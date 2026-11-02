"""Generates the inner pages from content/pages.json, then fills every page's
story slots with the latest headlines from content/news.json.

The masthead, footer and page chrome are lifted from index.html, so the home page
stays the single source for shared markup. A story slot is any element tagged
data-news="<feed>:<index>" data-news-field="title|source|date|byline|href";
each story also gets its own page at news/<id>.html.
Run from the repo root:
    python3 tools/build_pages.py
"""
import html
import json
import re
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NAV_FILES = {
    "World News": "world.html", "Politics": "politics.html", "Business": "business.html",
    "Technology": "technology.html", "Health": "health.html", "Sports": "sports.html",
    "Culture": "culture.html", "Podcast": "podcast.html",
}


def esc(text):
    return html.escape(text, quote=True)


def image_size(name):
    """Pixel size of a PNG or baseline/progressive JPEG in assets/."""
    data = (ROOT / "assets" / name).read_bytes()
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return struct.unpack(">II", data[16:24])
    if data[:2] == b"\xff\xd8":
        i = 2
        while i < len(data):
            marker, length = data[i + 1], struct.unpack(">H", data[i + 2:i + 4])[0]
            if 0xC0 <= marker <= 0xCF and marker not in (0xC4, 0xC8, 0xCC):
                h, w = struct.unpack(">HH", data[i + 5:i + 9])
                return w, h
            i += 2 + length
    raise ValueError(f"assets/{name}: unsupported image format")


def chunk(source, start, end):
    i = source.index(start)
    return source[i:source.index(end, i) + len(end)]


def shell():
    home = (ROOT / "index.html").read_text()
    return {
        "head": chunk(home, "<!doctype html>", "</head>"),
        "masthead": chunk(home, '<header class="masthead wrap">', "</header>"),
        "tail": chunk(home, '<footer class="foot wrap">', "</html>"),
    }


def masthead(source, active):
    # Mark the current section; nothing else in the shared header changes.
    link = f'<a href="{NAV_FILES[active]}" data-t>' if active else None
    return source.replace(link, f'<a href="{NAV_FILES[active]}" aria-current="page" data-t>') if link else source


def head(source, title):
    return re.sub(r"<title>.*?</title>", f"<title>{esc(title)} — The News</title>", source)


def bind(slot, name):
    return f' data-news="{slot}" data-news-field="{name}"' if slot else ""


def meta(left, right, slot=None):
    return (f'<p class="meta"><span data-t{bind(slot, "source")}>{esc(left)}</span>'
            f'<img class="dash" data-draw src="assets/dash.svg" width="15" height="1" alt="">'
            f'<span data-t{bind(slot, "date")}>{esc(right)}</span></p>')


def img(name, cls="", alt="", lazy=True):
    w, h = image_size(name)
    attrs = f' class="{cls}"' if cls else ""
    loading = ' loading="lazy"' if lazy else ' fetchpriority="high"'
    return f'<img{attrs} src="assets/{name}" width="{w}" height="{h}" alt="{esc(alt)}"{loading}>'


def card(c, byline="author", slot=None, href="article.html"):
    return f'''        <a class="card" href="{href}"{bind(slot, "href")}>
          <div class="media" data-draw>{img(c["img"])}</div>
          <h3 data-t{bind(slot, "title")}>{esc(c["title"])}</h3>
          {meta(c[byline], c["date"], slot)}
        </a>'''


def listing_main(slug, page):
    cards = "\n".join(card(c, slot=f"{slug}:{i}") for i, c in enumerate(page["cards"]))
    return f'''  <main id="top" class="wrap listing">
    <section aria-labelledby="page-title">
      <header class="block-head">
        <h1 id="page-title" class="page-title" data-t>{esc(page["title"])}</h1>
        <span class="rule" data-draw></span>
      </header>
      <div class="cards">
{cards}
      </div>
    </section>
  </main>'''


def body_block(block):
    if block["type"] == "ul":
        items = "\n".join(f'          <li><strong data-t>{esc(i["bold"])}</strong> <span data-t>{esc(i["text"].strip())}</span></li>'
                           for i in block["items"])
        return f"        <ul>\n{items}\n        </ul>"
    cls = ' class="lead-in"' if block["type"] == "lead" else ""
    return f"        <p{cls} data-t>{esc(block['text'])}</p>"


