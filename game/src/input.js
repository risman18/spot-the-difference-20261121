// input.js — mouse clicks on either panel and a keyboard crosshair.
// The crosshair is a ring that follows the arrow keys; Enter/Space checks the
// spot under it, so the whole game is playable without a mouse.
export function panelPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
  return { x: (event.clientX - rect.left) * scaleX, y: (event.clientY - rect.top) * scaleY };
}

export class KeyboardCursor {
  constructor(onCheck, onMove) {
    this.x = 290; this.y = 280; this.visible = false; this.panel = 'A';
    this.onCheck = onCheck; this.onMove = onMove;
    this.step = 24;
  }
  attach() {
    window.addEventListener('keydown', (e) => this.handle(e));
  }
  handle(e) {
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', ' '];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    this.visible = true;
    if (e.key === 'ArrowLeft') this.x = Math.max(12, this.x - this.step);
    if (e.key === 'ArrowRight') this.x = Math.min(568, this.x + this.step);
    if (e.key === 'ArrowUp') this.y = Math.max(12, this.y - this.step);
    if (e.key === 'ArrowDown') this.y = Math.min(548, this.y + this.step);
    if (e.key === 'Enter' || e.key === ' ') this.onCheck(this.panel, this.x, this.y);
    else this.onMove(this.panel, this.x, this.y);
  }
  reset() { this.x = 290; this.y = 280; this.visible = false; }
}
