export async function shrinkPhoto(file: File): Promise<string> {
  let max = 840;
  let quality = 0.68;
  let url = await render(file, max, quality);
  while (url.length > 160_000 && max > 480) {
    max -= 120;
    quality = Math.max(0.42, quality - 0.08);
    url = await render(file, max, quality);
  }
  return url;
}

async function render(file: File, max: number, quality: number): Promise<string> {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not read that photo.");
    ctx.drawImage(bitmap, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    bitmap.close();
  }
}
