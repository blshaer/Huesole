import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { GeneratedGradient } from "../types";
import { ColorStopItem } from "./ColorStopItem";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/ui/dialog";
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from "@/components/kibo-ui/color-picker";

import { useEffect, useState, useRef } from "react";

const MAX_COLOR_STOPS = 10;

interface ColorStopsSectionProps {
  result: GeneratedGradient | null;
  onUpdateColor: (index: number, color: string) => void;
  onAddColor: (color?: string) => void;
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newColor, setNewColor] = useState("#6366f1");
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

    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setItems(newItems);
    
    lastColorsRef.current = newItems.map(it => it.color);
    onMoveColor(index, direction);
  };

  const handleOpenAddDialog = () => {
    const lastColor = result.colors[result.colors.length - 1] || "#6366f1";
    setNewColor(lastColor);
    setIsAddDialogOpen(true);
  };

  const handleConfirmAdd = () => {
    onAddColor(newColor);
    setIsAddDialogOpen(false);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between pt-4">
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
          onClick={handleOpenAddDialog}
          disabled={isAtMax}
          className="hover:bg-secondary/80 h-8 rounded-lg bg-secondary text-secondary-foreground disabled:opacity-40"
        >
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>

      {/* Compact High Z-Index Color Picker for Addition */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-[280px] bg-black/98 border-white/10 backdrop-blur-3xl p-4 rounded-[28px] overflow-hidden z-[10000] shadow-[0_20px_50px_rgba(0,0,0,1)] border-[0.5px]">
          <div className="flex flex-col items-center gap-3">
            <ColorPicker value={newColor} onChange={(val) => setNewColor(val)} className="w-full bg-transparent border-none p-0">
               <ColorPickerSelection className="h-28 rounded-xl border border-white/5" />
               <div className="flex items-center gap-3 py-2 w-full">
                 <ColorPickerEyeDropper className="h-9 w-9 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 transition-colors shrink-0" />
                 <div className="grid w-full gap-2.5">
                   <ColorPickerHue />
                   <ColorPickerAlpha />
                 </div>
               </div>
               <div className="flex items-center gap-2 w-full bg-white/5 px-2 py-1.5 rounded-xl border border-white/5">
                 <ColorPickerOutput className="bg-transparent border-none text-[10px] flex-1 h-7 px-1 uppercase opacity-40 font-bold" />
                 <div className="w-px h-3 bg-white/5" />
                 <ColorPickerFormat className="bg-transparent border-none text-[10px] h-7 w-20 opacity-60 font-mono tracking-tight" />
               </div>
            </ColorPicker>
          </div>
          <div className="mt-4">
            <Button onClick={handleConfirmAdd} className="w-full bg-white text-black hover:bg-neutral-100 rounded-xl font-bold h-11 text-xs uppercase tracking-widest transition-all active:scale-[0.98]">
               Add Color
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-2 h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
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
            isOpen={openIndex === idx}
            onOpenChange={(open) => setOpenIndex(open ? idx : null)}
          />
        ))}
      </div>
    </section>
  );
};

