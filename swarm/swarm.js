(() => {
  // Swarm build, drop-in: one tag and a page builds itself, live, by a swarm of cursors.
  //   <script src="swarm/swarm.js" data-logo="logo.svg"></script>
  // Put it in <head> so the page never flashes before it's blanked. data-logo is the
  // mark the swarm orbits on the intro (defaults to the favicon). Add data-swarm-orbit
  // to an element for the finished swarm to settle on when the mouse is away.
  const me = document.currentScript;
  if (!me || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const src = new URL(me.src, location.href);
  const base = new URL('.', src).href;
  const files = ['kit.js', 'layers.js', 'sound.js', 'studio.js', 'engine.js'];
  const root = document.documentElement;
  window.SwarmConfig = { logo: me.dataset.logo ? new URL(me.dataset.logo, document.baseURI).href : null };

  // Blank the page right away; the engine takes over once it has read the layout.
  const hold = document.createElement('style');
  hold.textContent = 'html.swarm-pending body > :not([data-swarm-skip]) { clip-path: inset(0 0 100% 0) !important; }';
  (document.head || root).append(hold);
  root.classList.add('swarm-pending');
  const release = () => root.classList.remove('swarm-pending');
  setTimeout(release, 8000); // never leave the page blank if something fails to load

  const css = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: `${base}swarm.css${src.search}` });
  const styled = new Promise((resolve) => { css.onload = css.onerror = resolve; });
  (document.head || root).append(css);
  const parsed = new Promise((resolve) => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', resolve, { once: true });
    else resolve();
  });

  function load(i) {
    if (i === files.length) return;
    const s = Object.assign(document.createElement('script'), { src: `${base}${files[i]}${src.search}` });
    s.onload = () => load(i + 1);
    s.onerror = release;
    document.head.append(s);
  }
  Promise.all([styled, parsed]).then(() => load(0));
})();
