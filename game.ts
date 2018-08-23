import { vec2 } from 'gl-matrix';
import { hexToCart, cartToHex, hexVerts } from './hex';
import * as colors from './colors';
import { Level, CellType } from './level';

class Game {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  scale: number;

  level: Level;

  mouseHex: vec2 = vec2.create();

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;

    this.draw = this.draw.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onPlayButtonClick = this.onPlayButtonClick.bind(this);
  }

  start() {
    document.addEventListener('mousemove', this.onMouseMove);

    document
      .getElementById('play-button')
      .addEventListener('click', this.onPlayButtonClick);

    this.loadLevel(0);

    this.draw();
  }

  draw() {
    requestAnimationFrame(this.draw);
    const ctx = this.ctx;

    this.checkResize();

    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, this.width, this.height);

    if (typeof this.level !== 'undefined') {
      ctx.save();
      ctx.translate(this.width / 2, this.height / 2);

      for (let y = -15; y < 15; y++) {
        for (let x = -15; x < 15; x++) {
          const v = vec2.fromValues(x, y);
          this.drawCell(
            v,
            this.level.getCell(x, y),
            vec2.equals(v, this.mouseHex)
          );
        }
      }

      ctx.restore();
    }
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

  onPlayButtonClick(ev: MouseEvent) {
    const mainMenu = document.querySelector<HTMLElement>('.main-menu');
    mainMenu.style.setProperty('opacity', '0');
    const mainGui = document.querySelector<HTMLElement>('.main-gui');
    mainGui.style.setProperty('opacity', '1');
  }

  async loadLevel(index: number) {
    this.level = await Level.load(index);
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

  drawCell(v: vec2, type: CellType, highlighted: boolean) {
    const ctx = this.ctx;
    ctx.save();
    this.translateHex(v);

    switch (type) {
      case CellType.Empty:
        ctx.fillStyle = colors.empty;
        break;
      case CellType.Vertex:
        ctx.fillStyle = colors.vertex;
        break;
      case CellType.Edge:
        ctx.fillStyle = colors.edge;
        break;
    }

    ctx.beginPath();
    for (const vert of hexVerts) {
      ctx.lineTo(vert[0] * this.scale * 0.9, vert[1] * this.scale * 0.9);
    }
    ctx.closePath();
    ctx.fill();

    if (highlighted) {
      ctx.strokeStyle = colors.highlighted;
      ctx.lineWidth = this.scale / 10;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      for (const vert of hexVerts) {
        ctx.lineTo(vert[0] * this.scale, vert[1] * this.scale);
      }
      ctx.closePath();
      ctx.stroke();
    }

    ctx.restore();
  }
}

export default Game;
