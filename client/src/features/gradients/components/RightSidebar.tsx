import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { LikeDislike } from "./LikeDislike";
import { Slider } from "@/shared/ui/slider";
import { GeneratedGradient } from "../types";
import { animatedGradientUtils } from "../utils/animatedGradientUtils";
import { useFavorites } from "@/features/gradients/hooks/useFavorites";
import { useDislikes } from "@/features/gradients/hooks/useDislikes";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui/chart";

const chartConfig = {
  r: {
    label: "Red",
    color: "#EF4444",
  },
  g: {
    label: "Green",
    color: "#22C55E",
  },
  b: {
    label: "Blue",
    color: "#3B82F6",
  },
} satisfies ChartConfig;

interface RightSidebarProps {
  result: GeneratedGradient | null;
  setResult: React.Dispatch<React.SetStateAction<GeneratedGradient>>;
}

// Parse hex to RGB
const hexToRgb = (hex: string) => {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
};

// Clamp helper
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

// Apply exposure/contrast/frequency/phase to a single channel value (0-255)
const applyTransform = (
  value: number,
  exposure: number,
  contrast: number,
  frequency: number,
  phase: number,
) => {
  let v = value / 255;
  // Exposure (brightness multiplier)
  v *= Math.pow(2, exposure);
  // Contrast
  v = (v - 0.5) * contrast + 0.5;
  // Frequency & Phase (sine wave modulation)
  v = v * (0.5 + 0.5 * Math.cos(frequency * v * Math.PI * 2 + phase));
  return clamp(v, 0, 1);
};

