(() => {
  // The design-tool chrome around the build: Figma-style rulers on the top and left
  // edges (each cursor's selection lights up its span on them), red guides dragged
  // out of the left ruler that text snaps to, and red spacing measurements shown
  // while a copy is alt-dragged into place. app.js drives it once per frame.
  const RULER = 18;
  const STEP = 100;    // a labelled tick every 100px
  const MINOR = 10;    // short ticks in between
  const SNAP_PX = 2;   // edges this close share a guide
  const MAX_GUIDES = 6; // older guides fade away so the page doesn't drown in red lines

  const layer = document.createElement('div');
  layer.className = 'studio';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = '<canvas class="ruler ruler-x"></canvas><canvas class="ruler ruler-y"></canvas><i class="ruler-corner"></i>';
  document.body.append(layer);
  const [top, left] = layer.querySelectorAll('canvas');
  const guides = [];
  const measures = new Map();
  let drawnKey = '';

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

  // One ruler. `offset` is the page coordinate at the ruler's start, `spans` the
  // highlighted [from, to, colour] ranges in screen coordinates.
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
    const first = Math.floor(offset / MINOR) * MINOR;
    g.beginPath();
    for (let v = first; v - offset < length; v += MINOR) {
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

  function syncGuides() {
    for (const guide of guides) guide.el.style.transform = `translate3d(${guide.x}px, 0, 0)`;
  }

  window.Studio = {
    size: RULER,

    // Repaint the rulers when the scroll position or any selection moved.
    frame(boxes) {
      const spans = boxes.filter(Boolean);
      const key = `${innerWidth}|${innerHeight}|${scrollY}|${spans.map((b) => `${b.x | 0},${b.y | 0},${b.w | 0},${b.h | 0}`).join(';')}`;
      if (key === drawnKey) return;
      drawnKey = key;
      drawRuler(top, innerWidth, scrollX, spans.map((b) => [b.x, b.x + b.w, b.color]), false);
      drawRuler(left, innerHeight, scrollY, spans.map((b) => [b.y, b.y + b.h, b.color]), true);
    },

    hasGuide(x) {
      return guides.some((g) => !g.moving && Math.abs(g.x - x) <= SNAP_PX);
    },

    // A guide being pulled out of the left ruler; move it, then drop it.
    pullGuide(x) {
      const old = guides.length >= MAX_GUIDES && guides.findIndex((g) => !g.moving);
      if (old !== false && old >= 0) {
        const [gone] = guides.splice(old, 1);
        gone.el.classList.add('gone');
        setTimeout(() => gone.el.remove(), 400);
      }
      const el = document.createElement('i');
      el.className = 'guide moving';
      layer.append(el);
      const guide = { el, x, moving: true };
      guides.push(guide);
      syncGuides();
      return {
        move(nx) { guide.x = nx; syncGuides(); },
        drop() { guide.moving = false; el.classList.remove('moving'); },
      };
    },

    // Red spacing measurement between a dragged copy and where it came from.
    measure(id, gap) {
      let el = measures.get(id);
      if (!gap) { if (el) el.hidden = true; return; }
      if (!el) {
        el = document.createElement('div');
        el.className = 'measure';
        el.innerHTML = '<b></b>';
        layer.append(el);
        measures.set(id, el);
      }
      el.hidden = false;
      el.classList.toggle('vertical', gap.vertical);
      el.style.transform = `translate3d(${gap.x}px, ${gap.y}px, 0)`;
      el.style.width = `${gap.vertical ? 1 : gap.length}px`;
      el.style.height = `${gap.vertical ? gap.length : 1}px`;
      el.firstChild.textContent = Math.round(gap.length);
    },
  };
})();
