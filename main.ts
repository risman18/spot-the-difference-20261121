// main.ts — Lantern Lane entry program (Node 22, standard library only).
// It hands the game in: copies this repository's game/ and screenshots/ into the
// output directory and writes dossier.json there with the vendored make.fun
// library, exactly as the competition's kit describes. The grader runs it twice
// in a fresh container with no network; both runs must write identical bytes,
// so this program does nothing time- or environment-dependent: it only copies
// files and builds the dossier from them.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's caps, as the kit's RULES.txt states them: the dossier text is
// capped at 160 KiB, at most 4 screenshots of 256 KiB each, game/ at most 993
// files and 48 MiB in all, and no path under game/ longer than 1000 bytes.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
