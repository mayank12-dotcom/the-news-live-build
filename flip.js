(() => {
  // Soft page flip between pages, drawn by StPageFlip (vendor/page-flip.browser.js).
  // The page being left is saved on pagehide; the next page lays it and itself out
  // as a two-page book and flips from one to the other. Going deeper into the paper
  // flips forward; going back flips the earlier page back over the later one.
  const ORDER = ['index', 'world', 'politics', 'business', 'technology', 'health', 'sports', 'culture', 'podcast', 'article'];
  const KEY = 'turn-sheet';
  const FLIP_MS = 1100;
  const MAX_AGE_MS = 6000;     // ignore a saved page from a stale navigation

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rank(url) {
    const name = new URL(url, location.href).pathname.split('/').pop().replace(/\.html$/, '') || 'index';
    const i = ORDER.indexOf(name);
    return i < 0 ? ORDER.length : i; // story pages (news/<id>.html) sit deepest in the paper
  }

  // A static copy of the page as it looks right now, without the live cursor layer or scripts.
  function snapshot(root) {
    const copy = root.cloneNode(true);
    copy.querySelectorAll('.swarm-ui, .turn-layer, script').forEach((n) => n.remove());
    copy.querySelectorAll('img[loading="lazy"]').forEach((n) => n.removeAttribute('loading'));
    return copy.innerHTML;
  }

  addEventListener('pagehide', () => {
    if (reduceMotion) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify({
        html: snapshot(document.body), url: location.href, scrollY, at: Date.now(),
      }));
    } catch { /* storage full or blocked: this navigation just won't flip */ }
  });

  function takeSaved() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      sessionStorage.removeItem(KEY);
      const fresh = saved && Date.now() - saved.at < MAX_AGE_MS;
      const samePage = saved && new URL(saved.url).pathname === location.pathname;
      return fresh && !samePage ? saved : null;
    } catch {
      return null;
    }
  }

  // One book page holding a copy of a site page, scrolled to where the reader was.
  function bookPage(html, top) {
    const page = document.createElement('div');
    page.className = 'turn-page';
    page.dataset.density = 'soft';
    const copy = document.createElement('div');
    copy.className = 'turn-copy';
    copy.style.cssText = `top:${-top}px;width:${innerWidth}px`;
    copy.innerHTML = html;
    page.append(copy);
    return page;
  }

  function play(saved) {
    const back = rank(saved.url) > rank(location.href);
    const layer = document.createElement('div');
    layer.className = 'turn-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.inert = true;
    layer.dataset.swarmSkip = ''; // the swarm builds the page, not this snapshot of the last one
    const book = document.createElement('div');
    layer.append(book);
    document.body.append(layer);

    const leaving = bookPage(saved.html, saved.scrollY);
    // The new page hasn't been built yet, so it arrives as a blank sheet the cursors then fill.
    const arriving = bookPage('', 0);
    const pages = back ? [arriving, leaving] : [leaving, arriving];

    let flip;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      try { flip?.destroy(); } catch { /* already torn down */ }
      layer.remove();
    };

    try {
      flip = new St.PageFlip(book, {
        width: innerWidth,
        height: innerHeight,
        size: 'fixed',
        usePortrait: true,
        showCover: false,
        drawShadow: true,
        maxShadowOpacity: 0.55,
        flippingTime: FLIP_MS,
        startPage: back ? 1 : 0,
        useMouseEvents: false,
        mobileScrollSupport: false,
        autoSize: false,
      });
      flip.loadFromHTML(pages);
    } catch {
      finish(); // library missing or failed: show the page without a flip
      return;
    }

    flip.on('flip', () => setTimeout(finish, 60));
    setTimeout(finish, FLIP_MS + 1500); // never leave the overlay up
    requestAnimationFrame(() => (back ? flip.flipPrev('bottom') : flip.flipNext('bottom')));
  }

  function maybePlay() {
    if (reduceMotion || !window.St?.PageFlip) return;
    const saved = takeSaved();
    if (saved) play(saved);
  }

  maybePlay();
  // Pages restored from the back/forward cache don't rerun scripts.
  addEventListener('pageshow', (e) => { if (e.persisted) maybePlay(); });
})();
