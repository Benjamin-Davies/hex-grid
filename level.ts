import { fetchImage } from './fetching';

class Level {
  width: number;
  height: number;

  static async load(index: number) {
    const img = await fetchImage(`assets/levels/level${index}.png`);

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);

    return new Level();
  }
}

export default Level;
