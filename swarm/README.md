# Swarm build (drop-in)

Any page builds itself, live, by a swarm of Figma-style cursors. Add one tag to `<head>`:

```html
<script src="swarm/swarm.js" data-logo="logo.svg"></script>
```

- `data-logo` is the mark the swarm orbits on the intro. It defaults to the favicon.
- `data-swarm-orbit` on an element is where the finished swarm settles when the mouse is away.
- `data-swarm-skip` on an element leaves it out of the build.
- `.swarm-text` marks text still waiting to be typed, so a site can relax line clamps until it's done.
- `window.Swarm` offers `replay()`, `goLive()`, `tour(on)`, `state` and `plan`.

Try [demo.html](demo.html), a page with no build markup at all.

## How it reads a page

[layers.js](layers.js) walks the live DOM and sorts what it finds into layers:

| Layer | What it is | How it's built |
| --- | --- | --- |
| text | blocks of words, with their inline links and styles | typed in |
| box | fills, image fills, shadows, full borders | crosshair drag |
| media | img, svg, video, canvas, iframe, form controls | crosshair drag |
| line | `hr` and 1–3px bars | pen tool |
| edge | single-side borders | pen tool |

Layers are grouped into small frames, and each cursor claims one frame at a time:

- A frame only becomes available once it scrolls into view.
- A frame waits for the box behind it to be drawn first.
- Siblings that look alike are built once, then alt-dragged out as copies and edited.
- Guides come from the layout itself: left edges shared by three or more layers, and baselines shared by text blocks sitting side by side.

## Files

| File | What it does |
| --- | --- |
| `swarm.js` | The loader: blanks the page, then loads the rest |
| `layers.js` | Reads the page, hides layers, reveals them and restores the page |
| `engine.js` | Cursors, jobs, scroll-driven build, toolbar actions |
| `studio.js` | Rulers, guides, spacing measurements, toolbar |
| `kit.js` | Easing, hand-like paths, typing rhythm, flocking |
| `sound.js` | Web Audio synthesis, M to toggle |
| `swarm.css` | Everything visual, prefixed `swarm-` |

Users who prefer reduced motion get the page as is, with no build.

Inspired by [Swarm](https://califa.github.io/swarm-site/) by Joel Califa. This is an independent implementation; none of its code is used.
