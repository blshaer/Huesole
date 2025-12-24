import { Play, Pause } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Slider } from "@/shared/ui/slider";

interface AnimationSectionProps {
  isAnimated: boolean;
  setIsAnimated: (value: boolean) => void;
  animationSpeed: number;
  setAnimationSpeed: (value: number) => void;
}

export const AnimationSection = ({
  isAnimated,
  setIsAnimated,
  animationSpeed,
  setAnimationSpeed,
}: AnimationSectionProps) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-foreground/40 text-[11px] font-bold uppercase tracking-[0.2em]">
            Motion Effects
          </Label>
        </div>
        <Button
          size="sm"
          variant={isAnimated ? "secondary" : "ghost"}
          onClick={() => setIsAnimated(!isAnimated)}
          className={`h-8 gap-2 rounded-xl text-xs font-bold ${isAnimated
              ? "bg-accent text-accent-foreground"
              : "text-foreground/40"
            }`}
        >
          {isAnimated ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
          {isAnimated ? "Active" : "Static"}
        </Button>
      </div>

      {isAnimated && (
        <div className="bg-card/60 space-y-4 rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between">
            <Label className="text-foreground/40 text-[10px]">SPEED</Label>
            <span className="font-mono text-[10px] text-accent">
              {animationSpeed}x
            </span>
          </div>
          <Slider
            value={[animationSpeed]}
            min={0.1}
            max={5}
            step={0.1}
            onValueChange={([val]) => setAnimationSpeed(val)}
          />
        </div>
      )}
    </section>
  );
};
