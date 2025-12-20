import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Download,
  ChevronRight,
  Check,
  Sparkles,
  Eye,
  Code2,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Card, CardContent } from "@/shared/ui/card";

interface BrandKitBuilderProps {
  gradients: Array<{
    name: string;
    colors: string[];
  }>;
  onClose: () => void;
}

interface ColorPalette {
  primary: string[];
  secondary: string[];
  accent: string[];
  neutral: string[];
  surface: string[];
}

// Color utility functions
const hexToHsl = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

const hslToHex = (h: number, s: number, l: number) => {
  h /= 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 1 / 6) {
    r = c;
    g = x;
    b = 0;
  } else if (1 / 6 <= h && h < 2 / 6) {
    r = x;
    g = c;
    b = 0;
  } else if (2 / 6 <= h && h < 3 / 6) {
    r = 0;
    g = c;
    b = x;
  } else if (3 / 6 <= h && h < 4 / 6) {
    r = 0;
    g = x;
    b = c;
  } else if (4 / 6 <= h && h < 5 / 6) {
    r = x;
    g = 0;
    b = c;
  } else if (5 / 6 <= h && h <= 1) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const generateColorVariations = (baseColor: string) => {
  const [h, s, l] = hexToHsl(baseColor);
  return {
    50: hslToHex(h, Math.max(10, s - 20), Math.min(95, l + 40)),
    100: hslToHex(h, Math.max(15, s - 15), Math.min(90, l + 30)),
    200: hslToHex(h, Math.max(20, s - 10), Math.min(85, l + 20)),
    300: hslToHex(h, Math.max(25, s - 5), Math.min(80, l + 10)),
    400: hslToHex(h, s, Math.min(75, l + 5)),
    500: baseColor,
    600: hslToHex(h, Math.min(100, s + 5), Math.max(25, l - 5)),
    700: hslToHex(h, Math.min(100, s + 10), Math.max(20, l - 10)),
    800: hslToHex(h, Math.min(100, s + 15), Math.max(15, l - 20)),
    900: hslToHex(h, Math.min(100, s + 20), Math.max(10, l - 30)),
    950: hslToHex(h, Math.min(100, s + 25), Math.max(5, l - 40)),
  };
};

