import sharp from "sharp";

export const ImageOptimisation = async (file: Express.Multer.File, maxHeight: number, maxWidth: number) => {
  const metadata = await sharp(file.buffer).metadata();

  // Preserve original format
  const originalFormat = metadata.format;
  if (!originalFormat) {
    throw new Error("Could not determine image format");
  }

  // Define target sizes (max width & height in pixels)
  // Resize while maintaining aspect ratio
  const optimizedBuffer = await sharp(file.buffer)
    .resize({
      width: metadata.width && metadata.width > maxWidth ? maxWidth : undefined,
      height: metadata.height && metadata.height > maxHeight ? maxHeight : undefined,
      fit: "inside", // Ensures the image fits within the given dimensions while maintaining aspect ratio
    })
    .toFormat(originalFormat as keyof sharp.FormatEnum) // Keep original format
    .toBuffer();

  return {
    ...file,
    buffer: optimizedBuffer,
  };
};
