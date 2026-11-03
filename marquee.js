(() => {
  // Footer source logos scroll by on their own; hovering a logo eases the scroll down.
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPEED = reduceMotion ? 16 : 40; // px per second; gentler when the device asks for less motion
  const HOVER_SPEED = 8;  // px per second while a logo is hovered
  const EASE = 4;         // how quickly the speed follows the pointer (per second)

  const marquee = document.querySelector('.marquee');
  const track = marquee?.querySelector('.marquee-track');
  if (!track) return;

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
  // Only a real hover slows it: a finger never "leaves", so touch would leave it crawling.
  marquee.addEventListener('pointerover', (e) => {
    if (e.pointerType === 'touch') return;
    if (e.target.closest('li')) slow(); else resume();
  });
  marquee.addEventListener('pointerleave', resume);
  marquee.addEventListener('focusin', (e) => { if (e.target.matches(':focus-visible')) slow(); });
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
