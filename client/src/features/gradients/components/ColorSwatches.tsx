import { useState } from "react";
import { ColorSwatch } from "./ColorSwatch";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ColorSwatchesProps {
  colors: string[];
  getColorInFormat: (color: string) => string;
  editable?: boolean;
  onColorChange?: (index: number, newColor: string) => void;
  copyToClipboard: (text: string, key?: string) => void;
}

export const ColorSwatches: React.FC<ColorSwatchesProps> = ({
  colors,
  getColorInFormat,
  editable = false,
  onColorChange,
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayColors = showAll ? colors : colors.slice(0, 4);
  const hasMore = colors.length > 4;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {displayColors.map((color, index) => (
        <ColorSwatch
          key={index}
          color={color}
          formattedColor={getColorInFormat(color)}
          size="sm"
          editable={editable}
          onColorChange={(newColor) => onColorChange?.(index, newColor)}
        />
      ))}
      
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className={cn(
            "flex items-center justify-center rounded-full border border-white/10 h-6 px-2.5 transition-all duration-300",
            "bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 active:scale-95 group"
          )}
          title={showAll ? "Show less" : `Show ${colors.length - 4} more colors`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 group-hover:text-white/60 transition-colors">
            {showAll ? (
              <span className="flex items-center gap-1.5">
                <Minus className="h-2.5 w-2.5" /> Less
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Plus className="h-2.5 w-2.5" /> {colors.length - 4}
              </span>
            )}
          </span>
        </button>
      )}
    </div>
  );
};
