// src/features/ai-generator/components/StyleControls.tsx

import { Label } from "@/shared/ui/label";
import { Slider } from "@/shared/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { GeneratedGradient } from "../types";

interface StyleControlsProps {
  result: GeneratedGradient | null;
  setResult: (gradient: GeneratedGradient) => void;
}

export const StyleControls = ({ result, setResult }: StyleControlsProps) => {
  if (!result) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40">
          Style & Type
        </Label>
      </div>

      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] text-foreground/40">TYPE</Label>
          <Select
            value={result.type}
            onValueChange={(val: any) => setResult({ ...result, type: val })}
          >
            <SelectTrigger className="h-10 border-border bg-card/60 text-xs text-foreground">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="border-border bg-background text-foreground">
              <SelectItem value="linear">Linear</SelectItem>
              <SelectItem value="radial">Radial</SelectItem>
              <SelectItem value="conic">Conic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {result.type === "linear" && (
          <div className="space-y-2">
            <Label className="text-[10px] text-foreground/40">
              ANGLE ({result.angle}°)
            </Label>
            <div className="flex h-10 items-center">
              <Slider
                value={[result.angle || 0]}
                max={360}
                step={1}
                onValueChange={([val]) => setResult({ ...result, angle: val })}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
