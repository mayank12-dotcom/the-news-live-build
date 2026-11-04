(() => {
  // Motion helpers for the build (app.js): easing, hand-like paths, typing rhythm,
  // spacing between boxes, and the flocking used once the page is done.
  const FLOCK = {
    ring: 74,        // the swarm circles this far out from the viewer's pointer
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
  // neighbours (align, cohere, separate) so the swarm moves as one.
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

  window.Kit = { rand, minJerk, dragEase, keyDelay, along, gapBetween, flock };
})();
