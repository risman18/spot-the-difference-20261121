// scenes.js — the three original scenes. Each scene paints one 580x560 picture
// and hides exactly 7 differences between its left and right versions.
// A difference is { x, y, r, label }: the click target and the name shown on a find.
import {
  circle, ellipse, rect, roundRect, poly, line, star, skyGradient,
  drawCloud, drawBird, drawButterfly, drawCat, drawLantern, drawApple,
  drawFlower, drawTree, drawBoat, drawLighthouse, drawKite, drawRabbit,
} from './art.js';

const W = 580, H = 560;

function stars(ctx, list) { for (const [x, y, r] of list) star(ctx, x, y, r, '#fff8d0'); }
function cobbles(ctx) {
  rect(ctx, 0, 470, W, 90, '#3d3355');
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 2;
  for (let row = 0; row < 3; row++) {
    const y = 486 + row * 26;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    for (let x = (row % 2) * 30; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 26); ctx.stroke(); }
  }
}
function lanternString(ctx, thirdColor) {
  ctx.beginPath(); ctx.moveTo(0, 108);
  ctx.quadraticCurveTo(W / 2, 150, W, 108);
  ctx.strokeStyle = '#1c1440'; ctx.lineWidth = 3; ctx.stroke();
  const spots = [[70, 122], [160, 130], [250, 134], [340, 130], [430, 122], [510, 114]];
  const colors = ['#ff5a5a', '#ff9f1c', thirdColor, '#4fc3f7', '#ff5a5a', '#ffd166'];
  spots.forEach(([x, y], i) => {
    line(ctx, x, y - 22, x, y - 8, '#1c1440', 2);
    drawLantern(ctx, x, y + 8, 15, colors[i]);
  });
}
function fruitStall(ctx, appleCount) {
  // striped awning
  for (let i = 0; i < 6; i++) rect(ctx, 196 + i * 24, 296, 24, 26, i % 2 ? '#f5f0e6' : '#e63946');
  rect(ctx, 196, 322, 144, 6, '#7a4a12');
  line(ctx, 200, 328, 196, 380, '#7a4a12', 4); line(ctx, 336, 328, 340, 380, '#7a4a12', 4);
  rect(ctx, 196, 380, 144, 14, '#8d5a2b'); // counter
  rect(ctx, 200, 394, 8, 60, '#5a3a1a'); rect(ctx, 328, 394, 8, 60, '#5a3a1a');
  // crates of apples on the counter
  const spots = [[220, 368], [248, 368], [276, 368], [304, 368], [322, 368]];
  spots.slice(0, appleCount).forEach(([x, y]) => drawApple(ctx, x, y, 10));
  rect(ctx, 210, 402, 116, 26, '#c68b4e'); // basket front
  line(ctx, 210, 412, 326, 412, '#8d5a2b', 2);
}
function flowerStall(ctx) {
  rect(ctx, 420, 400, 130, 12, '#8d5a2b');
  rect(ctx, 426, 412, 8, 52, '#5a3a1a'); rect(ctx, 536, 412, 8, 52, '#5a3a1a');
  const pots = [[440, 392, '#e63946', '#ff8fa3'], [480, 392, '#ffd166', '#7e57c2'], [520, 392, '#4fc3f7', '#ff5a5a']];
  for (const [x, y, pot, petal] of pots) {
    poly(ctx, [[x - 14, y], [x + 14, y], [x + 10, y + 16], [x - 10, y + 16]], pot);
    drawFlower(ctx, x, y - 12, 1, petal);
    line(ctx, x, y - 6, x, y, '#2f7d32', 3);
  }
}

