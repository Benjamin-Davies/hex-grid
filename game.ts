import { vec2 } from 'gl-matrix';
import { hexToCart, cartToHex, hexVerts } from './hex';
import * as colors from './colors';

class Game {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  scale: number;

  mouseHex: vec2 = vec2.create();

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;

    this.draw = this.draw.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  start() {
    document.addEventListener('mousemove', this.onMouseMove);

    this.draw();
  }

  draw() {
    requestAnimationFrame(this.draw);
    const ctx = this.ctx;

    this.checkResize();

    ctx.clearRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.translate(this.width / 2, this.height / 2);

    for (let y = -15; y < 15; y++) {
      for (let x = -15; x < 15; x++) {
        const v = vec2.fromValues(x, y);
        this.drawCell(
          v,
          vec2.equals(v, this.mouseHex) ? colors.vertex : colors.background
        );
      }
    }

    ctx.restore();
  }

  onMouseMove(ev: MouseEvent) {
    const canvas = this.ctx.canvas;
    const v = vec2.fromValues(
      (ev.clientX - canvas.offsetLeft - this.width / 2) / this.scale,
      (ev.clientY - canvas.offsetTop - this.height / 2) / this.scale
    );
    cartToHex(v, v);
    vec2.round(v, v);
    this.mouseHex = v;
  }

  checkResize() {
    const canvas = this.ctx.canvas;
    if (
      this.width !== canvas.clientWidth ||
      this.height !== canvas.clientHeight
    ) {
      this.width = canvas.width = canvas.clientWidth;
      this.height = canvas.height = canvas.clientHeight;
      this.scale = Math.min(this.width, this.height) / 10;
    }
  }

  translateHex(v: vec2) {
    const temp = vec2.create();
    vec2.scale(temp, v, this.scale);
    hexToCart(temp, temp);

    this.ctx.translate(temp[0], temp[1]);
  }

  drawCell(v: vec2, type: string | number) {
    const ctx = this.ctx;
    ctx.save();
    this.translateHex(v);

    if (typeof type === 'string') {
      ctx.fillStyle = type;
      ctx.strokeStyle = colors.outline;
      ctx.lineWidth = this.scale / 10;
      ctx.beginPath();

      for (const vert of hexVerts) {
        ctx.lineTo(vert[0] * this.scale, vert[1] * this.scale);
      }

      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }
}

export default Game;
