export const colorMath = {
  hexToRGB: (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  },

  rgbToHSL: (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
          break;
        case g:
          h = ((b - r) / d + 2) * 60;
          break;
        case b:
          h = ((r - g) / d + 4) * 60;
          break;
      }
    }
    return {
      h: Math.round(h),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  },

  // Extract unique color names from gradients data
  getUniqueColors: (gradients: any[]) => {
    const colorSet = new Set<string>();

    gradients.forEach((gradient) => {
      if (gradient.colorsname && Array.isArray(gradient.colorsname)) {
        gradient.colorsname.forEach((color: string) => {
          if (color && typeof color === "string") {
            colorSet.add(color.toLowerCase().trim());
          }
        });
      }
    });

    return Array.from(colorSet).sort();
  },

  // Get basic color categories for professional filtering
  getColorCategories: (colors: string[]) => {
    const categories: { [key: string]: string[] } = {
      "🔴 Red": [],
      "🩷 Pink": [],
      "🟠 Orange": [],
      "🟡 Yellow": [],
      "🟢 Green": [],
      "🔵 Blue": [],
      "🟣 Purple": [],
      "🟤 Brown": [],
      "⚫ Black": [],
      "⚪ White": [],
      "🔘 Gray": [],
      "🎨 Other": [],
    };

    colors.forEach((color) => {
      const lowerColor = color.toLowerCase();

      if (lowerColor.includes("red")) {
        categories["🔴 Red"].push(color);
      } else if (lowerColor.includes("pink")) {
        categories["🩷 Pink"].push(color);
      } else if (
        lowerColor.includes("orange") ||
        lowerColor.includes("peach")
      ) {
        categories["🟠 Orange"].push(color);
      } else if (lowerColor.includes("yellow")) {
        categories["🟡 Yellow"].push(color);
      } else if (
        lowerColor.includes("green") ||
        lowerColor.includes("olive") ||
        lowerColor.includes("teal") ||
        lowerColor.includes("cyan")
      ) {
        categories["🟢 Green"].push(color);
      } else if (lowerColor.includes("blue") || lowerColor.includes("indigo")) {
        categories["🔵 Blue"].push(color);
      } else if (
        lowerColor.includes("purple") ||
        lowerColor.includes("violet") ||
        lowerColor.includes("magenta")
      ) {
        categories["🟣 Purple"].push(color);
      } else if (lowerColor.includes("brown") || lowerColor.includes("beige")) {
        categories["🟤 Brown"].push(color);
      } else if (lowerColor.includes("black")) {
        categories["⚫ Black"].push(color);
      } else if (lowerColor.includes("white")) {
        categories["⚪ White"].push(color);
      } else if (lowerColor.includes("gray") || lowerColor.includes("grey")) {
        categories["🔘 Gray"].push(color);
      } else {
        categories["🎨 Other"].push(color);
      }
    });

    // Remove empty categories
    Object.keys(categories).forEach((key) => {
      if (categories[key].length === 0) {
        delete categories[key];
      }
    });

    return categories;
  },

  // Get basic colors only (most common ones for professional filtering)
  getBasicColors: (gradients: any[]) => {
    const allColors = colorMath.getUniqueColors(gradients);
    const basicColorKeywords = [
      "red",
      "pink",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple",
      "brown",
      "black",
      "white",
      "gray",
      "grey",
      "teal",
      "cyan",
    ];

    return allColors.filter((color) => {
      const lowerColor = color.toLowerCase();
      return basicColorKeywords.some((keyword) => lowerColor.includes(keyword));
    });
  },

  // Get simplified color categories with only basic colors
  getBasicColorCategories: (colors: string[]) => {
    const basicColors = colors.filter((color) => {
      const lowerColor = color.toLowerCase();
      const basicKeywords = [
        "red",
        "pink",
        "orange",
        "yellow",
        "green",
        "blue",
        "purple",
        "brown",
        "black",
        "white",
        "gray",
        "grey",
        "teal",
        "cyan",
      ];
      return basicKeywords.some((keyword) => lowerColor.includes(keyword));
    });

    return colorMath.getColorCategories(basicColors);
  },

  // Get simplified color names (just basic colors like "Red", "Blue", etc.)
  getSimplifiedColors: (gradients: any[]) => {
    const colorMap = new Set<string>();
    const standardColors = [
      "Red",
      "Pink",
      "Orange",
      "Yellow",
      "Green",
      "Blue",
      "Purple",
      "Brown",
      "Black",
      "White",
      "Gray",
      "Teal",
      "Cyan",
    ];

    if (gradients && gradients.length > 0) {
      gradients.forEach((gradient) => {
        if (gradient.colorsname && Array.isArray(gradient.colorsname)) {
          gradient.colorsname.forEach((color: string) => {
            const lowerColor = (color || "").toLowerCase();

            // Map complex color names to simple ones
            if (lowerColor.includes("red")) colorMap.add("Red");
            else if (lowerColor.includes("pink")) colorMap.add("Pink");
            else if (lowerColor.includes("orange")) colorMap.add("Orange");
            else if (lowerColor.includes("yellow")) colorMap.add("Yellow");
            else if (lowerColor.includes("green")) colorMap.add("Green");
            else if (lowerColor.includes("blue")) colorMap.add("Blue");
            else if (
              lowerColor.includes("purple") ||
              lowerColor.includes("violet")
            )
              colorMap.add("Purple");
            else if (
              lowerColor.includes("brown") ||
              lowerColor.includes("beige")
            )
              colorMap.add("Brown");
            else if (lowerColor.includes("black")) colorMap.add("Black");
            else if (lowerColor.includes("white")) colorMap.add("White");
            else if (lowerColor.includes("gray") || lowerColor.includes("grey"))
              colorMap.add("Gray");
            else if (lowerColor.includes("teal")) colorMap.add("Teal");
            else if (lowerColor.includes("cyan")) colorMap.add("Cyan");
          });
        }
      });
    }

    // If no colors extracted, or to ensure full filter options, return standard list
    return colorMap.size > 0 ? Array.from(colorMap).sort() : standardColors;
  },

  // Get simplified color categories for filtering
  getSimplifiedColorCategories: (colors: string[]) => {
    const categories: { [key: string]: string[] } = {
      "🔴 Red": [],
      "🩷 Pink": [],
      "🟠 Orange": [],
      "🟡 Yellow": [],
      "🟢 Green": [],
      "🔵 Blue": [],
      "🟣 Purple": [],
      "🟤 Brown": [],
      "⚫ Black": [],
      "⚪ White": [],
      "🔘 Gray": [],
      "🩵 Teal": [],
      "🩵 Cyan": [],
    };

    colors.forEach((color) => {
      switch (color) {
        case "Red":
          categories["🔴 Red"].push(color);
          break;
        case "Pink":
          categories["🩷 Pink"].push(color);
          break;
        case "Orange":
          categories["🟠 Orange"].push(color);
          break;
        case "Yellow":
          categories["🟡 Yellow"].push(color);
          break;
        case "Green":
          categories["🟢 Green"].push(color);
          break;
        case "Blue":
          categories["🔵 Blue"].push(color);
          break;
        case "Purple":
          categories["🟣 Purple"].push(color);
          break;
        case "Brown":
          categories["🟤 Brown"].push(color);
          break;
        case "Black":
          categories["⚫ Black"].push(color);
          break;
        case "White":
          categories["⚪ White"].push(color);
          break;
        case "Gray":
          categories["🔘 Gray"].push(color);
          break;
        case "Teal":
          categories["🩵 Teal"].push(color);
          break;
        case "Cyan":
          categories["🩵 Cyan"].push(color);
          break;
      }
    });

    // Remove empty categories
    Object.keys(categories).forEach((key) => {
      if (categories[key].length === 0) {
        delete categories[key];
      }
    });

    return categories;
  },

  // Calculate brightness of a single color (0-255)
  getColorBrightness: (hex: string): number => {
    const { r, g, b } = colorMath.hexToRGB(hex);
    // Use standard luminance formula
    return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  },

  // Calculate average brightness of a gradient (0-255)
  getGradientBrightness: (colors: string[]): number => {
    if (!colors || colors.length === 0) return 0;
    const brightnesses = colors.map((color) =>
      colorMath.getColorBrightness(color),
    );
    return (
      brightnesses.reduce((sum, brightness) => sum + brightness, 0) /
      brightnesses.length
    );
  },

  // Calculate hue of a single color (0-360)
  getColorHue: (hex: string): number => {
    const { r, g, b } = colorMath.hexToRGB(hex);
    const { h } = colorMath.rgbToHSL(r, g, b);
    return h;
  },

  // Calculate average hue of a gradient (0-360)
  getGradientHue: (colors: string[]): number => {
    if (!colors || colors.length === 0) return 0;
    const hues = colors.map((color) => colorMath.getColorHue(color));
    return hues.reduce((sum, hue) => sum + hue, 0) / hues.length;
  },

  // Sort gradients by various criteria
  sortGradients: (
    gradients: any[],
    sortBy: string,
    favorites: string[] = [],
  ): any[] => {
    const sorted = [...gradients];

    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) =>
          (a.name || "").localeCompare(b.name || ""),
        );

      case "brightness":
        return sorted.sort((a, b) => {
          const brightnessA = colorMath.getGradientBrightness(a.colors || []);
          const brightnessB = colorMath.getGradientBrightness(b.colors || []);
          return brightnessB - brightnessA; // Brightest first
        });

      case "hue":
        return sorted.sort((a, b) => {
          const hueA = colorMath.getGradientHue(a.colors || []);
          const hueB = colorMath.getGradientHue(b.colors || []);
          return hueA - hueB; // Red first (0°), then through spectrum
        });

      case "favorites":
        return sorted.sort((a, b) => {
          const isFavA = favorites.includes(a.name || "");
          const isFavB = favorites.includes(b.name || "");
          if (isFavA && !isFavB) return -1;
          if (!isFavA && isFavB) return 1;
          return (a.name || "").localeCompare(b.name || "");
        });

      default:
        return sorted;
    }
  },

  // Extract color palette from gradient with additional color information
  extractPalette: (colors: string[]) => {
    return colors.map((color, index) => {
      const { r, g, b } = colorMath.hexToRGB(color);
      const { h, s, l } = colorMath.rgbToHSL(r, g, b);
      const brightness = colorMath.getColorBrightness(color);

      return {
        hex: color,
        rgb: `rgb(${r}, ${g}, ${b})`,
        hsl: `hsl(${h}, ${s}%, ${l}%)`,
        hue: h,
        saturation: s,
        lightness: l,
        brightness,
        isLight: brightness > 128,
        isDark: brightness <= 128,
        position: index,
        percentage:
          colors.length > 1
            ? Math.round((index / (colors.length - 1)) * 100)
            : 100,
      };
    });
  },

  // Generate complementary colors from a gradient
  generateComplementaryColors: (colors: string[]): string[] => {
    return colors.map((color) => {
      const { r, g, b } = colorMath.hexToRGB(color);
      const { h, s, l } = colorMath.rgbToHSL(r, g, b);

      // Calculate complementary hue (opposite on color wheel)
      const complementaryHue = (h + 180) % 360;

      // Convert complementary HSL back to RGB
      const complementaryRgb = colorMath.hslToRgb(complementaryHue, s, l);

      const toHex = (n: number) => n.toString(16).padStart(2, "0");
      return `#${toHex(complementaryRgb.r)}${toHex(complementaryRgb.g)}${toHex(complementaryRgb.b)}`;
    });
  },

  // Generate analogous colors (colors next to each other on color wheel)
  generateAnalogousColors: (colors: string[]): string[] => {
    return colors.flatMap((color) => {
      const { r, g, b } = colorMath.hexToRGB(color);
      const { h, s, l } = colorMath.rgbToHSL(r, g, b);

      // Generate analogous colors (±30 degrees)
      const analogous1 = (h + 30) % 360;
      const analogous2 = (h - 30 + 360) % 360;

      // This is a simplified conversion - in a real app you'd want proper HSL to RGB conversion
      const toHex = (hue: number) => {
        const rgb = colorMath.hslToRgb(hue, s, l);
        return `#${rgb.r.toString(16).padStart(2, "0")}${rgb.g.toString(16).padStart(2, "0")}${rgb.b.toString(16).padStart(2, "0")}`;
      };

      return [toHex(analogous1), toHex(analogous2)];
    });
  },

  // Convert HSL to RGB (helper function)
  hslToRgb: (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  },
};