function paintLanternLane(ctx, side) {
  const left = side === 'left';
  skyGradient(ctx, W, H, '#241645', '#ff9a5a');
  stars(ctx, [[40, 40, 4], [200, 30, 3], [330, 55, 4], [520, 40, 3], [430, 90, 2.5], [150, 70, 2.5], [540, 130, 3]]);
  // moon — difference 1: full moon vs crescent
  circle(ctx, 90, 70, 34, '#fff3c4');
  circle(ctx, 78, 62, 30, '#ffe9a8');
  if (!left) circle(ctx, 104, 60, 30, '#3a2a63'); // crescent shadow in sky colour
  // rooftops and buildings
  rect(ctx, 0, 190, 150, 280, '#2c2140');
  rect(ctx, 0, 190, 150, 10, '#1c1440');
  rect(ctx, 430, 170, 150, 300, '#33244d');
  rect(ctx, 430, 170, 150, 10, '#1c1440');
  // window — difference 5: lit with a cat silhouette vs dark
  if (left) {
    rect(ctx, 42, 232, 62, 84, '#ffd166');
    rect(ctx, 42, 232, 62, 84, 'rgba(255,180,60,0.35)');
    drawCat(ctx, 72, 316, 0.55, '#241b45');
  } else {
    rect(ctx, 42, 232, 62, 84, '#17102e');
  }
  rect(ctx, 42, 232, 62, 84, 'rgba(0,0,0,0)');
  ctx.strokeStyle = '#1c1440'; ctx.lineWidth = 4; ctx.strokeRect(42, 232, 62, 84);
  line(ctx, 73, 232, 73, 316, '#1c1440', 4); line(ctx, 42, 274, 104, 274, '#1c1440', 4);
  // door on the right building
  roundRect(ctx, 486, 360, 56, 110, 8, '#4a2f5e');
  circle(ctx, 534, 420, 4, '#ffd166');
  // lantern string across the sky — difference 3: middle lantern red vs teal
  lanternString(ctx, left ? '#ff5a5a' : '#2ec4b6');
  // bird on the wire — difference 6
  if (left) drawBird(ctx, 300, 92, 1.1);
  // stalls
  fruitStall(ctx, left ? 5 : 4); // difference 4: five apples vs four
  flowerStall(ctx);
  // barrel with a cat — difference 2
  ellipse(ctx, 165, 452, 34, 10, '#5a3a1a');
  rect(ctx, 136, 420, 58, 36, '#8d5a2b');
  line(ctx, 136, 432, 194, 432, '#5a3a1a', 3); line(ctx, 136, 444, 194, 444, '#5a3a1a', 3);
  if (left) drawCat(ctx, 165, 420, 0.9, '#2b2b2b');
  // street and puddle — difference 7: star glinting in the puddle
  cobbles(ctx);
  ellipse(ctx, 380, 512, 62, 14, 'rgba(120, 160, 255, 0.4)');
  ellipse(ctx, 380, 512, 62, 14, 'rgba(255,255,255,0.08)');
  if (left) star(ctx, 380, 508, 7, '#fff8d0');
  ellipse(ctx, 90, 528, 46, 10, 'rgba(120, 160, 255, 0.25)');
}

