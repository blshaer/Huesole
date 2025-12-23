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
        <Label className="text-foreground/40 text-[11px] font-bold uppercase tracking-[0.2em]">
          Style & Type
        </Label>
      </div>

      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label className="text-foreground/40 text-[10px]">TYPE</Label>
          <Select
            value={result.type}
            onValueChange={(val: any) => setResult({ ...result, type: val })}
          >
            <SelectTrigger className="bg-card/60 h-10 border-border text-xs text-foreground">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="border-border bg-background text-foreground">
              <SelectItem value="linear">Linear</SelectItem>
              <SelectItem value="radial">Radial</SelectItem>
              <SelectItem value="conic">Conic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
};
