import React, { useMemo, useState } from "react";
import {
  AnimatePresence,
  Reorder,
  useDragControls,
  motion,
} from "framer-motion";
import { Copy, Edit2, GripVertical, Plus, Trash2 } from "lucide-react";

import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from "@/components/kibo-ui/color-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

/* ---------------------------------------
   ColorSwatch (updated: full circle + adaptive icon + Kibo Color Picker)
---------------------------------------- */

interface ColorSwatchProps {
  color: string;
  formattedColor?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "square";
  showIcon?: boolean;
  editable?: boolean;
  onColorChange?: (newColor: string) => void;
}

type RGB = { r: number; g: number; b: number };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function parseColorToRgb(input: string): RGB | null {
  const v = input.trim().toLowerCase();

  if (v.startsWith("#")) {
    const hex = v.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      if ([r, g, b].some(Number.isNaN)) return null;
      return { r, g, b };
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      if ([r, g, b].some(Number.isNaN)) return null;
      return { r, g, b };
    }
    return null;
  }

  const rgbMatch = v.match(
    /^rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$/,
  );
  if (rgbMatch) {
    return {
      r: clamp(Number(rgbMatch[1]), 0, 255),
      g: clamp(Number(rgbMatch[2]), 0, 255),
      b: clamp(Number(rgbMatch[3]), 0, 255),
    };
  }

  return null;
}

function srgbToLinear(c01: number) {
  return c01 <= 0.03928 ? c01 / 12.92 : Math.pow((c01 + 0.055) / 1.055, 2.4);
}

function getRelativeLuminance(color: string) {
  const rgb = parseColorToRgb(color);
  if (!rgb) return 0;

  const rs = rgb.r / 255;
  const gs = rgb.g / 255;
  const bs = rgb.b / 255;

  const r = srgbToLinear(rs);
  const g = srgbToLinear(gs);
  const b = srgbToLinear(bs);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function pickIconIsDark(backgroundColor: string) {
  const L = getRelativeLuminance(backgroundColor);

  const contrastWithBlack = (L + 0.05) / 0.05;
  const contrastWithWhite = 1.05 / (L + 0.05);

  return contrastWithBlack >= contrastWithWhite;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  formattedColor,
  className,
  size = "md",
  shape = "circle",
  showIcon = false,
  editable = false,
  onColorChange,
}) => {
  const [open, setOpen] = useState(false);
  const displayColor = formattedColor || color;

  const iconIsDark = pickIconIsDark(color);
  const overlayBgClass = iconIsDark ? "bg-white/40" : "bg-black/30";
  const iconColorClass = iconIsDark ? "text-black" : "text-white";

  const sizeClasses: Record<NonNullable<ColorSwatchProps["size"]>, string> = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const iconSizeClasses: Record<
    NonNullable<ColorSwatchProps["size"]>,
    string
  > = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const shapeClasses: Record<NonNullable<ColorSwatchProps["shape"]>, string> = {
    circle: "rounded-full",
    square: "rounded",
  };

  const copyColor = () => {
    if (editable) return;
    navigator.clipboard.writeText(color);
    toast("Color copied!", { description: `${color.toUpperCase()} (HEX) copied to clipboard` });
  };

  const handleSwatchClick = () => {
    if (!editable) copyColor();
  };

  const shouldShowOverlay = editable || showIcon;

  const swatchContent = (
    <motion.div
      className={cn(
        "group relative cursor-pointer overflow-hidden border border-white/20",
        shapeClasses[shape],
        sizeClasses[size],
        className,
      )}
      style={{ backgroundColor: color }}
      onClick={handleSwatchClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSwatchClick();
        }
      }}
      aria-label={
        editable
          ? `Change color: ${displayColor}`
          : `Copy color: ${displayColor}`
      }
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 450, damping: 28 }}
    >
      {shouldShowOverlay && (
        <motion.div
          className={cn(
            "pointer-events-none absolute inset-0 flex items-center justify-center",
            shapeClasses[shape],
            overlayBgClass,
          )}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {editable ? (
            <Edit2
              className={cn(
                iconSizeClasses[size],
                iconColorClass,
                "drop-shadow-sm",
              )}
            />
          ) : (
            showIcon && (
              <Copy
                className={cn(
                  iconSizeClasses[size],
                  iconColorClass,
                  "drop-shadow-sm",
                )}
              />
            )
          )}
        </motion.div>
      )}
    </motion.div>
  );

  if (!editable) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {swatchContent}
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-white">
            Click to copy: {displayColor}
          </p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            {swatchContent}
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent suppressHydrationWarning>
          <p className="text-white">
            Click to change color: {displayColor}
          </p>
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="w-80 p-0 border-none bg-transparent shadow-none" side="right" align="start">
        <ColorPicker 
          value={color} 
          onChange={(newColor) => onColorChange?.(newColor)}
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
  );
};

/* ---------------------------------------
   Palette with add/remove animations + drag reorder
---------------------------------------- */

type PaletteItem = {
  id: string;
  color: string;
};

function uid() {
  // Works in modern browsers; fallback included.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = (globalThis as any).crypto;
  return (
    c?.randomUUID?.() ?? `${Date.now()}_${Math.random().toString(16).slice(2)}`
  );
}

// Hex <-> HSL helpers (enough for “next color based on last color”)
function hexToRgb(hex: string): RGB | null {
  return parseColorToRgb(hex);
}

