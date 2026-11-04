/*! Cursors at Work v1.0.0 | MIT License | https://github.com/mayank12-dotcom/cursors-at-work */
(function () {
  'use strict';
  const CAW = { version: "1.0.0", css: ":root{--caw-sel:#0d99ff;--caw-red:#f24822;--caw-ease:cubic-bezier(0.16,1,0.3,1);--caw-ui:\"Inter\",system-ui,-apple-system,\"Segoe UI\",sans-serif;--caw-z:2147483000}.caw-paint{background-color:transparent !important;background-image:none !important;border-color:transparent !important;box-shadow:none !important;outline-color:transparent !important}.caw-filled,.caw-restyled{transition:background-color 0.35s var(--caw-ease),border-color 0.35s,box-shadow 0.35s}.caw-edge-top{border-top-color:transparent !important}.caw-edge-right{border-right-color:transparent !important}.caw-edge-bottom{border-bottom-color:transparent !important}.caw-edge-left{border-left-color:transparent !important}.caw-hide{opacity:0 !important}.caw-reveal{animation:caw-fade 0.35s var(--caw-ease)}img.caw-reveal,video.caw-reveal,canvas.caw-reveal{animation:caw-fade 0.35s var(--caw-ease),caw-sweep 0.55s var(--caw-ease)}@keyframes caw-fade{from{opacity:0}}@keyframes caw-sweep{from{clip-path:inset(0 0 100% 0)}}.caw-ghost{color:transparent !important;-webkit-text-fill-color:transparent !important;text-decoration-color:transparent !important;text-shadow:none !important}.caw-caret{display:inline-block;width:0;height:0.95em;vertical-align:-0.12em;box-shadow:0 0 0 1px var(--c,var(--caw-sel));visibility:hidden}.caw-typing .caw-caret{visibility:visible}.caw-growing{transform-origin:left top}.caw-snap-x{animation:caw-snap-x 0.22s var(--caw-ease)}.caw-snap-y{animation:caw-snap-y 0.22s var(--caw-ease)}@keyframes caw-snap-x{from{translate:5px 0}}@keyframes caw-snap-y{from{translate:0 4px}}.caw-dragging{position:relative;z-index:5;background-color:var(--caw-canvas,#fff);box-shadow:0 10px 28px rgb(32 33 36 / 0.14)}.caw-selecting .caw-typed:first-child{background:color-mix(in srgb,var(--hl) 26%,transparent)}.caw-swapped{animation:caw-swap 0.32s var(--caw-ease)}@keyframes caw-swap{from{opacity:0.3}}.caw-loader{position:fixed;inset:0;z-index:calc(var(--caw-z) - 2);background:var(--caw-canvas,#fff);opacity:0;visibility:hidden;pointer-events:none;transition:opacity 0.7s var(--caw-ease),visibility 0.7s}.caw-loading .caw-loader{opacity:1;visibility:visible}.caw-loader-mark{position:absolute;left:50%;top:50%;width:172px;max-width:calc(100vw - 140px);height:auto;translate:-50% -50%;opacity:0.16;filter:grayscale(1);animation:caw-breathe 2.4s ease-in-out infinite alternate}@keyframes caw-breathe{to{opacity:0.3}}html.caw-loading{overflow:hidden}.caw-loader-hint{position:absolute;left:50%;bottom:84px;translate:-50% 8px;margin:0;display:flex;flex-direction:column;align-items:center;gap:10px;color:#8a8a8a;font:500 12px/1 var(--caw-ui);letter-spacing:0.4px;opacity:0;transition:opacity 0.6s var(--caw-ease),translate 0.6s var(--caw-ease)}.caw-waiting .caw-loader-hint{opacity:1;translate:-50% 0}.caw-loader-hint i{width:1px;height:28px;background:linear-gradient(currentColor,transparent);animation:caw-nudge 1.6s ease-in-out infinite}@keyframes caw-nudge{0%,100%{transform:translateY(-4px);opacity:0.4}50%{transform:translateY(4px);opacity:1}}.caw-cursors{position:fixed;inset:0;z-index:calc(var(--caw-z) + 1);overflow:hidden;pointer-events:none;transition:opacity 0.5s var(--caw-ease),visibility 0.5s}.caw-cursors>*{position:absolute;left:0;top:0}.caw-cursor{will-change:transform}.caw-cursor .ico{position:absolute;display:none;overflow:visible}.caw-cursor .ico-pointer{left:-2px;top:-2px}.caw-cursor .ico-pointer path{fill:var(--c)}.caw-cursor .ico-pointer .rim{fill:#fff}.caw-cursor .ico-text{left:-7px;top:-12px}.caw-cursor .ico-draw{left:-11px;top:-11px}.caw-cursor .ico-pen{left:-1.5px;top:-1.5px}.caw-cursor .ico-pen .nib{fill:var(--c);stroke:#fff;stroke-width:1.4;stroke-linejoin:round}.caw-cursor .ico-pen circle{fill:#fff}.caw-cursor .ico-text path,.caw-cursor .ico-draw path{fill:none;stroke:var(--c);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}.caw-cursor .ico-text .halo,.caw-cursor .ico-draw .halo{stroke:#fff;stroke-width:4.5}.mode-pointer .ico-pointer,.mode-text .ico-text,.mode-draw .ico-draw,.mode-pen .ico-pen,.mode-copy .ico-pointer,.mode-copy .ico-copy{display:block !important}.caw-cursor .ico-copy{left:13px;top:15px}.caw-cursor .ico-copy circle{fill:var(--c);stroke:#fff;stroke-width:1}.caw-cursor .ico-copy path{stroke:#fff;stroke-width:1.4;stroke-linecap:round}.caw-sel{display:none;box-shadow:inset 0 0 0 1px var(--c),0 0 0 0.5px var(--c)}.caw-sel.on{display:block}.caw-sel i{position:absolute;width:7px;height:7px;background:#fff;border:1px solid var(--c)}.caw-sel .tl{left:-3px;top:-3px}.caw-sel .tr{right:-3px;top:-3px}.caw-sel .bl{left:-3px;bottom:-3px}.caw-sel .br{right:-3px;bottom:-3px}.caw-dim{position:absolute;left:50%;top:100%;margin-top:6px;transform:translateX(-50%);padding:2px 5px;border-radius:3px;background:var(--c);color:#fff;font:500 11px/1.3 var(--caw-ui);white-space:nowrap}.caw-dim:empty,.caw-sel.text i{display:none}.caw-sel.fill{background:#d9d9d9}.caw-sel.pen{box-shadow:none;background:var(--c)}.caw-sel.pen i{border-radius:50%}.caw-sel.pen .tr,.caw-sel.pen .bl{display:none}.caw-studio{position:fixed;inset:0;z-index:var(--caw-z);overflow:hidden;pointer-events:none;opacity:0;visibility:hidden;transition:opacity 0.6s var(--caw-ease),visibility 0.6s}html:not(.caw-loading):not(.caw-pending) .caw-studio{opacity:1;visibility:visible}.caw-studio>*{position:absolute;left:0;top:0}.caw-grid{position:absolute;inset:0}.caw-grid i{position:absolute;top:0;bottom:0;background:rgb(242 72 34 / 0.05);box-shadow:inset 1px 0 rgb(242 72 34 / 0.16),inset -1px 0 rgb(242 72 34 / 0.16);transform-origin:top;animation:caw-column 0.7s var(--caw-ease) both;animation-delay:calc(var(--i) * 45ms)}@keyframes caw-column{from{transform:scaleY(0)}}.caw-ruler-corner{width:18px;height:18px;background:#2c2c2c;box-shadow:1px 1px 0 #444}.caw-guide{background:var(--caw-red);opacity:0.7}.caw-guide-x{width:1px;height:100%}.caw-guide-y{width:100%;height:1px}.caw-guide.moving{opacity:1}.caw-guide.gone{opacity:0;transition:opacity 0.4s var(--caw-ease)}.caw-measure{background:var(--caw-red)}.caw-measure b{position:absolute;left:50%;top:50%;translate:-50% -50%;padding:1px 4px;border-radius:2px;background:var(--caw-red);color:#fff;font:500 10px/1.3 var(--caw-ui);white-space:nowrap}.caw-measure.vertical b{translate:6px -50%}.caw-measure[hidden]{display:none}.caw-toolbar{position:fixed;left:16px;bottom:16px;z-index:calc(var(--caw-z) + 2);display:flex;align-items:center;gap:4px;max-width:calc(100vw - 32px);padding:5px;border-radius:999px;background:#2c2c2c;box-shadow:0 12px 32px rgb(0 0 0 / 0.24),0 2px 6px rgb(0 0 0 / 0.12),inset 0 0 0 1px rgb(255 255 255 / 0.06);font:500 12px/1 var(--caw-ui);color:#fff;transition:opacity 0.4s var(--caw-ease),translate 0.4s var(--caw-ease)}.caw-toolbar button{all:unset;box-sizing:border-box;padding:8px 14px;border-radius:999px;cursor:pointer;white-space:nowrap;color:#d6d6d6;transition:background-color 0.15s,color 0.15s,translate 0.15s var(--caw-ease)}.caw-toolbar button:hover{background:#3d3d3d;color:#fff}.caw-toolbar button:active{background:#474747;translate:0 1px}.caw-toolbar button:focus-visible{outline:2px solid var(--caw-sel);outline-offset:2px}.caw-toolbar button[aria-pressed=\"true\"]{background:#4a4a4a;color:#fff}.caw-toolbar .caw-primary{background:var(--caw-sel);color:#fff}.caw-toolbar .caw-primary:hover{background:#0a84e0}.caw-count{display:flex;align-items:center;gap:7px;padding:0 10px 0 9px;color:#d6d6d6;white-space:nowrap;font-variant-numeric:tabular-nums;animation:caw-fade 0.3s var(--caw-ease)}.caw-count[hidden]{display:none}.caw-count-dots{display:flex}.caw-count-dots:empty{display:none}.caw-count-dots i{width:9px;height:9px;border-radius:50%;box-shadow:0 0 0 1.5px #2c2c2c;transition:background-color 0.3s}.caw-count-dots i + i{margin-left:-3px}.caw-count b{color:#fff;font-weight:600;min-width:2ch;text-align:right}.caw-count-of,.caw-count-label{color:#9a9a9a}@media (max-width:480px){.caw-toolbar{left:12px;bottom:12px;max-width:calc(100vw - 24px);gap:2px}.caw-toolbar button{padding:8px 11px}.caw-count{gap:5px;padding:0 6px 0 7px}.caw-count-label{display:none}}.caw-toolbar[data-mode=\"building\"] [data-act=\"live\"],.caw-toolbar[data-mode=\"live\"] :is(.caw-count,[data-act=\"live\"]){display:none}.caw-live .caw-studio,.caw-live .caw-cursors{opacity:0 !important;visibility:hidden !important}@media (prefers-reduced-motion:reduce){.caw-ui{display:none !important}}" };

  // ---- kit.js ----
  CAW.kit = (() => {
    // Motion helpers for the build (engine.js): easing, hand-like paths, typing rhythm,
    // spacing between boxes, and the flocking used once the page is done.
    const FLOCK = {
      ring: 74,        // the crew circles this far out from the viewer's pointer
      avoid: 54,       // and is pushed away hard inside this
      seek: 9,
      swirl: 240,
      sight: 90,       // neighbours this close steer together...
      space: 22,       // ...and keep at least this far apart
      align: 2.6,
      cohere: 1.2,
      drag: 2.2,
      maxSpeed: 900,
    };

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

    // Point along a gently curved path from `a` to `b`.
    function along(a, b, bend, s) {
      const mx = (a.x + b.x) / 2 - (b.y - a.y) * bend;
      const my = (a.y + b.y) / 2 + (b.x - a.x) * bend;
      const u = 1 - s;
      return { x: u * u * a.x + 2 * u * s * mx + s * s * b.x, y: u * u * a.y + 2 * u * s * my + s * s * b.y };
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

    // One flocking step for cursor `c` around `target` (the pointer, page coordinates):
    // seek a ring around it, swirl one way round, flee if too close, and steer with the
    // neighbours (align, cohere, separate) so the crew moves as one.
    function flock(c, all, target, dt) {
      const dx = target.x - c.x;
      const dy = target.y - c.y;
      const d = Math.hypot(dx, dy) || 1;
      let ax = (dx / d) * (d - FLOCK.ring) * FLOCK.seek + (-dy / d) * FLOCK.swirl;
      let ay = (dy / d) * (d - FLOCK.ring) * FLOCK.seek + (dx / d) * FLOCK.swirl;
      if (d < FLOCK.avoid) {
        ax -= (dx / d) * (FLOCK.avoid - d) * 80;
        ay -= (dy / d) * (FLOCK.avoid - d) * 80;
      }
      let n = 0;
      let vx = 0;
      let vy = 0;
      let cx = 0;
      let cy = 0;
      for (const o of all) {
        if (o === c) continue;
        const ox = c.x - o.x;
        const oy = c.y - o.y;
        const od = Math.hypot(ox, oy);
        if (od > FLOCK.sight || od === 0) continue;
        n++;
        vx += o.vx;
        vy += o.vy;
        cx += o.x;
        cy += o.y;
        if (od < FLOCK.space) {
          ax += (ox / od) * (FLOCK.space - od) * 90;
          ay += (oy / od) * (FLOCK.space - od) * 90;
        }
      }
      if (n) {
        ax += (vx / n - c.vx) * FLOCK.align + (cx / n - c.x) * FLOCK.cohere;
        ay += (vy / n - c.vy) * FLOCK.align + (cy / n - c.y) * FLOCK.cohere;
      }
      c.vx += (ax - c.vx * FLOCK.drag) * dt;
      c.vy += (ay - c.vy * FLOCK.drag) * dt;
      const speed = Math.hypot(c.vx, c.vy);
      const cap = Math.max(FLOCK.maxSpeed, d * 3); // stragglers far up the page catch up fast
      if (speed > cap) {
        c.vx *= cap / speed;
        c.vy *= cap / speed;
      }
      c.x += c.vx * dt;
      c.y += c.vy * dt;
    }

    return { rand, minJerk, dragEase, keyDelay, along, gapBetween, flock };
  })();

  // ---- layers.js ----
  CAW.layers = (() => {
    // Reads any page into a build plan, the way a designer would see it in Figma:
    //   text   — a block of words (its inline links and styles kept), typed in
    //   box    — an element that paints a fill, image fill, shadow or full border
    //   media  — img, svg, video, canvas, iframe, form controls
    //   line   — a hairline (hr, a 1–3px bar), drawn with the pen tool
    //   edge   — a single-side border (a header's bottom rule), also pen-drawn
    // Text waiting to be typed carries .caw-text, so a site can relax line clamps until then.
    // Layers are grouped into frames (small subtrees, cursors claim one each), repeated
    // siblings become one master plus copies, and the page's own shared left edges and
    // baselines become the guides. It also owns hiding, revealing and restoring layers.
    const MAX_FRAME_OPS = 10;   // a subtree with more layers than this is split into its children
    const MAX_OPS = 4000;       // very long pages: stop reading after this many layers
    const EDGE_MIN = 3;         // a left edge shared by this many layers gets a guide
    const BASELINE_MIN = 2;     // a baseline shared by this many text blocks gets one too
    const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'LINK', 'META', 'TITLE', 'HEAD', 'BR', 'WBR', 'OPTION', 'DATALIST', 'SOURCE', 'TRACK']);
    const MEDIA = new Set(['IMG', 'SVG', 'VIDEO', 'CANVAS', 'IFRAME', 'EMBED', 'OBJECT', 'INPUT', 'TEXTAREA', 'SELECT', 'PROGRESS', 'METER', 'AUDIO']);
    const SIDES = ['top', 'right', 'bottom', 'left'];

    // Alpha of a computed colour; 0 means it paints nothing.
    function alpha(color) {
      if (!color || color === 'transparent') return 0;
      const m = color.match(/rgba?\(([^)]+)\)/);
      if (!m) return /\/\s*0(\.0+)?\s*\)$/.test(color) ? 0 : 1;
      const parts = m[1].split(/[\s,/]+/).filter(Boolean);
      return parts.length > 3 ? parseFloat(parts[3]) : 1;
    }

    const borderSides = (cs) => SIDES.filter((s) => parseFloat(cs.getPropertyValue(`border-${s}-width`)) > 0
      && cs.getPropertyValue(`border-${s}-style`) !== 'none' && alpha(cs.getPropertyValue(`border-${s}-color`)) > 0);

    function paintOf(cs) {
      if (cs.backgroundClip === 'text' || cs.webkitBackgroundClip === 'text') return null;
      const sides = borderSides(cs);
      const fill = alpha(cs.backgroundColor) > 0 || cs.backgroundImage !== 'none';
      const shadow = cs.boxShadow !== 'none';
      if (fill || shadow || sides.length >= 2) return { kind: 'box', bg: cs.backgroundColor, sides };
      if (sides.length === 1) return { kind: 'edge', side: sides[0], width: parseFloat(cs.getPropertyValue(`border-${sides[0]}-width`)) };
      return null;
    }

    const hasOwnText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.data.trim());
    const isPre = (el) => getComputedStyle(el).whiteSpace.startsWith('pre');

    // The text nodes a text layer types, skipping anything that isn't words on the page.
    function textNodes(el) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
        acceptNode: (n) => {
          if (n.nodeType === 1) return SKIP.has(n.tagName) || MEDIA.has(n.tagName.toUpperCase()) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
          return n.data.length ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        },
      });
      const list = [];
      while (walker.nextNode()) list.push(walker.currentNode);
      return list;
    }

    // ---------- reading the page ----------

    function scan(rootEl, exclude) {
      const ops = [];
      const boxes = new Map();
      function visit(el, inText) {
        if (ops.length >= MAX_OPS || SKIP.has(el.tagName) || exclude(el)) return null;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return null;
        const r = el.getBoundingClientRect();
        const sized = r.width >= 1 && r.height >= 1;
        const node = { el, own: [], kids: [], count: 0 };
        const tag = el.tagName.toUpperCase();
        if (MEDIA.has(tag) && !(tag === 'INPUT' && el.type === 'hidden')) {
          if (sized) node.own.push({ kind: 'media', el });
          ops.push(...node.own);
          node.count = node.own.length;
          return node;
        }
        if (sized && el !== document.body) {
          const paint = paintOf(cs);
          const thin = Math.min(r.width, r.height) <= 3;
          if (tag === 'HR' || (paint?.kind === 'box' && thin)) node.own.push({ kind: 'line', el, vertical: r.height > r.width });
          else if (paint?.kind === 'box') node.own.push({ kind: 'box', el, bg: paint.bg });
          else if (paint?.kind === 'edge') node.own.push({ kind: 'edge', el, side: paint.side, width: paint.width });
          node.own.forEach((op) => boxes.set(el, op));
        }
        let text = inText;
        if (!inText && hasOwnText(el) && sized && !(r.width <= 1 && r.height <= 1)) {
          node.own.push({ kind: 'text', el });
          text = true;
        }
        ops.push(...node.own);
        for (const child of el.children) {
          const kid = visit(child, text);
          if (kid && kid.count) node.kids.push(kid);
        }
        node.count = node.own.length + node.kids.reduce((n, k) => n + k.count, 0);
        return node;
      }
      const tree = visit(rootEl, false);
      const frames = [];
      if (tree) partition(tree, frames);
      frames.forEach((f) => { f.dep = parentBox(f, boxes); });
      linkRepeats(frames);
      findGuides(ops);
      return { ops, frames };
    }

    const opsIn = (node) => [...node.own, ...node.kids.flatMap(opsIn)];

    // Small subtrees are one frame; big ones give their own layers a frame and split.
    function partition(node, frames) {
      if (node.count <= MAX_FRAME_OPS) {
        frames.push({ el: node.el, ops: opsIn(node), keyed: true });
        return;
      }
      if (node.own.length) frames.push({ el: node.el, ops: node.own });
      node.kids.forEach((k) => partition(k, frames));
    }

    // A frame waits for the nearest box behind it to be drawn first.
    function parentBox(frame, boxes) {
      for (let el = frame.el.parentElement; el; el = el.parentElement) {
        const op = boxes.get(el);
        if (op && !frame.ops.includes(op)) return op;
      }
      return null;
    }

    // Siblings that look alike (same tag and classes, same layer structure, similar width)
    // are built once, then alt-dragged out as copies and edited.
    function linkRepeats(frames) {
      const firsts = new Map();
      const shape = (f) => f.ops.map((op) => op.kind[0]).join('');
      for (const f of frames) {
        if (!f.keyed || f.ops.length < 2 || !f.el.parentElement) continue;
        const key = `${f.el.tagName}.${[...f.el.classList].sort().join('.')}|${shape(f)}`;
        const peers = firsts.get(f.el.parentElement) || new Map();
        firsts.set(f.el.parentElement, peers);
        const first = peers.get(key);
        const w = f.el.getBoundingClientRect().width;
        if (!first || Math.abs(first.el.getBoundingClientRect().width - w) > w * 0.25) {
          if (!first) { peers.set(key, f); f.copies = []; }
          continue;
        }
        f.source = first;
        first.copies.push(f);
      }
    }

    // Guides come from the structure: left edges shared by several layers and
    // baselines shared by text blocks side by side.
    function findGuides(ops) {
      const lefts = new Map();
      const bases = new Map();
      const base = (op) => {
        const range = document.createRange();
        range.selectNodeContents(op.el);
        const first = range.getClientRects()[0] || op.el.getBoundingClientRect();
        return Math.round(first.top + first.height * 0.8 + scrollY);
      };
      for (const op of ops) {
        if (op.kind === 'edge' || op.kind === 'line') continue;
        const r = op.el.getBoundingClientRect();
        op.left = Math.round(r.left);
        lefts.set(op.left, (lefts.get(op.left) || 0) + 1);
        if (op.kind === 'text') {
          op.base = base(op);
          const at = bases.get(op.base) || new Set();
          at.add(op.left);
          bases.set(op.base, at);
        }
      }
      for (const op of ops) {
        if (op.kind !== 'text') continue;
        if (lefts.get(op.left) >= EDGE_MIN) op.guideX = op.left;
        if (bases.get(op.base)?.size >= BASELINE_MIN) op.guideY = op.base;
      }
    }

    // ---------- hiding, drawing and revealing ----------

    // Prepare a layer to be built: hide what it paints, split text for typing.
    function prepare(op) {
      Object.assign(op, { p: 0, n: -1, done: false, owner: null, stale: false, swap: false, restyle: false, pulled: false, boxed: false, growing: false });
      if (op.kind === 'box') op.el.classList.add('caw-paint');
      else if (op.kind === 'edge') op.el.classList.add(`caw-edge-${op.side}`);
      else if (op.kind !== 'text') op.el.classList.add('caw-hide');
      else wrapText(op);
    }

    function wrapText(op) {
      const pre = isPre(op.el);
      op.segs = textNodes(op.el).map((node) => {
        const typed = document.createElement('span');
        const ghost = document.createElement('span');
        typed.className = 'caw-typed';
        ghost.className = 'caw-ghost';
        const text = pre ? node.data : node.data.replace(/\s+/g, ' ');
        ghost.textContent = text;
        node.replaceWith(typed, ghost);
        return { node, text, typed, ghost };
      });
      op.el.classList.add('caw-text');
      op.caret = op.caret || Object.assign(document.createElement('span'), { className: 'caw-caret' });
      op.caret.setAttribute('aria-hidden', 'true');
      op.text = op.segs.map((s) => s.text).join('');
      op.k = 0;
      const style = getComputedStyle(op.el);
      const size = parseFloat(style.fontSize);
      op.grow = size >= 24 && style.display !== 'inline' ? size : 0;
      op.lineH = parseFloat(style.lineHeight) || size * 1.2;
    }

    // Show `n` characters typed, the caret after them; the rest holds its space invisibly.
    function renderText(op) {
      if (op.stale) {
        if (op.n === -2) return;
        op.n = -2;
        op.segs.forEach((s, i) => { s.typed.textContent = i ? '' : op.old; s.ghost.textContent = ''; });
        op.caret.remove();
        return;
      }
      const n = Math.round(op.p * op.text.length);
      if (n === op.n) return;
      op.n = n;
      let left = n;
      let at = null;
      for (const s of op.segs) {
        const k = Math.max(0, Math.min(s.text.length, left));
        left -= s.text.length;
        if (s.typed.textContent.length !== k || s.ghost.textContent.length !== s.text.length - k) {
          s.typed.textContent = s.text.slice(0, k);
          s.ghost.textContent = s.text.slice(k);
        }
        if (!at && (k < s.text.length || s === op.segs.at(-1))) at = s;
      }
      if (at) at.ghost.before(op.caret);
      op.el.classList.toggle('caw-typing', op.p > 0 && op.p < 1);
    }

    function render(op) {
      if (op.kind === 'text') renderText(op);
      else if (op.p >= 1 && !op.revealed) reveal(op);
    }

    function reveal(op) {
      op.revealed = true;
      if (op.kind === 'box' || op.kind === 'edge') {
        // Fade the paint in, then hand transitions back to the site.
        op.el.classList.add('caw-filled');
        op.el.classList.remove('caw-paint', `caw-edge-${op.side}`);
        setTimeout(() => op.el.classList.remove('caw-filled'), 400);
      } else {
        op.el.classList.remove('caw-hide');
        op.el.classList.add('caw-reveal');
      }
    }

    // Put the text back exactly as it was, so the finished page is the real page.
    function unwrapText(op) {
      if (!op.segs) return;
      op.segs.forEach((s) => { s.typed.replaceWith(s.node); s.ghost.remove(); });
      op.caret.remove();
      op.segs = null;
      op.el.classList.remove('caw-text', 'caw-typing', 'caw-snap-x', 'caw-snap-y', 'caw-growing');
      op.el.style.scale = '';
    }

    function finish(op) {
      op.stale = false;
      op.swap = false;
      if (op.realSrc) { op.el.src = op.realSrc; op.realSrc = null; }
      if (op.restyle) { op.el.style.backgroundColor = ''; op.restyle = false; }
      op.p = 1;
      op.done = true;
      if (op.kind === 'text') unwrapText(op);
      else render(op);
    }

    // Back to blank, for a replay.
    function reset(op) {
      finish(op);
      op.revealed = false;
      op.el.classList.remove('caw-reveal', 'caw-swapped', 'caw-restyled', 'caw-selecting');
      prepare(op);
    }

    // Going live: strip every trace of the build, leaving the page exactly as it was.
    function clean(op) {
      op.el.classList.remove('caw-reveal', 'caw-swapped', 'caw-restyled', 'caw-filled', 'caw-selecting', 'caw-snap-x', 'caw-snap-y');
      if (!op.el.classList.length) op.el.removeAttribute('class');
    }

    return { scan, prepare, render, finish, reset, clean, textNodes };
  })();

  // ---- grid.js ----
  CAW.grid = (() => {
    // Works out the page's layout grid from its own structure, like the column grid a
    // designer lays over a Figma frame:
    //   - the container: the left and right edges most of the content lines up on
    //   - the gutter: the column-gap the page's own grids (else flex rows) use most, by width
    //   - the columns: 4 on phones, 8 on tablets; on desktop, whichever of 8–12 columns
    //     lines up with the most of the content's left and right edges (12 on a tie)
    const TABLET_PX = 768;
    const DESKTOP_PX = 1024;
    const DESKTOP_COLUMNS = [12, 11, 10, 9, 8];
    const GUTTER = { mobile: 16, tablet: 20, desktop: 24 };
    const EDGE_TOLERANCE = 3;   // an edge within this many px of a column line counts as on it
    const GAP_RANGE = [8, 80];  // gaps outside this aren't gutters
    const MAX_SCAN = 6000;      // elements looked at for grid and flex rows

    // The most common value (the smaller one on a tie); `weights` count some values more.
    function mode(values, weights) {
      const counts = new Map();
      values.forEach((v, i) => counts.set(v, (counts.get(v) || 0) + (weights ? weights[i] : 1)));
      let best = null;
      let most = 0;
      for (const [v, n] of counts) if (n > most || (n === most && v < best)) { best = v; most = n; }
      return best;
    }

    function container(rects, width) {
      const left = mode(rects.filter((r) => r.left >= 0 && r.left < width * 0.3).map((r) => Math.round(r.left)));
      const right = mode(rects.filter((r) => r.right <= width + 1 && r.right > width * 0.7).map((r) => Math.round(r.right)));
      if (left === null || right === null || right - left < width * 0.5) return { left: 16, right: width - 16 };
      return { left, right };
    }

    // The page's multi-column rows: CSS grids with two or more tracks and flex rows.
    // Their gaps are the gutters, their children's edges are where columns start and end.
    function layoutRows(root) {
      const rows = [];
      const els = root.getElementsByTagName('*');
      for (let i = 0; i < els.length && i < MAX_SCAN; i++) {
        const el = els[i];
        if (el.children.length < 2 || el.closest('.caw-ui')) continue;
        const cs = getComputedStyle(el);
        const grid = cs.display.includes('grid') && cs.gridTemplateColumns.trim().split(/\s+/).length >= 2;
        const flex = cs.display.includes('flex') && cs.flexDirection.startsWith('row');
        const gap = parseFloat(cs.columnGap);
        if (!(grid || flex) || !(gap >= GAP_RANGE[0] && gap <= GAP_RANGE[1])) continue;
        const kids = [...el.children].map((k) => k.getBoundingClientRect()).filter((r) => r.width >= 1);
        const width = el.getBoundingClientRect().width;
        if (kids.length >= 2) rows.push({ gap: Math.round(gap), width, kids, grid });
      }
      return rows;
    }

    // Page-level CSS grids decide the gutter; wide flex rows only if there are no grids
    // (flex gaps are often just spacing between nav links or buttons).
    function gutter(rows, width, fallback) {
      const wide = rows.filter((r) => r.width >= width * 0.4);
      const grids = wide.filter((r) => r.grid);
      const pick = grids.length ? grids : wide.length ? wide : rows;
      return mode(pick.map((r) => r.gap), pick.map((r) => r.width)) ?? fallback;
    }

    function columnsFor(count, box, gap) {
      const width = box.right - box.left;
      const column = (width - gap * (count - 1)) / count;
      return column > 8 ? Array.from({ length: count }, (_, i) => box.left + i * (column + gap)).map((x) => [x, x + column]) : null;
    }

    // Share of the layout's edges that land on a column line.
    function fit(columns, edges) {
      if (!columns || !edges.length) return 0;
      const lines = columns.flat();
      return edges.filter((e) => lines.some((x) => Math.abs(x - e) <= EDGE_TOLERANCE)).length / edges.length;
    }

    // `layers` are the build's layers ({ el, kind }); `forced` pins the column count (the
    // `columns` option), otherwise it's read from the page.
    function detect(root, layers, forced) {
      const width = document.documentElement.clientWidth;
      const breakpoint = width < TABLET_PX ? 'mobile' : width < DESKTOP_PX ? 'tablet' : 'desktop';
      const placed = layers.map((op) => ({ op, r: op.el.getBoundingClientRect() })).filter(({ r }) => r.width >= 1 && r.height >= 1);
      const rows = layoutRows(root);
      const box = container([...placed.map(({ r }) => r), ...rows.flatMap((row) => row.kids)], width);
      const gap = gutter(rows, width, GUTTER[breakpoint]);
      // Column lines the layout commits to: both sides of grid and flex children and of boxes
      // and media, only the left of text (its right edge is ragged).
      const lines = [
        ...rows.flatMap((row) => row.kids.flatMap((r) => [r.left, r.right])),
        ...placed.flatMap(({ op, r }) => (op.kind === 'text' ? [r.left] : [r.left, r.right])),
      ];
      const edges = [...new Set(lines.map(Math.round))].filter((e) => e > box.left + EDGE_TOLERANCE && e < box.right - EDGE_TOLERANCE);
      let count = Number(forced) || (breakpoint === 'mobile' ? 4 : breakpoint === 'tablet' ? 8 : 0);
      let score = fit(columnsFor(count, box, gap), edges);
      if (!count) {
        for (const n of DESKTOP_COLUMNS) {
          const s = fit(columnsFor(n, box, gap), edges);
          if (s > score) { score = s; count = n; }
        }
        count ||= DESKTOP_COLUMNS[0];
      }
      return { breakpoint, count, gutter: gap, left: box.left, right: box.right, columns: columnsFor(count, box, gap) || [], fit: score };
    }

    return { detect };
  })();

  // ---- sound.js ----
  CAW.sound = () => {
    // Build sounds, synthesized live with Web Audio (no files): keyboard clicks while
    // typing, a click per mouse press, a tick per heading size step, a soft glass note
    // per finished box (big boxes low, small high, left to right rising, panned to the
    // cursor), and a chord when the page is done. Browsers keep audio locked until the
    // first tap or key, so it starts then. M or the toolbar's Sound button toggles it.
    const KEY = 'caw-sound';
    const PENTATONIC = [0, 2, 4, 7, 9];  // E major pentatonic, semitones above E
    const BASE_HZ = 164.81;              // E3
    const MAX_CLICKS_PER_S = 28;         // eight typists at once would otherwise buzz
    const NOTE_GRID_S = 0.125;           // glass notes land on an eighth-note grid

    let on = true;
    try { on = localStorage.getItem(KEY) !== 'off'; } catch { /* storage blocked: default on */ }

    let ctx = null;
    let out = null;
    let noise = null;
    let clickBudget = MAX_CLICKS_PER_S;
    let budgetAt = 0;
    let lastNoteAt = 0;

    let listener = () => {};
    function label() {
      const locked = on && (!ctx || ctx.state !== 'running');
      listener(!on ? 'Sound off' : locked ? 'Tap for sound' : 'Sound on', on);
    }

    function unlock() {
      if (!on) return;
      try {
        if (!ctx) {
          ctx = new AudioContext();
          out = ctx.createGain();
          out.gain.value = 0.5;
          out.connect(ctx.destination);
          noise = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
          const data = noise.getChannelData(0);
          for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        }
        ctx.resume().then(label, label);
      } catch { ctx = null; /* no Web Audio: stay silent */ }
      label();
    }

    function toggle() {
      on = !on;
      try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* not remembered */ }
      if (on) unlock();
      else ctx?.suspend();
      label();
    }

    addEventListener('pointerdown', unlock, { capture: true });
    addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'm' && !e.metaKey && !e.ctrlKey && !e.altKey && !e.target.closest('input, textarea, [contenteditable]')) toggle();
      else unlock();
    }, { capture: true });
    const live = () => on && ctx && ctx.state === 'running';
    const panFor = (x) => Math.max(-0.8, Math.min(0.8, (x / innerWidth) * 2 - 1));

    function chain(pan) {
      const g = ctx.createGain();
      const p = ctx.createStereoPanner();
      p.pan.value = pan;
      g.connect(p).connect(out);
      return g;
    }

    function burst(t, { freq, q, gain, len, pan }) {
      const src = ctx.createBufferSource();
      const band = ctx.createBiquadFilter();
      const g = chain(pan);
      src.buffer = noise;
      band.type = 'bandpass';
      band.frequency.value = freq;
      band.Q.value = q;
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      src.connect(band).connect(g);
      src.start(t);
      src.stop(t + len + 0.01);
    }

    function tone(t, { hz, gain, len, pan, type = 'sine', attack = 0.004 }) {
      const osc = ctx.createOscillator();
      const g = chain(pan);
      osc.type = type;
      osc.frequency.value = hz;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      osc.connect(g);
      osc.start(t);
      osc.stop(t + len + 0.02);
    }

    // Rate-limited so a crowd of typists stays a patter, not a buzz.
    function spend() {
      const t = ctx.currentTime;
      clickBudget = Math.min(MAX_CLICKS_PER_S, clickBudget + (t - budgetAt) * MAX_CLICKS_PER_S);
      budgetAt = t;
      if (clickBudget < 1) return false;
      clickBudget -= 1;
      return true;
    }

    const noteHz = (step) => BASE_HZ * 2 ** ((PENTATONIC[((step % 5) + 5) % 5] + 12 * Math.floor(step / 5)) / 12);

    return {
      toggle,
      // Tell `fn(label, on)` whenever sound turns on, off or unlocks.
      onChange(fn) { listener = fn; label(); },
      // The page dissolving to a blank canvas: an airy swell of filtered noise.
      swell() {
        if (!live()) return;
        const t = ctx.currentTime;
        const src = ctx.createBufferSource();
        const band = ctx.createBiquadFilter();
        const g = chain(0);
        src.buffer = noise;
        src.loop = true;
        band.type = 'bandpass';
        band.Q.value = 0.8;
        band.frequency.setValueAtTime(300, t);
        band.frequency.exponentialRampToValueAtTime(2400, t + 1.2);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.05, t + 0.7);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
        src.connect(band).connect(g);
        src.start(t);
        src.stop(t + 1.7);
      },
      // The cursors fanning out to build: a quick rising arpeggio.
      arpeggio() {
        if (!live()) return;
        const t = ctx.currentTime;
        [0, 1, 2, 3, 4, 5, 7].forEach((step, i) => tone(t + i * 0.07, { hz: noteHz(step + 5), gain: 0.035, len: 0.5, pan: (i / 6) * 1.2 - 0.6 }));
      },
      // Going live: a soft falling sweep.
      sweep() {
        if (!live()) return;
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const g = chain(0);
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(160, t + 0.7);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.045, t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
        osc.connect(g);
        osc.start(t);
        osc.stop(t + 0.85);
      },
      // A mechanical key: a sharp click over a short thock, deeper on spaces.
      key(ch, x) {
        if (!live() || !spend()) return;
        const t = ctx.currentTime;
        const pan = panFor(x);
        const space = ch === ' ';
        burst(t, { freq: 3800 + Math.random() * 1200, q: 3, gain: 0.05, len: 0.018, pan });
        tone(t, { hz: (space ? 110 : 190) * (0.94 + Math.random() * 0.12), gain: 0.035, len: space ? 0.06 : 0.035, pan, type: 'triangle', attack: 0.002 });
      },
      // Mouse press and release.
      click(x) {
        if (!live()) return;
        const t = ctx.currentTime;
        const pan = panFor(x);
        burst(t, { freq: 2600, q: 5, gain: 0.07, len: 0.012, pan });
        burst(t + 0.07, { freq: 3400, q: 5, gain: 0.045, len: 0.01, pan });
      },
      // A guide snapping into place.
      snap(x) {
        if (!live()) return;
        burst(ctx.currentTime, { freq: 5200, q: 8, gain: 0.08, len: 0.015, pan: panFor(x) });
      },
      // Font size stepping up: each step a little higher.
      tick(step, x) {
        if (!live() || !spend()) return;
        tone(ctx.currentTime, { hz: 900 + step * 140, gain: 0.03, len: 0.03, pan: panFor(x), type: 'square', attack: 0.001 });
      },
      // A sparse glass note for a finished box: area sets the octave, x the step.
      note(box) {
        if (!live()) return;
        const now = ctx.currentTime;
        const t = Math.max(now, Math.ceil(now / NOTE_GRID_S) * NOTE_GRID_S);
        if (t - lastNoteAt < NOTE_GRID_S * 1.5) return; // sparse: skip if one just played
        lastNoteAt = t;
        const area = (box.w * box.h) / (innerWidth * innerHeight);
        const octave = area > 0.15 ? 0 : area > 0.03 ? 1 : area > 0.004 ? 2 : 3;
        const step = octave * 5 + Math.floor(Math.max(0, Math.min(0.99, (box.x + box.w / 2) / innerWidth)) * 5);
        const hz = noteHz(step);
        const pan = panFor(box.x + box.w / 2);
        tone(t, { hz, gain: 0.05, len: 1.4, pan, attack: 0.006 });
        tone(t, { hz: hz * 2.01, gain: 0.015, len: 0.7, pan, attack: 0.004 });
      },
      // The page is done: a soft E major chord.
      chord() {
        if (!live()) return;
        const t = ctx.currentTime + 0.05;
        [0, 4, 7, 12].forEach((semi, i) => tone(t + i * 0.06, { hz: BASE_HZ * 2 * 2 ** (semi / 12), gain: 0.04, len: 2.6, pan: (i - 1.5) * 0.3, attack: 0.03 }));
      },
    };
  };

  // ---- studio.js ----
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
    const bar = make('div', 'caw-ui caw-toolbar', `
      <span class="caw-count" aria-live="off" hidden><span class="caw-count-dots" aria-hidden="true"></span><b>0</b><span class="caw-count-of"> / 0</span><span class="caw-count-label"> at work</span></span>
      <button type="button" data-act="tour" aria-pressed="false">Tour</button>
      <button type="button" data-act="sound" aria-pressed="true">Sound</button>
      <button type="button" data-act="live" class="caw-primary">Go live</button>`);
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Build controls');
    if (options.sound === false) bar.querySelector('[data-act="sound"]').remove();
    if (options.autoLive !== false) bar.querySelector('[data-act="live"]').remove(); // it goes live by itself
    document.body.append(layer);
    if (options.toolbar !== false) document.body.append(bar);

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
        const counter = bar.querySelector('.caw-count');
        counter.hidden = bar.dataset.mode !== 'building' || !working;
        if (counter.hidden) return;
        const [dots, num, of, label] = counter.children;
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

  // ---- engine.js ----
  CAW.run = (config) => {
    // Lifecycle: loading (the cursors orbit the logo on a blank canvas) → building (each
    // cursor claims a frame that's scrolled into view and builds its layers; idle cursors
    // chase the viewer's scroll) → built (the crew flocks around the mouse) → live (the real
    // page, chrome gone; straight away with autoLive, else on Go live). Tour, once the page
    // is done, starts over and tours the new build.
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
    const TOUR_PX_S = 240;         // Tour scrolls at most this fast
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
    const LIVE_DELAY_MS = 700;     // with autoLive: let the closing chord land, then hand over the page
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
    // Waiting for the visitor: the build starts on their first scroll (or Tour).
    if (config.startOn === 'scroll') loaderEl.insertAdjacentHTML('beforeend', '<p class="caw-loader-hint">Scroll to start<i></i></p>');
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
    let touring = false;
    let tourNext = false; // tour the build that's about to start

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
      if (config.autoLive) setTimeout(() => { if (state === 'built') goLive(); }, LIVE_DELAY_MS);
    }

    function goLive() {
      state = 'live';
      ops.forEach(L.clean);
      root.classList.add('caw-live');
      Studio.setMode('live');
      Sound.sweep();
    }

    function startBuilding() {
      if (state !== 'loading') return;
      root.classList.remove('caw-waiting');
      for (const c of cursors) c.readyAt = buildTime + Math.random() * START_STAGGER_MS;
      state = 'building';
      root.classList.remove('caw-loading');
      Sound.arpeggio();
      if (tourNext) setTour(true);
      tourNext = false;
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
      Studio.setTour(touring || tourNext);
    }

    // The Tour button: while building, auto-scroll on or off; once built, build it all
    // again and tour it from the top.
    function tourButton() {
      if (state === 'building') setTour(!touring);
      else if (state === 'loading') {
        tourNext = true; // Tour on the intro starts the build and tours it
        setTour(false);
        wantStart();
      }
      else {
        replay();
        tourNext = true;
        setTour(false);
      }
    }

    Studio.onAction((act) => {
      if (act === 'tour') tourButton();
      else if (act === 'sound') Sound.toggle();
      else if (act === 'live') goLive();
    });
    Sound.onChange((label, on) => Studio.setSound(label, on));
    // What CursorsAtWork's public API drives.
    const handle = { replay, goLive, tour: setTour, get state() { return state; }, plan: { ops, frames } };
    // The viewer taking the wheel ends the tour.
    const takeWheel = (e) => {
      if (e.target instanceof Element && e.target.closest('.caw-ui')) return; // the toolbar's own taps
      tourNext = false;
      setTour(false);
    };
    for (const type of ['wheel', 'touchstart']) addEventListener(type, takeWheel, { passive: true });
    addEventListener('keydown', (e) => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(e.key)) takeWheel(); });

    // Tour: scroll down at a pace the cursors keep up with, keeping the next unbuilt frame low on screen.
    function tourStep(dt) {
      const next = frames.find((u) => u.state === 'idle');
      if (!next) return;
      const ahead = next.el.getBoundingClientRect().top - innerHeight * TOUR_LEAD;
      const room = document.documentElement.scrollHeight - innerHeight - scrollY;
      if (ahead <= 0 || room <= 0) return;
      scrollTo({ top: scrollY + Math.min(ahead, room, TOUR_PX_S * dt), behavior: 'instant' });
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

    // The build runs on its own clock, with a catch-up boost while the
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
        speedTarget = catchUpSpeed();
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
        // Only cursors on a job right now count; on the intro and once built, nobody is.
        const busy = state === 'building' ? cursors.filter((c) => c.unit && buildTime >= c.readyAt) : [];
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

    // The first build waits for the visitor (startOn: 'scroll'): the cursors keep orbiting
    // until they scroll, swipe, press a scrolling key or hit Tour. 'load' starts on its own.
    let introDone = false;
    let wanted = config.startOn === 'load';
    function maybeStart() {
      if (!introDone) return;
      if (wanted) startBuilding();
      else root.classList.add('caw-waiting');
    }
    function wantStart() {
      wanted = true;
      maybeStart();
    }
    if (!wanted) {
      const SCROLL_KEYS = ['ArrowDown', 'PageDown', ' ', 'End'];
      const intent = (e) => {
        if (e.type === 'keydown' && !SCROLL_KEYS.includes(e.key)) return;
        if (e.type === 'wheel' && e.deltaY <= 0) return;
        if (e.target instanceof Element && e.target.closest('.caw-ui')) return;
        wantStart();
      };
      addEventListener('wheel', intent, { passive: true });
      addEventListener('touchmove', intent, { passive: true });
      addEventListener('keydown', intent);
    }
    Promise.all([loaded, new Promise((resolve) => setTimeout(resolve, MIN_LOADER_MS))]).then(() => {
      introDone = true;
      maybeStart();
    });
    requestAnimationFrame(frame);
    return handle;

    // Sound turned off in the options: the same calls, all silent.
    function muted() {
      const quiet = () => {};
      return new Proxy({ onChange: quiet }, { get: (target, key) => target[key] || quiet });
    }
  };

  // ---- index.js ----
  // Public API. On a <script> tag it starts by itself (unless it has data-manual);
  // from a bundler, call CursorsAtWork.start(options).
  const DEFAULTS = {
    logo: null,          // the mark the cursors orbit on the intro (defaults to the favicon)
    cursors: 16,         // cursors at the start
    maxCursors: 32,      // fast scrolling brings in more, up to this many
    typingSpeed: 40,     // average characters per second
    columns: 'auto',     // layout grid: 'auto' (4 / 8 / 8–12 by screen and layout) or a number
    grid: true,          // show the layout grid
    sound: true,         // synthesized sounds (still need a first tap or key to unlock)
    toolbar: true,       // crew counter, Tour (once built: build again and tour), Sound
    autoLive: true,      // hand back the real page as soon as the build is done (false: wait for Go live)
    startOn: 'scroll',   // 'scroll': the intro waits for the visitor's first scroll; 'load': start on its own
    skip: null,          // CSS selector for elements to leave out of the build
    root: null,          // element to build (defaults to <body>)
    respectReducedMotion: true,
  };

  const HOLD_ID = 'caw-hold';
  const STYLE_ID = 'caw-styles';
  const HOLD_MS = 8000; // never leave a page blank if something goes wrong
  let running = null;
  let starting = false;

  const release = () => document.documentElement.classList.remove('caw-pending');

  // Blank the page right away; the engine takes over once it has read the layout.
  function hold() {
    if (!document.getElementById(HOLD_ID)) {
      const style = Object.assign(document.createElement('style'), { id: HOLD_ID });
      style.textContent = 'html.caw-pending body > :not([data-caw-skip]) { clip-path: inset(0 0 100% 0) !important; }';
      (document.head || document.documentElement).append(style);
    }
    document.documentElement.classList.add('caw-pending');
    setTimeout(release, HOLD_MS);
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = Object.assign(document.createElement('style'), { id: STYLE_ID });
    style.textContent = CAW.css;
    (document.head || document.documentElement).append(style);
  }

  // Options from a script tag's data attributes: data-logo, data-cursors, data-max-cursors,
  // data-typing-speed, data-columns, data-grid="off", data-sound="off", data-toolbar="off",
  // data-auto-live="off", data-start-on="load", data-skip.
  function fromDataset(d) {
    const num = (v) => (v === undefined || v === '' || Number.isNaN(Number(v)) ? undefined : Number(v));
    const off = (v) => (v === undefined ? undefined : v !== 'off' && v !== 'false');
    const options = {
      logo: d.logo ? new URL(d.logo, document.baseURI).href : undefined,
      cursors: num(d.cursors),
      maxCursors: num(d.maxCursors),
      typingSpeed: num(d.typingSpeed),
      columns: d.columns,
      grid: off(d.grid),
      sound: off(d.sound),
      toolbar: off(d.toolbar),
      autoLive: off(d.autoLive),
      startOn: d.startOn,
      skip: d.skip,
    };
    return Object.fromEntries(Object.entries(options).filter(([, v]) => v !== undefined));
  }

  function validate(options) {
    const config = { ...DEFAULTS, ...options };
    const count = (v, min, max, name) => {
      const n = Math.round(Number(v));
      if (!Number.isFinite(n) || n < min || n > max) throw new RangeError(`cursors-at-work: ${name} must be between ${min} and ${max}`);
      return n;
    };
    config.cursors = count(config.cursors, 1, 64, 'cursors');
    config.maxCursors = count(config.maxCursors, config.cursors, 128, 'maxCursors');
    config.typingSpeed = count(config.typingSpeed, 1, 400, 'typingSpeed');
    if (config.columns !== 'auto') config.columns = count(config.columns, 1, 24, 'columns');
    if (!['scroll', 'load'].includes(config.startOn)) throw new RangeError("cursors-at-work: startOn must be 'scroll' or 'load'");
    return config;
  }

  function start(options = {}) {
    if (running || starting) return api;
    const config = validate(options);
    if (config.respectReducedMotion && matchMedia('(prefers-reduced-motion: reduce)').matches) return api;
    starting = true;
    injectStyles();
    hold();
    const go = () => {
      try {
        running = CAW.run(config);
      } catch (err) {
        release(); // show the page as it is rather than leave it blank
        console.error('cursors-at-work: could not start', err);
      } finally {
        starting = false;
      }
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go, { once: true });
    else go();
    return api;
  }

  const api = {
    version: CAW.version,
    start,
    replay: () => running?.replay(),
    goLive: () => running?.goLive(),
    tour: (on = true) => running?.tour(on),
    get state() { return running ? running.state : 'idle'; },
    // The page as read: { ops, frames }, for inspecting what will be built and in what order.
    get plan() { return running ? running.plan : null; },
  };

  const me = document.currentScript;
  if (me && !('manual' in me.dataset)) start(fromDataset(me.dataset));
  if (typeof module === 'object' && module.exports) module.exports = api;
  window.CursorsAtWork = api;
})();
