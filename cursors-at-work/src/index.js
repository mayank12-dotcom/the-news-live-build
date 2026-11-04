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
  toolbar: true,       // Tour, speed, Sound, Go live, Replay
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
// data-typing-speed, data-columns, data-grid="off", data-sound="off", data-toolbar="off", data-skip.
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
};

const me = document.currentScript;
if (me && !('manual' in me.dataset)) start(fromDataset(me.dataset));
if (typeof module === 'object' && module.exports) module.exports = api;
window.CursorsAtWork = api;