export function BrandKitBuilder({ gradients, onClose }: BrandKitBuilderProps) {
  const [brandName, setBrandName] = useState("My Brand");
  const [selectedGradients, setSelectedGradients] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      id: 1,
      name: "Select Gradients",
      description: "Choose gradients for your brand",
    },
    {
      id: 2,
      name: "Generate Palette",
      description: "AI-powered color extraction",
    },
    { id: 3, name: "Export & Use", description: "Download your brand kit" },
  ];

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  // Extract unique colors from selected gradients
  const extractedColors = useMemo(() => {
    const colors = new Set<string>();
    selectedGradients.forEach((gradientName) => {
      const gradient = gradients.find((g) => g.name === gradientName);
      if (gradient) {
        gradient.colors.forEach((color) => {
          if (color.startsWith("#")) {
            colors.add(color);
          }
        });
      }
    });
    return Array.from(colors);
  }, [selectedGradients, gradients]);

  // Generate intelligent color palette
  const colorPalette = useMemo((): ColorPalette => {
    if (extractedColors.length === 0) {
      return {
        primary: [],
        secondary: [],
        accent: [],
        neutral: [],
        surface: [],
      };
    }

    // Sort colors by HSL values for better categorization
    const sortedColors = extractedColors
      .map((color) => ({
        hex: color,
        hsl: hexToHsl(color),
      }))
      .sort((a, b) => {
        // Sort by saturation first, then lightness
        if (Math.abs(a.hsl[1] - b.hsl[1]) > 20) {
          return b.hsl[1] - a.hsl[1]; // Higher saturation first
        }
        return a.hsl[2] - b.hsl[2]; // Lighter colors first
      });

    const primary = sortedColors.slice(0, 2).map((c) => c.hex);
    const secondary = sortedColors.slice(2, 4).map((c) => c.hex);
    const accent = sortedColors.slice(4, 6).map((c) => c.hex);

    // Generate neutrals and surfaces
    const neutralVariations = generateColorVariations("#64748b");
    const surfaceVariations = generateColorVariations("#f8fafc");

    return {
      primary,
      secondary,
      accent,
      neutral: Object.values(neutralVariations).slice(0, 5),
      surface: Object.values(surfaceVariations).slice(0, 5),
    };
  }, [extractedColors]);

  const toggleGradient = (gradientName: string) => {
    setSelectedGradients((prev) =>
      prev.includes(gradientName)
        ? prev.filter((name) => name !== gradientName)
        : [...prev, gradientName],
    );
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const generateCSSVariables = () => {
    const css = `:root {
  /* ${brandName} Brand Colors - Modern CSS Variables */
  
  /* Primary Colors */
${colorPalette.primary
  .map(
    (color, i) => `  --color-primary-${i + 1}: ${color};
  --color-primary-${i + 1}-rgb: ${color
    .slice(1)
    .match(/.{2}/g)
    ?.map((hex) => parseInt(hex, 16))
    .join(", ")};`,
  )
  .join("\n")}
  
  /* Secondary Colors */
${colorPalette.secondary
  .map(
    (color, i) => `  --color-secondary-${i + 1}: ${color};
  --color-secondary-${i + 1}-rgb: ${color
    .slice(1)
    .match(/.{2}/g)
    ?.map((hex) => parseInt(hex, 16))
    .join(", ")};`,
  )
  .join("\n")}
  
  /* Accent Colors */
${colorPalette.accent
  .map(
    (color, i) => `  --color-accent-${i + 1}: ${color};
  --color-accent-${i + 1}-rgb: ${color
    .slice(1)
    .match(/.{2}/g)
    ?.map((hex) => parseInt(hex, 16))
    .join(", ")};`,
  )
  .join("\n")}
  
  /* Neutral Colors */
${colorPalette.neutral
  .map(
    (color, i) => `  --color-neutral-${(i + 1) * 100}: ${color};
  --color-neutral-${(i + 1) * 100}-rgb: ${color
    .slice(1)
    .match(/.{2}/g)
    ?.map((hex) => parseInt(hex, 16))
    .join(", ")};`,
  )
  .join("\n")}
  
  /* Surface Colors */
${colorPalette.surface
  .map(
    (color, i) => `  --color-surface-${(i + 1) * 100}: ${color};
  --color-surface-${(i + 1) * 100}-rgb: ${color
    .slice(1)
    .match(/.{2}/g)
    ?.map((hex) => parseInt(hex, 16))
    .join(", ")};`,
  )
  .join("\n")}
  
  /* Gradients */
${selectedGradients
  .map((name, i) => {
    const gradient = gradients.find((g) => g.name === name);
    return gradient
      ? `  --gradient-${i + 1}: linear-gradient(135deg, ${gradient.colors.join(", ")});`
      : "";
  })
  .filter(Boolean)
  .join("\n")}
}

/* Usage Examples */
/*
  Colors: color: var(--color-primary-1);
  Alpha: background: rgba(var(--color-primary-1-rgb), 0.5);
  Gradients: background: var(--gradient-1);
*/`;
    return css;
  };

  const generateTailwindConfig = () => {
    const config = `/* ${brandName} Tailwind v4 Config */
@import "tailwindcss";

/* Brand Theme Configuration */
@theme {
  /* Primary Colors */
${colorPalette.primary.map((color, i) => `  --color-primary-${(i + 1) * 100}: ${color};`).join("\n")}
  
  /* Secondary Colors */
${colorPalette.secondary.map((color, i) => `  --color-secondary-${(i + 1) * 100}: ${color};`).join("\n")}
  
  /* Accent Colors */
${colorPalette.accent.map((color, i) => `  --color-accent-${(i + 1) * 100}: ${color};`).join("\n")}
  
  /* Neutral Colors */
${colorPalette.neutral.map((color, i) => `  --color-neutral-${(i + 1) * 100}: ${color};`).join("\n")}
  
  /* Surface Colors */
${colorPalette.surface.map((color, i) => `  --color-surface-${(i + 1) * 100}: ${color};`).join("\n")}
  
  /* Brand Gradients */
${selectedGradients
  .map((name, i) => {
    const gradient = gradients.find((g) => g.name === name);
    return gradient
      ? `  --gradient-${i + 1}: linear-gradient(135deg, ${gradient.colors.join(", ")});`
      : "";
  })
  .filter(Boolean)
  .join("\n")}
}

/* Usage Examples */
/*
  Primary: text-primary-100, bg-primary-500, border-primary-200
  Secondary: text-secondary-100, bg-secondary-500
  Accent: text-accent-100, bg-accent-500
  Gradients: bg-[--gradient-1], bg-[--gradient-2]
*/`;
    return config;
  };

  const generateSCSSVariables = () => {
    const scss = `// ${brandName} Brand Colors

// Primary Colors
${colorPalette.primary.map((color, i) => `$primary-${i + 1}: ${color};`).join("\n")}

// Secondary Colors
${colorPalette.secondary.map((color, i) => `$secondary-${i + 1}: ${color};`).join("\n")}

// Accent Colors
${colorPalette.accent.map((color, i) => `$accent-${i + 1}: ${color};`).join("\n")}

// Neutral Colors
${colorPalette.neutral.map((color, i) => `$neutral-${(i + 1) * 100}: ${color};`).join("\n")}

// Surface Colors
${colorPalette.surface.map((color, i) => `$surface-${(i + 1) * 100}: ${color};`).join("\n")}

// Gradients
${selectedGradients
  .map((name, i) => {
    const gradient = gradients.find((g) => g.name === name);
    return gradient
      ? `$gradient-${i + 1}: linear-gradient(135deg, ${gradient.colors.join(", ")});`
      : "";
  })
  .filter(Boolean)
  .join("\n")}`;
    return scss;
  };

  const generateJSTokens = () => {
    const tokens = `// ${brandName} Design Tokens
export const brandColors = {
  primary: [${colorPalette.primary.map((c) => `'${c}'`).join(", ")}],
  secondary: [${colorPalette.secondary.map((c) => `'${c}'`).join(", ")}],
  accent: [${colorPalette.accent.map((c) => `'${c}'`).join(", ")}],
  neutral: [${colorPalette.neutral.map((c) => `'${c}'`).join(", ")}],
  surface: [${colorPalette.surface.map((c) => `'${c}'`).join(", ")}]
};

export const brandGradients = {
${selectedGradients
  .map((name, i) => {
    const gradient = gradients.find((g) => g.name === name);
    return gradient
      ? `  gradient${i + 1}: 'linear-gradient(135deg, ${gradient.colors.join(", ")})',`
      : "";
  })
  .filter(Boolean)
  .join("\n")}
};`;
    return tokens;
  };

  const downloadBrandKit = () => {
    const kit = {
      brandName,
      selectedGradients,
      colorPalette,
      css: generateCSSVariables(),
      tailwind: generateTailwindConfig(),
      scss: generateSCSSVariables(),
      js: generateJSTokens(),
    };

    const blob = new Blob([JSON.stringify(kit, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brandName.toLowerCase().replace(/\s+/g, "-")}-brand-kit.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <Card className="max-h-[90vh] w-full max-w-7xl overflow-hidden border border-border bg-background">
        <CardContent className="p-0">
          {/* Header with Progress */}
          <div className="border-b border-border p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-xl p-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Brand Kit Builder
                  </h2>
                  <p className="text-muted-foreground">
                    Create a complete brand color system with AI-powered
                    extraction
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="lg" onClick={onClose}>
                ✕
              </Button>
            </div>

            {/* Progress Steps */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-medium">
                    Step {currentStep} of {steps.length}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {steps[currentStep - 1]?.name}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-1 ${
                      currentStep >= step.id
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <span className="flex h-3 w-3 items-center justify-center rounded-full border border-current text-[8px]">
                        {step.id}
                      </span>
                    )}
                    <span>{step.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-6">
            {/* Step 1: Brand Name & Gradient Selection */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-semibold text-foreground">
                    Let's Start Building Your Brand
                  </h3>
                  <p className="text-muted-foreground">
                    Give your brand a name and select gradients that represent
                    your vision
                  </p>
                </div>

                <div className="mx-auto max-w-md space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="brand-name"
                      className="font-medium text-foreground"
                    >
                      Brand Name
                    </Label>
                    <Input
                      id="brand-name"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="Enter your brand name"
                      className="h-12 text-center font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="text-center">
                    <Label className="text-lg font-semibold text-foreground">
                      Select Gradients
                    </Label>
                    <p className="mt-1 text-muted-foreground">
                      Choose 2-4 gradients that match your brand aesthetic
                    </p>
                    <Badge variant="outline" className="mt-2">
                      {selectedGradients.length} of 4 selected
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {gradients.slice(0, 20).map((gradient) => (
                      <motion.div
                        key={gradient.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                          selectedGradients.includes(gradient.name)
                            ? "ring-primary/20 border-primary shadow-xl ring-2"
                            : "hover:border-primary/50 border-border hover:shadow-lg"
                        }`}
                        onClick={() => toggleGradient(gradient.name)}
                      >
                        <div
                          className="h-20 w-full"
                          style={{
                            background: `linear-gradient(135deg, ${gradient.colors.join(", ")})`,
                          }}
                        />
                        <div className="bg-background p-3">
                          <p className="truncate text-xs font-medium text-foreground">
                            {gradient.name}
                          </p>
                        </div>
                        {selectedGradients.includes(gradient.name) && (
                          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-lg">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center pt-6">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={
                      selectedGradients.length === 0 || !brandName.trim()
                    }
                    size="lg"
                    className="px-8"
                  >
                    Generate Color Palette
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Color Palette Generation */}
            {currentStep === 2 && selectedGradients.length > 0 && (
              <div className="space-y-8">
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-semibold text-foreground">
                    ✨ AI-Generated Color Palette
                  </h3>
                  <p className="text-muted-foreground">
                    We've extracted and organized colors from your selected
                    gradients
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Enhanced Color Palette Preview */}
                  <div className="space-y-6">
                    <div className="space-y-2 text-center">
                      <Label className="text-xl font-bold text-foreground">
                        🎨 Your Brand Color Palette
                      </Label>
                      <p className="text-muted-foreground">
                        Click any color to copy • Generated from your selected
                        gradients
                      </p>
                    </div>

                    {/* Main Color Showcase */}
                    <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-background">
                      {/* Header with gradient preview */}
                      <div
                        className="relative h-24 overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${[
                            ...colorPalette.primary,
                            ...colorPalette.secondary,
                            ...colorPalette.accent,
                          ]
                            .filter(Boolean)
                            .slice(0, 4)
                            .join(", ")})`,
                        }}
                      >
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                              {brandName}
                            </h3>
                            <p className="text-sm text-white/90 drop-shadow">
                              Brand Color System
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Color Categories */}
                      <div className="space-y-8 p-6">
                        {Object.entries(colorPalette).map(
                          ([category, colors]) =>
                            colors.length > 0 && (
                              <motion.div
                                key={category}
                                className="space-y-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  delay:
                                    Object.keys(colorPalette).indexOf(
                                      category,
                                    ) * 0.1,
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-6 w-1 rounded-full bg-primary" />
                                  <Label className="text-lg font-semibold capitalize text-foreground">
                                    {category}
                                  </Label>
                                  <Badge variant="outline" className="text-xs">
                                    {colors.length} colors
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-5 gap-3 md:grid-cols-8 lg:grid-cols-10">
                                  {colors.map(
                                    (color: string, index: number) => (
                                      <motion.div
                                        key={index}
                                        className="group relative cursor-pointer"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                          navigator.clipboard.writeText(color);
                                          setCopied(color);
                                          setTimeout(
                                            () => setCopied(null),
                                            1500,
                                          );
                                        }}
                                      >
                                        <div
                                          className="border-border/50 group-hover:border-primary/50 relative aspect-square w-full overflow-hidden rounded-xl border-2 shadow-sm transition-all duration-200 group-hover:shadow-lg"
                                          style={{ backgroundColor: color }}
                                          title={`${category} • ${color} • Click to copy`}
                                        >
                                          {/* Shine effect */}
                                          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity group-hover:opacity-100" />

                                          {/* Copy feedback */}
                                          {copied === color && (
                                            <motion.div
                                              className="absolute inset-0 flex items-center justify-center bg-black/50"
                                              initial={{ opacity: 0 }}
                                              animate={{ opacity: 1 }}
                                              exit={{ opacity: 0 }}
                                            >
                                              <Check className="h-4 w-4 text-white" />
                                            </motion.div>
                                          )}
                                        </div>

                                        <div className="mt-2 text-center">
                                          <p className="font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                                            {color.toUpperCase()}
                                          </p>
                                        </div>
                                      </motion.div>
                                    ),
                                  )}
                                </div>

                                {/* Color usage examples */}
                                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                                  {colors.slice(0, 3).map((color, index) => (
                                    <div
                                      key={index}
                                      className="bg-muted/30 rounded-lg border border-border p-3"
                                    >
                                      <div className="mb-2 flex items-center gap-2">
                                        <div
                                          className="h-4 w-4 rounded-full border border-border"
                                          style={{ backgroundColor: color }}
                                        />
                                        <span className="text-xs font-medium text-foreground">
                                          {category === "primary"
                                            ? "Buttons"
                                            : category === "secondary"
                                              ? "Links"
                                              : category === "accent"
                                                ? "Highlights"
                                                : category === "neutral"
                                                  ? "Text"
                                                  : "Background"}
                                        </span>
                                      </div>
                                      <div
                                        className="flex h-8 items-center justify-center rounded border border-border"
                                        style={{
                                          backgroundColor: color,
                                          color:
                                            category === "neutral" ||
                                            category === "surface"
                                              ? "#000"
                                              : "#fff",
                                        }}
                                      >
                                        <span className="text-xs font-medium">
                                          Sample
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            ),
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Brand Preview */}
                  <div className="space-y-6">
                    <Label className="flex items-center gap-2 text-lg font-semibold text-foreground">
                      <Eye className="h-5 w-5" />
                      Brand Preview
                    </Label>
                    <div className="space-y-4">
                      {/* Mock website preview */}
                      <div className="overflow-hidden rounded-xl border border-border bg-background">
                        <div
                          className="flex h-16 items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${colorPalette.primary.slice(0, 2).join(", ")})`,
                          }}
                        >
                          <h4 className="text-lg font-bold text-white">
                            {brandName}
                          </h4>
                        </div>
                        <div className="space-y-3 p-4">
                          <div className="flex gap-2">
                            {colorPalette.primary.slice(0, 3).map((color) => (
                              <div
                                key={color}
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Sample brand implementation
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    ← Back to Selection
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    size="lg"
                    className="px-8"
                  >
                    Export Brand Kit
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Export */}
            {currentStep === 3 && selectedGradients.length > 0 && (
              <div className="space-y-8">
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-semibold text-foreground">
                    🚀 Export Your Brand Kit
                  </h3>
                  <p className="text-muted-foreground">
                    Choose your preferred format and download your complete
                    brand system
                  </p>
                </div>

                <Tabs defaultValue="css" className="w-full">
                  <TabsList className="mb-6 grid w-full grid-cols-4">
                    <TabsTrigger
                      value="css"
                      className="flex items-center gap-2"
                    >
                      <Code2 className="h-4 w-4" />
                      CSS
                    </TabsTrigger>
                    <TabsTrigger value="tailwind">Tailwind v4</TabsTrigger>
                    <TabsTrigger value="scss">SCSS</TabsTrigger>
                    <TabsTrigger value="js">JavaScript</TabsTrigger>
                  </TabsList>

                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="space-y-4">
                      <TabsContent value="css" className="mt-0 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="font-medium text-foreground">
                            Modern CSS Variables (with RGB)
                          </Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(generateCSSVariables(), "css")
                            }
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            {copied === "css" ? "Copied!" : "Copy CSS"}
                          </Button>
                        </div>
                        <pre className="max-h-60 overflow-x-auto rounded-lg border border-border bg-muted p-4 text-xs">
                          <code className="text-foreground">
                            {generateCSSVariables()}
                          </code>
                        </pre>
                      </TabsContent>

                      <TabsContent value="tailwind" className="mt-0 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="font-medium text-foreground">
                            Tailwind v4 Theme Config
                          </Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                generateTailwindConfig(),
                                "tailwind",
                              )
                            }
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            {copied === "tailwind"
                              ? "Copied!"
                              : "Copy v4 Config"}
                          </Button>
                        </div>
                        <pre className="max-h-60 overflow-x-auto rounded-lg border border-border bg-muted p-4 text-xs">
                          <code className="text-foreground">
                            {generateTailwindConfig()}
                          </code>
                        </pre>
                      </TabsContent>

                      <TabsContent value="scss" className="mt-0 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="font-medium text-foreground">
                            SCSS Variables
                          </Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(generateSCSSVariables(), "scss")
                            }
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            {copied === "scss" ? "Copied!" : "Copy SCSS"}
                          </Button>
                        </div>
                        <pre className="max-h-60 overflow-x-auto rounded-lg border border-border bg-muted p-4 text-xs">
                          <code className="text-foreground">
                            {generateSCSSVariables()}
                          </code>
                        </pre>
                      </TabsContent>

                      <TabsContent value="js" className="mt-0 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="font-medium text-foreground">
                            JavaScript/TypeScript Tokens
                          </Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(generateJSTokens(), "js")
                            }
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            {copied === "js" ? "Copied!" : "Copy JS"}
                          </Button>
                        </div>
                        <pre className="max-h-60 overflow-x-auto rounded-lg border border-border bg-muted p-4 text-xs">
                          <code className="text-foreground">
                            {generateJSTokens()}
                          </code>
                        </pre>
                      </TabsContent>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Label className="text-lg font-semibold text-foreground">
                          Quick Actions
                        </Label>
                        <div className="space-y-3">
                          <Button
                            onClick={downloadBrandKit}
                            size="lg"
                            className="h-14 w-full justify-start"
                          >
                            <Download className="mr-3 h-5 w-5" />
                            <div className="text-left">
                              <p className="font-medium">
                                Download Complete Kit
                              </p>
                              <p className="text-xs opacity-90">
                                JSON file with all formats
                              </p>
                            </div>
                          </Button>

                          <Button
                            variant="outline"
                            size="lg"
                            className="h-14 w-full justify-start"
                            onClick={() => {
                              // Copy all colors as comma-separated list
                              const allColors =
                                Object.values(colorPalette).flat();
                              navigator.clipboard.writeText(
                                allColors.join(", "),
                              );
                              setCopied("all-colors");
                              setTimeout(() => setCopied(null), 2000);
                            }}
                          >
                            <Copy className="mr-3 h-5 w-5" />
                            <div className="text-left">
                              <p className="font-medium">
                                {copied === "all-colors"
                                  ? "Copied!"
                                  : "Copy All Colors"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Comma-separated list
                              </p>
                            </div>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tabs>

                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    ← Back to Palette
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Start Over
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
