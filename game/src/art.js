// art.js — small procedural drawing helpers shared by every scene.
// Every helper draws with plain canvas paths; no image or font is loaded.
export function circle(ctx, x, y, r, fill) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
}
export function ellipse(ctx, x, y, rx, ry, fill, rotation = 0) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
}
export function rect(ctx, x, y, w, h, fill) { ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); }
export function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
}
export function poly(ctx, points, fill) {
  ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
}
export function line(ctx, x1, y1, x2, y2, color, width = 2) {
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.stroke();
}
export function star(ctx, x, y, r, fill, points = 5) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const rr = i % 2 === 0 ? r : r * 0.45;
    const a = (i * Math.PI) / points - Math.PI / 2;
    const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
}
export function skyGradient(ctx, w, h, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, top); g.addColorStop(1, bottom);
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
}
export function drawCloud(ctx, x, y, s, fill = '#ffffff') {
  circle(ctx, x, y, 26 * s, fill);
  circle(ctx, x + 24 * s, y + 6 * s, 20 * s, fill);
  circle(ctx, x - 26 * s, y + 8 * s, 18 * s, fill);
  circle(ctx, x + 2 * s, y + 12 * s, 20 * s, fill);
}
export function drawBird(ctx, x, y, s = 1, color = '#2b2135') {
  ctx.beginPath(); ctx.moveTo(x - 12 * s, y);
  ctx.quadraticCurveTo(x - 4 * s, y - 9 * s, x, y);
  ctx.quadraticCurveTo(x + 4 * s, y - 9 * s, x + 12 * s, y);
  ctx.strokeStyle = color; ctx.lineWidth = 2.5 * s; ctx.lineCap = 'round'; ctx.stroke();
}
export function drawButterfly(ctx, x, y, s, colorA, colorB, flap = 0) {
  const w = 9 * s * (1 - 0.35 * Math.abs(flap));
  ctx.save(); ctx.translate(x, y);
  ellipse(ctx, -w, -4 * s, w, 7 * s, colorA, -0.5);
  ellipse(ctx, w, -4 * s, w, 7 * s, colorB, 0.5);
  ellipse(ctx, -w * 0.8, 5 * s, w * 0.7, 5 * s, colorB, 0.5);
  ellipse(ctx, w * 0.8, 5 * s, w * 0.7, 5 * s, colorA, -0.5);
  line(ctx, 0, -6 * s, 0, 7 * s, '#3a2b22', 2 * s);
  ctx.restore();
}
export function drawCat(ctx, x, y, s, coat, ear = '#ff9fb0') {
  // A sitting cat, facing forward. (x, y) is the ground point under it.
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, -16, 17, 15, coat);                 // body
  circle(ctx, 0, -38, 13, coat);                      // head
  poly(ctx, [[-11, -46], [-8, -58], [-2, -47]], coat); // left ear
  poly(ctx, [[11, -46], [8, -58], [2, -47]], coat);    // right ear
  poly(ctx, [[-10, -47], [-8, -55], [-4, -47]], ear);
  poly(ctx, [[10, -47], [8, -55], [4, -47]], ear);
  circle(ctx, -5, -40, 1.8, '#1c1440'); circle(ctx, 5, -40, 1.8, '#1c1440'); // eyes
  poly(ctx, [[-2, -35], [2, -35], [0, -32]], '#ff9fb0'); // nose
  ctx.beginPath(); ctx.arc(0, -16, 4, 0.15 * Math.PI, 0.85 * Math.PI); ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(15, -6); ctx.quadraticCurveTo(30, -8, 32, -26); ctx.strokeStyle = coat; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.stroke(); // tail
  ctx.restore();
}
export function drawLantern(ctx, x, y, r, body, glow = true) {
  if (glow) { const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 2.4); g.addColorStop(0, 'rgba(255, 190, 90, 0.5)'); g.addColorStop(1, 'rgba(255, 190, 90, 0)'); ctx.fillStyle = g; ctx.fillRect(x - r * 2.4, y - r * 2.4, r * 4.8, r * 4.8); }
  ellipse(ctx, x, y, r * 0.72, r, body);
  ellipse(ctx, x, y, r * 0.3, r * 0.9, 'rgba(255,255,255,0.25)');
  rect(ctx, x - r * 0.28, y - r - 4, r * 0.56, 5, '#e8b64c');
  rect(ctx, x - r * 0.28, y + r - 1, r * 0.56, 5, '#e8b64c');
  line(ctx, x, y + r + 4, x, y + r + 12, '#e8b64c', 2);
  circle(ctx, x, y + r + 15, 3, '#e8b64c');
}
export function drawApple(ctx, x, y, r, color = '#e63946') {
  circle(ctx, x, y, r, color);
  circle(ctx, x - r * 0.3, y - r * 0.3, r * 0.35, 'rgba(255,255,255,0.35)');
  line(ctx, x, y - r, x + 2, y - r - 5, '#5a3a1a', 2);
  ellipse(ctx, x + 6, y - r - 3, 5, 2.5, '#4caf50', -0.5);
}
export function drawFlower(ctx, x, y, s, petal, center = '#ffd166') {
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    ellipse(ctx, x + Math.cos(a) * 8 * s, y + Math.sin(a) * 8 * s, 6 * s, 6 * s, petal);
  }
  circle(ctx, x, y, 5.5 * s, center);
}
export function drawTree(ctx, x, y, s, apples) {
  // Oak tree: (x, y) is the base of the trunk.
  rect(ctx, x - 14 * s, y - 120 * s, 28 * s, 120 * s, '#6b4226');
  ctx.beginPath(); ctx.moveTo(x - 12 * s, y - 90 * s); ctx.lineTo(x - 42 * s, y - 130 * s); ctx.lineTo(x - 26 * s, y - 120 * s); ctx.closePath(); ctx.fillStyle = '#6b4226'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(x + 12 * s, y - 80 * s); ctx.lineTo(x + 44 * s, y - 125 * s); ctx.lineTo(x + 26 * s, y - 118 * s); ctx.closePath(); ctx.fillStyle = '#6b4226'; ctx.fill();
  circle(ctx, x, y - 150 * s, 62 * s, '#2f7d32');
  circle(ctx, x - 48 * s, y - 120 * s, 42 * s, '#388e3c');
  circle(ctx, x + 50 * s, y - 122 * s, 44 * s, '#43a047');
  circle(ctx, x - 20 * s, y - 168 * s, 34 * s, '#4caf50');
  circle(ctx, x + 26 * s, y - 172 * s, 32 * s, '#388e3c');
  for (const [ax, ay] of apples) drawApple(ctx, ax, ay, 7 * s);
}
export function drawBoat(ctx, x, y, s, hull, sail) {
  line(ctx, x, y - 78 * s, x, y - 6 * s, '#5a3a1a', 4 * s); // mast
  poly(ctx, [[x + 4 * s, y - 74 * s], [x + 4 * s, y - 14 * s], [x + 46 * s, y - 14 * s]], sail); // sail
  poly(ctx, [[x - 4 * s, y - 70 * s], [x - 4 * s, y - 16 * s], [x - 30 * s, y - 16 * s]], '#fff8e1'); // jib
  poly(ctx, [[x - 46 * s, y - 8 * s], [x + 52 * s, y - 8 * s], [x + 38 * s, y + 14 * s], [x - 32 * s, y + 14 * s]], hull); // hull
  rect(ctx, x - 20 * s, y - 8 * s, 44 * s, 4 * s, 'rgba(255,255,255,0.5)');
}
export function drawLighthouse(ctx, x, y, s, beamOn) {
  // (x, y) is the base of the tower.
  poly(ctx, [[x - 26 * s, y], [x + 26 * s, y], [x + 16 * s, y - 150 * s], [x - 16 * s, y - 150 * s]], '#f5f0e6');
  rect(ctx, x - 24 * s, y - 118 * s, 48 * s, 14 * s, '#e63946');
  rect(ctx, x - 21 * s, y - 76 * s, 42 * s, 14 * s, '#e63946');
  rect(ctx, x - 18 * s, y - 34 * s, 36 * s, 14 * s, '#e63946');
  rect(ctx, x - 20 * s, y - 172 * s, 40 * s, 24 * s, '#37474f');
  if (beamOn) {
    const g = ctx.createLinearGradient(x, y - 160 * s, x + 190 * s, y - 160 * s);
    g.addColorStop(0, 'rgba(255, 240, 160, 0.85)'); g.addColorStop(1, 'rgba(255, 240, 160, 0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x + 18 * s, y - 168 * s); ctx.lineTo(x + 190 * s, y - 196 * s); ctx.lineTo(x + 190 * s, y - 128 * s); ctx.lineTo(x + 18 * s, y - 148 * s); ctx.closePath(); ctx.fill();
  }
  circle(ctx, x, y - 160 * s, 9 * s, beamOn ? '#fff59d' : '#90a4ae');
  poly(ctx, [[x - 24 * s, y - 172 * s], [x + 24 * s, y - 172 * s], [x, y - 196 * s]], '#263238');
}
export function drawKite(ctx, x, y, s, bows) {
  poly(ctx, [[x, y - 26 * s], [x + 20 * s, y], [x, y + 26 * s], [x - 20 * s, y]], '#e63946');
  poly(ctx, [[x, y - 26 * s], [x + 20 * s, y], [x, y]], '#ffd166');
  poly(ctx, [[x, y - 26 * s], [x - 20 * s, y], [x, y]], '#4fc3f7');
  ctx.beginPath(); ctx.moveTo(x, y + 26 * s);
  ctx.quadraticCurveTo(x - 14 * s, y + 60 * s, x + 6 * s, y + 92 * s);
  ctx.strokeStyle = '#5a3a1a'; ctx.lineWidth = 2 * s; ctx.stroke();
  const bowYs = [48, 70, 92].slice(0, bows);
  for (const by of bowYs) {
    const bx = x + (by === 70 ? -8 : 2) * s;
    poly(ctx, [[bx - 7 * s, by * s + y - 26 * s + 26 * s], [bx + 7 * s, by * s + y], [bx, by * s + y + 7 * s]], '#7e57c2');
  }
}
export function drawRabbit(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, -12, 16, 12, '#e8e0d0'); // body
  circle(ctx, 14, -24, 10, '#e8e0d0');     // head
  ellipse(ctx, 10, -42, 3.5, 11, '#e8e0d0', -0.15); // ear
  ellipse(ctx, 18, -42, 3.5, 11, '#e8e0d0', 0.15);
  ellipse(ctx, 10, -42, 1.8, 8, '#f8bbd0', -0.15);
  ellipse(ctx, 18, -42, 1.8, 8, '#f8bbd0', 0.15);
  circle(ctx, 17, -26, 1.6, '#1c1440'); // eye
  circle(ctx, 23, -22, 2.2, '#ff9fb0'); // nose
  ctx.restore();
}
