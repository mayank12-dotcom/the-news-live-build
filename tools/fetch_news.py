"""Pulls headlines from Google News (India English edition) into content/news.json.

Uses Google News' public RSS feeds for the same edition as
https://news.google.com/home?hl=en-IN&gl=IN&ceid=IN:en — one feed per section.
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
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "content" / "news.json"
EDITION = {"hl": "en-IN", "gl": "IN", "ceid": "IN:en"}
IST = timezone(timedelta(hours=5, minutes=30))
PER_FEED = 12
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
    OUT.write_text(json.dumps({"updated": datetime.now(IST).isoformat(timespec="minutes"), "feeds": feeds},
                              indent=2, ensure_ascii=False) + "\n")
    print(f"wrote {OUT.relative_to(ROOT)}: " + ", ".join(f"{k} {len(v)}" for k, v in feeds.items()))
    for line in failed:
        print("kept previous copy for", line, file=sys.stderr)


if __name__ == "__main__":
    main()
