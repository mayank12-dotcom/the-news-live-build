CAW.grid = (() => {
  // Works out the page's layout grid from its own structure, like the column grid a
  // designer lays over a Figma frame:
  //   - the container: the left and right edges most of the content lines up on
  //   - the gutter: the column-gap the page's own grids (else flex rows) use most, by width
  //   - the columns: 4 on phones, 8 on tablets; on desktop, whichever of 8–12 columns
  //     lines up with the most of the content's left and right edges (12 on a tie)
  const TABLET_PX = 768;
  const DESKTOP_PX = 1024;
  const DESKTOP_COLUMNS = [12, 11, 10, 9, 8];
  const GUTTER = { mobile: 16, tablet: 20, desktop: 24 };
  const EDGE_TOLERANCE = 3;   // an edge within this many px of a column line counts as on it
  const GAP_RANGE = [8, 80];  // gaps outside this aren't gutters
  const MAX_SCAN = 6000;      // elements looked at for grid and flex rows

  // The most common value (the smaller one on a tie); `weights` count some values more.
  function mode(values, weights) {
    const counts = new Map();
    values.forEach((v, i) => counts.set(v, (counts.get(v) || 0) + (weights ? weights[i] : 1)));
    let best = null;
    let most = 0;
    for (const [v, n] of counts) if (n > most || (n === most && v < best)) { best = v; most = n; }
    return best;
  }

  function container(rects, width) {
    const left = mode(rects.filter((r) => r.left >= 0 && r.left < width * 0.3).map((r) => Math.round(r.left)));
    const right = mode(rects.filter((r) => r.right <= width + 1 && r.right > width * 0.7).map((r) => Math.round(r.right)));
    if (left === null || right === null || right - left < width * 0.5) return { left: 16, right: width - 16 };
    return { left, right };
  }

  // The page's multi-column rows: CSS grids with two or more tracks and flex rows.
  // Their gaps are the gutters, their children's edges are where columns start and end.
  function layoutRows(root) {
    const rows = [];
    const els = root.getElementsByTagName('*');
    for (let i = 0; i < els.length && i < MAX_SCAN; i++) {
      const el = els[i];
      if (el.children.length < 2 || el.closest('.caw-ui')) continue;
      const cs = getComputedStyle(el);
      const grid = cs.display.includes('grid') && cs.gridTemplateColumns.trim().split(/\s+/).length >= 2;
      const flex = cs.display.includes('flex') && cs.flexDirection.startsWith('row');
      const gap = parseFloat(cs.columnGap);
      if (!(grid || flex) || !(gap >= GAP_RANGE[0] && gap <= GAP_RANGE[1])) continue;
      const kids = [...el.children].map((k) => k.getBoundingClientRect()).filter((r) => r.width >= 1);
      const width = el.getBoundingClientRect().width;
      if (kids.length >= 2) rows.push({ gap: Math.round(gap), width, kids, grid });
    }
    return rows;
  }

  // Page-level CSS grids decide the gutter; wide flex rows only if there are no grids
  // (flex gaps are often just spacing between nav links or buttons).
  function gutter(rows, width, fallback) {
    const wide = rows.filter((r) => r.width >= width * 0.4);
    const grids = wide.filter((r) => r.grid);
    const pick = grids.length ? grids : wide.length ? wide : rows;
    return mode(pick.map((r) => r.gap), pick.map((r) => r.width)) ?? fallback;
  }

  function columnsFor(count, box, gap) {
    const width = box.right - box.left;
    const column = (width - gap * (count - 1)) / count;
    return column > 8 ? Array.from({ length: count }, (_, i) => box.left + i * (column + gap)).map((x) => [x, x + column]) : null;
  }

  // Share of the layout's edges that land on a column line.
  function fit(columns, edges) {
    if (!columns || !edges.length) return 0;
    const lines = columns.flat();
    return edges.filter((e) => lines.some((x) => Math.abs(x - e) <= EDGE_TOLERANCE)).length / edges.length;
  }

  // `layers` are the build's layers ({ el, kind }); `forced` pins the column count (the
  // `columns` option), otherwise it's read from the page.
  function detect(root, layers, forced) {
    const width = document.documentElement.clientWidth;
    const breakpoint = width < TABLET_PX ? 'mobile' : width < DESKTOP_PX ? 'tablet' : 'desktop';
    const placed = layers.map((op) => ({ op, r: op.el.getBoundingClientRect() })).filter(({ r }) => r.width >= 1 && r.height >= 1);
    const rows = layoutRows(root);
    const box = container([...placed.map(({ r }) => r), ...rows.flatMap((row) => row.kids)], width);
    const gap = gutter(rows, width, GUTTER[breakpoint]);
    // Column lines the layout commits to: both sides of grid and flex children and of boxes
    // and media, only the left of text (its right edge is ragged).
    const lines = [
      ...rows.flatMap((row) => row.kids.flatMap((r) => [r.left, r.right])),
      ...placed.flatMap(({ op, r }) => (op.kind === 'text' ? [r.left] : [r.left, r.right])),
    ];
    const edges = [...new Set(lines.map(Math.round))].filter((e) => e > box.left + EDGE_TOLERANCE && e < box.right - EDGE_TOLERANCE);
    let count = Number(forced) || (breakpoint === 'mobile' ? 4 : breakpoint === 'tablet' ? 8 : 0);
    let score = fit(columnsFor(count, box, gap), edges);
    if (!count) {
      for (const n of DESKTOP_COLUMNS) {
        const s = fit(columnsFor(n, box, gap), edges);
        if (s > score) { score = s; count = n; }
      }
      count ||= DESKTOP_COLUMNS[0];
    }
    return { breakpoint, count, gutter: gap, left: box.left, right: box.right, columns: columnsFor(count, box, gap) || [], fit: score };
  }

  return { detect };
})();
