"""Generates the inner pages from content/pages.json.

The masthead, footer and page chrome are lifted from index.html, so the home page
stays the single source for shared markup. Run from the repo root:
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


def meta(left, right):
    return (f'<p class="meta"><span data-t>{esc(left)}</span>'
            f'<img class="dash" data-draw src="assets/dash.svg" width="15" height="1" alt="">'
            f'<span data-t>{esc(right)}</span></p>')


def img(name, cls="", alt="", lazy=True):
    w, h = image_size(name)
    attrs = f' class="{cls}"' if cls else ""
    loading = ' loading="lazy"' if lazy else ' fetchpriority="high"'
    return f'<img{attrs} src="assets/{name}" width="{w}" height="{h}" alt="{esc(alt)}"{loading}>'


def card(c, byline="author"):
    return f'''        <a class="card" href="article.html">
          <div class="media" data-draw>{img(c["img"])}</div>
          <h3 data-t>{esc(c["title"])}</h3>
          {meta(c[byline], c["date"])}
        </a>'''


def listing_main(page):
    cards = "\n".join(card(c) for c in page["cards"])
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
            content = page_html(parts, page["title"].title(), page["nav"], listing_main(page))
        out.write_text(content)
        print("wrote", out.name)


if __name__ == "__main__":
    main()
