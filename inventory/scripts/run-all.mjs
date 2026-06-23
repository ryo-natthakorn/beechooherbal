// Runs the whole Phase-1 pipeline in order. Each step is also runnable on its own.
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const steps = [
  '01-fetch-sitemap.mjs',
  '02-fetch-pages.mjs',
  'make-proposed-pairs.mjs', // semantic EN<->TH pairs (depends on pages.json from 02)
  '03-build-map.mjs',
  '04-fetch-rest.mjs',
  '05-parity-report.mjs',
];
for (const s of steps) {
  console.log(`\n########## ${s} ##########`);
  const r = spawnSync(process.execPath, [path.join(here, s)], { stdio: 'inherit' });
  if (r.status !== 0) { console.error(`Step ${s} failed (exit ${r.status}). Stopping.`); process.exit(r.status || 1); }
}
console.log('\nAll steps complete. See inventory/parity-report.md');
