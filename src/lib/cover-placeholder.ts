import sharp from 'sharp';
import type { ImageMetadata } from 'astro';

/** Local collection images carry their source path during Astro rendering. */
export async function coverPlaceholder(image: ImageMetadata | string): Promise<string> {
  let source: string | Buffer;
  if (typeof image === 'string') {
    const response = await fetch(image);
    if (!response.ok) throw new Error(`Cover preview request failed: ${response.status}`);
    source = Buffer.from(await response.arrayBuffer());
  } else {
    // Astro's local image metadata retains this non-enumerable build-time path.
    const path = (image as ImageMetadata & { fsPath?: string }).fsPath;
    if (!path) throw new Error(`Cover image has no local source: ${image.src}`);
    source = path;
  }
  const preview = await sharp(source)
    .rotate()
    .resize(32, 18, { fit: 'cover', position: 'centre' })
    .blur(1)
    .webp({ quality: 35 })
    .toBuffer();
  return `data:image/webp;base64,${preview.toString('base64')}`;
}
