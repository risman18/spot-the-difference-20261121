// audio.js — every sound is synthesized with WebAudio. No audio file is loaded,
// so the game stays silent until the player first interacts (browser policy).
let ctx = null;
let enabled = true;
let lastTickSecond = -1;

export function setEnabled(v) { enabled = v; }
export function isEnabled() { return enabled; }

function audio() {
  if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; } }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}
function tone(freq, start, dur, type = 'sine', vol = 0.16) {
  if (!enabled) return;
  const ac = audio(); if (!ac) return;
  const osc = ac.createOscillator(), gain = ac.createGain();
  osc.type = type; osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ac.currentTime + start);
  gain.gain.linearRampToValueAtTime(vol, ac.currentTime + start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
  osc.connect(gain); gain.connect(ac.destination);
  osc.start(ac.currentTime + start); osc.stop(ac.currentTime + start + dur + 0.05);
}
export function playFound() { tone(660, 0, 0.14, 'sine', 0.2); tone(880, 0.09, 0.22, 'sine', 0.2); tone(1320, 0.18, 0.28, 'triangle', 0.12); }
export function playWrong() { tone(160, 0, 0.22, 'sawtooth', 0.1); tone(110, 0.05, 0.25, 'sawtooth', 0.08); }
export function playHint() { tone(520, 0, 0.12, 'triangle', 0.12); tone(780, 0.08, 0.16, 'triangle', 0.1); }
export function playClick() { tone(440, 0, 0.06, 'square', 0.06); }
export function playLevelWin() { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.3, 'triangle', 0.16)); }
export function playGameWin() { [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, i * 0.13, 0.35, 'triangle', 0.16)); }
export function playGameOver() { [392, 330, 262, 196].forEach((f, i) => tone(f, i * 0.16, 0.3, 'sine', 0.14)); }
export function playTick(secondsLeft) {
  if (!enabled || secondsLeft > 10 || secondsLeft === lastTickSecond) return;
  lastTickSecond = secondsLeft;
  tone(980, 0, 0.05, 'square', 0.05);
}
