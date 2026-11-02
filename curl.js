(() => {
  // Newspaper page turn between pages. The page being left is saved on pagehide;
  // the next page redraws it as a sheet of hinged vertical strips and bends it
  // over its left edge, strip by strip, so the paper curls instead of swinging flat.
  // Going back plays it in reverse: the earlier page curls back over the later one.
  const ORDER = ['index', 'world', 'politics', 'business', 'technology', 'health', 'sports', 'culture', 'podcast', 'article'];
  const KEY = 'turn-sheet';
  const DURATION_MS = 1150;
  const MAX_AGE_MS = 6000;     // ignore a saved sheet from a stale navigation
  const CURL = 0.55;           // share of the page width that is bent at once
  const STRIP_PX = 70;         // target strip width; more strips = smoother bend

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rank(url) {
    const name = new URL(url, location.href).pathname.split('/').pop().replace(/\.html$/, '') || 'index';
    return Math.max(0, ORDER.indexOf(name));
  }

  // A static copy of the page as it looks right now, without the live cursor layer or scripts.
  function snapshot(root) {
    const copy = root.cloneNode(true);
    copy.querySelectorAll('.cursors, .loader, .turn-layer, script').forEach((n) => n.remove());
    copy.querySelectorAll('img[loading="lazy"]').forEach((n) => n.removeAttribute('loading'));
    return copy.innerHTML;
  }

  addEventListener('pagehide', () => {
    if (reduceMotion) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify({
        html: snapshot(document.body), url: location.href, scrollY, at: Date.now(),
      }));
    } catch { /* storage full or blocked: this navigation just won't turn */ }
  });

  function takeSheet() {
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

  function pageCopy(html, top, width) {
    const el = document.createElement('div');
    el.className = 'turn-copy';
    el.style.cssText = `top:${-top}px;width:${width}px`;
    el.innerHTML = html;
    return el;
  }

  // Chain of strips: each one is hinged to the right edge of the one before it.
  function buildSheet(html, top) {
    const width = innerWidth;
    const count = Math.max(12, Math.round(width / STRIP_PX));
    const stripW = width / count;
    const strips = [];
    let parent = null;
    for (let i = 0; i < count; i++) {
      const strip = document.createElement('div');
      strip.className = 'turn-strip';
      strip.style.cssText = `width:${stripW}px;left:${i === 0 ? 0 : stripW}px`;
      const front = document.createElement('div');
      front.className = 'turn-face';
      const copy = pageCopy(html, top, width);
      copy.style.left = `${-i * stripW}px`;
      const frontShade = document.createElement('i');
      front.append(copy, frontShade);
      const back = document.createElement('div');
      back.className = 'turn-face turn-back';
      const backShade = document.createElement('i');
      back.append(backShade);
      strip.append(front, back);
      (parent || document.createDocumentFragment()).append(strip);
      strips.push({ el: strip, x: (i + 0.5) / count, frontShade, backShade });
      parent = strip;
    }
    return strips;
  }

  const smooth = (v) => v * v * (3 - 2 * v);
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

  // Angle of the paper at x (0 = spine, 1 = free edge) when the turn is t done.
  function angleAt(x, t) {
    const v = Math.min(1, Math.max(0, (t * (1 + CURL) - (1 - x)) / CURL));
    return 180 * smooth(v);
  }

  function play(saved) {
    const back = rank(saved.url) > rank(location.href);
    const layer = document.createElement('div');
    layer.className = 'turn-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.inert = true;

    // Forward: the old page curls away over the live page. Back: the live page curls
    // back into place over a still copy of the old one.
    if (back) layer.append(pageCopy(saved.html, saved.scrollY, innerWidth));
    const shadow = document.createElement('div');
    shadow.className = 'turn-shadow';
    layer.append(shadow);
    const strips = buildSheet(back ? snapshot(document.body) : saved.html, back ? scrollY : saved.scrollY);
    layer.append(strips[0].el);
    document.body.append(layer);

    const start = performance.now();
    function frame(now) {
      const raw = Math.min(1, (now - start) / DURATION_MS);
      const t = back ? 1 - ease(raw) : ease(raw);
      let prev = 0;
      for (const s of strips) {
        const angle = angleAt(s.x, t);
        s.el.style.transform = `rotateY(${-(angle - prev)}deg)`;
        prev = angle;
        // Light falls off as the strip tilts away; the underside is lit from the other side.
        const tilt = Math.sin((angle * Math.PI) / 180);
        s.frontShade.style.opacity = (tilt * 0.45).toFixed(3);
        s.backShade.style.opacity = (0.15 + tilt * 0.3).toFixed(3);
      }
      // Soft shadow cast on the page beneath, just ahead of the fold.
      const fold = 1 - t * (1 + CURL) + CURL / 2;
      shadow.style.transform = `translateX(${(fold * 100).toFixed(2)}vw)`;
      shadow.style.opacity = (Math.sin(t * Math.PI) * 0.9).toFixed(3);
      if (raw < 1) requestAnimationFrame(frame);
      else layer.remove();
    }
    requestAnimationFrame(frame);
  }

  function maybePlay() {
    if (reduceMotion) return;
    const saved = takeSheet();
    if (saved) play(saved);
  }

  maybePlay();
  // Pages restored from the back/forward cache don't rerun scripts.
  addEventListener('pageshow', (e) => { if (e.persisted) maybePlay(); });
})();