def article_main(a):
    body = "\n".join(body_block(b) for b in a["body"])
    similar = "\n".join(card(c, byline="category") for c in a["similar"])
    return f'''  <main id="top" class="wrap article-page">
    <article class="article" aria-labelledby="page-title">
      <div class="media article-hero" data-draw>{img(a["hero"], alt="Ornate domed basilica under a cloudy sky", lazy=False)}</div>
      <div class="byline">
        <span class="rule" data-draw></span>
        <div class="byline-row">
          <img class="avatar" data-draw src="assets/{a["avatar"]}" width="42" height="42" alt="">
          <div>
            <p class="byline-name" data-t>{esc(a["author"])}</p>
            <p class="byline-date"><img data-draw src="assets/{a["calendarIcon"]}" width="16" height="18" alt=""><span data-t>{esc(a["date"])}</span></p>
          </div>
        </div>
        <span class="rule" data-draw></span>
      </div>
      <h1 id="page-title" class="article-title" data-t>{esc(a["headline"])}</h1>
      <span class="rule" data-draw></span>
      <div class="article-body">
{body}
      </div>
      <span class="rule" data-draw></span>
    </article>
    <section class="block similar" aria-labelledby="similar-title">
      <header class="block-head">
        <h2 id="similar-title" data-t>{esc(a["similarTitle"])}</h2>
        <span class="rule" data-draw></span>
      </header>
      <div class="cards">
{similar}
      </div>
    </section>
  </main>'''


def page_html(parts, title, active, main):
    return f'''{head(parts["head"], title)}
<body aria-busy="true">
  {masthead(parts["masthead"], active)}

{main}

  {parts["tail"]}
'''


def main():
    parts = shell()
    pages = json.loads((ROOT / "content" / "pages.json").read_text())
    for slug, page in pages.items():
        out = ROOT / f"{slug}.html"
        if slug == "article":
            content = page_html(parts, page["headline"].capitalize(), page["nav"], article_main(page))
        else:
            content = page_html(parts, page["title"].title(), page["nav"], listing_main(slug, page))
        out.write_text(content)
        print("wrote", out.name)
    fill_news()


SLOT_TEXT = re.compile(r'(<(\w+)[^>]*? data-news="(\w+):(\d+)" data-news-field="(title|source|date|byline)"[^>]*>)[^<]*(</\2>)')
SLOT_HREF = re.compile(r'href="[^"]*"(?: target="_blank" rel="noopener")? data-news="(\w+):(\d+)" data-news-field="href"')
FEED_NAV = {"top": None, "world": "World News", "politics": "Politics", "business": "Business",
            "technology": "Technology", "health": "Health", "sports": "Sports", "culture": "Culture",
            "podcast": "Podcast"}
FEED_LABEL = {"top": "Top Stories", "world": "World News"}
HOME_PHOTOS = ["hero.jpg", "latest-main.jpg", "latest-1.jpg", "latest-2.jpg", "card-1.jpg", "card-2.jpg", "card-3.jpg"]


def story_href(s):
    return f"news/{s['id']}.html"


def story_photo(pages, feed, i):
    # Feeds carry no images, so each story borrows the design photo of its section slot.
    pool = HOME_PHOTOS if feed == "top" else [c["img"] for c in pages[feed]["cards"]]
    return pool[i % len(pool)]


def external(href, inner, cls=""):
    attrs = f' class="{cls}"' if cls else ""
    return f'<a{attrs} href="{esc(href)}" target="_blank" rel="noopener">{inner}</a>'


