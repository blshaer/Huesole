import { Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ColorSwatch } from "@/features/gradients/components/ColorSwatch";

interface ColorStopItemProps {
  color: string;
  index: number;
  canRemove: boolean;
  onUpdate: (index: number, color: string) => void;
  onRemove: (index: number) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export const ColorStopItem = ({
  color,
  index,
  canRemove,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: ColorStopItemProps) => {
  return (
    <div
      className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2 transition-all hover:bg-white/10 hover:border-white/20 shadow-sm"
    >
      <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp?.();
          }}
          disabled={!onMoveUp}
          className="text-white/40 hover:text-white transition-colors disabled:pointer-events-none disabled:opacity-0"
        >
          <ChevronUp className="h-3 w-3" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown?.();
          }}
          disabled={!onMoveDown}
          className="text-white/40 hover:text-white transition-colors disabled:pointer-events-none disabled:opacity-0"
        >
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
      <div className="shrink-0">
        <ColorSwatch
          color={color}
          editable={true}
          onColorChange={(newColor) => onUpdate(index, newColor)}
          size="sm"
        />
      </div>
      <div className="flex-1">
        <Input
          value={color}
          onChange={(e) => onUpdate(index, e.target.value)}
          className="h-8 border-none bg-transparent font-mono text-[11px] font-medium text-white/70 focus-visible:ring-0 px-0 selection:bg-primary/30"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(index)}
        disabled={!canRemove}
        className="h-8 w-8 rounded-lg text-white/20 transition-all hover:bg-rose-500/20 hover:text-rose-400 disabled:opacity-0 group-hover:opacity-100 opacity-0"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

