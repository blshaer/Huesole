import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { GeneratedGradient } from "../types";
import { ColorStopItem } from "./ColorStopItem";

import { useEffect, useState, useRef } from "react";

const MAX_COLOR_STOPS = 10;

interface ColorStopsSectionProps {
  result: GeneratedGradient | null;
  onUpdateColor: (index: number, color: string) => void;
  onAddColor: () => void;
  onRemoveColor: (index: number) => void;
  onMoveColor: (index: number, direction: "up" | "down") => void;
}

interface Item {
  id: string;
  color: string;
}

export const ColorStopsSection = ({
  result,
  onUpdateColor,
  onAddColor,
  onRemoveColor,
  onMoveColor,
}: ColorStopsSectionProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const lastColorsRef = useRef<string[]>([]);

  // Sync items when colors array changes length or content
  useEffect(() => {
    if (!result) return;
    
    // Check if lengths match
    if (items.length !== result.colors.length) {
      setItems(result.colors.map((color, idx) => ({
        id: `stop-${idx}-${Date.now()}`,
        color
      })));
    } else {
      // If content changed but length is same, check if it matches our last known state
      // This prevents resetting IDs when we just moved an item locally
      const colorsString = JSON.stringify(result.colors);
      const lastColorsString = JSON.stringify(lastColorsRef.current);
      
      if (colorsString !== lastColorsString) {
        setItems(prev => prev.map((item, idx) => ({
          ...item,
          color: result.colors[idx]
        })));
      }
    }
    lastColorsRef.current = result.colors;
  }, [result?.colors]);

  if (!result) return null;

  const isAtMax = result.colors.length >= MAX_COLOR_STOPS;

  const handleMove = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    // Local swap for immediate update
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setItems(newItems);
    
    // Update ref so useEffect doesn't overwrite
    lastColorsRef.current = newItems.map(it => it.color);
    
    // Notify parent
    onMoveColor(index, direction);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-foreground/40 text-[11px] font-bold uppercase tracking-[0.2em]">
            Color Stops
          </Label>
          <span className="text-[10px] font-medium text-white/30">
            {result.colors.length}/{MAX_COLOR_STOPS}
          </span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={onAddColor}
          disabled={isAtMax}
          className="hover:bg-secondary/80 h-8 rounded-lg bg-secondary text-secondary-foreground disabled:opacity-40"
        >
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>

      <div className="space-y-2 relative">
        {items.map((item, idx) => (
          <ColorStopItem
            key={item.id}
            color={item.color}
            index={idx}
            canRemove={result.colors.length > 2}
            onUpdate={onUpdateColor}
            onRemove={onRemoveColor}
            onMoveUp={idx > 0 ? () => handleMove(idx, "up") : undefined}
            onMoveDown={
              idx < items.length - 1
                ? () => handleMove(idx, "down")
                : undefined
            }
          />
        ))}
      </div>
    </section>
  );
};

