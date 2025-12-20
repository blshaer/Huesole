import { Button } from "@/shared/ui/button";
import { toast } from "@/shared/hooks/use-toast";
import { colorUtils } from "@/features/gradients/utils/colorUtils";
import { ChevronDown, ChevronUp, Copy, Palette } from "lucide-react";
import { useState } from "react";

interface ColorPaletteProps {
  colors: string[];
  gradientName: string;
}

export function ColorPalette({ colors }: ColorPaletteProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComplementary, setShowComplementary] = useState(false);

  const palette = colorUtils.extractPalette(colors);
  const complementaryColors = colorUtils.generateComplementaryColors(colors);

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast({
      title: "Color copied!",
      description: `${color} copied to clipboard`,
    });
  };

  const copyAllColors = (format: "hex" | "rgb" | "hsl") => {
    const colorString = palette
      .map((p) => {
        switch (format) {
          case "rgb":
            return p.rgb;
          case "hsl":
            return p.hsl;
          default:
            return p.hex;
        }
      })
      .join(", ");

    navigator.clipboard.writeText(colorString);
    toast({
      title: "All colors copied!",
      description: `${palette.length} colors copied as ${format.toUpperCase()}`,
    });
  };

  if (!colors || colors.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-medium text-white">
          <Palette className="h-4 w-4" />
          Color Palette ({palette.length} colors)
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex h-6 w-6 items-center justify-center p-0 text-white hover:bg-white/10"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Basic palette - always visible */}
      <div className="flex flex-wrap gap-1">
        {palette.map((colorInfo, index) => (
          <div
            key={index}
            className="group relative cursor-pointer"
            onClick={() => copyColor(colorInfo.hex)}
            title={`${colorInfo.hex} - Click to copy`}
          >
            <div
              className="h-8 w-8 rounded border border-white/20 transition-transform group-hover:scale-110"
              style={{ backgroundColor: colorInfo.hex }}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <Copy className="h-3 w-3 text-white drop-shadow-lg" />
            </div>
          </div>
        ))}
      </div>

      {isExpanded && (
        <div className="border-border/50 space-y-4 border-t pt-2">
          {/* Detailed color information */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyAllColors("hex")}
                className="h-7 border-white/30 text-xs text-white hover:bg-white/10"
              >
                Copy HEX
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyAllColors("rgb")}
                className="h-7 border-white/30 text-xs text-white hover:bg-white/10"
              >
                Copy RGB
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyAllColors("hsl")}
                className="h-7 border-white/30 text-xs text-white hover:bg-white/10"
              >
                Copy HSL
              </Button>
            </div>

            {/* Color details */}
            <div className="space-y-2">
              {palette.map((colorInfo, index) => (
                <div
                  key={index}
                  className="bg-muted/30 hover:bg-muted/50 flex items-center gap-3 rounded p-2 transition-colors"
                >
                  <div
                    className="h-6 w-6 flex-shrink-0 rounded border border-white/20"
                    style={{ backgroundColor: colorInfo.hex }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex gap-4 text-xs text-white/90">
                      <button
                        onClick={() => copyColor(colorInfo.hex)}
                        className="font-mono transition-colors hover:text-white"
                        title="Click to copy HEX"
                      >
                        {colorInfo.hex}
                      </button>
                      <button
                        onClick={() => copyColor(colorInfo.rgb)}
                        className="font-mono transition-colors hover:text-white"
                        title="Click to copy RGB"
                      >
                        {colorInfo.rgb}
                      </button>
                      <button
                        onClick={() => copyColor(colorInfo.hsl)}
                        className="font-mono transition-colors hover:text-white"
                        title="Click to copy HSL"
                      >
                        {colorInfo.hsl}
                      </button>
                    </div>
                    <div className="mt-1 text-xs text-white/70">
                      <span>H: {colorInfo.hue}°</span>
                      <span className="ml-3">S: {colorInfo.saturation}%</span>
                      <span className="ml-3">L: {colorInfo.lightness}%</span>
                      <span className="ml-3">
                        {colorInfo.isLight ? "Light" : "Dark"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Complementary colors */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-medium text-white/90">
                  Complementary Colors
                </h5>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowComplementary(!showComplementary)}
                  className="h-5 p-1 text-xs text-white/90 hover:bg-white/10 hover:text-white"
                >
                  {showComplementary ? "Hide" : "Show"}
                </Button>
              </div>

              {showComplementary && (
                <div className="flex flex-wrap gap-1">
                  {complementaryColors.map((color, index) => (
                    <div
                      key={index}
                      className="group relative cursor-pointer"
                      onClick={() => copyColor(color)}
                      title={`${color} - Click to copy`}
                    >
                      <div
                        className="h-6 w-6 rounded border border-white/20 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: color }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                        <Copy className="h-2 w-2 text-white drop-shadow-lg" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