export const RightSidebar = ({
  result,
  setResult,
}: RightSidebarProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();
  const { dislikes, toggleDislike } = useDislikes();
  
  const isFavorited = favorites.includes(result?.name || "");
  const isDisliked = dislikes.includes(result?.name || "");

  // Controls
  const [steps, setSteps] = useState<number | null>(result?.steps ?? null);
  const [exposure, setExposure] = useState(result?.exposure ?? 0.0);
  const [contrast, setContrast] = useState(result?.contrast ?? 1.0);
  const [frequency, setFrequency] = useState(result?.frequency ?? 0.0);
  const [phase, setPhase] = useState(result?.phase ?? 0.0);

  // Swatch rendering type
  const [swatchType, setSwatchType] = useState<
    "angular" | "linear" | "radial" | "auto"
  >("linear");

  // State to hold the original un-mutated colors from the AI/left sidebar before curve/slider edits
  const [baseColors, setBaseColors] = useState<string[]>(result?.baseColors || result?.colors || []);
  const lastPushedColorsRef = useRef<string[]>([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Compute final colors whenever slider values or base colors change
  const computeColors = useCallback(() => {
    if (baseColors.length < 2) return baseColors;
    
    const rgbColors = baseColors.map(hexToRgb);
    const out: string[] = [];

    const currentSteps = steps ?? baseColors.length;
    for (let i = 0; i < currentSteps; i++) {
        const t = currentSteps <= 1 ? 0 : i / (currentSteps - 1);
        const pos = t * (rgbColors.length - 1);
        const idx = Math.floor(pos);
        const frac = pos - idx;
        const c1 = rgbColors[Math.min(idx, rgbColors.length - 1)];
        const c2 = rgbColors[Math.min(idx + 1, rgbColors.length - 1)];

        const rawR = c1.r * (1 - frac) + c2.r * frac;
        const rawG = c1.g * (1 - frac) + c2.g * frac;
        const rawB = c1.b * (1 - frac) + c2.b * frac;

        const tr = applyTransform(rawR, exposure, contrast, frequency, phase) * 255;
        const tg = applyTransform(rawG, exposure, contrast, frequency, phase) * 255;
        const tb = applyTransform(rawB, exposure, contrast, frequency, phase) * 255;

        const toHex = (n: number) => Math.floor(n).toString(16).padStart(2, '0');
        out.push(`#${toHex(tr)}${toHex(tg)}${toHex(tb)}`);
    }
    return out;
  }, [baseColors, steps, exposure, contrast, frequency, phase]);

  // Sync colors from outside AND push computed colors back up in a controlled way
  useEffect(() => {
    if (!result) return;
    
    const currentColorsStr = JSON.stringify(result.colors);
    const pushedStr = JSON.stringify(lastPushedColorsRef.current);
    
    // 1. If result.colors changed from OUTSIDE (don't match our last push)
    if (currentColorsStr !== pushedStr) {
      setBaseColors(result.baseColors || result.colors);
      
      setExposure(result.exposure !== undefined ? result.exposure : 0.0);
      setContrast(result.contrast !== undefined ? result.contrast : 1.0);
      setFrequency(result.frequency !== undefined ? result.frequency : 0.0);
      setPhase(result.phase !== undefined ? result.phase : 0.0);
      setSteps(result.steps !== undefined ? result.steps : null);
      
      lastPushedColorsRef.current = result.colors; // prevent immediate re-push of same values
      return; 
    }

    // 2. Internal -> External Sync: compute new colors and push up if they differ
    const newColors = computeColors();
    const newStr = JSON.stringify(newColors);

    const hasAdjustmentDiff = 
      result.exposure !== exposure ||
      result.contrast !== contrast ||
      result.frequency !== frequency ||
      result.phase !== phase ||
      result.steps !== steps;

    if (currentColorsStr !== newStr || hasAdjustmentDiff) {
      lastPushedColorsRef.current = newColors;
      setResult({ 
        ...result, 
        baseColors: baseColors,
        colors: newColors,
        exposure,
        contrast,
        frequency,
        phase,
        steps
      });
    }
  }, [result, computeColors, setResult, exposure, contrast, frequency, phase, steps]);

  // Sync swatch type highlight separately
  useEffect(() => {
    if (!result) return;
    const resType = result.type === "conic" ? "angular" : (result.type === "default" ? "auto" : result.type);
    if (resType !== swatchType) {
      setSwatchType(resType as "angular" | "linear" | "radial" | "auto");
    }
  }, [result?.type, swatchType]);

  // Calculate Chart Data for EvilCharts
  const chartData = useMemo(() => {
    if (!result) return [];
    
    // Extract base RGB colors
    const colors = baseColors.map((c) => hexToRgb(c));
    const data: { t: string; r: number; g: number; b: number }[] = [];
    const points = 60; // Enough detail for a smooth curve
    
    for (let i = 0; i <= points; i++) {
      const t = i / points;
      
      // Interpolate base color at position t
      const pos = t * (colors.length - 1);
      const idx = Math.floor(pos);
      const frac = pos - idx;
      const c1 = colors[Math.min(idx, colors.length - 1)];
      const c2 = colors[Math.min(idx + 1, colors.length - 1)];
      
      const rawR = c1.r * (1 - frac) + c2.r * frac;
      const rawG = c1.g * (1 - frac) + c2.g * frac;
      const rawB = c1.b * (1 - frac) + c2.b * frac;

      // Apply transforms and add to data
      data.push({
        t: (t * 100).toFixed(0),
        r: applyTransform(rawR, exposure, contrast, frequency, phase),
        g: applyTransform(rawG, exposure, contrast, frequency, phase),
        b: applyTransform(rawB, exposure, contrast, frequency, phase),
      });
    }
    return data;
  }, [baseColors, exposure, contrast, frequency, phase, result]);

  // Generate dot-pattern swatch preview
  const renderSwatch = (
    colors: string[],
    type: "angular" | "linear" | "radial" | "auto",
    isActive: boolean,
  ) => {
    // "Auto" = clean faithful linear rendering of all colors — no mesh, as-it-is
    const autoGradient = result
      ? (result as any).rawCss || animatedGradientUtils.generateSegmentedConic(result.colors, result.angle || 90)
      : "";

    const gradient =
      type === "angular"
        ? `conic-gradient(${colors.join(", ")})`
        : type === "radial"
          ? `radial-gradient(circle, ${colors.join(", ")})`
          : type === "auto"
            ? autoGradient
            : `linear-gradient(90deg, ${colors.join(", ")})`;

    return (
      <button
        onClick={() => {
          setSwatchType(type);
          if (result) {
            const newType =
              type === "angular"
                ? "conic"
                : type === "radial"
                  ? "radial"
                  : type === "auto"
                    ? "default"
                    : "linear";
            setResult({ ...result, type: newType as any });
          }
        }}
        className={`relative h-12 w-12 rounded-lg overflow-hidden transition-all duration-200 group ${
          isActive
            ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0d0f14]"
            : "ring-1 ring-white/10 hover:ring-white/20"
        }`}
      >
        <div
          className="absolute inset-0"
          style={{ background: gradient }}
        />
        
        {/* Label Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <span className="text-[8px] font-black text-white uppercase tracking-[0.15em] drop-shadow-md">
            {type === "angular" ? "Conic" : type}
          </span>
        </div>

        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "8px 8px",
            backgroundPosition: "4px 4px",
          }}
        />
      </button>
    );
  };

  if (!result || isMobile) return null;

  return (
    <aside className="relative  pt-4 z-20 flex h-full w-full flex-shrink-0 flex-col border-l border-border bg-background/40 backdrop-blur-3xl">
      <div className="custom-scrollbar flex-1 overflow-y-auto px-6 pb-6 md:pb-12 space-y-6">

        {/* Color Swatches */}
        <div className="flex items-center pt-2 justify-between">
          <div className="flex items-center gap-2">
            {renderSwatch(
              result.colors,
              "auto",
              swatchType === "auto",
            )}
            {renderSwatch(
              result.colors,
              "linear",
              swatchType === "linear",
            )}
            {renderSwatch(
              result.colors,
              "radial",
              swatchType === "radial",
            )}
            {renderSwatch(
              result.colors,
              "angular",
              swatchType === "angular",
            )}
          </div>

          {/* Favorite Button */}
          <LikeDislike
            variant="ghost"
            isLiked={isFavorited}
            isDisliked={isDisliked}
            onLikeToggle={() => {
              if (isDisliked) toggleDislike(result.name || "");
              toggleFavorite(result.name || "");
            }}
            onDislikeToggle={() => {
              if (isFavorited) toggleFavorite(result.name || "");
              toggleDislike(result.name || "");
            }}
          />
        </div>

        {/* RGB Curves Chart - EvilCharts Aesthetic */}
        <div className="h-[180px] w-full pt-2">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart 
              data={chartData} 
              margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="fillG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="fillB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                vertical={false} 
                strokeDasharray="3 3" 
                stroke="#ffffff10" 
              />
              <YAxis 
                hide 
                domain={[0, 1]} 
              />
              <XAxis hide dataKey="t" />
              <ChartTooltip 
                cursor={false}
                content={<ChartTooltipContent hideLabel indicator="line" />} 
              />
              <Area
                type="monotone"
                dataKey="r"
                stroke="#EF4444"
                fillOpacity={1}
                fill="url(#fillR)"
                strokeWidth={2}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="g"
                stroke="#22C55E"
                fillOpacity={1}
                fill="url(#fillG)"
                strokeWidth={2}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="b"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#fillB)"
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        </div>

        {/* Sliders */}
        <div className="space-y-5">
          {/* Exposure */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">
                Exposure
              </span>
              <span className="text-sm tabular-nums text-white/60">
                {exposure.toFixed(3)}
              </span>
            </div>
            <Slider
              value={[exposure]}
              onValueChange={(v) => setExposure(v[0])}
              min={-2}
              max={2}
              step={0.001}
              className="w-full"
            />
          </div>

          {/* Contrast */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">
                Contrast
              </span>
              <span className="text-sm tabular-nums text-white/60">
                {contrast.toFixed(3)}
              </span>
            </div>
            <Slider
              value={[contrast]}
              onValueChange={(v) => setContrast(v[0])}
              min={0}
              max={3}
              step={0.001}
              className="w-full"
            />
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">
                Frequency
              </span>
              <span className="text-sm tabular-nums text-white/60">
                {frequency.toFixed(3)}
              </span>
            </div>
            <Slider
              value={[frequency]}
              onValueChange={(v) => setFrequency(v[0])}
              min={0}
              max={5}
              step={0.001}
              className="w-full"
            />
          </div>

          {/* Phase */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">
                Phase
              </span>
              <span className="text-sm tabular-nums text-white/60">
                {phase.toFixed(3)}
              </span>
            </div>
            <Slider
              value={[phase]}
              onValueChange={(v) => setPhase(v[0])}
              min={-Math.PI}
              max={Math.PI}
              step={0.001}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
