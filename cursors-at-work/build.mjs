// Builds dist/cursors-at-work.js: every module in src/ plus the stylesheet, in one
// self-contained file with no dependencies. Run with `node build.mjs` (or `npm run build`).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const here = (path) => new URL(path, import.meta.url);
const pkg = JSON.parse(readFileSync(here('./package.json'), 'utf8'));
const read = (file) => readFileSync(here(`./src/${file}`), 'utf8').trim();
// Order matters: helpers first, the public entry last.
const MODULES = ['kit.js', 'layers.js', 'grid.js', 'sound.js', 'studio.js', 'engine.js', 'index.js'];

// Comments out, whitespace squeezed. Spaces before ':' stay: in a selector they're the
// descendant combinator (`.bar :is(…)` is not `.bar:is(…)`).
const css = read('styles.css')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{};,>])\s*/g, '$1')
  .replace(/:\s+/g, ':')
  .replace(/;}/g, '}')
  .trim();

const indent = (code) => code.split('\n').map((line) => (line ? `  ${line}` : line)).join('\n');
const banner = `/*! Cursors at Work v${pkg.version} | ${pkg.license} License | ${pkg.homepage} */`;
const out = `${banner}
(function () {
  'use strict';
  const CAW = { version: ${JSON.stringify(pkg.version)}, css: ${JSON.stringify(css)} };

${MODULES.map((file) => indent(`// ---- ${file} ----\n${read(file)}`)).join('\n\n')}
})();
`;

mkdirSync(here('./dist/'), { recursive: true });
writeFileSync(here('./dist/cursors-at-work.js'), out);
console.log(`dist/cursors-at-work.js  ${(out.length / 1024).toFixed(1)} KB`);
