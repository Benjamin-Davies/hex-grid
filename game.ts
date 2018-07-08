import { vec2 } from 'gl-matrix';
import { hexToCart, cartToHex } from './hex';

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

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = 'blue';
    for (let y = 0; y < 30; y++) {
      for (let x = -10; x < 20; x++) {
        const v = vec2.fromValues(x, y);
        ctx.save();
        this.translateHex(v);
        if (vec2.equals(v, this.mouseHex)) {
          ctx.fillStyle = 'limegreen';
        }
        ctx.beginPath();
        ctx.arc(0, 0, this.scale / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  checkResize() {
    const canvas = this.ctx.canvas;
    if (this.width !== canvas.clientWidth) {
      this.width = canvas.width = canvas.clientWidth;
      this.height = canvas.height = this.width * 0.5;
      this.scale = this.width / 20;
    }
  }

  translateHex(v: vec2) {
    const temp = vec2.create();
    vec2.scale(temp, v, this.scale);
    hexToCart(temp, temp);

    this.ctx.translate(temp[0], temp[1]);
  }
}

export default Game;
