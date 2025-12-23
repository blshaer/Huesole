import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { GeneratedGradient } from "../types";
import { ColorStopItem } from "./ColorStopItem";

interface ColorStopsSectionProps {
  result: GeneratedGradient | null;
  onUpdateColor: (index: number, color: string) => void;
  onAddColor: () => void;
  onRemoveColor: (index: number) => void;
}

export const ColorStopsSection = ({
  result,
  onUpdateColor,
  onAddColor,
  onRemoveColor,
}: ColorStopsSectionProps) => {
  if (!result) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-foreground/40 text-[11px] font-bold uppercase tracking-[0.2em]">
            Color Stops
          </Label>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={onAddColor}
          className="hover:bg-secondary/80 h-8 rounded-lg bg-secondary text-secondary-foreground"
        >
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>

      <div className="space-y-2">
        {result.colors.map((color, idx) => (
          <ColorStopItem
            key={idx}
            color={color}
            index={idx}
            canRemove={result.colors.length > 2}
            onUpdate={onUpdateColor}
            onRemove={onRemoveColor}
          />
        ))}
      </div>
    </section>
  );
};
