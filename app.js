(() => {
  // Lifecycle: loading (cursors spin on a white screen) → building (each cursor
  // claims a frame and builds its layers one by one, visible frames first) →
  // resting (the swarm buzzes in a tiny circle on the masthead).
  const ARROW = 'M0.101898 32.4518C-1.90724 7.26404 26.2171 -8.9729 47.0257 5.36096L261.832 153.329C285.213 169.434 275.216 205.994 246.894 207.963L137.119 215.59L75.6263 306.843L75.2503 307.389C59.3159 330.056 23.6497 320.694 20.9017 293.124L20.8962 293.062L20.8431 292.464L0.101898 32.4518Z';
  const ARROW_IN = 'M30.0072 30.066L244.814 178.034L120.427 186.678L50.7474 290.079L30.0072 30.066Z';
  const CURSOR_COUNT = 8;
  const MAX_CURSORS = 16;        // fast scrolling calls in reinforcements, up to this many
  const JOIN_SPEED = 1600;       // px/s of scrolling that counts as fast
  const JOIN_EVERY_MS = 320;     // at most one newcomer this often
  const TYPE_CPS = 40;           // average typing speed, characters per second
  const LONG_TEXT = 90;          // longer than this and the typist speeds up proportionally (article paragraphs)
  const DRAW_S = 0.65;           // average seconds to drag out a box
  const AIM_MS = [90, 260];      // hover before clicking into a layer
  const LINGER_MS = [140, 380];  // look at the result before moving on
  const QUICK_MS = [30, 90];     // aim/linger when going straight from a box to what's inside it
  const DUPE_MS = [520, 760];    // alt-drag a copy of the first item in a repeated set into place
  const SELECT_MS = [260, 420];  // double-click the copied text before retyping it
  const SWAP_MS = 320;           // a copied photo is replaced with the item's own
  const CATCH_UP_PER_FOLD = 1;   // extra build speed for each fold the viewer is scrolled ahead
  const MAX_CATCH_UP = 4;        // never more than 4x the normal speed
  const START_STAGGER_MS = 1400; // cursors peel off the loader one at a time
  const MIN_LOADER_MS = 1800;
  const MAX_LOADER_MS = 8000;
  const LOADER_RX = 118;         // the swarm orbits the logo in a loose ellipse
  const LOADER_RY = 64;
  const HEADING_PX = 24;         // text this big starts at 18px and is stepped up once typed
  const HEADING_START_PX = 18;
  const GROW_STEPS = 4;
  const GROW_STEP_MS = 110;
  const GUIDE_CHANCE = 0.55;     // how often a new left edge gets a guide pulled out for it
  const GUIDE_PULL_MS = [380, 560];
  const FLOCK_RADIUS = 46;       // finished: the swarm circles the viewer's mouse this far out
  const PERSONAL_SPACE = 20;
  const SPRING = 70;
  const DAMPING = 12;

  const FRAMES = [
    '.topwrap',
    '.logo',
    '.navwrap',
    '.topics li',
    '.lead',
    '.block-head',
    '.feature',
    '.row',
    '.cards .card',
    '.world-main',
    '.side',
    '.tech .card',
    '.pod',
    '.article-hero',
    '.byline',
    '.article-title',
    '.article-body > *',
    '.foot',
  ];
  const LAYER = '[data-t], [data-draw]';

  const root = document.documentElement;

  // Publisher photos that are blocked or gone fall back to the slot's design photo.
  function useFallback(img) {
    const fallback = img.dataset.fallback;
    if (fallback && !img.src.endsWith(fallback)) img.src = fallback;
  }
  document.addEventListener('error', (e) => { if (e.target.tagName === 'IMG') useFallback(e.target); }, true);
  document.querySelectorAll('img[data-fallback]').forEach((img) => { if (img.complete && !img.naturalWidth) useFallback(img); });
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const orbitEl = document.querySelector('[data-orbit]');
  const layerEl = document.querySelector('.cursors');
  const loaderEl = document.querySelector('.loader');
  if (loaderEl && !reduceMotion) loaderEl.innerHTML = '<img class="loader-mark" src="assets/logo.svg" width="172" height="41" alt="">';

  // Today's date and time in the top bar, written before the layers are read so it's typed too.
  // Small screens get the short form: "Tue, Nov 3, 2026 | 10:12 AM".
  const smallScreen = matchMedia('(max-width: 760px)');
  const longDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const shortDate = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const clock = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });
  const nowText = (now = new Date()) => `${(smallScreen.matches ? shortDate : longDate).format(now)} | ${clock.format(now)}`;
  const todayEls = [...document.querySelectorAll('[data-today]')];
  todayEls.forEach((el) => { el.textContent = nowText(); });

  const ops = new Map([...document.querySelectorAll(LAYER)].map((el) => [el, setup(el)]));

  // Keep the clock ticking (and the format matching the screen) without a reload.
  function refreshToday() {
    const text = nowText();
    for (const el of todayEls) {
      const op = ops.get(el);
      if (!op || op.text === text) continue;
      op.text = text;
      op.n = -1;
      if (op.done || op.p >= 1) {
        op.k = text.length;
        render(op);
      }
    }
  }
  setInterval(refreshToday, 5000);
  smallScreen.addEventListener('change', refreshToday);
  const units = buildUnits();
  let state = 'loading';
  root.classList.add('ready');

  if (reduceMotion) {
    for (const op of ops.values()) finishOp(op);
    for (const unit of units) unit.state = 'done';
    finishBuild();
    return;
  }

  // Each cursor gets its own random colour; hues are spread around the wheel so no two look alike.
  const hueOffset = Math.random() * 360;
  const spread = (n, shift) => Array.from({ length: n }, (_, i) => Math.round(hueOffset + ((i + shift) * 360) / CURSOR_COUNT + Math.random() * 20) % 360)
    .sort(() => Math.random() - 0.5);
  // Newcomers take the hues halfway between the first eight.
  const hues = [...spread(CURSOR_COUNT, 0), ...spread(MAX_CURSORS - CURSOR_COUNT, 0.5)];
  const cursors = Array.from({ length: CURSOR_COUNT }, makeCursor);

  function setup(el) {
    const op = { el, p: 0, n: -1, draw: 'draw' in el.dataset, done: false };
    if (op.draw) {
      // Hairlines (rules, dashes) are drawn with the pen tool, not dragged as boxes.
      const r = el.getBoundingClientRect();
      op.line = r.width > 0 && r.height > 0 && Math.min(r.width, r.height) <= 3;
      op.vertical = op.line && r.height > r.width;
      if (op.line) el.classList.add(op.vertical ? 'line-v' : 'line');
      return op;
    }

    // Full text stays in layout (ghost) so nothing reflows while typing.
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    const typed = document.createElement('span');
    const caret = document.createElement('span');
    const rest = document.createElement('span');
    caret.className = 'caret';
    caret.setAttribute('aria-hidden', 'true');
    rest.className = 'ghost';
    el.replaceChildren(typed, caret, rest);
    const cps = TYPE_CPS * Math.min(8, Math.max(1, text.length / LONG_TEXT));
    const style = getComputedStyle(el);
    const size = parseFloat(style.fontSize);
    const grow = size >= HEADING_PX && style.display !== 'inline' ? size : 0;
    return { ...op, text, typed, caret, rest, cps, grow, k: 0, nextKeyAt: 0 };
  }

  // Which screen-height band of the page a frame belongs to: the one it fits in whole,
  // so a frame poking out under the fold waits for the next screen. Frames taller than
  // a screen go by their top.
  function foldOf(unit) {
    const r = unit.el.getBoundingClientRect();
    return Math.floor(((r.height < innerHeight ? r.bottom - 1 : r.top) + scrollY) / innerHeight);
  }

  function buildUnits() {
    const claimed = new Set();
    const list = [];
    for (const selector of FRAMES) {
      for (const el of document.querySelectorAll(selector)) {
        const layers = [...(el.matches(LAYER) ? [el] : []), ...el.querySelectorAll(LAYER)].filter((l) => !claimed.has(l));
        layers.forEach((l) => claimed.add(l));
        list.push({ el, ops: layers.map((l) => ops.get(l)), idx: 0, state: 'idle', selector });
      }
    }
    for (const [el, op] of ops) if (!claimed.has(el)) list.push({ el, ops: [op], idx: 0, state: 'idle' });
    list.sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    linkRepeats(list);
    return list;
  }

  // Items that repeat (same frame, same parent, same layer structure) are built once,
  // then every free cursor grabs a copy at once: each alt-drags its copy out of the
  // first item and updates the content of the copy it dropped.
  function linkRepeats(list) {
    const firsts = new Map();
    const shape = (u) => u.ops.map((op) => (op.draw ? 'd' : 't')).join('');
    for (const unit of list) {
      if (!unit.selector || unit.ops.length < 2) continue;
      const key = `${unit.selector}|${unit.el.tagName}|${shape(unit)}`;
      const peers = firsts.get(unit.el.parentElement) || new Map();
      firsts.set(unit.el.parentElement, peers);
      const first = peers.get(key);
      if (!first) {
        peers.set(key, unit);
        unit.copies = [];
        continue;
      }
      unit.source = first;
      first.copies.push(unit);
    }
  }

  // What a free cursor may pick up next: a plain frame, or any copy once its first item is built.
  function claimable(u) {
    if (u.state !== 'idle') return false;
    return !u.source || u.source.ops.every((op) => op.done); // its helpers may still be on it
  }

  const imageOf = (op) => (op.el.tagName === 'IMG' ? op.el : op.el.querySelector('img'));

  // Fill a repeated item with the first item's content, as a fresh duplicate would look.
  function pasteCopy(unit) {
    unit.ops.forEach((op, i) => {
      const from = unit.source.ops[i];
      if (op.draw) {
        op.p = 1;
        render(op);
        const img = imageOf(op);
        const srcImg = imageOf(from);
        const copied = srcImg && (srcImg.currentSrc || srcImg.src);
        if (img && copied && copied !== (img.currentSrc || img.src)) {
          op.realSrc = img.getAttribute('src');
          new Image().src = op.realSrc; // warm it, so the swap doesn't blink empty
          op.swap = true;
          img.removeAttribute('loading');
          img.src = copied;
        } else op.done = true;
      } else if (from.text === op.text) {
        op.done = true;
        finishOp(op);
      } else {
        op.old = from.text;
        op.stale = true;
        op.n = -1;
        render(op);
      }
    });
  }

  function restoreImage(op) {
    if (!op.realSrc) return;
    imageOf(op).src = op.realSrc;
    op.realSrc = null;
  }

  function makeCursor(_, i, from) {
    const html = (tag, cls, inner = '') => Object.assign(document.createElement(tag), { className: cls, innerHTML: inner });
    const sel = html('div', 'sel', '<i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i><b class="dim"></b>');
    // Arrow from cursor.svg: white outline, colored body.
    const el = html('div', 'cursor mode-pointer', `
      <svg class="ico ico-pointer" width="19" height="22" viewBox="0 0 275 321"><path class="rim" d="${ARROW}"/><path d="${ARROW_IN}"/></svg>
      <svg class="ico ico-copy" width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4.5"/><path d="M5 2.6v4.8M2.6 5h4.8"/></svg>
      <svg class="ico ico-text" width="14" height="24" viewBox="-1 -1 14 24"><path class="halo" d="M2 1.5h2.5L6 3l1.5-1.5H10M6 3v16M2 20.5h2.5L6 19l1.5 1.5H10"/><path d="M2 1.5h2.5L6 3l1.5-1.5H10M6 3v16M2 20.5h2.5L6 19l1.5 1.5H10"/></svg>
      <svg class="ico ico-draw" width="22" height="22" viewBox="-1 -1 22 22"><path class="halo" d="M10 1v18M1 10h18"/><path d="M10 1v18M1 10h18"/></svg>
      <svg class="ico ico-pen" width="20" height="22" viewBox="0 0 20 22"><path class="nib" d="M1.5 1.5l12 4.2-3.4 3.4 6.4 6.4-2.6 2.6-6.4-6.4-3.4 3.4z"/><circle cx="6.6" cy="6.6" r="1.3"/></svg>`);
    const color = `hsl(${hues[i]} 82% 48%)`;
    sel.style.setProperty('--c', color);
    el.style.setProperty('--c', color);
    layerEl.append(sel, el);
    const angle = (i * Math.PI * 2) / CURSOR_COUNT;
    const start = from || (state === 'resting' ? swarmStart(angle) : loaderPoint(angle, performance.now() / 1000));
    return {
      id: i, el, sel, angle, color, phase: 'idle', phaseAt: 0, unit: null,
      // Each fly gets its own little orbit so the swarm doesn't move in lockstep.
      swarmRadius: 10 + Math.random() * 12,
      swarmSpin: (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 1.8),
      x: start.x, y: start.y, vx: 0, vy: 0,
      readyAt: 0, waitUntil: 0, from: null, bend: 0, travelMs: 0,
    };
  }

  function render(op) {
    const { el, p } = op;
    if (op.draw) {
      el.style.setProperty('--d', p.toFixed(4));
      el.classList.toggle('drawn', p >= 1);
      return;
    }
    if (op.stale) {
      if (op.n !== -2) {
        op.n = -2;
        op.typed.textContent = op.old;
        op.rest.textContent = '';
      }
      el.classList.remove('typing');
      el.classList.add('typed');
      return;
    }
    const n = Math.round(p * op.text.length);
    if (n !== op.n) {
      op.n = n;
      op.typed.textContent = op.text.slice(0, n);
      op.rest.textContent = op.text.slice(n);
    }
    el.classList.toggle('typing', p > 0 && p < 1);
    el.classList.toggle('typed', p >= 1);
  }

  function finishOp(op) {
    if (op.growing) {
      op.growing = false;
      op.el.classList.remove('growing');
      op.el.style.scale = '';
    }
    op.stale = false;
    op.swap = false;
    restoreImage(op);
    op.p = 1;
    op.done = true;
    render(op);
  }

  function finishBuild() {
    state = 'resting';
    root.classList.add('loaded', 'built');
    document.body.setAttribute('aria-busy', 'false');
    if (!reduceMotion) window.Sound?.chord();
  }

  // Free cursor takes the next unbuilt frame in reading order (units are sorted
  // top to bottom), working fold by fold (one screen height at a time). The top fold
  // comes first; only when there's nothing left to start or help with there does a
  // free cursor move down to start a section in the next fold, so nobody sits idle.
  function claimUnit() {
    const left = units.filter((u) => u.state !== 'done');
    const folds = left.map(foldOf);
    for (const fold of [...new Set(folds)].sort((a, b) => a - b)) {
      const inFold = left.filter((u, i) => folds[i] === fold);
      const unit = inFold.find(claimable);
      if (unit) {
        unit.state = unit.source && !unit.duped ? 'duping' : 'active';
        return unit;
      }
      const helper = lendHand(inFold);
      if (helper) return helper;
    }
    return null;
  }

  // Nothing left to start in a fold: take over the untouched back half of a frame
  // another cursor is still working through, so nobody stands around. Only layers whose
  // boxes are already drawn can be handed over, or the text would land in an empty box.
  function lendHand(inFold) {
    let best = null;
    for (const u of inFold) {
      if (u.state !== 'active') continue; // a copy is only 'active' once it's been dropped
      const mine = u.ops.slice(u.idx).filter((op) => !op.done && (!op.owner || op.owner === u));
      const rest = mine.slice(1); // the first one is in someone's hands right now
      for (let k = Math.floor(rest.length / 2); k < rest.length; k++) {
        const tail = rest.slice(k);
        const kept = mine.slice(0, k + 1);
        if (kept.some((box) => box.draw && tail.some((op) => box.el.contains(op.el)))) continue;
        if (!best || tail.length > best.ops.length) best = { from: u, ops: tail };
        break;
      }
    }
    if (!best) return null;
    const helper = { el: best.ops[0].el, ops: best.ops, idx: 0, state: 'active' };
    best.ops.forEach((op) => { op.owner = helper; });
    units.push(helper);
    return helper;
  }

  // Cursor positions live in page coordinates so a cursor stays put on the
  // content when the viewer scrolls; they're shifted into the viewport on render.
  function toPage(x, y) {
    return { x: x + scrollX, y: y + scrollY };
  }

  // Cursor anchor for a layer: just right of the caret, or the dragging corner.
  function pointFor(op) {
    if (!op.draw) {
      const r = op.caret.getBoundingClientRect();
      return r.height ? toPage(r.right + 3, r.top + r.height / 2) : null;
    }
    const r = op.el.getBoundingClientRect();
    if (op.swap) return r.height ? toPage(r.left + r.width * 0.5, r.top + r.height * 0.45) : null;
    return r.height ? toPage(r.left + r.width * op.p, r.top + r.height * op.p) : null;
  }

  function selectionFor(op) {
    const r = op.el.getBoundingClientRect();
    if (!op.draw) {
      // Auto-height text box: it grows line by line with what's been typed so far.
      const line = [...op.typed.getClientRects()].at(-1) || op.caret.getBoundingClientRect();
      const lineH = parseFloat(getComputedStyle(op.el).lineHeight) || line.height;
      const bottom = line.height ? Math.min(r.bottom, line.top + (line.height + lineH) / 2) : r.bottom;
      return { x: r.left - 2, y: r.top - 2, w: r.width + 4, h: bottom - r.top + 4, text: true };
    }
    const p = Math.max(op.p, 0.02);
    if (op.line) {
      // Pen tool: an anchor where it started, a rubber band out to the cursor.
      const w = op.vertical ? r.width : r.width * p;
      const h = op.vertical ? r.height * p : r.height;
      return { x: r.left, y: r.top, w, h, pen: true, dim: `${Math.round(op.vertical ? h : w)}` };
    }
    // Crosshair drag: a grey placeholder grows with the drag; the real fill fades in when let go.
    return { x: r.left, y: r.top, w: r.width * p, h: r.height * p, fill: op.p < 1, dim: `${Math.round(r.width * p)} × ${Math.round(r.height * p)}` };
  }

  // Intro: the swarm circles the logo, each cursor breathing in and out a little.
  function loaderPoint(angle, t) {
    const a = t * 1.1 + angle;
    const wobble = 1 + Math.sin(t * 2.3 + angle * 3) * 0.07;
    const fit = Math.min(1, (innerWidth - 40) / (LOADER_RX * 2 + 40));
    return toPage(innerWidth / 2 + Math.cos(a) * LOADER_RX * wobble * fit, innerHeight / 2 + Math.sin(a) * LOADER_RY * wobble);
  }

  function swarmStart(angle) {
    const r = orbitEl.getBoundingClientRect();
    return toPage(r.right - r.width * 0.04 + Math.cos(angle) * 14, r.top + r.height * 0.2 + Math.sin(angle) * 14);
  }

  // Resting spot: a tiny swarm on the logo's asterisk.
  function swarmPoint(c, t) {
    const r = orbitEl.getBoundingClientRect();
    const a = t * c.swarmSpin + c.angle;
    return toPage(r.right - r.width * 0.04 + Math.cos(a) * c.swarmRadius, r.top + r.height * 0.2 + Math.sin(a) * c.swarmRadius);
  }

  // Once the page is done the swarm flocks around the viewer's mouse, keeping clear of
  // the pointer itself; with no mouse around it settles back on the logo.
  let mouse = null;
  addEventListener('pointermove', (e) => { mouse = e.pointerType === 'mouse' ? { x: e.clientX, y: e.clientY } : null; }, { passive: true });
  root.addEventListener('mouseleave', () => { mouse = null; });

  function restingPoint(c, t) {
    if (state !== 'resting' || !mouse) return swarmPoint(c, t);
    const a = t * c.swarmSpin * 0.45 + c.angle;
    const r = FLOCK_RADIUS + c.swarmRadius * 1.5;
    return toPage(mouse.x + Math.cos(a) * r, mouse.y + Math.sin(a) * r);
  }

  function setPhase(c, phase, now) {
    c.phase = phase;
    c.phaseAt = now;
  }

  const rand = (min, max) => min + Math.random() * (max - min);
  const minJerk = (s) => s * s * s * (10 - 15 * s + 6 * s * s);
  // Drag eases in, overshoots a hair and settles — how a hand lets go of a mouse.
  const dragEase = (s) => {
    const e = s * s * (3 - 2 * s) - 1;
    return 1 + 2 * e * e * e + e * e;
  };

  // Human keystroke rhythm: uneven keys, a beat between words, longer after punctuation.
  function keyDelay(ch, cps) {
    let ms = (1000 / cps) * rand(0.5, 1.5);
    if (ch === ' ') ms += rand(20, 140);
    if (',.;:?!—'.includes(ch)) ms += rand(180, 420);
    if (Math.random() < 0.04) ms += rand(250, 650);
    return ms;
  }

  function startTravel(c, now, phase = 'travel') {
    setPhase(c, phase, now);
    c.from = { x: c.x, y: c.y };
    c.bend = rand(-0.18, 0.18);
    c.travelMs = 0;
  }

  // Point along a gently curved path from `a` to `b`.
  function along(a, b, bend, s) {
    const mx = (a.x + b.x) / 2 - (b.y - a.y) * bend;
    const my = (a.y + b.y) / 2 + (b.x - a.x) * bend;
    const u = 1 - s;
    return { x: u * u * a.x + 2 * u * s * mx + s * s * b.x, y: u * u * a.y + 2 * u * s * my + s * s * b.y };
  }

  // Advances the cursor's job; returns where it should be and what it shows.
  function work(c, now) {
    if (now < c.readyAt) return { point: loaderPoint(c.angle, now / 1000), mode: 'pointer', exact: true };
    if (!c.unit) {
      c.unit = claimUnit();
      if (!c.unit) return null;
      c.quick = false;
      startTravel(c, now, c.unit.state === 'duping' ? 'dupe-travel' : 'travel');
    }
    const unit = c.unit;
    if (c.phase.startsWith('dupe')) return duplicate(c, unit, now);
    const skip = (o) => o.done || (o.owner && o.owner !== unit);
    let op = unit.ops[unit.idx];
    while (op && skip(op)) op = unit.ops[++unit.idx];
    if (!op) {
      unit.state = 'done';
      c.unit = null;
      return null;
    }
    const point = pointFor(op);
    if (!point) {
      finishOp(op);
      return null;
    }
    const tool = op.draw ? (op.line ? 'pen' : 'draw') : 'text';
    // On the way to a text box with a fresh left edge, pull a guide out of the ruler first.
    if (c.phase === 'travel' && !op.draw && op.guide === undefined) {
      op.guide = !unit.source && wantsGuide(op);
      if (op.guide) startTravel(c, now, 'guide-travel');
    }
    if (c.phase.startsWith('guide')) return pullGuide(c, op, now);

    if (c.phase === 'travel') {
      // Move time grows with distance, varies a little per move (Fitts-ish).
      if (!c.travelMs) {
        const dist = Math.hypot(point.x - c.from.x, point.y - c.from.y);
        c.travelMs = Math.min(1000, (c.quick ? 120 : 220) + dist * 0.55) * rand(0.85, 1.2);
      }
      const s = Math.min(1, (now - c.phaseAt) / c.travelMs);
      if (s >= 1) {
        setPhase(c, 'aim', now);
        c.waitUntil = now + rand(...(c.quick ? QUICK_MS : AIM_MS));
      }
      return { point: along(c.from, point, c.bend, minJerk(s)), mode: s > 0.85 ? tool : 'pointer', unit, exact: true };
    }
    if (c.phase === 'aim') {
      if (now >= c.waitUntil) {
        setPhase(c, op.stale ? 'select' : 'work', now);
        c.waitUntil = now + rand(...SELECT_MS);
        op.nextKeyAt = now;
        op.dragMs = op.swap ? SWAP_MS : DRAW_S * 1000 * rand(0.8, 1.25);
        if (op.stale) op.el.style.setProperty('--hl', c.color);
        if (op.draw && !op.swap) window.Sound?.click(point.x - scrollX);
        if (op.guide) op.el.classList.add('snapped');
        if (op.grow && !unit.source && !op.stale) {
          // Big type starts at 18px; it's stepped up to size once typed.
          op.growing = true;
          op.el.classList.add('growing');
          op.el.style.scale = String(HEADING_START_PX / op.grow);
        }
        if (op.swap) {
          // Drop the item's own photo onto the copy.
          restoreImage(op);
          op.el.classList.remove('swapped');
          void op.el.offsetWidth;
          op.el.classList.add('swapped');
        }
      }
      return { point, mode: op.swap ? 'pointer' : tool, unit, exact: true };
    }
    if (c.phase === 'select') {
      // Double-click the copied words, then type over them.
      op.el.classList.add('selecting');
      if (now >= c.waitUntil) {
        op.el.classList.remove('selecting');
        op.stale = false;
        op.k = 0;
        op.n = -1;
        render(op);
        setPhase(c, 'work', now);
        op.nextKeyAt = now + rand(60, 160);
      }
      return { point, mode: 'text', sel: selectionFor(op), unit, exact: true };
    }
    if (c.phase === 'grow') return growHeading(c, op, now);
    if (c.phase === 'work') {
      let finished;
      if (op.swap) {
        finished = now - c.phaseAt >= op.dragMs;
        if (finished) op.swap = false;
      } else if (op.draw) {
        const s = Math.min(1, (now - c.phaseAt) / op.dragMs);
        op.p = s < 1 ? (op.line ? minJerk(s) : dragEase(s)) : 1;
        finished = s >= 1;
      } else {
        let ch = null;
        while (now >= op.nextKeyAt && op.k < op.text.length) {
          ch = op.text[op.k];
          op.nextKeyAt += keyDelay(op.text[op.k++], op.cps);
        }
        if (ch !== null) window.Sound?.key(ch, point.x - scrollX);
        op.p = op.k / op.text.length;
        finished = op.k >= op.text.length;
      }
      render(op);
      if (finished && op.draw && !op.swap) {
        if (op.line) window.Sound?.click(point.x - scrollX);
        else window.Sound?.note(boxOf(op.el));
      }
      if (finished && op.growing) {
        setPhase(c, 'grow', now);
        op.growStep = 0;
      } else if (finished) {
        // A freshly drawn box gets filled right away; otherwise pause to look.
        const next = unit.ops[unit.idx + 1];
        c.quick = Boolean(next && op.draw && op.el.contains(next.el));
        setPhase(c, 'linger', now);
        c.waitUntil = now + rand(...(c.quick ? QUICK_MS : LINGER_MS));
      }
    } else if (now >= c.waitUntil) {
      op.done = true;
      unit.idx++;
      startTravel(c, now);
    }
    // Hands on the layer: the crosshair sits on the dragging corner, the I-beam on the caret.
    return { point: pointFor(op), mode: op.swap ? 'pointer' : tool, sel: selectionFor(op), unit, exact: true };
  }

  function boxOf(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height, dim: `${Math.round(r.width)} × ${Math.round(r.height)}` };
  }

  // Step a just-typed heading from 18px up to its size, a tick per step.
  function growHeading(c, op, now) {
    const step = Math.min(GROW_STEPS, Math.floor((now - c.phaseAt) / GROW_STEP_MS) + 1);
    const px = HEADING_START_PX + ((op.grow - HEADING_START_PX) * step) / GROW_STEPS;
    if (step !== op.growStep) {
      op.growStep = step;
      op.el.style.scale = step >= GROW_STEPS ? '' : String(px / op.grow);
      window.Sound?.tick(step, op.el.getBoundingClientRect().left);
    }
    if (step >= GROW_STEPS && now - c.phaseAt >= GROW_STEPS * GROW_STEP_MS) {
      op.growing = false;
      op.el.classList.remove('growing');
      setPhase(c, 'linger', now);
      c.waitUntil = now + rand(...LINGER_MS);
    }
    return { point: pointFor(op), mode: 'text', sel: { ...selectionFor(op), dim: `${Math.round(px)}px` }, unit: c.unit, exact: true };
  }

  function wantsGuide(op) {
    const studio = window.Studio;
    const r = op.el.getBoundingClientRect();
    if (!studio || !r.height || r.left <= studio.size + 4) return false;
    return !studio.hasGuide(r.left) && Math.random() < GUIDE_CHANCE;
  }

  // Walk to the left ruler, press, drag a red guide out to the text's left edge, let go.
  function pullGuide(c, op, now) {
    const studio = window.Studio;
    const r = op.el.getBoundingClientRect();
    const y = Math.max(studio.size + 30, Math.min(innerHeight - 30, r.top + r.height / 2));
    const start = studio.size / 2;
    if (c.phase === 'guide-travel') {
      const grab = toPage(start, y);
      if (!c.travelMs) c.travelMs = Math.min(1000, 220 + Math.hypot(grab.x - c.from.x, grab.y - c.from.y) * 0.55) * rand(0.85, 1.2);
      const s = Math.min(1, (now - c.phaseAt) / c.travelMs);
      if (s >= 1) {
        setPhase(c, 'guide-pull', now);
        c.guide = studio.pullGuide(start);
        c.guideMs = rand(...GUIDE_PULL_MS);
        window.Sound?.click(start);
      }
      return { point: along(c.from, grab, c.bend, minJerk(s)), mode: 'pointer', unit: c.unit, exact: true };
    }
    const s = Math.min(1, (now - c.phaseAt) / c.guideMs);
    const x = start + (r.left - start) * minJerk(s);
    c.guide.move(x);
    if (s >= 1) {
      c.guide.drop();
      c.guide = null;
      window.Sound?.snap(x);
      startTravel(c, now);
    }
    return { point: toPage(x, y), mode: 'pointer', unit: c.unit, exact: true };
  }

  // The gap between a copy and the item it came from, for the red measurement.
  function gapBetween(a, b) {
    const s = a.getBoundingClientRect();
    const d = b.getBoundingClientRect();
    const mid = (lo1, hi1, lo2, hi2) => (Math.max(lo1, lo2) + Math.min(hi1, hi2)) / 2;
    if (d.left - s.right >= 1) return { x: s.right, y: mid(s.top, s.bottom, d.top, d.bottom), length: d.left - s.right, vertical: false };
    if (d.top - s.bottom >= 1) return { x: mid(s.left, s.right, d.left, d.right), y: s.bottom, length: d.top - s.bottom, vertical: true };
    return null;
  }

  // Grab the first item of the set, alt-drag a copy into this item's place, let go.
  function duplicate(c, unit, now) {
    // Drag out of the finished first item, so the copy always matches what it left.
    const src = unit.source.el.getBoundingClientRect();
    const grab = toPage(src.left + Math.min(src.width * 0.3, 60), src.top + Math.min(src.height * 0.35, 40));
    if (c.phase === 'dupe-travel') {
      if (!c.travelMs) c.travelMs = Math.min(1000, 220 + Math.hypot(grab.x - c.from.x, grab.y - c.from.y) * 0.55) * rand(0.85, 1.2);
      const s = Math.min(1, (now - c.phaseAt) / c.travelMs);
      if (s >= 1) {
        setPhase(c, 'dupe-aim', now);
        c.waitUntil = now + rand(...AIM_MS);
      }
      return { point: along(c.from, grab, c.bend, minJerk(s)), mode: 'pointer', unit, exact: true };
    }
    if (c.phase === 'dupe-aim') {
      if (now >= c.waitUntil) {
        pasteCopy(unit);
        const dest = unit.el.getBoundingClientRect();
        c.dupe = { grab, dx: dest.left - src.left, dy: dest.top - src.top, ms: rand(...DUPE_MS) };
        // Start the copy on top of the item it came from, not at its own slot for a frame.
        unit.el.style.translate = `${-c.dupe.dx}px ${-c.dupe.dy}px`;
        unit.el.classList.add('dragging');
        window.Sound?.click(grab.x - scrollX);
        setPhase(c, 'dupe-move', now);
      }
      return { point: grab, mode: 'copy', sel: boxOf(unit.source.el), unit, exact: true };
    }
    if (c.phase === 'dupe-move') {
      const { dx, dy, ms } = c.dupe;
      const s = Math.min(1, (now - c.phaseAt) / ms);
      const e = minJerk(s);
      unit.el.style.translate = `${dx * (e - 1)}px ${dy * (e - 1)}px`;
      if (s >= 1) {
        unit.el.style.translate = '';
        unit.el.classList.remove('dragging');
        window.Sound?.note(boxOf(unit.el));
        setPhase(c, 'dupe-linger', now);
        c.waitUntil = now + rand(...LINGER_MS);
      }
      const gap = gapBetween(unit.source.el, unit.el);
      return { point: { x: c.dupe.grab.x + dx * e, y: c.dupe.grab.y + dy * e }, mode: 'copy', sel: boxOf(unit.el), gap, unit, exact: true };
    }
    // Let go, then update the copy just dropped; the next copy is free for another cursor.
    if (now >= c.waitUntil) {
      unit.duped = true;
      unit.state = 'active';
      c.quick = false;
      startTravel(c, now);
    }
    const gap = gapBetween(unit.source.el, unit.el);
    return { point: { x: c.dupe.grab.x + c.dupe.dx, y: c.dupe.grab.y + c.dupe.dy }, mode: 'pointer', sel: boxOf(unit.el), gap, unit, exact: true };
  }

  function place(node, box) {
    node.classList.toggle('on', Boolean(box));
    if (!box) return;
    node.style.transform = `translate3d(${box.x}px, ${box.y}px, 0)`;
    node.style.width = `${box.w}px`;
    node.style.height = `${box.h}px`;
  }

  function moveCursor(c, job, now, dt) {
    const t = now / 1000;
    if (state === 'loading' || job?.exact) {
      const target = job ? job.point : loaderPoint(c.angle, t);
      c.x = target.x;
      c.y = target.y;
      c.vx = c.vy = 0;
    } else {
      // Off duty: fly to the swarm with a springy chase and a buzz that fades as it lands.
      const target = restingPoint(c, t);
      const dist = Math.hypot(target.x - c.x, target.y - c.y);
      const buzz = Math.max(3, Math.min(26, dist * 0.13));
      const wx = target.x + Math.sin(t * 12 + c.angle * 3) * buzz;
      const wy = target.y + Math.cos(t * 9.5 + c.angle * 4) * buzz;
      c.vx += ((wx - c.x) * SPRING - c.vx * DAMPING) * dt;
      c.vy += ((wy - c.y) * SPRING - c.vy * DAMPING) * dt;
      // Flocking: keep a little personal space from the others.
      for (const o of cursors) {
        if (o === c) continue;
        const ox = c.x - o.x;
        const oy = c.y - o.y;
        const d = Math.hypot(ox, oy);
        if (d > 0 && d < PERSONAL_SPACE) {
          c.vx += (ox / d) * (PERSONAL_SPACE - d) * 60 * dt;
          c.vy += (oy / d) * (PERSONAL_SPACE - d) * 60 * dt;
        }
      }
      c.x += c.vx * dt;
      c.y += c.vy * dt;
    }

    c.el.className = `cursor mode-${job ? job.mode : 'pointer'}`;
    c.el.style.transform = `translate3d(${c.x - scrollX}px, ${c.y - scrollY}px, 0)`;

    place(c.sel, job?.sel);
    window.Studio?.measure(c.id, job?.gap || null);
    if (job?.sel) {
      c.sel.classList.toggle('text', Boolean(job.sel.text));
      c.sel.classList.toggle('fill', Boolean(job.sel.fill));
      c.sel.classList.toggle('pen', Boolean(job.sel.pen));
      c.sel.lastChild.textContent = job.sel.dim || '';
    }
  }

  // Leave the loader once the page (images included) is in, but never flash it.
  const t0 = performance.now();
  const loaded = new Promise((resolve) => {
    if (document.readyState === 'complete') resolve();
    else addEventListener('load', resolve, { once: true });
    setTimeout(resolve, MAX_LOADER_MS);
  });
  const minShown = new Promise((resolve) => setTimeout(resolve, MIN_LOADER_MS));
  if (state !== 'resting') Promise.all([loaded, minShown]).then(() => {
    for (const c of cursors) c.readyAt = buildTime + Math.random() * START_STAGGER_MS;
    state = 'building';
    root.classList.add('loaded');
  });

  // The build runs on its own clock, which speeds up while the viewer is scrolled
  // ahead of the fold being built, so the cursors hurry to catch up.
  let last = t0;
  let buildTime = t0;
  let speed = 1;
  let speedTarget = 1;
  let speedCheckAt = 0;

  function catchUpSpeed() {
    const left = units.filter((u) => u.state !== 'done');
    if (!left.length) return 1;
    const building = Math.min(...left.map(foldOf));
    const viewing = Math.floor((scrollY + innerHeight - 1) / innerHeight);
    return Math.min(MAX_CATCH_UP, 1 + Math.max(0, viewing - building) * CATCH_UP_PER_FOLD);
  }

  // Scroll fast and more cursors join, flying in from the edge you're scrolling toward.
  let lastScroll = scrollY;
  let scrollSpeed = 0;
  let joinAt = 0;
  function callReinforcements(now, dt) {
    const moved = scrollY - lastScroll;
    lastScroll = scrollY;
    if (dt > 0) scrollSpeed += (Math.abs(moved) / dt - scrollSpeed) * Math.min(1, dt * 8);
    if (scrollSpeed < JOIN_SPEED || cursors.length >= MAX_CURSORS || now < joinAt) return;
    joinAt = now + JOIN_EVERY_MS;
    const edge = moved >= 0 ? innerHeight + 24 : -24;
    const c = makeCursor(null, cursors.length, toPage(rand(0.1, 0.9) * innerWidth, edge));
    c.readyAt = buildTime;
    cursors.push(c);
  }

  function frame(now) {
    const realDt = Math.min(1 / 30, (now - last) / 1000);
    last = now;
    if (state === 'building' && now >= speedCheckAt) {
      speedTarget = catchUpSpeed();
      speedCheckAt = now + 200;
    }
    speed += (speedTarget - speed) * Math.min(1, realDt * 3);
    buildTime += realDt * 1000 * (state === 'building' ? speed : 1);
    if (state === 'building') callReinforcements(now, realDt);
    // Physics keeps real time steps so the springy swarm stays stable at any speed.
    const boxes = [];
    for (const c of cursors) {
      const job = state === 'building' ? work(c, buildTime) : null;
      moveCursor(c, job, buildTime, realDt);
      if (job?.sel) boxes.push({ ...job.sel, color: c.color });
    }
    if (state !== 'resting') window.Studio?.frame(boxes);
    if (state === 'building' && units.every((u) => u.state === 'done')) finishBuild();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
