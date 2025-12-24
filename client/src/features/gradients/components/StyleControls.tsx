// src/features/ai-generator/components/StyleControls.tsx
import { X } from "lucide-react";

import { Label } from "@/shared/ui/label";
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
  onClose?: () => void;
}

export const StyleControls = ({ result, setResult, onClose }: StyleControlsProps) => {

  if (!result) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-foreground/40 text-[11px] font-bold uppercase tracking-[0.2em]">
          Style & Type
        </Label>
        {onClose && (
          <button
            onClick={onClose}
            className="hover:bg-foreground/5 rounded-lg p-1.5 transition-colors"
            aria-label="Close style controls"
          >
            <X className="h-4 w-4 text-foreground/60 hover:text-foreground" />
          </button>
        )}
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
