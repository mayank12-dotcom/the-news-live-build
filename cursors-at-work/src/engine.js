CAW.run = (config) => {
  // Lifecycle: loading (the cursors orbit the logo on a blank canvas) → building (each
  // cursor claims a frame that's scrolled into view and builds its layers; idle cursors
  // chase the viewer's scroll) → built (the crew flocks around the mouse; Go live or
  // Replay) → live (the real page, chrome gone).
  const ARROW = 'M0.101898 32.4518C-1.90724 7.26404 26.2171 -8.9729 47.0257 5.36096L261.832 153.329C285.213 169.434 275.216 205.994 246.894 207.963L137.119 215.59L75.6263 306.843L75.2503 307.389C59.3159 330.056 23.6497 320.694 20.9017 293.124L20.8962 293.062L20.8431 292.464L0.101898 32.4518Z';
  const ARROW_IN = 'M30.0072 30.066L244.814 178.034L120.427 186.678L50.7474 290.079L30.0072 30.066Z';
  const CURSOR_COUNT = config.cursors;
  const MAX_CURSORS = Math.max(config.cursors, config.maxCursors); // fast scrolling calls in more, up to this many
  const JOIN_SPEED = 1600;       // px/s of scrolling that counts as fast
  const JOIN_EVERY_MS = 260;     // at most one newcomer this often
  const TYPE_CPS = config.typingSpeed; // average typing speed, characters per second
  const LONG_TEXT = 90;          // longer than this and the typist speeds up proportionally
  const DRAW_S = 0.65;           // average seconds to drag out a box
  const TEXT_BOX_S = 0.32;       // dragging out a text box before typing into it
  const AIM_MS = [90, 260];      // hover before clicking into a layer
  const LINGER_MS = [140, 380];  // look at the result before moving on
  const QUICK_MS = [30, 90];     // aim/linger when going straight on to the next thing
  const DUPE_MS = [520, 760];    // alt-drag a copy of the first item in a repeated set into place
  const SELECT_MS = [260, 420];  // double-click the copied text before retyping it
  const SWAP_MS = 320;           // a copied photo or fill is changed to the item's own
  const CATCH_UP_PER_FOLD = 1;   // extra build speed for each screen the viewer is scrolled ahead
  const MAX_CATCH_UP = 4;
  const TOUR_PX_S = 240;         // Tour scrolls at most this fast (times the speed setting)
  const TOUR_LEAD = 0.82;        // and keeps the next unbuilt frame this far down the screen
  const START_STAGGER_MS = 1600; // cursors peel off the loader one at a time
  const MIN_LOADER_MS = 1800;
  const MAX_LOADER_MS = 8000;
  const LOADER_RX = 118;         // the cursors orbit the logo in a loose ellipse
  const LOADER_RY = 64;
  const HEADING_START_PX = 18;   // big type is typed at 18px, then stepped up
  const GROW_STEPS = 4;
  const GROW_STEP_MS = 110;
  const GUIDE_PULL_MS = [380, 560];
  const SPRING = 70;
  const DAMPING = 12;

  const { rand, minJerk, dragEase, keyDelay, along, gapBetween, flock } = CAW.kit;
  const L = CAW.layers;
  const Sound = config.sound === false ? muted() : CAW.sound();
  const Studio = CAW.studio(config);
  const root = document.documentElement;
  const isDraw = (op) => op.kind !== 'text';
  const isPen = (op) => op.kind === 'line' || op.kind === 'edge';

  const layerEl = Object.assign(document.createElement('div'), { className: 'caw-ui caw-cursors' });
  const loaderEl = Object.assign(document.createElement('div'), { className: 'caw-ui caw-loader' });
  layerEl.setAttribute('aria-hidden', 'true');
  loaderEl.setAttribute('aria-hidden', 'true');
  const logo = config.logo || document.querySelector('link[rel~="icon"]')?.href;
  const scanRoot = config.root || document.body;
  if (logo) loaderEl.innerHTML = `<img class="caw-loader-mark" src="${encodeURI(logo)}" alt="">`;
  document.body.append(loaderEl, layerEl);
  root.style.setProperty('--caw-canvas', getComputedStyle(document.body).backgroundColor);
  const orbitEl = document.querySelector('[data-caw-orbit]');

  const { ops, frames } = L.scan(scanRoot, (el) => el.classList.contains('caw-ui') || el.hasAttribute('data-caw-skip') || Boolean(config.skip && el.matches(config.skip)));
  // The layout grid, read from the page before anything is hidden; redone on resize.
  const layoutGrid = () => Studio.setGrid(CAW.grid.detect(scanRoot, ops.filter((op) => !isPen(op)), config.columns));
  layoutGrid();
  let gridTimer = 0;
  addEventListener('resize', () => { clearTimeout(gridTimer); gridTimer = setTimeout(layoutGrid, 150); });
  ops.forEach(L.prepare);
  frames.forEach((u) => Object.assign(u, { idx: 0, state: 'idle' }));
  root.classList.remove('caw-pending');
  root.classList.add('caw-loading');
  document.body.setAttribute('aria-busy', 'true');

  let state = 'loading';
  let userSpeed = 1;
  let touring = false;

  // Each cursor gets its own colour; hues are spread around the wheel so no two look alike.
  const hueOffset = Math.random() * 360;
  const spread = (n, shift) => Array.from({ length: n }, (_, i) => Math.round(hueOffset + ((i + shift) * 360) / CURSOR_COUNT + Math.random() * 12) % 360)
    .sort(() => Math.random() - 0.5);
  const hues = [...spread(CURSOR_COUNT, 0), ...spread(MAX_CURSORS - CURSOR_COUNT, 0.5)];
  const cursors = Array.from({ length: CURSOR_COUNT }, (_, i) => makeCursor(i));

  // What a free cursor may pick up: a frame scrolled into view whose backdrop is drawn,
  // or a copy once its first item is built.
  function claimable(u) {
    if (u.state !== 'idle') return false;
    if (u.dep && !u.dep.done) return false;
    if (u.source && !u.source.ops.every((op) => op.done)) return false;
    return u.el.getBoundingClientRect().top < innerHeight;
  }

  // Which screen-height band a frame belongs to: the one it fits in whole.
  function foldOf(unit) {
    const r = unit.el.getBoundingClientRect();
    return Math.floor(((r.height < innerHeight ? r.bottom - 1 : r.top) + scrollY) / innerHeight);
  }

  // Top fold first; nothing left to start there, lend a hand on a frame in progress.
  function claimUnit() {
    const left = frames.filter((u) => u.state !== 'done');
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

  // Take over the untouched back half of a frame another cursor is working through.
  function lendHand(inFold) {
    let best = null;
    for (const u of inFold) {
      if (u.state !== 'active') continue;
      const mine = u.ops.slice(u.idx).filter((op) => !op.done && (!op.owner || op.owner === u));
      const rest = mine.slice(1);
      for (let k = Math.floor(rest.length / 2); k < rest.length; k++) {
        const tail = rest.slice(k);
        const kept = mine.slice(0, k + 1);
        if (kept.some((box) => isDraw(box) && tail.some((op) => box.el.contains(op.el)))) continue;
        if (!best || tail.length > best.ops.length) best = { ops: tail };
        break;
      }
    }
    if (!best) return null;
    const helper = { el: best.ops[0].el, ops: best.ops, idx: 0, state: 'active', helper: true };
    best.ops.forEach((op) => { op.owner = helper; });
    frames.push(helper);
    return helper;
  }

  // Fill a copy with the first item's content, as a fresh duplicate would look.
  function pasteCopy(unit) {
    unit.ops.forEach((op, i) => {
      const from = unit.source.ops[i];
      if (op.kind === 'text') {
        if (from.text === op.text) L.finish(op);
        else {
          op.old = from.text;
          op.stale = true;
          op.n = -1;
          L.render(op);
        }
        return;
      }
      op.p = 1;
      L.render(op);
      const copied = op.el.tagName === 'IMG' && !op.el.srcset && from.el.currentSrc;
      if (copied && copied !== op.el.currentSrc) {
        op.realSrc = op.el.getAttribute('src');
        new Image().src = op.realSrc; // warm it, so the swap doesn't blink empty
        op.swap = true;
        op.el.removeAttribute('loading');
        op.el.src = copied;
      } else if (op.kind === 'box' && from.bg !== op.bg) {
        op.restyle = true; // the copy wears the first item's fill until it's restyled
        op.el.style.backgroundColor = from.bg;
      } else op.done = true;
    });
  }

  function makeCursor(i, from) {
    const html = (tag, cls, inner = '') => Object.assign(document.createElement(tag), { className: cls, innerHTML: inner });
    const sel = html('div', 'caw-sel', '<i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i><b class="caw-dim"></b>');
    const el = html('div', 'caw-cursor mode-pointer', `
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
    const start = from || loaderPoint(angle, performance.now() / 1000);
    return {
      id: i, el, sel, angle, color, phase: 'idle', phaseAt: 0, unit: null,
      hoverRadius: 10 + Math.random() * 12,
      hoverSpin: (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 1.8),
      x: start.x, y: start.y, vx: 0, vy: 0,
      readyAt: Infinity, waitUntil: 0, from: null, bend: 0, travelMs: 0,
    };
  }

  // Cursor positions live in page coordinates so a cursor stays put on the content.
  function toPage(x, y) {
    return { x: x + scrollX, y: y + scrollY };
  }

  // Where a pen line or edge is drawn: the element itself, or its one bordered side.
  function lineRect(op) {
    const r = op.el.getBoundingClientRect();
    if (op.kind === 'line') return { x: r.left, y: r.top, w: r.width, h: r.height, vertical: op.vertical };
    const w = Math.max(1, op.width);
    if (op.side === 'top') return { x: r.left, y: r.top, w: r.width, h: w, vertical: false };
    if (op.side === 'bottom') return { x: r.left, y: r.bottom - w, w: r.width, h: w, vertical: false };
    if (op.side === 'left') return { x: r.left, y: r.top, w, h: r.height, vertical: true };
    return { x: r.right - w, y: r.top, w, h: r.height, vertical: true };
  }

  // Cursor anchor for a layer: just right of the caret, or the dragging corner.
  function pointFor(op) {
    if (op.kind === 'text') {
      const r = (op.caret.isConnected ? op.caret : op.el).getBoundingClientRect();
      return r.height ? toPage(op.caret.isConnected ? r.right + 3 : r.left, r.top + r.height / 2) : null;
    }
    if (isPen(op)) {
      const l = lineRect(op);
      return l.w || l.h ? toPage(l.x + (l.vertical ? l.w / 2 : l.w * op.p), l.y + (l.vertical ? l.h * op.p : l.h / 2)) : null;
    }
    const r = op.el.getBoundingClientRect();
    if (op.swap || op.restyle) return r.height ? toPage(r.left + r.width * 0.5, r.top + r.height * 0.45) : null;
    return r.height ? toPage(r.left + r.width * op.p, r.top + r.height * op.p) : null;
  }

  const dims = (w, h) => `${Math.round(w)} × ${Math.round(h)}`;

  function selectionFor(op) {
    const r = op.el.getBoundingClientRect();
    if (op.kind === 'text') {
      // Auto-height text box: it grows line by line with what's been typed so far.
      const typed = op.segs ? [...op.segs].reverse().find((s) => s.typed.textContent) : null;
      const line = (typed && [...typed.typed.getClientRects()].at(-1)) || (op.caret.isConnected ? op.caret : op.el).getBoundingClientRect();
      const bottom = line.height ? Math.min(r.bottom, line.top + (line.height + op.lineH) / 2) : r.bottom;
      return { x: r.left - 2, y: r.top - 2, w: r.width + 4, h: bottom - r.top + 4, text: true, dim: dims(r.width + 4, bottom - r.top + 4) };
    }
    const p = Math.max(op.p, 0.02);
    if (isPen(op)) {
      // Pen tool: an anchor where it started, a rubber band out to the cursor.
      const l = lineRect(op);
      const w = l.vertical ? l.w : l.w * p;
      const h = l.vertical ? l.h * p : l.h;
      return { x: l.x, y: l.y, w, h, pen: op.p < 1, dim: `${Math.round(l.vertical ? h : w)}` };
    }
    // Crosshair drag: a grey placeholder grows with the drag; the real fill fades in when let go.
    return { x: r.left, y: r.top, w: r.width * p, h: r.height * p, fill: op.p < 1, dim: dims(r.width * p, r.height * p) };
  }

  // Intro: the cursors circle the logo, each cursor breathing in and out a little.
  function loaderPoint(angle, t) {
    const a = t * 1.1 + angle;
    const wobble = 1 + Math.sin(t * 2.3 + angle * 3) * 0.07;
    const fit = Math.min(1, (innerWidth - 40) / (LOADER_RX * 2 + 40));
    return toPage(innerWidth / 2 + Math.cos(a) * LOADER_RX * wobble * fit, innerHeight / 2 + Math.sin(a) * LOADER_RY * wobble);
  }

  // Off duty while building: wait along the bottom of the screen, so the crew chases
  // the viewer down the page. Once built with no mouse around: a lazy circle on the logo.
  function restingPoint(c, t) {
    if (state === 'building') {
      const slot = (c.id * 0.618) % 1;
      return toPage(innerWidth * (0.1 + 0.8 * slot) + Math.sin(t * 1.3 + c.angle) * 14, innerHeight - 56 - (c.id % 3) * 16);
    }
    const a = t * c.hoverSpin + c.angle;
    const r = orbitEl?.getBoundingClientRect();
    const cx = r ? r.right - r.width * 0.04 : innerWidth - 90;
    const cy = r ? r.top + r.height * 0.2 : innerHeight - 110;
    return toPage(cx + Math.cos(a) * c.hoverRadius * 1.6, cy + Math.sin(a) * c.hoverRadius * 1.6);
  }

  let mouse = null;
  addEventListener('pointermove', (e) => { mouse = e.pointerType === 'mouse' ? { x: e.clientX, y: e.clientY } : null; }, { passive: true });
  root.addEventListener('mouseleave', () => { mouse = null; });

  function setPhase(c, phase, now) {
    c.phase = phase;
    c.phaseAt = now;
  }

  function startTravel(c, now, phase = 'travel') {
    setPhase(c, phase, now);
    c.from = { x: c.x, y: c.y };
    c.bend = rand(-0.18, 0.18);
    c.travelMs = 0;
  }

  // A hand-like move toward `to`; calls `arrive` once there.
  function travel(c, to, now, quick, arrive) {
    if (!c.travelMs) c.travelMs = Math.min(1000, (quick ? 120 : 220) + Math.hypot(to.x - c.from.x, to.y - c.from.y) * 0.55) * rand(0.85, 1.2);
    const s = Math.min(1, (now - c.phaseAt) / c.travelMs);
    if (s >= 1) arrive();
    return { point: along(c.from, to, c.bend, minJerk(s)), s };
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
      L.finish(op);
      return null;
    }
    const tool = op.kind === 'text' ? 'text' : isPen(op) ? 'pen' : 'draw';
    // On the way to text on a shared edge or baseline, pull that guide out of a ruler first.
    if (c.phase === 'travel' && op.kind === 'text' && !op.pulled) {
      op.pulled = true;
      c.axis = !unit.source && guideAxis(op);
      if (c.axis) startTravel(c, now, 'guide-travel');
    }
    if (c.phase.startsWith('guide')) return pullGuide(c, op, now);
    if (c.phase === 'tbox') return dragTextBox(c, op, now);
    if (c.phase === 'grow') return growHeading(c, op, now);

    if (c.phase === 'travel') {
      const { point: at, s } = travel(c, point, now, c.quick, () => {
        setPhase(c, 'aim', now);
        c.waitUntil = now + rand(...(c.quick ? QUICK_MS : AIM_MS));
      });
      return { point: at, mode: s > 0.85 ? tool : 'pointer', unit, exact: true };
    }
    const edit = op.swap || op.restyle;
    if (c.phase === 'aim') {
      if (now >= c.waitUntil) startWork(c, op, unit, now, point);
      return { point, mode: edit ? 'pointer' : tool, unit, exact: true };
    }
    if (c.phase === 'select') {
      // Double-click the copied words, then type over them.
      op.el.classList.add('caw-selecting');
      if (now >= c.waitUntil) {
        op.el.classList.remove('caw-selecting');
        op.stale = false;
        op.n = -1;
        L.render(op);
        setPhase(c, 'work', now);
        op.nextKeyAt = now + rand(60, 160);
      }
      return { point, mode: 'text', sel: selectionFor(op), unit, exact: true };
    }
    if (c.phase === 'work') doWork(c, op, unit, now, point);
    else if (now >= c.waitUntil) {
      if (op.kind === 'text') L.finish(op);
      op.done = true;
      unit.idx++;
      startTravel(c, now);
    }
    // Hands on the layer: the crosshair sits on the dragging corner, the I-beam on the caret.
    return { point: pointFor(op) || point, mode: edit ? 'pointer' : tool, sel: selectionFor(op), unit, exact: true };
  }

  // The click that starts work on a layer.
  function startWork(c, op, unit, now, point) {
    if (op.kind === 'text' && !op.boxed && !op.stale && !unit.source) {
      setPhase(c, 'tbox', now); // drag out the text box first
      Sound.click(point.x - scrollX);
      return;
    }
    setPhase(c, op.stale ? 'select' : 'work', now);
    c.waitUntil = now + rand(...SELECT_MS);
    op.nextKeyAt = now;
    if (op.kind === 'text') op.cps = TYPE_CPS * Math.min(8, Math.max(1, op.text.length / LONG_TEXT));
    op.dragMs = op.swap || op.restyle ? SWAP_MS : DRAW_S * 1000 * rand(0.8, 1.25) * (isPen(op) ? 0.8 : 1);
    if (op.stale) op.el.style.setProperty('--hl', c.color);
    if (isDraw(op) && !op.swap) Sound.click(point.x - scrollX);
    if (op.snap) op.el.classList.add(`caw-snap-${op.snap}`);
    if (op.grow && !unit.source && !op.stale) {
      op.growing = true;
      op.el.classList.add('caw-growing');
      op.el.style.scale = String(HEADING_START_PX / op.grow);
    }
    if (op.swap) {
      op.el.src = op.realSrc; // drop the item's own photo onto the copy
      op.realSrc = null;
      op.el.classList.remove('caw-swapped');
      void op.el.offsetWidth;
      op.el.classList.add('caw-swapped');
    }
    if (op.restyle) {
      op.el.classList.add('caw-restyled'); // its own fill fades in over the copied one
      op.el.style.backgroundColor = '';
    }
  }

  function doWork(c, op, unit, now, point) {
    let finished;
    if (op.swap || op.restyle) {
      finished = now - c.phaseAt >= op.dragMs;
      if (finished) op.swap = op.restyle = false;
    } else if (isDraw(op)) {
      const s = Math.min(1, (now - c.phaseAt) / op.dragMs);
      op.p = s < 1 ? (isPen(op) ? minJerk(s) : dragEase(s)) : 1;
      finished = s >= 1;
    } else {
      let ch = null;
      while (now >= op.nextKeyAt && op.k < op.text.length) {
        ch = op.text[op.k];
        op.nextKeyAt += keyDelay(op.text[op.k++], op.cps);
      }
      if (ch !== null) Sound.key(ch, point.x - scrollX);
      op.p = op.text.length ? op.k / op.text.length : 1;
      finished = op.k >= op.text.length;
    }
    L.render(op);
    if (!finished) return;
    if (isDraw(op) && !op.el.classList.contains('caw-restyled')) {
      if (isPen(op)) Sound.click(point.x - scrollX);
      else Sound.note(selectionFor(op));
    }
    if (op.growing) {
      setPhase(c, 'grow', now);
      op.growStep = 0;
      return;
    }
    // A freshly drawn box gets filled right away; otherwise pause to look.
    const next = unit.ops[unit.idx + 1];
    c.quick = Boolean(next && isDraw(op) && op.el.contains(next.el));
    setPhase(c, 'linger', now);
    c.waitUntil = now + rand(...(c.quick ? QUICK_MS : LINGER_MS));
  }

  // Drag the text box out from where the text starts, then click back in to type.
  function dragTextBox(c, op, now) {
    const r = op.el.getBoundingClientRect();
    const s = Math.min(1, (now - c.phaseAt) / (TEXT_BOX_S * 1000));
    const e = s < 1 ? dragEase(s) : 1;
    const w = (r.width + 4) * e;
    const h = (Math.min(r.height, op.lineH) + 4) * e;
    if (s >= 1) {
      op.boxed = true;
      c.quick = true;
      startTravel(c, now);
    }
    return { point: toPage(r.left - 2 + w, r.top - 2 + h), mode: 'draw', sel: { x: r.left - 2, y: r.top - 2, w, h, text: true, dim: dims(w, h) }, unit: c.unit, exact: true };
  }

  // Step a just-typed heading from 18px up to its size, a tick per step.
  function growHeading(c, op, now) {
    const step = Math.min(GROW_STEPS, Math.floor((now - c.phaseAt) / GROW_STEP_MS) + 1);
    const px = HEADING_START_PX + ((op.grow - HEADING_START_PX) * step) / GROW_STEPS;
    if (step !== op.growStep) {
      op.growStep = step;
      op.el.style.scale = step >= GROW_STEPS ? '' : String(px / op.grow);
      Sound.tick(step, op.el.getBoundingClientRect().left);
    }
    if (step >= GROW_STEPS && now - c.phaseAt >= GROW_STEPS * GROW_STEP_MS) {
      op.growing = false;
      op.el.classList.remove('caw-growing');
      setPhase(c, 'linger', now);
      c.waitUntil = now + rand(...LINGER_MS);
    }
    return { point: pointFor(op), mode: 'text', sel: { ...selectionFor(op), dim: `${Math.round(px)}px` }, unit: c.unit, exact: true };
  }

  // A guide for this text, if its left edge or baseline is shared and not guided yet.
  function guideAxis(op) {
    if (op.guideX !== undefined && op.guideX > Studio.size + 4 && !Studio.hasGuide('x', op.guideX)) return 'x';
    if (op.guideY !== undefined && op.guideY - scrollY > Studio.size + 20 && !Studio.hasGuide('y', op.guideY)) return 'y';
    return null;
  }

  // Walk to a ruler, press, drag a red guide out to the edge or baseline, let go.
  function pullGuide(c, op, now) {
    const r = op.el.getBoundingClientRect();
    const half = Studio.size / 2;
    const vertical = c.axis === 'x';
    const grab = vertical
      ? { x: half, y: Math.max(Studio.size + 30, Math.min(innerHeight - 30, r.top + r.height / 2)) }
      : { x: Math.max(Studio.size + 30, Math.min(innerWidth - 30, r.left + 30)), y: half };
    const goal = vertical ? op.guideX : op.guideY - scrollY;
    if (c.phase === 'guide-travel') {
      const { point } = travel(c, toPage(grab.x, grab.y), now, false, () => {
        setPhase(c, 'guide-pull', now);
        c.guide = Studio.pullGuide(c.axis, vertical ? half : half + scrollY);
        c.guideMs = rand(...GUIDE_PULL_MS);
        Sound.click(grab.x);
      });
      return { point, mode: 'pointer', unit: c.unit, exact: true };
    }
    const s = Math.min(1, (now - c.phaseAt) / c.guideMs);
    const v = half + (goal - half) * minJerk(s);
    c.guide.move(vertical ? v : v + scrollY);
    const at = vertical ? { x: v, y: grab.y } : { x: grab.x, y: v };
    if (s >= 1) {
      c.guide.drop();
      c.guide = null;
      op.snap = c.axis;
      Sound.snap(at.x);
      startTravel(c, now);
    }
    return { point: toPage(at.x, at.y), mode: 'pointer', unit: c.unit, exact: true };
  }

  function boxOf(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height, dim: dims(r.width, r.height) };
  }

  // Grab the first item of the set, alt-drag a copy into this item's place, let go.
  function duplicate(c, unit, now) {
    const src = unit.source.el.getBoundingClientRect();
    const grab = toPage(src.left + Math.min(src.width * 0.3, 60), src.top + Math.min(src.height * 0.35, 40));
    if (c.phase === 'dupe-travel') {
      const { point } = travel(c, grab, now, false, () => {
        setPhase(c, 'dupe-aim', now);
        c.waitUntil = now + rand(...AIM_MS);
      });
      return { point, mode: 'pointer', unit, exact: true };
    }
    if (c.phase === 'dupe-aim') {
      if (now >= c.waitUntil) {
        pasteCopy(unit);
        const dest = unit.el.getBoundingClientRect();
        c.dupe = { grab, dx: dest.left - src.left, dy: dest.top - src.top, ms: rand(...DUPE_MS) };
        unit.el.style.translate = `${-c.dupe.dx}px ${-c.dupe.dy}px`; // start on top of the original
        unit.el.classList.add('caw-dragging');
        Sound.click(grab.x - scrollX);
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
        unit.el.classList.remove('caw-dragging');
        Sound.note(boxOf(unit.el));
        setPhase(c, 'dupe-linger', now);
        c.waitUntil = now + rand(...LINGER_MS);
      }
      return { point: { x: c.dupe.grab.x + dx * e, y: c.dupe.grab.y + dy * e }, mode: 'copy', sel: boxOf(unit.el), gap: gapBetween(unit.source.el, unit.el), unit, exact: true };
    }
    if (now >= c.waitUntil) {
      unit.duped = true;
      unit.state = 'active';
      c.quick = false;
      startTravel(c, now);
    }
    return { point: { x: c.dupe.grab.x + c.dupe.dx, y: c.dupe.grab.y + c.dupe.dy }, mode: 'pointer', sel: boxOf(unit.el), gap: gapBetween(unit.source.el, unit.el), unit, exact: true };
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
    } else if (state === 'built' && mouse) {
      flock(c, cursors, toPage(mouse.x, mouse.y), dt);
    } else {
      // Off duty: a springy chase to its waiting spot, with a buzz that fades as it lands.
      const target = restingPoint(c, t);
      const dist = Math.hypot(target.x - c.x, target.y - c.y);
      const buzz = Math.max(3, Math.min(26, dist * 0.13));
      const wx = target.x + Math.sin(t * 12 + c.angle * 3) * buzz;
      const wy = target.y + Math.cos(t * 9.5 + c.angle * 4) * buzz;
      c.vx += ((wx - c.x) * SPRING - c.vx * DAMPING) * dt;
      c.vy += ((wy - c.y) * SPRING - c.vy * DAMPING) * dt;
      c.x += c.vx * dt;
      c.y += c.vy * dt;
    }
    c.el.className = `caw-cursor mode-${job ? job.mode : 'pointer'}`;
    c.el.style.transform = `translate3d(${c.x - scrollX}px, ${c.y - scrollY}px, 0)`;
    place(c.sel, job?.sel);
    Studio.measure(c.id, job?.gap || null);
    if (job?.sel) {
      for (const k of ['text', 'fill', 'pen']) c.sel.classList.toggle(k, Boolean(job.sel[k]));
      c.sel.lastChild.textContent = job.sel.dim || '';
    }
  }

  // ---------- lifecycle and toolbar ----------

  function finishBuild() {
    state = 'built';
    touring = false;
    Studio.setTour(false);
    Studio.setMode('built');
    root.classList.add('caw-built');
    document.body.setAttribute('aria-busy', 'false');
    Sound.chord();
  }

  function goLive() {
    state = 'live';
    ops.forEach(L.clean);
    root.classList.add('caw-live');
    Studio.setMode('live');
    Sound.sweep();
  }

  function startBuilding() {
    for (const c of cursors) c.readyAt = buildTime + Math.random() * START_STAGGER_MS;
    state = 'building';
    root.classList.remove('caw-loading');
    Sound.arpeggio();
  }

  // Back to a blank canvas and build it all again.
  function replay() {
    state = 'loading';
    touring = false;
    Studio.setTour(false);
    Studio.setMode('building');
    Studio.reset();
    scrollTo({ top: 0, behavior: 'instant' });
    frames.splice(0, frames.length, ...frames.filter((u) => !u.helper));
    for (const u of frames) {
      Object.assign(u, { idx: 0, state: 'idle', duped: false });
      u.el.style.translate = '';
      u.el.classList.remove('caw-dragging');
    }
    ops.forEach(L.reset);
    cursors.splice(CURSOR_COUNT).forEach((c) => { c.el.remove(); c.sel.remove(); });
    for (const c of cursors) Object.assign(c, { unit: null, phase: 'idle', readyAt: Infinity, ...loaderPoint(c.angle, buildTime / 1000), vx: 0, vy: 0 });
    root.classList.remove('caw-built', 'caw-live');
    root.classList.add('caw-loading');
    document.body.setAttribute('aria-busy', 'true');
    Sound.swell();
    setTimeout(startBuilding, MIN_LOADER_MS);
  }

  function setTour(on) {
    touring = on && state === 'building';
    Studio.setTour(touring);
  }

  Studio.onAction((act, value) => {
    if (act === 'tour') setTour(!touring);
    else if (act === 'speed') { userSpeed = value; Studio.setSpeed(value); }
    else if (act === 'sound') Sound.toggle();
    else if (act === 'live') goLive();
    else if (act === 'replay') replay();
  });
  Sound.onChange((label, on) => Studio.setSound(label, on));
  // What CursorsAtWork's public API drives.
  const handle = { replay, goLive, tour: setTour, get state() { return state; }, plan: { ops, frames } };
  // The viewer taking the wheel ends the tour.
  for (const type of ['wheel', 'touchstart']) addEventListener(type, () => setTour(false), { passive: true });
  addEventListener('keydown', (e) => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(e.key)) setTour(false); });

  // Tour: scroll down at a pace the cursors keep up with, keeping the next unbuilt frame low on screen.
  function tourStep(dt) {
    const next = frames.find((u) => u.state === 'idle');
    if (!next) return;
    const ahead = next.el.getBoundingClientRect().top - innerHeight * TOUR_LEAD;
    const room = document.documentElement.scrollHeight - innerHeight - scrollY;
    if (ahead <= 0 || room <= 0) return;
    scrollTo({ top: scrollY + Math.min(ahead, room, TOUR_PX_S * userSpeed * dt), behavior: 'instant' });
  }

  // Scroll fast and more cursors join, flying in from the edge you're scrolling toward.
  let lastScroll = scrollY;
  let scrollSpeed = 0;
  let joinAt = 0;
  function callReinforcements(now, dt) {
    const moved = scrollY - lastScroll;
    lastScroll = scrollY;
    if (dt > 0) scrollSpeed += (Math.abs(moved) / dt - scrollSpeed) * Math.min(1, dt * 8);
    if (touring || scrollSpeed < JOIN_SPEED || cursors.length >= MAX_CURSORS || now < joinAt) return;
    joinAt = now + JOIN_EVERY_MS;
    const c = makeCursor(cursors.length, toPage(rand(0.1, 0.9) * innerWidth, moved >= 0 ? innerHeight + 24 : -24));
    c.readyAt = buildTime;
    cursors.push(c);
  }

  // The build runs on its own clock: the speed setting, plus a catch-up boost while the
  // viewer is scrolled ahead of what's being built.
  let last = performance.now();
  let buildTime = last;
  let speed = 1;
  let speedTarget = 1;
  let speedCheckAt = 0;

  function catchUpSpeed() {
    const left = frames.filter((u) => u.state !== 'done');
    if (!left.length) return 1;
    const building = Math.min(...left.map(foldOf));
    const viewing = Math.floor((scrollY + innerHeight - 1) / innerHeight);
    return Math.min(MAX_CATCH_UP, 1 + Math.max(0, viewing - building) * CATCH_UP_PER_FOLD);
  }

  function frame(now) {
    const realDt = Math.min(1 / 30, (now - last) / 1000);
    last = now;
    if (state === 'building' && now >= speedCheckAt) {
      speedTarget = catchUpSpeed() * userSpeed;
      speedCheckAt = now + 200;
    }
    speed += (speedTarget - speed) * Math.min(1, realDt * 3);
    buildTime += realDt * 1000 * (state === 'building' ? speed : 1);
    if (state === 'building') {
      callReinforcements(now, realDt);
      if (touring) tourStep(realDt);
    }
    if (state !== 'live') {
      const boxes = [];
      for (const c of cursors) {
        const job = state === 'building' ? work(c, buildTime) : null;
        moveCursor(c, job, buildTime, realDt);
        if (job?.sel) boxes.push({ ...job.sel, color: c.color });
      }
      Studio.frame(boxes);
      // Building: who's on a job right now. Built: the whole crew.
      const busy = state === 'building' ? cursors.filter((c) => c.unit && buildTime >= c.readyAt) : cursors;
      Studio.setCount(busy.length, cursors.length, busy.map((c) => c.color));
    }
    if (state === 'building' && frames.every((u) => u.state === 'done')) finishBuild();
    requestAnimationFrame(frame);
  }

  // Leave the loader once the page (images included) is in, but never flash it.
  const loaded = new Promise((resolve) => {
    if (document.readyState === 'complete') resolve();
    else addEventListener('load', resolve, { once: true });
    setTimeout(resolve, MAX_LOADER_MS);
  });
  Sound.swell();
  Promise.all([loaded, new Promise((resolve) => setTimeout(resolve, MIN_LOADER_MS))]).then(startBuilding);
  requestAnimationFrame(frame);
  return handle;

  // Sound turned off in the options: the same calls, all silent.
  function muted() {
    const quiet = () => {};
    return new Proxy({ onChange: quiet }, { get: (target, key) => target[key] || quiet });
  }
};
