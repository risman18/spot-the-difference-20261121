# 🏮 Lantern Lane — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/risman18/spot-the-difference-20261121/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/risman18/spot-the-difference-20261121/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Two pictures, side by side, almost identical — **seven things changed** between them. Find them all before the timer runs out.

## The game

**Lantern Lane** is an original spot-the-difference game, drawn entirely in code (no image files, no network, no libraries). Three hand-drawn scenes, 7 differences each, 21 in total:

1. **Lantern Lane** — a night market under paper lanterns (3:00)
2. **Harbour Dawn** — sunrise over the fishing pier (2:30)
3. **Picnic Meadow** — an afternoon under the old oak (2:00)

- 🖱️ Click a difference on **either** panel — it counts on both, and a gold ring marks it
- ⌨️ Arrow keys move the ring cursor, **Enter** checks the spot — fully playable by keyboard
- 💡 **Hint** circles one hiding difference (−25 pts, 3 per scene)
- ❌ A wrong click costs 5 seconds; finishing a scene earns a time bonus
- 🔊 All sounds are synthesized with WebAudio — no audio files
- 🏆 Beat all three scenes to win

## Play it

Serve `game/` with any static server and open `index.html` in desktop Chrome:

```sh
node serve.ts   # http://localhost:8080
```

Everything the game loads lives under `game/`; it makes no network request.

## Layout

- `game/index.html` + `game/style.css` — page and HUD
- `game/src/main.js` — game state, timer, scoring, overlays, screenshot staging
- `game/src/scenes.js` — the three scenes and their 7 differences each
- `game/src/art.js` — procedural drawing helpers (lanterns, cats, boats, trees…)
- `game/src/audio.js` — synthesized sounds (WebAudio)
- `game/src/input.js` — mouse clicks and the keyboard crosshair
- `screenshots/` — real renders of the running game
- `main.ts` — the make.fun entry program (copies `game/` + `screenshots/` and writes `dossier.json`)

## Screenshots

1. **Cover** — mid-hunt in Lantern Lane: 3 differences found and ringed, 4 still hiding, counter showing 4 left
2. Title screen
3. Harbour Dawn mid-hunt
4. Lantern Lane complete

Entered on [make.fun](https://make.fun/?ref=7trfcnag&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards
