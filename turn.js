// Page-turn direction for cross-document view transitions: moving deeper into the
// paper turns the sheet forward, going back turns it back. Loaded in <head> so the
// pagereveal listener exists before the first frame.
(() => {
  const ORDER = ['index', 'world', 'politics', 'business', 'technology', 'health', 'sports', 'culture', 'podcast', 'article'];
  const KEY = 'turn-from';

  function rank(url) {
    const name = new URL(url, location.href).pathname.split('/').pop().replace(/\.html$/, '') || 'index';
    return Math.max(0, ORDER.indexOf(name));
  }

  addEventListener('pageswap', () => {
    try { sessionStorage.setItem(KEY, String(rank(location.href))); } catch { /* storage blocked: default to forward */ }
  });

  addEventListener('pagereveal', (e) => {
    if (!e.viewTransition) return;
    let from = null;
    try { from = sessionStorage.getItem(KEY); } catch { /* storage blocked */ }
    const back = from !== null && Number(from) > rank(location.href);
    e.viewTransition.types.add(back ? 'back' : 'forward');
  });
})();
