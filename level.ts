import { fetchImage } from './fetching';

export enum CellType {
  Empty,
  Vertex,
  Edge
}

export class Level {
  width: number;
  height: number;
  data: CellType[];

  constructor(width: number, height: number, data: CellType[] = []) {
    this.width = width;
    this.height = height;
    this.data = data;
    console.log(data);
  }

  static async load(index: number) {
    const img = await fetchImage(`assets/levels/level${index}.png`);

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, img.width, img.height).data;

    const data = Array(img.width * img.height).fill(CellType.Empty);
    for (let i = 0; i < data.length; i++) {
      if (imgData[4 * i + 3] === 0) {
        continue;
      }
      if (data[4 * i] === 255) {
        data[i] = CellType.Vertex;
        continue;
      }
      if (data[4 * i + 1] === 255) {
        data[i] = CellType.Edge;
        continue;
      }
    }

    return new Level(img.width, img.height, data);
  }
}
