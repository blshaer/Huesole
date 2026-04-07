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

      {/* Modern Center Dialog for Adding Color */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md bg-[#0d0f14]/95 border-white/10 backdrop-blur-3xl p-6 rounded-[28px] overflow-hidden">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold text-white tracking-tight">Add Color Stop</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-4">
            <ColorPicker value={newColor} onChange={setNewColor} className="w-full bg-transparent border-none p-0">
               <ColorPickerSelection className="h-48 rounded-2xl border border-white/5" />
               <div className="flex items-center gap-4 py-4 w-full">
                 <ColorPickerEyeDropper className="rounded-xl bg-white/5 border-white/10 hover:bg-white/10 transition-colors" />
                 <div className="grid w-full gap-3">
                   <ColorPickerHue />
                   <ColorPickerAlpha />
                 </div>
               </div>
               <div className="flex items-center gap-3 w-full bg-white/5 p-3 rounded-2xl border border-white/5">
                 <ColorPickerOutput className="bg-transparent border-white/10 rounded-xl flex-1 h-9" />
                 <ColorPickerFormat className="bg-transparent border-white/10 rounded-xl overflow-hidden h-9" />
               </div>
            </ColorPicker>
          </div>
          <DialogFooter className="mt-6 flex gap-3 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="text-white/40 hover:text-white flex-1 sm:flex-none">
              Cancel
            </Button>
            <Button onClick={handleConfirmAdd} className="bg-white text-black hover:bg-neutral-200 rounded-xl font-bold px-8 flex-1 sm:flex-none">
               Confirm & Add
            </Button>
          </DialogFooter>
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

