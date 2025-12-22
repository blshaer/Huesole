import { Button } from "@/shared/ui/button";
import { toast } from "@/shared/hooks/use-toast";
import { colorUtils } from "@/features/gradients/utils/colorUtils";
import { ChevronDown, ChevronUp, Palette } from "lucide-react";
import { useState } from "react";
import { ColorSwatch } from "./ColorSwatch";

interface ColorPaletteProps {
  colors: string[];
  gradientName: string;
}

export function ColorPalette({ colors }: ColorPaletteProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComplementary, setShowComplementary] = useState(false);

  const palette = colorUtils.extractPalette(colors);
  const complementaryColors = colorUtils.generateComplementaryColors(colors);

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
          <ColorSwatch
            key={index}
            color={colorInfo.hex}
            shape="square"
            size="md"
            showIcon
          />
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
                  <ColorSwatch color={colorInfo.hex} shape="square" size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex gap-4 text-xs text-white/90">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(colorInfo.hex);
                          toast({
                            title: "Copied!",
                            description: colorInfo.hex,
                          });
                        }}
                        className="font-mono transition-colors hover:text-white"
                        title="Click to copy HEX"
                      >
                        {colorInfo.hex}
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(colorInfo.rgb);
                          toast({
                            title: "Copied!",
                            description: colorInfo.rgb,
                          });
                        }}
                        className="font-mono transition-colors hover:text-white"
                        title="Click to copy RGB"
                      >
                        {colorInfo.rgb}
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(colorInfo.hsl);
                          toast({
                            title: "Copied!",
                            description: colorInfo.hsl,
                          });
                        }}
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
                    <ColorSwatch
                      key={index}
                      color={color}
                      shape="square"
                      size="sm"
                      showIcon
                    />
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
