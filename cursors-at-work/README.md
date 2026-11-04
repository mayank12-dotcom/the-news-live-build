# Cursors at Work

Your page builds itself, live, in front of the visitor. A crew of Figma-style multiplayer cursors does the work:

- drags out every box
- types every line
- draws every rule with the pen tool
- alt-drags repeated cards into place

Drop it on any site. It reads the page's own layout, so there's no markup to add.

- **No dependencies.** One file, about 85 KB unminified. Sound is synthesized live, so there are no audio files.
- **Works on any page.** It finds text, boxes, images, rules and repeated items by itself.
- **Layout-aware guides.** It works out your column grid (4 on phones, 8 on tablets, 8–12 on desktop) and pulls red guides from the edges and baselines your layout shares.
- **The page stays real.** When the visitor clicks Go live, every trace of the build is removed and your page is exactly as you wrote it.

[See the demo](demo/index.html), a page with no build markup at all.

## Install

**Script tag.** Copy `dist/cursors-at-work.js` into your site and add it to `<head>`, so the page never flashes before it's blanked:

```html
<script src="/js/cursors-at-work.js" data-logo="/logo.svg"></script>
```

**From GitHub via jsDelivr**, no download needed:

```html
<script src="https://cdn.jsdelivr.net/gh/mayank12-dotcom/cursors-at-work@1.0.0/dist/cursors-at-work.js"></script>
```

**npm**, for bundlers:

```bash
npm install cursors-at-work
```

```js
import CursorsAtWork from 'cursors-at-work';

CursorsAtWork.start({ logo: '/logo.svg' });
```

When it's bundled, call `start()` as early as you can, before your page first paints, so visitors don't see the page appear and then blank out. The script tag in `<head>` avoids this entirely.

## Options

Pass them to `start()`, or as data attributes on the script tag (`maxCursors` becomes `data-max-cursors`):

| Option | Default | What it does |
| --- | --- | --- |
| `logo` | the favicon | Mark the cursors orbit on the intro |
| `cursors` | `16` | Cursors at the start (1–64) |
| `maxCursors` | `32` | Fast scrolling brings in more, up to this many |
| `typingSpeed` | `40` | Average characters per second |
| `columns` | `'auto'` | Layout grid: `'auto'`, or a fixed column count |
| `grid` | `true` | Show the layout grid (`data-grid="off"`) |
| `sound` | `true` | Synthesized sound (`data-sound="off"`) |
| `toolbar` | `true` | Crew counter, Tour, 1×/2×/3×, Sound, Go live, Replay (`data-toolbar="off"`) |
| `skip` | `null` | CSS selector for elements to leave out |
| `root` | `<body>` | Element to build (JS only) |
| `respectReducedMotion` | `true` | Visitors who prefer reduced motion get the page as is |

Add `data-manual` to the script tag to load it without starting, then call `CursorsAtWork.start()` yourself.

## API

```js
CursorsAtWork.start(options) // begin (once per page)
CursorsAtWork.tour(true)     // auto-scroll at the pace the cursors keep up with
CursorsAtWork.goLive()       // remove the build chrome, back to the real page
CursorsAtWork.replay()       // blank the page and build it again
CursorsAtWork.state          // 'idle' | 'loading' | 'building' | 'built' | 'live'
CursorsAtWork.version
```

## Markup hooks (all optional)

| Hook | Use |
| --- | --- |
| `data-caw-skip` | Leave an element (and everything in it) out of the build |
| `data-caw-orbit` | Where the finished cursors settle when the mouse is away |
| `.caw-text` | Present on text still waiting to be typed. Useful to relax `line-clamp` until it's done |

All of the plugin's classes, attributes and CSS variables start with `caw-`. Its only global is `window.CursorsAtWork`.

## What the visitor sees

1. **Intro.** The page clears to a blank canvas and the cursors orbit your logo.
2. **Build.** Figma rulers slide in and your layout grid drops in column by column. The cursors fan out:
   - Boxes are crosshair-dragged as grey placeholders with a W×H badge, then filled. Photos sweep in.
   - Text boxes are dragged out, then typed into. Big headings start at 18px and step up to size.
   - Rules and single-side borders are drawn with the pen tool.
   - Repeated cards are built once, then alt-dragged into place with red spacing measurements, then retyped, re-photographed or restyled.
   - Before text is typed, a cursor pulls a red guide out of the ruler onto the edge or baseline that text shares with others.
3. **Crew counter.** The toolbar shows how many cursors are on a job right now, with a dot in each one's colour ("9 / 17 at work").
4. **Scroll.** Frames start only as they come into view. Idle cursors wait at the bottom of the screen and follow the visitor down. Scroll fast and more cursors join. Tour scrolls for them.
5. **Done.** The cursors flock around the mouse and keep clear of the pointer. **Go live** fades to the real page; **Replay** builds it again.

Sound is mostly clicky: keys, mouse presses, guide snaps. Boxes add sparse glass-piano notes, and the page finishes on a soft chord. Browsers only allow audio after the visitor's first tap or key press. **M** toggles sound.

## How it reads a page

| Layer | Found as | Built with |
| --- | --- | --- |
| text | elements with their own words, inline links and styles kept | the I-beam: typed |
| box | anything painting a fill, image fill, shadow or full border | the crosshair |
| media | `img`, `svg`, `video`, `canvas`, `iframe`, form controls | the crosshair |
| line | `hr` and 1–3px bars | the pen tool |
| edge | single-side borders | the pen tool |

- **Frames.** Layers are grouped into small subtrees, and each cursor claims one at a time.
  - A frame waits for the box behind it.
  - Siblings with the same tag, classes and layer structure become a master plus copies.
- **Guides.** A left edge shared by three or more layers gets a vertical guide. A baseline shared by text blocks side by side gets a horizontal one.
- **Layout grid** ([src/grid.js](src/grid.js)):
  - **Container:** the left and right edges most content lines up on.
  - **Gutter:** the `column-gap` your page-level CSS grids use most. Wide flex rows are the fallback.
  - **Columns:** 4 below 768px, 8 up to 1024px. On desktop, whichever of 8–12 columns lines up with the most of your layout's edges (12 on a tie).
  - It's worked out again when the window is resized.

## Accessibility

- Respects `prefers-reduced-motion`: those visitors get the page with no build at all.
- `aria-busy` is set on `<body>` while building.
- All of the plugin's own UI is `aria-hidden`, except the toolbar, which is a labelled `role="toolbar"` of real buttons with visible focus.
- Text is typed into the real elements, so screen readers and search engines always get your actual content.
- If it can't start, the page is shown as is, never left blank.

## Good to know

- It suits static and server-rendered pages. For a single-page app, call `start()` once your view has rendered.
- It reads up to 4,000 layers. Beyond that, the rest of the page simply appears.
- Very large DOMs take a moment to read before the intro ends.
- Built for current evergreen browsers. Tested in Chromium so far.

## Build from source

The source is in `src/`. `build.mjs` joins it into `dist/` and needs nothing but Node:

```bash
node build.mjs
```

## License

MIT. See [LICENSE](LICENSE).

The interaction design is inspired by Joel Califa's ([joelcalifa.com](https://joelcalifa.com)) self-building website. This is an independent implementation; none of its code is used.
