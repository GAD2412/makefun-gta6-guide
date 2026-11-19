// Node 22 hand-in. The embedded catalogue also permits a cold start from a local file in Chrome.
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const catalog = JSON.parse(readFileSync(join(here, 'app/data/trophies.json'), 'utf8'));
const page = readFileSync(join(here, 'app/index.html'), 'utf8');
const embedded = page.match(/<script type="application\/json" id="catalog">([^<]+)<\/script>/);
if (!embedded || JSON.stringify(JSON.parse(embedded[1])) !== JSON.stringify(catalog.trophies)) {
  throw new Error('The catalogue embedded for offline use must match app/data/trophies.json.');
}

mkdirSync(out, { recursive: true });
for (const directory of ['app', 'screenshots']) {
  cpSync(join(here, directory), join(out, directory), { recursive: true });
}
const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(out, 'dossier.json'), dossier);
