(() => {
  // Build sounds, synthesized live with Web Audio (no files): keyboard clicks while
  // typing, a click per mouse press, a tick per heading size step, a soft glass note
  // per finished box (big boxes low, small high, left to right rising, panned to the
  // cursor), and a chord when the page is done. Browsers keep audio locked until the
  // first tap or key, so it starts then. M or the toolbar's Sound button toggles it.
  const KEY = 'swarm-sound';
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

  window.Sound = {
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
    // The swarm fanning out to build: a quick rising arpeggio.
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
})();
