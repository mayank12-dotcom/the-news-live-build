(() => {
  // Reads any page into a build plan, the way a designer would see it in Figma:
  //   text   — a block of words (its inline links and styles kept), typed in
  //   box    — an element that paints a fill, image fill, shadow or full border
  //   media  — img, svg, video, canvas, iframe, form controls
  //   line   — a hairline (hr, a 1–3px bar), drawn with the pen tool
  //   edge   — a single-side border (a header's bottom rule), also pen-drawn
  // Text waiting to be typed carries .swarm-text, so a site can relax line clamps until then.
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
    if (op.kind === 'box') op.el.classList.add('swarm-paint');
    else if (op.kind === 'edge') op.el.classList.add(`swarm-edge-${op.side}`);
    else if (op.kind !== 'text') op.el.classList.add('swarm-hide');
    else wrapText(op);
  }

  function wrapText(op) {
    const pre = isPre(op.el);
    op.segs = textNodes(op.el).map((node) => {
      const typed = document.createElement('span');
      const ghost = document.createElement('span');
      typed.className = 'swarm-typed';
      ghost.className = 'swarm-ghost';
      const text = pre ? node.data : node.data.replace(/\s+/g, ' ');
      ghost.textContent = text;
      node.replaceWith(typed, ghost);
      return { node, text, typed, ghost };
    });
    op.el.classList.add('swarm-text');
    op.caret = op.caret || Object.assign(document.createElement('span'), { className: 'swarm-caret' });
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
    op.el.classList.toggle('swarm-typing', op.p > 0 && op.p < 1);
  }

  function render(op) {
    if (op.kind === 'text') renderText(op);
    else if (op.p >= 1 && !op.revealed) reveal(op);
  }

  function reveal(op) {
    op.revealed = true;
    if (op.kind === 'box' || op.kind === 'edge') {
      // Fade the paint in, then hand transitions back to the site.
      op.el.classList.add('swarm-filled');
      op.el.classList.remove('swarm-paint', `swarm-edge-${op.side}`);
      setTimeout(() => op.el.classList.remove('swarm-filled'), 400);
    } else {
      op.el.classList.remove('swarm-hide');
      op.el.classList.add('swarm-reveal');
    }
  }

  // Put the text back exactly as it was, so the finished page is the real page.
  function unwrapText(op) {
    if (!op.segs) return;
    op.segs.forEach((s) => { s.typed.replaceWith(s.node); s.ghost.remove(); });
    op.caret.remove();
    op.segs = null;
    op.el.classList.remove('swarm-text', 'swarm-typing', 'swarm-snap-x', 'swarm-snap-y', 'swarm-growing');
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
    op.el.classList.remove('swarm-reveal', 'swarm-swapped', 'swarm-restyled', 'swarm-selecting');
    prepare(op);
  }

  // Going live: strip every trace of the build, leaving the page exactly as it was.
  function clean(op) {
    op.el.classList.remove('swarm-reveal', 'swarm-swapped', 'swarm-restyled', 'swarm-filled', 'swarm-selecting', 'swarm-snap-x', 'swarm-snap-y');
    if (!op.el.classList.length) op.el.removeAttribute('class');
  }

  window.SwarmLayers = { scan, prepare, render, finish, reset, clean, textNodes };
})();
