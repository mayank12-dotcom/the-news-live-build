(() => {
  // Footer source logos scroll by on their own; hovering a logo eases the scroll down.
  const SPEED = 40;       // px per second
  const HOVER_SPEED = 8;  // px per second while a logo is hovered
  const EASE = 4;         // how quickly the speed follows the pointer (per second)

  const marquee = document.querySelector('.marquee');
  const track = marquee?.querySelector('.marquee-track');
  if (!track || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // A second copy of the logos follows the first, so the loop never shows a gap.
  const copy = track.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  copy.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
  marquee.append(copy);
  marquee.classList.add('running');

  let offset = 0;
  let speed = SPEED;
  let target = SPEED;
  let last = performance.now();

  const slow = () => { target = HOVER_SPEED; };
  const resume = () => { target = SPEED; };
  marquee.addEventListener('pointerover', (e) => { if (e.target.closest('li')) slow(); else resume(); });
  marquee.addEventListener('pointerleave', resume);
  marquee.addEventListener('focusin', slow);
  marquee.addEventListener('focusout', resume);

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    speed += (target - speed) * Math.min(1, EASE * dt);
    const width = track.offsetWidth;
    if (width) {
      offset = (offset + speed * dt) % width;
      const shift = `translate3d(${-offset}px, 0, 0)`;
      track.style.transform = shift;
      copy.style.transform = shift;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
