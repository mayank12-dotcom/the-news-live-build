"""Pulls headlines from Google News (India English edition) into content/news.json.

Uses Google News' public RSS feeds for the same edition as
https://news.google.com/home?hl=en-IN&gl=IN&ceid=IN:en — one feed per section.
Each new story is then resolved to the publisher's article, and its link-preview
metadata (og:image, og:description) is recorded. Results are cached by story id,
so a story is only looked up once. Each publisher's logo is saved to
assets/logos/<host>.png (once) for the footer's source marquee.
Run by .github/workflows/news.yml every 2 hours; also safe to run by hand:
    python3 tools/fetch_news.py
"""
import hashlib
import html
import json
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "content" / "news.json"
EDITION = {"hl": "en-IN", "gl": "IN", "ceid": "IN:en"}
IST = timezone(timedelta(hours=5, minutes=30))
PER_FEED = 12
LOOKUP_WORKERS = 6
BROWSER_UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
              "(KHTML, like Gecko) Chrome/124 Safari/537.36")
DECODE_URL = "https://news.google.com/_/DotsSplashUi/data/batchexecute"
FEEDS = {
    "top": "rss",
    "world": "rss/headlines/section/topic/WORLD",
    "politics": "rss/search?q=politics",
    "business": "rss/headlines/section/topic/BUSINESS",
    "technology": "rss/headlines/section/topic/TECHNOLOGY",
    "health": "rss/headlines/section/topic/HEALTH",
    "sports": "rss/headlines/section/topic/SPORTS",
    "culture": "rss/headlines/section/topic/ENTERTAINMENT",
    "podcast": "rss/search?q=podcast",
}


def feed_url(path):
    base, _, query = path.partition("?")
    params = dict(urllib.parse.parse_qsl(query)) | EDITION
    return f"https://news.google.com/{base}?{urllib.parse.urlencode(params)}"


def clean_title(title, source):
    # Google appends " - Source" to every headline; the source is shown separately.
    suffix = f" - {source}"
    return title[: -len(suffix)].strip() if source and title.endswith(suffix) else title.strip()


RELATED = re.compile(r'<a href="([^"]+)"[^>]*>(.*?)</a>(?:&nbsp;|\s)*<font[^>]*>(.*?)</font>', re.S)


def related_coverage(description, title):
    """Other outlets' takes on the same story, as listed in the item description."""
    items = []
    for link, headline, source in RELATED.findall(html.unescape(description or "")):
        headline, source = html.unescape(headline).strip(), html.unescape(source).strip()
        headline = clean_title(headline, source)
        if headline and headline != title:
            items.append({"title": headline, "source": source, "link": link})
    return items[:6]


def fetch(path):
    req = urllib.request.Request(feed_url(path), headers={"User-Agent": "Mozilla/5.0 (news-refresh bot)"})
    with urllib.request.urlopen(req, timeout=20) as res:
        root = ET.fromstring(res.read())
    stories, seen = [], set()
    for item in root.iterfind("./channel/item"):
        source = (item.findtext("source") or "").strip()
        title = clean_title(item.findtext("title") or "", source)
        if not title or title in seen:
            continue
        seen.add(title)
        published = parsedate_to_datetime(item.findtext("pubDate")).astimezone(IST)
        link = item.findtext("link") or "https://news.google.com/"
        stories.append({
            "id": hashlib.sha1(link.encode()).hexdigest()[:10],
            "title": title,
            "source": source or "Google News",
            "link": link,
            "date": f"{published:%b} {published.day}, {published:%Y}",
            "longDate": f"{published:%A, %B} {published.day}, {published:%Y}",
            "related": related_coverage(item.findtext("description"), title),
        })
        if len(stories) == PER_FEED:
            break
    return stories


def http_get(url, data=None, headers=None, limit=None):
    req = urllib.request.Request(url, data=data, headers={"User-Agent": BROWSER_UA, **(headers or {})})
    with urllib.request.urlopen(req, timeout=20) as res:
        return res.read(limit).decode("utf-8", "replace"), res.geturl()


