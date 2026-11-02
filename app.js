(() => {
  // Lifecycle: loading (cursors spin on a white screen) → building (each cursor
  // claims a frame and builds its layers one by one, visible frames first) →
  // resting (the swarm buzzes in a tiny circle on the masthead).
  const CURSOR_COUNT = 8;
  const TYPE_CPS = 10;           // average typing speed, characters per second
  const DRAW_S = 0.9;            // average seconds to drag out a box
  const AIM_MS = [140, 420];     // hover before clicking into a layer
  const LINGER_MS = [220, 600];  // look at the result before moving on
  const START_STAGGER_MS = 1400; // cursors peel off the loader one at a time
  const MIN_LOADER_MS = 1400;
  const MAX_LOADER_MS = 8000;
  const LOADER_RADIUS = 18;
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
    '.foot',
  ];
  const LAYER = '[data-t], [data-draw]';

  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const orbitEl = document.querySelector('[data-orbit]');
  const layerEl = document.querySelector('.cursors');

  const ops = new Map([...document.querySelectorAll(LAYER)].map((el) => [el, setup(el)]));
  const units = buildUnits();
  let state = 'loading';
  root.classList.add('ready');

  if (reduceMotion) {
    for (const op of ops.values()) finishOp(op);
    finishBuild();
    return;
  }

  const cursors = Array.from({ length: CURSOR_COUNT }, makeCursor);

  function setup(el) {
    const op = { el, p: 0, n: -1, draw: 'draw' in el.dataset, done: false };
    if (op.draw) return op;

    // Full text stays in layout (ghost) so nothing reflows while typing.
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    const typed = document.createElement('span');
    const caret = document.createElement('span');
    const rest = document.createElement('span');
    caret.className = 'caret';
    caret.setAttribute('aria-hidden', 'true');
    rest.className = 'ghost';
    el.replaceChildren(typed, caret, rest);
    return { ...op, text, typed, caret, rest, k: 0, nextKeyAt: 0 };
  }

  function buildUnits() {
    const claimed = new Set();
    const list = [];
    for (const selector of FRAMES) {
      for (const el of document.querySelectorAll(selector)) {
        const layers = [...(el.matches(LAYER) ? [el] : []), ...el.querySelectorAll(LAYER)].filter((l) => !claimed.has(l));
        layers.forEach((l) => claimed.add(l));
        list.push({ el, ops: layers.map((l) => ops.get(l)), idx: 0, state: 'idle' });
      }
    }
    for (const [el, op] of ops) if (!claimed.has(el)) list.push({ el, ops: [op], idx: 0, state: 'idle' });
    return list.sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
  }

  function makeCursor(_, i) {
    const html = (tag, cls, inner = '') => Object.assign(document.createElement(tag), { className: cls, innerHTML: inner });
    const sel = html('div', 'sel', '<i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i><b class="dim"></b>');
    const el = html('div', 'cursor mode-pointer', `
      <svg class="ico ico-pointer" width="22" height="22" viewBox="0 0 22 22"><path d="M1 1v17l4.5-4.3 3.3 7.3 2.8-1.2-3.2-7.1H15z"/></svg>
      <svg class="ico ico-text" width="12" height="22" viewBox="0 0 12 22"><path d="M2 1.5h2.5L6 3l1.5-1.5H10M6 3v16M2 20.5h2.5L6 19l1.5 1.5H10"/></svg>
      <svg class="ico ico-draw" width="20" height="20" viewBox="0 0 20 20"><path d="M10 1v18M1 10h18"/></svg>`);
    layerEl.append(sel, el);
    const angle = (i * Math.PI * 2) / CURSOR_COUNT;
    const start = loaderPoint(angle, performance.now() / 1000);
    return {
      el, sel, angle, phase: 'idle', phaseAt: 0, unit: null,
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
    const n = Math.round(p * op.text.length);
    if (n !== op.n) {
      op.n = n;
      op.typed.textContent = op.text.slice(0, n);
      op.rest.textContent = op.text.slice(n);
    }
    el.classList.toggle('typing', p > 0 && p < 1);
  }

  function finishOp(op) {
    op.p = 1;
    op.done = true;
    render(op);
  }

  function finishBuild() {
    state = 'resting';
    root.classList.add('loaded', 'built');
    document.body.setAttribute('aria-busy', 'false');
  }

  // Free cursor takes the next unbuilt frame in reading order (units are sorted
  // top to bottom), skipping ahead to the screen when the viewer scrolls past.
  function claimUnit() {
    const idle = units.filter((u) => u.state === 'idle');
    const unit = idle.find((u) => u.el.getBoundingClientRect().bottom > 0) || idle[0];
    if (unit) unit.state = 'active';
    return unit || null;
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
      return r.height ? toPage(r.right + 5, r.top + r.height / 2) : null;
    }
    const r = op.el.getBoundingClientRect();
    return r.height ? toPage(r.left + r.width * op.p, r.top + r.height * op.p) : null;
  }

  function selectionFor(op) {
    const r = op.el.getBoundingClientRect();
    if (!op.draw) return { x: r.left - 2, y: r.top - 2, w: r.width + 4, h: r.height + 4, text: true };
    const p = Math.max(op.p, 0.02);
    return { x: r.left, y: r.top, w: r.width * p, h: r.height * p, dim: `${Math.round(r.width * p)} × ${Math.round(r.height * p)}` };
  }

  function loaderPoint(angle, t) {
    const a = t * 3 + angle;
    return toPage(innerWidth / 2 + Math.cos(a) * LOADER_RADIUS, innerHeight / 2 + Math.sin(a) * LOADER_RADIUS);
  }

  // Resting spot: a tiny swarm on the logo's asterisk.
  function swarmPoint(c, t) {
    const r = orbitEl.getBoundingClientRect();
    const a = t * c.swarmSpin + c.angle;
    return toPage(r.right - r.width * 0.04 + Math.cos(a) * c.swarmRadius, r.top + r.height * 0.2 + Math.sin(a) * c.swarmRadius);
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
  function keyDelay(ch) {
    let ms = (1000 / TYPE_CPS) * rand(0.5, 1.5);
    if (ch === ' ') ms += rand(20, 140);
    if (',.;:?!—'.includes(ch)) ms += rand(180, 420);
    if (Math.random() < 0.04) ms += rand(250, 650);
    return ms;
  }

  function startTravel(c, now) {
    setPhase(c, 'travel', now);
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
      startTravel(c, now);
    }
    const unit = c.unit;
    let op = unit.ops[unit.idx];
    while (op && op.done) op = unit.ops[++unit.idx];
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
    const tool = op.draw ? 'draw' : 'text';

    if (c.phase === 'travel') {
      // Move time grows with distance, varies a little per move (Fitts-ish).
      if (!c.travelMs) c.travelMs = Math.min(1300, 280 + Math.hypot(point.x - c.from.x, point.y - c.from.y) * 0.75) * rand(0.85, 1.2);
      const s = Math.min(1, (now - c.phaseAt) / c.travelMs);
      if (s >= 1) {
        setPhase(c, 'aim', now);
        c.waitUntil = now + rand(...AIM_MS);
      }
      return { point: along(c.from, point, c.bend, minJerk(s)), mode: s > 0.85 ? tool : 'pointer', unit, exact: true };
    }
    if (c.phase === 'aim') {
      if (now >= c.waitUntil) {
        setPhase(c, 'work', now);
        op.nextKeyAt = now;
        op.dragMs = DRAW_S * 1000 * rand(0.8, 1.25);
      }
      return { point, mode: tool, unit, exact: true };
    }
    if (c.phase === 'work') {
      let finished;
      if (op.draw) {
        const s = Math.min(1, (now - c.phaseAt) / op.dragMs);
        op.p = s < 1 ? dragEase(s) : 1;
        finished = s >= 1;
      } else {
        while (now >= op.nextKeyAt && op.k < op.text.length) op.nextKeyAt += keyDelay(op.text[op.k++]);
        op.p = op.k / op.text.length;
        finished = op.k >= op.text.length;
      }
      render(op);
      if (finished) {
        setPhase(c, 'linger', now);
        c.waitUntil = now + rand(...LINGER_MS);
      }
    } else if (now >= c.waitUntil) {
      op.done = true;
      unit.idx++;
      startTravel(c, now);
    }
    // Dragging: the hand is on the corner. Typing: the mouse rests and only drifts after the caret.
    return { point: pointFor(op), mode: tool, sel: selectionFor(op), unit, exact: op.draw, drift: !op.draw };
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
    } else if (job?.drift) {
      const k = 1 - Math.exp(-dt * 2.5);
      c.x += (job.point.x - c.x) * k;
      c.y += (job.point.y - c.y) * k;
    } else {
      // Off duty: fly to the swarm with a springy chase and a buzz that fades as it lands.
      const target = swarmPoint(c, t);
      const dist = Math.hypot(target.x - c.x, target.y - c.y);
      const buzz = Math.max(3, Math.min(26, dist * 0.13));
      const wx = target.x + Math.sin(t * 12 + c.angle * 3) * buzz;
      const wy = target.y + Math.cos(t * 9.5 + c.angle * 4) * buzz;
      c.vx += ((wx - c.x) * SPRING - c.vx * DAMPING) * dt;
      c.vy += ((wy - c.y) * SPRING - c.vy * DAMPING) * dt;
      c.x += c.vx * dt;
      c.y += c.vy * dt;
    }

    c.el.className = `cursor mode-${job ? job.mode : 'pointer'}`;
    c.el.style.transform = `translate3d(${c.x - scrollX}px, ${c.y - scrollY}px, 0)`;

    place(c.sel, job?.sel);
    if (job?.sel) {
      c.sel.classList.toggle('text', Boolean(job.sel.text));
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
  Promise.all([loaded, minShown]).then(() => {
    const now = performance.now();
    for (const c of cursors) c.readyAt = now + Math.random() * START_STAGGER_MS;
    state = 'building';
    root.classList.add('loaded');
  });

  let last = t0;
  function frame(now) {
    const dt = Math.min(1 / 30, (now - last) / 1000);
    last = now;
    for (const c of cursors) moveCursor(c, state === 'building' ? work(c, now) : null, now, dt);
    if (state === 'building' && units.every((u) => u.state === 'done')) finishBuild();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
