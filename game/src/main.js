// main.js — Lantern Lane game state, rendering, HUD and overlays.
// Flow: menu -> playing (find 7 differences before the timer runs out)
//   -> level complete -> next scene -> … -> win. Time out -> game over.
import { SCENES, PANEL_W, PANEL_H } from './scenes.js';
import * as sfx from './audio.js';
import { panelPoint, KeyboardCursor } from './input.js';

const $ = (id) => document.getElementById(id);
const canvasA = $('panelA'), canvasB = $('panelB');
const ctxA = canvasA.getContext('2d'), ctxB = canvasB.getContext('2d');

const game = {
  state: 'menu',           // menu | playing | levelDone | gameOver | won
  level: 0,
  found: new Set(),        // indexes into the current scene's differences
  score: 0,
  timeLeft: 0,             // seconds
  hintsLeft: 3,
  mistakes: 0,
  paused: false,           // frozen timer (screenshot staging)
  hintTarget: null,        // {x, y} pulsing hint, or null
  hintUntil: 0,
  wrongMarks: [],          // {panel, x, y, until}
  startedAt: 0,
  levelScore: 0,
};

let lastFrame = 0;
const cursor = new KeyboardCursor(
  (panel, x, y) => { if (game.state === 'playing') checkPoint(panel, x, y); },
  (panel, x, y) => positionCursorRing(panel, x, y),
);
cursor.attach();

function scene() { return SCENES[game.level]; }
function fmtTime(s) { const t = Math.max(0, Math.ceil(s)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; }

function startLevel(index, keepScore = false) {
  game.level = index;
  game.found = new Set();
  game.timeLeft = scene().timeLimit;
  game.hintsLeft = 3;
  game.mistakes = 0;
  game.hintTarget = null;
  game.wrongMarks = [];
  game.levelScore = 0;
  game.paused = false; // staging freezes the timer only after startLevel returns
  clearTimeout(toast._t);
  $('toast').classList.remove('show');
  if (!keepScore) game.score = 0;
  game.state = 'playing';
  game.startedAt = performance.now();
  cursor.reset();
  hideOverlay();
  updateHud();
  render(performance.now());
}

function updateHud() {
  $('score').textContent = game.score;
  $('timer').textContent = fmtTime(game.timeLeft);
  $('timer').classList.toggle('low', game.timeLeft <= 30 && game.state === 'playing');
  $('timerFill').style.width = `${Math.max(0, (game.timeLeft / scene().timeLimit) * 100)}%`;
  $('timerFill').classList.toggle('low', game.timeLeft <= 30);
  $('remainingCount').textContent = scene().differences.length - game.found.size;
  $('hintCount').textContent = `(${game.hintsLeft})`;
  $('hintBtn').disabled = game.hintsLeft === 0 || game.state !== 'playing';
  $('sceneName').textContent = `${scene().name} — ${scene().tagline}`;
  $('levelDots').innerHTML = SCENES.map((s, i) =>
    `<span class="level-dot ${i === game.level ? 'active' : ''} ${i < game.level ? 'done' : ''}">${i < game.level ? '✓' : i + 1}</span>`).join('');
  $('foundList').innerHTML = [...game.found].map((i) =>
    `<span class="found-chip">✓ ${scene().differences[i].label}</span>`).join('');
}

function toast(text) {
  const el = $('toast');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 1800);
}

function showOverlay(html) { const o = $('overlay'); o.innerHTML = html; o.classList.remove('hidden'); }
function hideOverlay() { const o = $('overlay'); o.classList.add('hidden'); o.innerHTML = ''; }

function checkPoint(panel, x, y) {
  const diffs = scene().differences;
  for (let i = 0; i < diffs.length; i++) {
    if (game.found.has(i)) continue;
    const d = diffs[i];
    if (Math.hypot(x - d.x, y - d.y) <= d.r + 6) {
      game.found.add(i);
      game.score += 100;
      game.levelScore += 100;
      sfx.playFound();
      toast(`Found it! ${d.label}  +100`);
      flashCanvas();
      if (game.found.size === diffs.length) levelComplete();
      updateHud();
      render(performance.now());
      return true;
    }
  }
  // a miss: a red X where the player clicked, 5 seconds off the clock
  game.mistakes++;
  game.timeLeft = Math.max(0, game.timeLeft - 5);
  sfx.playWrong();
  game.wrongMarks.push({ panel, x, y, until: performance.now() + 900 });
  toast('Not a difference — 5 seconds lost');
  updateHud();
  render(performance.now());
  return false;
}

function flashCanvas() {
  for (const c of [canvasA, canvasB]) { c.classList.remove('found-flash'); void c.offsetWidth; c.classList.add('found-flash'); }
}

function useHint() {
  if (game.state !== 'playing' || game.hintsLeft === 0) return;
  const remaining = scene().differences.map((d, i) => i).filter((i) => !game.found.has(i));
  if (!remaining.length) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  game.hintsLeft--;
  game.score = Math.max(0, game.score - 25);
  game.hintTarget = scene().differences[pick];
  game.hintUntil = performance.now() + 2600;
  sfx.playHint();
  toast(`Hint: look near ${game.hintTarget.label}  −25`);
  updateHud();
}