function waves(ctx, y0, y1, color) {
  rect(ctx, 0, y0, W, y1 - y0, color);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2;
  for (let y = y0 + 26; y < y1; y += 34) {
    ctx.beginPath();
    for (let x = 0; x <= W; x += 20) ctx.quadraticCurveTo(x + 10, y - 7, x + 20, y);
    ctx.stroke();
  }
}
function paintHarbourDawn(ctx, side) {
  const left = side === 'left';
  skyGradient(ctx, W, H, '#ffb74d', '#ffe0b2');
  drawCloud(ctx, 120, 70, 1.1, '#fff8e1');
  drawCloud(ctx, 300, 48, 0.8, '#fff8e1');
  // sun — difference 1: clear sun vs a cloud drifting over it
  circle(ctx, 470, 80, 36, '#ffca28');
  circle(ctx, 470, 80, 28, '#ffee58');
  if (!left) drawCloud(ctx, 462, 74, 0.85, '#fff8e1');
  // sea
  waves(ctx, 300, H, '#1565c0');
  rect(ctx, 0, 300, W, 4, 'rgba(255,255,255,0.5)');
  // rocks and lighthouse — difference 2: beam on vs off
  poly(ctx, [[20, 400], [150, 400], [120, 356], [50, 356]], '#5d4037');
  drawLighthouse(ctx, 88, 372, 1, left);
  // pier and fisherman
  rect(ctx, 300, 372, 280, 12, '#8d5a2b');
  for (let x = 312; x < 580; x += 26) line(ctx, x, 372, x, 384, '#5a3a1a', 2);
  rect(ctx, 330, 384, 10, 44, '#5a3a1a'); rect(ctx, 540, 384, 10, 44, '#5a3a1a');
  // fisherman: legs, body, rod, hat — difference 5: hat on vs off
  line(ctx, 428, 372, 424, 338, '#37474f', 7); line(ctx, 436, 372, 440, 338, '#37474f', 7);
  rect(ctx, 420, 306, 26, 34, '#e63946');
  circle(ctx, 433, 292, 11, '#ffcc9e');
  line(ctx, 446, 320, 500, 250, '#5a3a1a', 3); // rod
  line(ctx, 500, 250, 500, 330, 'rgba(255,255,255,0.7)', 1.5); // line
  if (left) { poly(ctx, [[420, 286], [446, 286], [433, 268]], '#ffd166'); rect(ctx, 418, 284, 30, 5, '#ffd166'); }
  // boats — difference 3: main sail red vs blue
  drawBoat(ctx, 300, 448, 1, '#6d4c41', left ? '#e63946' : '#1e88e5');
  drawBoat(ctx, 160, 500, 0.7, '#37474f', '#ffd166');
  // buoy — difference 6: striped red/white vs plain yellow
  ellipse(ctx, 500, 470, 16, 9, left ? '#e63946' : '#ffd166');
  if (left) { rect(ctx, 488, 456, 24, 6, '#f5f0e6'); }
  poly(ctx, [[500, 442], [508, 456], [492, 456]], left ? '#e63946' : '#ffd166');
  // jumping fish — difference 7
  if (left) {
    ctx.beginPath(); ctx.arc(350, 336, 16, Math.PI, 0); ctx.strokeStyle = '#90caf9'; ctx.lineWidth = 3; ctx.stroke();
    ellipse(ctx, 350, 318, 12, 5, '#64b5f6', -0.4);
    poly(ctx, [[340, 316], [332, 310], [338, 322]], '#64b5f6');
  }
  // seagulls — difference 4: three gulls vs two
  drawBird(ctx, 200, 120, 1);
  drawBird(ctx, 260, 100, 0.9);
  if (left) drawBird(ctx, 330, 130, 1);
}

