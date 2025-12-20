export interface ImageExportOptions {
  colors: string[];
  angle: number;
  width: number;
  height: number;
  isAnimated: boolean;
  animationSpeed: number;
}

export interface ImageFormat {
  value: string;
  label: string;
  extension: string;
  mimeType: string;
}

export const imageFormats: ImageFormat[] = [
  { value: "png", label: "PNG", extension: "png", mimeType: "image/png" },
  { value: "jpg", label: "JPG", extension: "jpg", mimeType: "image/jpeg" },
  { value: "webp", label: "WebP", extension: "webp", mimeType: "image/webp" },
  { value: "svg", label: "SVG", extension: "svg", mimeType: "image/svg+xml" },
];

export const imageExportUtils = {
  // Create a canvas with gradient
  createGradientCanvas: (options: ImageExportOptions): HTMLCanvasElement => {
    const { colors, angle, width, height } = options;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvas context not available");
    }

    canvas.width = width;
    canvas.height = height;

    // Convert angle to radians
    const angleRad = (angle * Math.PI) / 180;

    // Calculate gradient direction
    const x1 = (Math.cos(angleRad) * width) / 2 + width / 2;
    const y1 = (Math.sin(angleRad) * height) / 2 + height / 2;
    const x2 = width - x1;
    const y2 = height - y1;

    // Create linear gradient
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);

    // Add color stops
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });

    // Fill canvas with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    return canvas;
  },

  // Generate SVG string
  generateSVG: (options: ImageExportOptions): string => {
    const { colors, angle, width, height, isAnimated, animationSpeed } =
      options;

    const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

    const colorStops = colors
      .map((color, index) => {
        const offset = (index / (colors.length - 1)) * 100;
        return `<stop offset="${offset}%" stop-color="${color}" />`;
      })
      .join("\n    ");

    const animationElements = isAnimated
      ? `
    <animateTransform
      attributeName="gradientTransform"
      type="rotate"
      values="0 ${width / 2} ${height / 2};360 ${width / 2} ${height / 2};0 ${width / 2} ${height / 2}"
      dur="${4 / animationSpeed}s"
      repeatCount="indefinite"
    />`
      : "";

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(${angle} ${width / 2} ${height / 2})">
      ${colorStops}${animationElements}
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#${gradientId})" />
</svg>`;
  },

  // Convert canvas to blob
  canvasToBlob: (
    canvas: HTMLCanvasElement,
    format: string,
    quality: number = 0.9,
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const mimeType =
        imageFormats.find((f) => f.value === format)?.mimeType || "image/png";

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob"));
          }
        },
        mimeType,
        quality,
      );
    });
  },

  // Download image
  downloadImage: async (
    options: ImageExportOptions,
    format: string,
    filename?: string,
  ): Promise<void> => {
    const formatConfig = imageFormats.find((f) => f.value === format);
    if (!formatConfig) {
      throw new Error("Unsupported format");
    }

    const finalFilename =
      filename || `gradient-${Date.now()}.${formatConfig.extension}`;

    if (format === "svg") {
      // Handle SVG download
      const svgContent = imageExportUtils.generateSVG(options);
      const blob = new Blob([svgContent], { type: formatConfig.mimeType });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // Handle canvas-based formats (PNG, JPG, WebP)
      const canvas = imageExportUtils.createGradientCanvas(options);
      const blob = await imageExportUtils.canvasToBlob(canvas, format);

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  },

  // Get image as data URL for preview
  getImageDataURL: (
    options: ImageExportOptions,
    format: string = "png",
  ): string => {
    if (format === "svg") {
      const svgContent = imageExportUtils.generateSVG(options);
      return `data:image/svg+xml;base64,${btoa(svgContent)}`;
    } else {
      const canvas = imageExportUtils.createGradientCanvas(options);
      const formatConfig = imageFormats.find((f) => f.value === format);
      return canvas.toDataURL(formatConfig?.mimeType || "image/png");
    }
  },

  // Predefined image sizes
  imageSizes: [
    { label: "Square (512x512)", width: 512, height: 512 },
    { label: "HD (1920x1080)", width: 1920, height: 1080 },
    { label: "4K (3840x2160)", width: 3840, height: 2160 },
    { label: "Mobile (375x667)", width: 375, height: 667 },
    { label: "Tablet (768x1024)", width: 768, height: 1024 },
    { label: "Desktop (1440x900)", width: 1440, height: 900 },
    { label: "Custom", width: 800, height: 600 },
  ],
};
