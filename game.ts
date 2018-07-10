import { vec2 } from 'gl-matrix';
import { hexToCart, cartToHex, hexVerts } from './hex';

class Game {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  scale: number;

  mouseHex: vec2 = vec2.create();

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;

    this.draw = this.draw.bind(this);
  }

  start() {
    const canvas = this.ctx.canvas;
    canvas.addEventListener('mousemove', ev => {
      const v = vec2.fromValues(
        ev.clientX - canvas.offsetLeft,
        ev.clientY - canvas.offsetTop
      );
      vec2.scale(v, v, 1 / this.scale);
      cartToHex(v, v);
      vec2.round(v, v);
      this.mouseHex = v;
    });

    this.draw();
  }

  draw() {
    requestAnimationFrame(this.draw);
    const ctx = this.ctx;

    this.checkResize();

    ctx.clearRect(0, 0, this.width, this.height);

    for (let y = 0; y < 30; y++) {
      for (let x = -10; x < 20; x++) {
        const v = vec2.fromValues(x, y);
        this.drawCell(v, vec2.equals(v, this.mouseHex) ? 'limegreen' : 'blue');
      }
    }
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
      ctx.strokeStyle = 'white';
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