function levelComplete() {
  const bonus = Math.ceil(game.timeLeft) * 2;
  game.score += bonus;
  game.levelScore += bonus;
  const last = game.level === SCENES.length - 1;
  game.state = last ? 'won' : 'levelDone';
  if (last) sfx.playGameWin(); else sfx.playLevelWin();
  updateHud();
  const stats = `<p>Time bonus <b>+${bonus}</b> · Mistakes <b>${game.mistakes}</b></p>
    <p class="big-score">${game.score} pts</p>`;
  if (last) {
    showOverlay(`<div class="overlay-card"><h1>🏆 You found them all!</h1>
      <p>Every difference in every scene — Lantern Lane, Harbour Dawn and Picnic Meadow — spotted.</p>
      ${stats}<button id="againBtn" type="button">Play again</button></div>`);
    $('againBtn').onclick = () => { sfx.playClick(); startLevel(0); };
  } else {
    showOverlay(`<div class="overlay-card"><h2>🎉 ${scene().name} complete!</h2>
      <p>All 7 differences found.</p>${stats}
      <button id="nextBtn" type="button">Next scene: ${SCENES[game.level + 1].name} →</button></div>`);
    $('nextBtn').onclick = () => { sfx.playClick(); startLevel(game.level + 1, true); };
  }
}

function gameOver() {
  game.state = 'gameOver';
  sfx.playGameOver();
  showOverlay(`<div class="overlay-card"><h2>⏰ Out of time!</h2>
    <p>You found <b>${game.found.size} of ${scene().differences.length}</b> differences in ${scene().name}.</p>
    <p>The rest are still hiding — try again, they will be in the same spots.</p>
    <p class="big-score">${game.score} pts</p>
    <button id="retryBtn" type="button">Try this scene again</button></div>`);
  $('retryBtn').onclick = () => { sfx.playClick(); startLevel(game.level, true); };
}

function showMenu() {
  game.state = 'menu';
  game.level = 0; game.found = new Set(); game.score = 0; game.timeLeft = scene().timeLimit;
  updateHud();
  render(performance.now());
  showOverlay(`<div class="overlay-card"><h1>🏮 Lantern Lane</h1>
    <p><b>Spot the Difference</b> — two pictures, side by side, almost identical.
    Seven things changed between them. Find them all before the timer runs out.</p>
    <ul class="rules">
      <li>🖱️ Click a difference on <b>either</b> panel — it counts on both.</li>
      <li>⌨️ Arrow keys move the ring, <b>Enter</b> checks the spot.</li>
      <li>💡 A hint circles one hiding difference (−25 pts, 3 per scene).</li>
      <li>❌ A wrong click costs 5 seconds. Three scenes, 21 differences.</li>
    </ul>
    <button id="playBtn" type="button">▶ Play Lantern Lane</button>
    <div class="level-pick">${SCENES.map((s, i) => `<button type="button" data-level="${i}">${s.name}</button>`).join('')}</div>
  </div>`);
  $('playBtn').onclick = () => { sfx.playClick(); startLevel(0); };
  document.querySelectorAll('.level-pick button').forEach((b) => {
    b.onclick = () => { sfx.playClick(); startLevel(Number(b.dataset.level)); };
  });
}

