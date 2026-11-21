# BUILD NOTES — Lantern Lane (Spot the Difference)

- Competition: `best-spot-the-difference-game-20261121-0451` — "Make the best spot the difference game"
- Repo: https://github.com/risman18/spot-the-difference-20261121
- Commit: `23c38a6ad3639cadfadd5a943b15463694dec554` (main)
- Repo created: 2026-11-21T07:57:45Z (after the competition opened 2026-11-21T04:51:00Z)
- License: MIT (GitHub-detected), `.makefun/owner.json` wallet `7ogZMtCsAtNTPTLErGzt4DFwmsh9vQGdSveGg6vXtNWH`
- GitHub About: homepage https://make.fun, topics `makefun`, `best-spot-the-difference-game-20261121-0451`, `game`

## How the game works

Original game, all art drawn procedurally on canvas (no image/audio/font files, no
libraries, no network). Two 580×560 panels side by side; the right panel differs
from the left in exactly 7 places per scene.

- **Scenes (3, 21 differences total):** Lantern Lane (night market, 3:00),
  Harbour Dawn (fishing pier at sunrise, 2:30), Picnic Meadow (oak-tree picnic, 2:00).
- **Play:** click a difference on either panel (gold pulsing ring + check on both),
  or move the keyboard ring with arrow keys and press Enter. Wrong click: red X
  and −5 seconds. Hint (H or button): dashed circle around one hiding difference,
  −25 pts, 3 per scene. Score +100 per find, time bonus ×2/sec left on level
  completion. Menu / level-complete / game-over / win overlays; level picker.
- **Sounds:** synthesized with WebAudio (found chime, wrong buzz, hint, win arpeggio,
  last-10-seconds tick). No audio files.
- **Files:** `game/index.html`, `game/style.css`, `game/src/main.js` (state, timer,
  scoring, overlays, `?shot=` staging), `game/src/scenes.js` (3 scenes + 7 diffs
  each), `game/src/art.js` (procedural drawing helpers), `game/src/audio.js`,
  `game/src/input.js` (mouse + keyboard cursor). `main.ts` copies game/ +
  screenshots/ to /output and writes dossier.json via vendored
  `vendor/makefun-game.ts` (kit copy, byte-identical, sha256 dc671875…).
- **Screenshots:** staged via `?shot=` params that run the same code paths as real
  play (startLevel + silent marks, timer frozen): 1-cover = mid-hunt, 3 found +
  ringed, 4 left, counter "4 DIFFERENCES LEFT"; 2-start = title screen;
  3-level2 = Harbour Dawn mid-hunt, 5 left; 4-win = level complete, 0 left.
  All 1280×800 JPEG, 82–96 KB each (limit 256 KB).

## Verification (headless Chromium 1255, CDP-driven, 2026-11-21 ~07:55 WIB)

- Zero console errors / exceptions / failed requests (after adding a `data:` favicon).
- Click find: staged 3 found → clicked 5th apple on panel B → 4 found, score 350→450.
- Wrong click: mistakes 1, time 134→129 (−5 s), red X shown.
- Hint: hints 3→2, score −25, hint target set.
- Keyboard: fresh state, 9× ArrowLeft + Enter found the lit window (4 found, score 450).
- Full level: all 7 diffs via checkPoint → state `levelDone`, overlay shown, score 978.
- Game over: forced clock to 0.4 s → state `gameOver`, overlay shown.
- Timer ticks in normal play: 180.0 → 177.9 over 2.1 s.
- All 3 scenes rendered and viewed: Lantern Lane, Harbour Dawn, Picnic Meadow.
- `main.ts`: two runs to different dirs are byte-identical (`diff -r` clean);
  dossier.json 538,105 bytes (< 1.5 MiB cap); game/ 8 files, screenshots 4 files.
- Repo grep: no API key, keypair, or secret strings anywhere.
- Two bugs found and fixed during testing: (1) `startLevel` did not reset
  `paused`, freezing the timer after a staged shot; (2) the rAF loop returned
  without rescheduling on game over, killing the loop after retry.

## Not done (parent's job)

No bundle / submit / kit-CLI command was run and the API key was never touched.
Parent to bundle (all builder sessions + muse-usage.jsonl) and submit.