def publisher_url(link):
    """Google News feed links are encoded redirects; ask Google for the real article URL."""
    gid = urllib.parse.urlparse(link).path.rsplit("/", 1)[-1]
    page, _ = http_get(f"https://news.google.com/rss/articles/{gid}")
    sig = re.search(r'data-n-a-sg="([^"]+)"', page).group(1)
    ts = re.search(r'data-n-a-ts="([^"]+)"', page).group(1)
    inner = (f'["garturlreq",[["X","X",["X","X"],null,null,1,1,"US:en",null,1,null,null,null,null,null,0,1],'
             f'"X","X",1,[1,1,1],1,1,null,0,0,null,0],"{gid}",{ts},"{sig}"]')
    body = ("f.req=" + urllib.parse.quote(json.dumps([[["Fbv4je", inner, None, "generic"]]]))).encode()
    resp, _ = http_get(DECODE_URL, body, {"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"})
    return json.loads(json.loads(resp.split("\n\n")[1])[:-2][0][2])[1]


def meta_tag(page, name):
    for pattern in (rf'<meta[^>]+(?:property|name)=["\']{name}["\'][^>]*content=["\']([^"\']+)',
                    rf'<meta[^>]+content=["\']([^"\']+)["\'][^>]*(?:property|name)=["\']{name}["\']'):
        m = re.search(pattern, page, re.I)
        if m:
            return html.unescape(m.group(1)).strip()
    return None


def preview(story):
    """Publisher URL plus the article's own preview image and summary, where the site allows it."""
    found = {"url": None, "image": None, "summary": None}
    try:
        found["url"] = publisher_url(story["link"])
        page, final = http_get(found["url"], limit=600_000)
        image = meta_tag(page, "og:image") or meta_tag(page, "twitter:image")
        if image:
            image = urllib.parse.urljoin(final, image)
            found["image"] = image if image.startswith("https://") else None
        summary = meta_tag(page, "og:description") or meta_tag(page, "description")
        found["summary"] = summary[:320] if summary else None
    except Exception:
        pass  # blocked or unreachable: the story keeps its feed data and a design photo
    return found


def enrich(feeds, previous):
    cache = {s["id"]: s for stories in previous.get("feeds", {}).values() for s in stories if "url" in s}
    fresh = {s["id"]: s for stories in feeds.values() for s in stories if s["id"] not in cache}
    with ThreadPoolExecutor(LOOKUP_WORKERS) as pool:
        for sid, found in zip(fresh, pool.map(preview, fresh.values())):
            cache[sid] = found
    for stories in feeds.values():
        for s in stories:
            c = cache.get(s["id"], {})
            s.update({k: c.get(k) for k in ("url", "image", "summary")})
    return len(fresh)


LOGOS = ROOT / "assets" / "logos"
LOGO_URL = "https://www.google.com/s2/favicons?domain={host}&sz=128"


def logo_host(url):
    return urllib.parse.urlsplit(url).netloc.lower()


def fetch_logo(host):
    path = LOGOS / f"{host}.png"
    if path.exists():
        return False
    req = urllib.request.Request(LOGO_URL.format(host=host), headers={"User-Agent": BROWSER_UA})
    try:
        with urllib.request.urlopen(req, timeout=20) as res:
            data = res.read()
    except Exception:  # no logo: the marquee shows the publisher's name alone
        return False
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        return False
    path.write_bytes(data)
    return True


def fetch_logos(feeds):
    LOGOS.mkdir(parents=True, exist_ok=True)
    hosts = {logo_host(s["url"]) for v in feeds.values() for s in v if s.get("url")}
    with ThreadPoolExecutor(LOOKUP_WORKERS) as pool:
        return sum(pool.map(fetch_logo, sorted(hosts)))


def main():
    previous = json.loads(OUT.read_text()) if OUT.exists() else {"feeds": {}}
    feeds, failed = {}, []
    for name, path in FEEDS.items():
        try:
            feeds[name] = fetch(path)
        except Exception as err:  # keep the last good copy of a feed that fails
            failed.append(f"{name}: {err}")
            feeds[name] = previous["feeds"].get(name, [])
    if all(not stories for stories in feeds.values()):
        sys.exit("No feeds could be fetched:\n" + "\n".join(failed))
    looked_up = enrich(feeds, previous)
    OUT.write_text(json.dumps({"updated": datetime.now(IST).isoformat(timespec="minutes"), "feeds": feeds},
                              indent=2, ensure_ascii=False) + "\n")
    print(f"wrote {OUT.relative_to(ROOT)}: " + ", ".join(f"{k} {len(v)}" for k, v in feeds.items()))
    with_image = sum(1 for v in feeds.values() for s in v if s.get("image"))
    total = sum(len(v) for v in feeds.values())
    print(f"looked up {looked_up} new stories; {with_image}/{total} have a publisher image")
    print(f"saved {fetch_logos(feeds)} new publisher logos")
    for line in failed:
        print("kept previous copy for", line, file=sys.stderr)


if __name__ == "__main__":
    main()
