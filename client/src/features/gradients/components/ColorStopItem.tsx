import React from "react";
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ColorSwatch } from "@/features/gradients/components/ColorSwatch";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from "@/components/kibo-ui/color-picker";

interface ColorStopItemProps {
  color: string;
  index: number;
  canRemove: boolean;
  onUpdate: (index: number, color: string) => void;
  onRemove: (index: number) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ColorStopItem = React.memo(({
  color,
  index,
  canRemove,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  isOpen,
  onOpenChange,
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

      <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <div className="flex flex-1 items-center gap-3 cursor-pointer">
            <div className="shrink-0">
              <ColorSwatch
                color={color}
                editable={false}
                size="sm"
              />
            </div>
            <div className="flex-1">
              <Input
                value={color}
                readOnly
                className="h-8 border-none bg-transparent font-mono text-[11px] font-medium text-white/40 cursor-pointer focus-visible:ring-0 px-0 select-none shadow-none pointer-events-none"
              />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 border-none bg-transparent shadow-none" side="right" align="start">
          <ColorPicker 
            value={color} 
            onChange={(newColor) => onUpdate(index, newColor)}
            className="max-w-sm rounded-[24px] border border-white/10 bg-neutral-950/90 p-4 shadow-2xl backdrop-blur-3xl"
          >
            <ColorPickerSelection className="h-40 rounded-xl border border-white/5" />
            <div className="flex items-center gap-4 py-2">
              <ColorPickerEyeDropper className="rounded-xl bg-white/5 border-white/10 hover:bg-white/10 transition-colors" />
              <div className="grid w-full gap-3">
                <ColorPickerHue />
                <ColorPickerAlpha />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <ColorPickerOutput className="bg-white/5 border-white/10 rounded-xl" />
              <ColorPickerFormat className="bg-white/5 border-white/10 rounded-xl overflow-hidden" />
            </div>
          </ColorPicker>
        </PopoverContent>
      </Popover>
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
});

