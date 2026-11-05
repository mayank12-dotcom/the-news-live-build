CAW.studio = (options = {}) => {
  // The design-tool chrome around the build: Figma-style rulers on the top and left
  // edges (each cursor's selection lights up its span), the page's layout grid as
  // translucent columns (see grid.js), red guides pulled out of the
  // rulers (vertical ones for shared left edges, horizontal ones for shared baselines),
  // red spacing measurements while a copy is alt-dragged, and the toolbar.
  const RULER = 18;
  const STEP = 100;     // a labelled tick every 100px
  const MINOR = 10;     // short ticks in between
  const SNAP_PX = 2;    // edges this close share a guide
  const MAX_GUIDES = 8; // older guides fade away so the page doesn't drown in red lines
  const MAX_DOTS = 5;   // colour dots in the crew counter

  const make = (tag, cls, html = '') => Object.assign(document.createElement(tag), { className: cls, innerHTML: html });
  const layer = make('div', 'caw-ui caw-studio', '<canvas class="caw-ruler"></canvas><canvas class="caw-ruler"></canvas><i class="caw-ruler-corner"></i>');
  layer.setAttribute('aria-hidden', 'true');
  // The crew counter is its own pill in the bottom-right; the toolbar sits bottom-left.
  const crew = make('div', 'caw-ui caw-count', '<span class="caw-count-dots" aria-hidden="true"></span><b>0</b><span class="caw-count-of"> / 0</span><span class="caw-count-label"> at work</span>');
  crew.setAttribute('aria-live', 'off');
  crew.hidden = true;
  const bar = make('div', 'caw-ui caw-toolbar', `
    <button type="button" data-act="tour" aria-pressed="false">Tour</button>
    <button type="button" data-act="sound" aria-pressed="true">Sound</button>
    <button type="button" data-act="live" class="caw-primary">Go live</button>`);
  bar.setAttribute('role', 'toolbar');
  bar.setAttribute('aria-label', 'Build controls');
  if (options.sound === false) bar.querySelector('[data-act="sound"]').remove();
  if (options.autoLive !== false) bar.querySelector('[data-act="live"]').remove(); // it goes live by itself
  document.body.append(layer);
  if (options.toolbar !== false) document.body.append(bar, crew);

  const [top, left] = layer.querySelectorAll('canvas');
  const gridEl = make('div', 'caw-grid');
  layer.prepend(gridEl);
  const guides = [];
  const measures = new Map();
  let onAction = () => {};
  let drawnKey = '';
  let countKey = '';

  bar.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    e.stopPropagation();
    onAction(b.dataset.act);
  });

  function fit(canvas, w, h) {
    const dpr = Math.min(2, devicePixelRatio || 1);
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }
    const g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    return g;
  }

  // One ruler. `offset` is the page coordinate at its start, `spans` the highlighted
  // [from, to, colour] ranges in screen coordinates.
  function drawRuler(canvas, length, offset, spans, vertical) {
    const g = vertical ? fit(canvas, RULER, length) : fit(canvas, length, RULER);
    g.fillStyle = '#2c2c2c';
    g.fillRect(0, 0, vertical ? RULER : length, vertical ? length : RULER);
    for (const [a, b, color] of spans) {
      g.fillStyle = color;
      g.globalAlpha = 0.28;
      if (vertical) g.fillRect(0, a, RULER, b - a);
      else g.fillRect(a, 0, b - a, RULER);
      g.globalAlpha = 1;
    }
    g.strokeStyle = '#5c5c5c';
    g.lineWidth = 1;
    g.font = '500 9px Inter, system-ui, sans-serif';
    g.textBaseline = 'middle';
    g.beginPath();
    for (let v = Math.floor(offset / MINOR) * MINOR; v - offset < length; v += MINOR) {
      const s = Math.round(v - offset) + 0.5;
      const tick = v % STEP === 0 ? RULER : v % 50 === 0 ? 6 : 3;
      if (vertical) { g.moveTo(RULER - tick, s); g.lineTo(RULER, s); } else { g.moveTo(s, RULER - tick); g.lineTo(s, RULER); }
    }
    g.stroke();
    const label = (text, s, color) => {
      g.fillStyle = color;
      if (!vertical) { g.fillText(text, s + 3, RULER / 2); return; }
      g.save();
      g.translate(RULER / 2, s - 3);
      g.rotate(-Math.PI / 2);
      g.fillText(text, 0, 0);
      g.restore();
    };
    for (let v = Math.ceil(offset / STEP) * STEP; v - offset < length; v += STEP) label(String(v), v - offset, '#8a8a8a');
    // The selection's own edges, numbered in its colour like Figma does.
    for (const [a, b, color] of spans) {
      label(String(Math.round(a + offset)), a - (vertical ? -24 : 0), color);
      label(String(Math.round(b + offset)), b - (vertical ? 0 : 22), color);
    }
  }

  // Vertical guides sit at a screen x; horizontal ones at a page y, so they scroll with it.
  function place(guide) {
    guide.el.style.transform = guide.axis === 'x' ? `translate3d(${guide.v}px, 0, 0)` : `translate3d(0, ${guide.v - scrollY}px, 0)`;
  }

  function measure(id, gap) {
    let el = measures.get(id);
    if (!gap) { if (el) el.hidden = true; return; }
    if (!el) {
      el = make('div', 'caw-measure', '<b></b>');
      layer.append(el);
      measures.set(id, el);
    }
    el.hidden = false;
    el.classList.toggle('vertical', gap.vertical);
    el.style.transform = `translate3d(${gap.x}px, ${gap.y}px, 0)`;
    el.style.width = `${gap.vertical ? 1 : gap.length}px`;
    el.style.height = `${gap.vertical ? gap.length : 1}px`;
    el.firstChild.textContent = Math.round(gap.length);
  }

  const press = (sel, on) => bar.querySelectorAll(sel).forEach((b) => b.setAttribute('aria-pressed', String(on(b))));

  const api = {
    size: RULER,
    measure,

    // Repaint the rulers when the scroll position or any selection moved.
    frame(boxes) {
      guides.forEach((g) => { if (g.axis === 'y') place(g); });
      const key = `${innerWidth}|${innerHeight}|${scrollY}|${boxes.map((b) => `${b.x | 0},${b.y | 0},${b.w | 0},${b.h | 0}`).join(';')}`;
      if (key === drawnKey) return;
      drawnKey = key;
      drawRuler(top, innerWidth, scrollX, boxes.map((b) => [b.x, b.x + b.w, b.color]), false);
      drawRuler(left, innerHeight, scrollY, boxes.map((b) => [b.y, b.y + b.h, b.color]), true);
    },

    hasGuide(axis, v) {
      return guides.some((g) => g.axis === axis && Math.abs(g.v - v) <= SNAP_PX);
    },

    // A guide being pulled out of a ruler: move it, then drop it.
    pullGuide(axis, v) {
      const old = guides.length >= MAX_GUIDES ? guides.findIndex((g) => !g.moving) : -1;
      if (old >= 0) {
        const [gone] = guides.splice(old, 1);
        gone.el.classList.add('gone');
        setTimeout(() => gone.el.remove(), 400);
      }
      const guide = { el: make('i', `caw-guide caw-guide-${axis} moving`), axis, v, moving: true };
      layer.append(guide.el);
      guides.push(guide);
      place(guide);
      return {
        move(nv) { guide.v = nv; place(guide); },
        drop() { guide.moving = false; guide.el.classList.remove('moving'); },
      };
    },

    // Lay the detected column grid over the page; its columns drop in one by one.
    setGrid(grid) {
      if (options.grid === false) return;
      const cols = grid.columns.map(([a, b], i) => {
        const col = make('i');
        col.style.cssText = `left:${a}px;width:${b - a}px;--i:${i}`;
        return col;
      });
      gridEl.dataset.breakpoint = grid.breakpoint;
      gridEl.replaceChildren(...cols);
    },

    reset() {
      guides.splice(0).forEach((g) => g.el.remove());
      measures.forEach((el) => { el.hidden = true; });
      drawnKey = '';
    },

    // Toolbar state: 'building' (counter, tour, sound), 'built' (tour, sound, go live), 'live' (tour).
    // Once built, Tour builds the page again from the top and tours it.
    setMode(mode) { bar.dataset.mode = mode; },
    setTour(on) { press('[data-act="tour"]', () => on); },
    // The crew counter: dots in the working cursors' colours, then "12 / 16 at work".
    // Shown only while cursors are actually on a job.
    setCount(working, total, colors) {
      const key = `${bar.dataset.mode}|${working}|${total}|${colors.join()}`;
      if (key === countKey) return;
      countKey = key;
      crew.hidden = bar.dataset.mode !== 'building' || !working;
      if (crew.hidden) return;
      const [dots, num, of, label] = crew.children;
      dots.replaceChildren(...colors.slice(0, MAX_DOTS).map((c) => {
        const dot = make('i');
        dot.style.background = c;
        return dot;
      }));
      num.textContent = working;
      of.textContent = ` / ${total}`;
      label.textContent = ' at work';
    },

    setSound(label, on) {
      const b = bar.querySelector('[data-act="sound"]');
      if (!b) return;
      b.textContent = label;
      b.setAttribute('aria-pressed', String(on));
    },
    onAction(fn) { onAction = fn; },
  };
  api.setMode('building');
  return api;
};
