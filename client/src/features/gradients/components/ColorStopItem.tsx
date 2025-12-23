import { Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ColorSwatch } from "@/features/gradients/components/ColorSwatch";

interface ColorStopItemProps {
  color: string;
  index: number;
  canRemove: boolean;
  onUpdate: (index: number, color: string) => void;
  onRemove: (index: number) => void;
}

export const ColorStopItem = ({
  color,
  index,
  canRemove,
  onUpdate,
  onRemove,
}: ColorStopItemProps) => {
  return (
    <div className="bg-card/60 hover:border-foreground/20 group flex items-center gap-3 rounded-xl border border-border p-2 transition-all">
      <ColorSwatch
        color={color}
        editable={true}
        onColorChange={(newColor) => onUpdate(index, newColor)}
        size="sm"
      />
      <Input
        value={color}
        onChange={(e) => onUpdate(index, e.target.value)}
        className="text-foreground/70 h-8 border-none bg-transparent font-mono text-xs focus-visible:ring-0"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(index)}
        disabled={!canRemove}
        className="text-destructive/60 hover:bg-destructive/20 h-8 w-8 hover:text-destructive disabled:opacity-0 group-hover:disabled:opacity-0"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};
