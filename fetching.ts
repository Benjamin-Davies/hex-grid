export function fetchImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;

    img.onerror = ev => {
      reject(ev.error);
    };
    img.onload = () => {
      resolve(img);
    };
  });
}