def story_main(pages, feed, i, s, stories):
    label = FEED_LABEL.get(feed, f"{FEED_NAV[feed]} News")
    coverage = "\n".join(
        f'          <li>{external(r["link"], f"<span data-t>{esc(r['title'])}</span>")} <span class="coverage-source" data-t>{esc(r["source"])}</span></li>'
        for r in s["related"])
    coverage_block = f'''
        <p class="lead-in" data-t>More coverage of this story</p>
        <ul class="coverage">
{coverage}
        </ul>''' if coverage else ""
    arrow = ('<span class="ring-arrow" data-draw><img src="assets/ring.svg" width="20" height="20" alt="">'
             '<img src="assets/arrow.svg" width="10" height="8" alt=""></span>')
    more = [(j, o) for j, o in enumerate(stories) if o["id"] != s["id"]][i:i + 3] or \
           [(j, o) for j, o in enumerate(stories) if o["id"] != s["id"]][:3]
    cards = "\n".join(card({"title": o["title"], "author": o["source"], "date": o["date"], "img": story_photo(pages, feed, j)},
                           href=story_href(o)) for j, o in more)
    return f'''  <main id="top" class="wrap article-page">
    <article class="article" aria-labelledby="page-title">
      <div class="media article-hero" data-draw>{img(story_photo(pages, feed, i), lazy=False)}</div>
      <div class="byline">
        <span class="rule" data-draw></span>
        <div class="byline-row">
          <div>
            <p class="byline-name" data-t>{esc(s["source"])}</p>
            <p class="byline-date"><img data-draw src="assets/article-calendar.svg" width="16" height="18" alt=""><span data-t>{esc(s["longDate"])}</span></p>
          </div>
        </div>
        <span class="rule" data-draw></span>
      </div>
      <h1 id="page-title" class="article-title" data-t>{esc(s["title"])}</h1>
      <span class="rule" data-draw></span>
      <div class="article-body">
        <p data-t>{esc(label)} · reported by {esc(s["source"])}. The full story is published on their site.</p>
        <p>{external(s["link"], f'<span data-t>Read the full story on {esc(s["source"])}</span>{arrow}', "more read-source")}</p>{coverage_block}
      </div>
      <span class="rule" data-draw></span>
    </article>
    <section class="block similar" aria-labelledby="similar-title">
      <header class="block-head">
        <h2 id="similar-title" data-t>More {esc(label)}</h2>
        <span class="rule" data-draw></span>
      </header>
      <div class="cards">
{cards}
      </div>
    </section>
  </main>'''


def build_stories(parts, pages, feeds):
    """One page per story under news/; pages for stories that dropped out of the feeds are removed."""
    out_dir = ROOT / "news"
    out_dir.mkdir(exist_ok=True)
    head_src = parts["head"].replace("<head>", '<head>\n  <base href="../">', 1)
    shell_parts = {**parts, "head": head_src}
    written = set()
    # Section feeds first, so a story that is also a top story is filed under its section.
    for feed, stories in sorted(feeds.items(), key=lambda kv: kv[0] == "top"):
        for i, s in enumerate(stories):
            name = f"{s['id']}.html"
            if name in written:
                continue
            written.add(name)
            (out_dir / name).write_text(page_html(shell_parts, s["title"], FEED_NAV[feed], story_main(pages, feed, i, s, stories)))
    for old in out_dir.glob("*.html"):
        if old.name not in written:
            old.unlink()
    print(f"wrote {len(written)} story pages")


def fill_news():
    """Writes the latest headlines into every story slot; slots without a story keep their text."""
    path = ROOT / "content" / "news.json"
    if not path.exists():
        return
    feeds = json.loads(path.read_text())["feeds"]
    build_stories(shell(), json.loads((ROOT / "content" / "pages.json").read_text()), feeds)

    def story(feed, i):
        stories = feeds.get(feed) or []
        return stories[int(i)] if int(i) < len(stories) else None

    def text(m):
        s = story(m.group(3), m.group(4))
        if not s:
            return m.group(0)
        value = {"title": s["title"], "source": s["source"], "date": s["date"], "byline": f"by. {s['source']}"}[m.group(5)]
        return f"{m.group(1)}{esc(value)}{m.group(6)}"

    def href(m):
        s = story(m.group(1), m.group(2))
        if not s:
            return m.group(0)
        return f'href="{story_href(s)}" data-news="{m.group(1)}:{m.group(2)}" data-news-field="href"'

    for page in sorted(ROOT.glob("*.html")):
        source = page.read_text()
        filled = SLOT_HREF.sub(href, SLOT_TEXT.sub(text, source))
        if filled != source:
            page.write_text(filled)
            print("filled", page.name)


if __name__ == "__main__":
    main()
