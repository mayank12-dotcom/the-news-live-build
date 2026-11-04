(() => {
  // The News, site-only behaviour. The live build itself is the drop-in swarm/swarm.js,
  // which reads this page like any other.

  // Publisher photos that are blocked or gone fall back to the slot's design photo.
  function useFallback(img) {
    const fallback = img.dataset.fallback;
    if (fallback && !img.src.endsWith(fallback)) img.src = fallback;
  }
  document.addEventListener('error', (e) => { if (e.target.tagName === 'IMG') useFallback(e.target); }, true);
  document.querySelectorAll('img[data-fallback]').forEach((img) => { if (img.complete && !img.naturalWidth) useFallback(img); });

  // Today's date and time in the top bar. Small screens get the short form:
  // "Tue, Nov 3, 2026 | 10:12 AM". It's written before the swarm reads the page, so
  // it gets typed too, and is kept current after (never mid-typing).
  const smallScreen = matchMedia('(max-width: 760px)');
  const longDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const shortDate = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const clock = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });
  const nowText = (now = new Date()) => `${(smallScreen.matches ? shortDate : longDate).format(now)} | ${clock.format(now)}`;
  const todayEls = [...document.querySelectorAll('[data-today]')];

  function refreshToday() {
    const text = nowText();
    for (const el of todayEls) {
      if (el.textContent !== text && !el.querySelector('.swarm-typed')) el.textContent = text;
    }
  }
  refreshToday();
  setInterval(refreshToday, 5000);
  smallScreen.addEventListener('change', refreshToday);
})();