function paintPicnicMeadow(ctx, side) {
  const left = side === 'left';
  skyGradient(ctx, W, H, '#87ceeb', '#e0f7fa');
  drawCloud(ctx, 120, 60, 1, '#ffffff');
  drawCloud(ctx, 300, 90, 0.75, '#ffffff');
  // extra cloud — difference 7
  if (left) drawCloud(ctx, 430, 140, 0.6, '#ffffff');
  // sun with a face — difference 5: smiling vs plain
  circle(ctx, 480, 70, 34, '#ffca28');
  circle(ctx, 480, 70, 26, '#ffee58');
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    line(ctx, 480 + Math.cos(a) * 40, 70 + Math.sin(a) * 40, 480 + Math.cos(a) * 50, 70 + Math.sin(a) * 50, '#ffca28', 3);
  }
  circle(ctx, 470, 66, 3, '#5d4037'); circle(ctx, 490, 66, 3, '#5d4037');
  if (left) { ctx.beginPath(); ctx.arc(480, 74, 10, 0.15 * Math.PI, 0.85 * Math.PI); ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 2.5; ctx.stroke(); }
  // kite — difference 1: three tail bows vs two
  drawKite(ctx, 430, 150, 1, left ? 3 : 2);
  // meadow
  const g = ctx.createLinearGradient(0, 260, 0, H);
  g.addColorStop(0, '#7cb342'); g.addColorStop(1, '#558b2f');
  ctx.fillStyle = g; ctx.fillRect(0, 260, W, H - 260);
  // oak tree with apples — difference 4: four apples vs three
  drawTree(ctx, 110, 520, 1, left
    ? [[66, 372], [150, 300], [96, 420], [140, 380]]
    : [[66, 372], [96, 420], [140, 380]]);
  // wildflowers
  const flowers = [[210, 500, '#ff8fa3'], [250, 530, '#ffd166'], [470, 470, '#e1bee7'], [540, 430, '#ff8fa3'], [40, 470, '#ffd166'], [330, 500, '#ffffff']];
  for (const [x, y, c] of flowers) { line(ctx, x, y, x, y - 12, '#2f7d32', 2); drawFlower(ctx, x, y - 14, 0.8, c); }
  // picnic blanket
  ctx.save(); ctx.translate(300, 440); ctx.rotate(-0.03);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) rect(ctx, -90 + c * 30, -50 + r * 25, 30, 25, (r + c) % 2 ? '#e63946' : '#f5f0e6');
  ctx.restore();
  // basket
  poly(ctx, [[228, 402], [272, 402], [266, 430], [234, 430]], '#a1887f');
  line(ctx, 228, 412, 272, 412, '#6d4c41', 2);
  ctx.beginPath(); ctx.arc(250, 402, 14, Math.PI, 0); ctx.strokeStyle = '#6d4c41'; ctx.lineWidth = 3; ctx.stroke();
  // apple on the blanket — difference 3
  if (left) drawApple(ctx, 340, 440, 9);
  // butterflies — difference 2: three vs two
  drawButterfly(ctx, 200, 300, 1, '#ff8fa3', '#ffd166', 0.4);
  drawButterfly(ctx, 380, 320, 0.9, '#4fc3f7', '#e1bee7', -0.5);
  if (left) drawButterfly(ctx, 480, 380, 1, '#ffd166', '#ff8fa3', 0.2);
  // rabbit in the grass — difference 6
  if (left) drawRabbit(ctx, 500, 500, 1);
}

export const SCENES = [
  {
    id: 'lantern-lane', name: 'Lantern Lane', tagline: 'A night market under paper lanterns',
    timeLimit: 180, paint: paintLanternLane,
    differences: [
      { x: 90, y: 70, r: 40, label: 'the crescent moon' },
      { x: 165, y: 408, r: 46, label: 'the barrel cat' },
      { x: 250, y: 142, r: 26, label: 'the teal lantern' },
      { x: 322, y: 368, r: 22, label: 'the fifth apple' },
      { x: 73, y: 274, r: 48, label: 'the lit window' },
      { x: 300, y: 92, r: 22, label: 'the bird on the wire' },
      { x: 380, y: 508, r: 30, label: 'the star in the puddle' },
    ],
  },
  {
    id: 'harbour-dawn', name: 'Harbour Dawn', tagline: 'Sunrise over the fishing pier',
    timeLimit: 150, paint: paintHarbourDawn,
    differences: [
      { x: 470, y: 80, r: 42, label: 'the cloud over the sun' },
      { x: 150, y: 212, r: 58, label: 'the lighthouse beam' },
      { x: 320, y: 400, r: 52, label: 'the blue sail' },
      { x: 330, y: 130, r: 20, label: 'the third seagull' },
      { x: 433, y: 276, r: 22, label: "the fisherman's hat" },
      { x: 500, y: 462, r: 24, label: 'the striped buoy' },
      { x: 350, y: 322, r: 26, label: 'the jumping fish' },
    ],
  },
  {
    id: 'picnic-meadow', name: 'Picnic Meadow', tagline: 'An afternoon under the old oak',
    timeLimit: 120, paint: paintPicnicMeadow,
    differences: [
      { x: 430, y: 216, r: 30, label: 'the third kite bow' },
      { x: 480, y: 380, r: 22, label: 'the third butterfly' },
      { x: 340, y: 440, r: 22, label: 'the blanket apple' },
      { x: 150, y: 300, r: 18, label: 'the fourth tree apple' },
      { x: 480, y: 70, r: 40, label: "the sun's smile" },
      { x: 500, y: 496, r: 30, label: 'the meadow rabbit' },
      { x: 430, y: 140, r: 30, label: 'the little cloud' },
    ],
  },
];
export const PANEL_W = W, PANEL_H = H;