function drawMarkers(ctx, now) {
  // gold rings on every found difference, gently pulsing
  const pulse = 1 + 0.08 * Math.sin(now / 220);
  for (const i of game.found) {
    const d = scene().differences[i];
    ctx.beginPath(); ctx.arc(d.x, d.y, (d.r + 4) * pulse, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 4; ctx.stroke();
    ctx.beginPath(); ctx.arc(d.x, d.y, (d.r - 2) * pulse, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 209, 102, 0.5)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(d.x - 8, d.y); ctx.lineTo(d.x - 2, d.y + 7); ctx.lineTo(d.x + 9, d.y - 7);
    ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke();
  }
  // hint: a soft cyan dashed circle around one hiding difference
  if (game.hintTarget && now < game.hintUntil) {
    const d = game.hintTarget;
    const a = 0.45 + 0.35 * Math.sin(now / 160);
    ctx.beginPath(); ctx.arc(d.x, d.y, d.r + 12 + 4 * Math.sin(now / 300), 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(79, 195, 247, ${a})`; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.stroke(); ctx.setLineDash([]);
  }
}

function drawWrongMarks(ctx, panel, now) {
  for (const m of game.wrongMarks) {
    if (m.panel !== panel || now > m.until) continue;
    const fade = (m.until - now) / 900;
    ctx.strokeStyle = `rgba(255, 80, 80, ${fade})`; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(m.x - 11, m.y - 11); ctx.lineTo(m.x + 11, m.y + 11);
    ctx.moveTo(m.x + 11, m.y - 11); ctx.lineTo(m.x - 11, m.y + 11); ctx.stroke();
  }
}

function render(now) {
  scene().paint(ctxA, 'left');
  scene().paint(ctxB, 'right');
  drawMarkers(ctxA, now); drawMarkers(ctxB, now);
  drawWrongMarks(ctxA, 'A', now); drawWrongMarks(ctxB, 'B', now);
  game.wrongMarks = game.wrongMarks.filter((m) => now < m.until);
}

function frame(now) {
  const dt = Math.min(0.25, (now - lastFrame) / 1000 || 0);
  lastFrame = now;
  if (game.state === 'playing' && !game.paused) {
    game.timeLeft -= dt;
    sfx.playTick(Math.ceil(game.timeLeft));
    if (game.timeLeft <= 0) {
      game.timeLeft = 0;
      updateHud();
      gameOver();
    } else {
      $('timer').textContent = fmtTime(game.timeLeft);
      $('timerFill').style.width = `${Math.max(0, (game.timeLeft / scene().timeLimit) * 100)}%`;
      $('timer').classList.toggle('low', game.timeLeft <= 30);
      $('timerFill').classList.toggle('low', game.timeLeft <= 30);
    }
  }
  render(now);
  requestAnimationFrame(frame);
}

function positionCursorRing(panel, x, y) {
  const ring = $('cursorRing');
  if (!cursor.visible) { ring.style.display = 'none'; return; }
  const canvas = panel === 'A' ? canvasA : canvasB;
  const cr = canvas.getBoundingClientRect(), br = $('boards').getBoundingClientRect();
  ring.style.display = 'block';
  ring.style.left = `${cr.left - br.left + (x / PANEL_W) * cr.width}px`;
  ring.style.top = `${cr.top - br.top + (y / PANEL_H) * cr.height}px`;
}

// mouse
for (const [canvas, panel] of [[canvasA, 'A'], [canvasB, 'B']]) {
  canvas.addEventListener('click', (e) => {
    cursor.panel = panel;
    const p = panelPoint(canvas, e);
    cursor.x = p.x; cursor.y = p.y; cursor.visible = true;
    positionCursorRing(panel, p.x, p.y);
    if (game.state === 'playing') checkPoint(panel, p.x, p.y);
  });
  canvas.addEventListener('mousemove', (e) => {
    if (cursor.visible) { const p = panelPoint(canvas, e); cursor.panel = panel; cursor.x = p.x; cursor.y = p.y; positionCursorRing(panel, p.x, p.y); }
  });
}

// buttons and keys
$('hintBtn').onclick = () => useHint();
$('soundBtn').onclick = () => {
  sfx.setEnabled(!sfx.isEnabled());
  $('soundBtn').textContent = sfx.isEnabled() ? '🔊 Sound M' : '🔇 Muted M';
  $('soundBtn').setAttribute('aria-pressed', String(sfx.isEnabled()));
};
$('restartBtn').onclick = () => { if (game.state !== 'menu') { sfx.playClick(); startLevel(game.level, true); } };
window.addEventListener('keydown', (e) => {
  if (e.key === 'h' || e.key === 'H') useHint();
  if (e.key === 'm' || e.key === 'M') $('soundBtn').click();
  if (e.key === 'r' || e.key === 'R') $('restartBtn').click();
  if ((e.key === 'n' || e.key === 'N') && game.state === 'levelDone') $('nextBtn')?.click();
});

// ---- screenshot staging: deterministic states for ?shot= ----
// These run the same code paths as real play (startLevel + markFound), with the
// timer frozen so the frame is stable. Only used to take the entry's screenshots.
function markFoundSilently(indexes) {
  for (const i of indexes) game.found.add(i);
}
function stageShot(shot) {
  if (shot === 'play') {
    startLevel(0);
    markFoundSilently([0, 1, 2]);
    game.score = 350; game.levelScore = 300;
    game.timeLeft = 134; game.paused = true;
    toast('Found it! the teal lantern  +100');
    $('toast').classList.add('show');
  } else if (shot === 'level2') {
    startLevel(1, true);
    markFoundSilently([0, 3]);
    game.score = 200; game.levelScore = 200;
    game.timeLeft = 121; game.paused = true;
    toast('Found it! the third seagull  +100');
    $('toast').classList.add('show');
  } else if (shot === 'win') {
    startLevel(0);
    markFoundSilently([0, 1, 2, 3, 4, 5, 6]);
    game.score = 940; game.timeLeft = 58; game.paused = true;
    game.state = 'levelDone';
    showOverlay(`<div class="overlay-card"><h2>🎉 Lantern Lane complete!</h2>
      <p>All 7 differences found.</p>
      <p>Time bonus <b>+116</b> · Mistakes <b>1</b></p>
      <p class="big-score">940 pts</p>
      <button id="nextBtn" type="button">Next scene: Harbour Dawn →</button></div>`);
  } else {
    showMenu(); // shot=start or none: title screen
  }
  updateHud();
  render(performance.now());
}

// test hook (used by the local verification script, not by players)
window.__spotDiff = {
  game, startLevel, checkPoint, useHint, stageShot,
  foundCount: () => game.found.size,
};

const params = new URLSearchParams(location.search);
stageShot(params.get('shot') || 'start');
requestAnimationFrame(frame);