function rgbToHsl({ r, g, b }: RGB) {
  const r01 = r / 255;
  const g01 = g / 255;
  const b01 = b / 255;

  const max = Math.max(r01, g01, b01);
  const min = Math.min(r01, g01, b01);
  const d = max - min;

  let h = 0;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  if (d !== 0) {
    switch (max) {
      case r01:
        h = ((g01 - b01) / d) % 6;
        break;
      case g01:
        h = (b01 - r01) / d + 2;
        break;
      case b01:
        h = (r01 - g01) / d + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number): RGB {
  const C = (1 - Math.abs(2 * l - 1)) * s;
  const X = C * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - C / 2;

  let r1 = 0,
    g1 = 0,
    b1 = 0;

  if (0 <= h && h < 60) [r1, g1, b1] = [C, X, 0];
  else if (60 <= h && h < 120) [r1, g1, b1] = [X, C, 0];
  else if (120 <= h && h < 180) [r1, g1, b1] = [0, C, X];
  else if (180 <= h && h < 240) [r1, g1, b1] = [0, X, C];
  else if (240 <= h && h < 300) [r1, g1, b1] = [X, 0, C];
  else[r1, g1, b1] = [C, 0, X];

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

function rgbToHex({ r, g, b }: RGB) {
  const to2 = (n: number) => n.toString(16).padStart(2, "0");
  return `#${to2(clamp(r, 0, 255))}${to2(clamp(g, 0, 255))}${to2(clamp(b, 0, 255))}`;
}

function nextColorFromLast(lastHex: string, stepIndex: number) {
  const rgb = hexToRgb(lastHex);
  if (!rgb) {
    // fallback if last is not hex/rgb
    const base = { h: 210, s: 0.85, l: 0.55 };
    const h = (base.h + 137.5 * (stepIndex + 1)) % 360;
    return rgbToHex(hslToRgb(h, base.s, base.l));
  }

  const { h, s, l } = rgbToHsl(rgb);

  // “Golden angle” hue step produces distinct successive hues.
  const nextH = (h + 137.5) % 360;

  // Small alternating tweaks to avoid same-lightness feeling.
  const tweak = stepIndex % 2 === 0 ? 0.04 : -0.04;
  const nextS = clamp(s + 0.02, 0.25, 1);
  const nextL = clamp(l + tweak, 0.18, 0.82);

  return rgbToHex(hslToRgb(nextH, nextS, nextL));
}

function reorderItemsByIds(items: PaletteItem[], orderedIds: string[]) {
  const map = new Map(items.map((it) => [it.id, it]));
  return orderedIds.map((id) => map.get(id)!).filter(Boolean);
}

export function ColorPaletteEditor({
  initialColors = ["#3b82f6", "#22c55e", "#f97316"],
}: {
  initialColors?: string[];
}) {
  const [items, setItems] = useState<PaletteItem[]>(
    initialColors.map((c) => ({ id: uid(), color: c })),
  );

  const orderedIds = useMemo(() => items.map((i) => i.id), [items]);

  const addColor = () => {
    setItems((prev) => {
      const last = prev[prev.length - 1]?.color ?? "#3b82f6";
      const next = nextColorFromLast(last, prev.length);
      return [...prev, { id: uid(), color: next }];
    });
  };

  const removeColor = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const updateColor = (id: string, newColor: string) => {
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, color: newColor } : x)),
    );
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          onClick={addColor}
          className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
        >
          <Plus className="h-4 w-4" />
          Add color
        </button>

        <div className="text-xs text-white/60">
          Drag with the handle to reorder.
        </div>
      </div>

      <Reorder.Group
        axis="x"
        values={orderedIds}
        onReorder={(newOrder) =>
          setItems((prev) => reorderItemsByIds(prev, newOrder))
        }
        className="flex flex-wrap items-center gap-2"
      >
        <AnimatePresence initial={false}>
          {items.map((item, index) => (
            <PaletteRow
              key={item.id}
              id={item.id}
              color={item.color}
              index={index}
              onRemove={removeColor}
              onChange={updateColor}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
}

function PaletteRow({
  id,
  color,
  index,
  onRemove,
  onChange,
}: {
  id: string;
  color: string;
  index: number;
  onRemove: (id: string) => void;
  onChange: (id: string, next: string) => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={id}
      dragListener={false}
      dragControls={controls}
      layout
      initial={{ opacity: 0, scale: 0.92, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -6 }}
      transition={{ duration: 0.16 }}
      whileDrag={{ scale: 1.02 }}
      className="flex items-center gap-2 rounded-full bg-white/5 px-2 py-1"
    >
      {/* Drag handle */}
      <button
        type="button"
        onPointerDown={(e) => controls.start(e)}
        className="cursor-grab rounded-full p-1 text-white/70 hover:text-white active:cursor-grabbing"
        aria-label={`Reorder color ${index + 1}`}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Swatch (editable) */}
      <ColorSwatch
        color={color}
        size="md"
        shape="circle"
        editable
        onColorChange={(next) => onChange(id, next)}
      />

      {/* Remove */}
      <motion.button
        type="button"
        onClick={() => onRemove(id)}
        className="rounded-full p-1 text-white/70 hover:text-white"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Remove color ${index + 1}`}
      >
        <Trash2 className="h-4 w-4" />
      </motion.button>
    </Reorder.Item>
  );
}
