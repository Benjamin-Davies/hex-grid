import Game from './game';

const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
if (!ctx) {
  throw new Error('Could not create drawing context');
}

const game = new Game(ctx);
game.start();
