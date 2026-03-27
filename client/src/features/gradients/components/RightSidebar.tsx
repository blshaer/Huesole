import { useRef, useEffect, useState, useCallback } from "react";
import { Heart } from "lucide-react";
import { Slider } from "@/shared/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { GeneratedGradient } from "../types";

interface RightSidebarProps {
  result: GeneratedGradient | null;
  setResult: (gradient: GeneratedGradient) => void;
  onAngleChange?: (angle: number) => void;
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
  onAngleChange,
}: RightSidebarProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Controls
  const [steps, setSteps] = useState(15);
  const [exposure, setExposure] = useState(0.003);
  const [contrast, setContrast] = useState(1.0);
  const [frequency, setFrequency] = useState(1.0);
  const [phase, setPhase] = useState(0.0);

  // Swatch rendering type
  const [swatchType, setSwatchType] = useState<
    "angular" | "linear" | "radial"
  >("angular");

  // State to hold the original un-mutated colors from the AI/left sidebar before curve/slider edits
  const [baseColors, setBaseColors] = useState<string[]>(result?.colors || []);
  const lastPushedColorsRef = useRef<string[]>([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Update baseColors if result.colors changed from outside (e.g. user added a color in left sidebar)
  useEffect(() => {
    if (!result) return;
    const currentStr = JSON.stringify(result.colors);
    const pushedStr = JSON.stringify(lastPushedColorsRef.current);
    if (currentStr !== pushedStr) {
      setBaseColors(result.colors);
    }
  }, [result?.colors]);

  // Compute final colors whenever slider values or base colors change
  const computeColors = useCallback(() => {
    if (baseColors.length < 2) return baseColors;
    
    const rgbColors = baseColors.map(hexToRgb);
    const out = [];

    for (let i = 0; i < steps; i++) {
        const t = steps <= 1 ? 0 : i / (steps - 1);
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

  // Push computed colors to global result state
  useEffect(() => {
    if (!result) return;
    
    const newColors = computeColors();
    const currentStr = JSON.stringify(result.colors);
    const newStr = JSON.stringify(newColors);

    if (currentStr !== newStr) {
      lastPushedColorsRef.current = newColors;
      setResult({ ...result, colors: newColors });
    }
  }, [computeColors, result, setResult]);

  // Draw the RGB curves on canvas
  const drawCurves = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !result) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // Grid lines (dotted)
    ctx.setLineDash([2, 4]);
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    const gridSteps = 6; // 0, 0.2, 0.4, 0.6, 0.8, 1.0
    for (let i = 0; i <= gridSteps; i++) {
      const y = (i / gridSteps) * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Grid labels on right side
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "11px Inter, sans-serif";
    ctx.textAlign = "right";
    for (let i = 0; i <= gridSteps; i++) {
      const val = (1 - i / gridSteps).toFixed(1);
      const y = (i / gridSteps) * h + 4;
      ctx.fillText(val, w - 4, y);
    }

    // Extract average RGB from each base color position (so curves don't reflect already-transformed values!)
    const colors = baseColors.map((c) => hexToRgb(c));

    // Draw a curve for each RGB channel
    const channels = ["r", "g", "b"] as const;
    const channelColors = [
      "rgba(239, 68, 68, 0.9)", // red
      "rgba(74, 222, 128, 0.9)", // green
      "rgba(96, 165, 250, 0.9)", // blue
    ];

    channels.forEach((channel, ci) => {
      ctx.strokeStyle = channelColors[ci];
      ctx.lineWidth = 2;
      ctx.beginPath();

      const curvePoints = 200;
      for (let i = 0; i <= curvePoints; i++) {
        const t = i / curvePoints;
        const x = t * w;

        // Interpolate color at position t
        const pos = t * (colors.length - 1);
        const idx = Math.floor(pos);
        const frac = pos - idx;
        const c1 = colors[Math.min(idx, colors.length - 1)];
        const c2 = colors[Math.min(idx + 1, colors.length - 1)];
        const raw = c1[channel] * (1 - frac) + c2[channel] * frac;

        // Apply transforms
        const transformed = applyTransform(
          raw,
          exposure,
          contrast,
          frequency,
          phase,
        );
        const y = (1 - transformed) * h;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    });
  }, [result, exposure, contrast, frequency, phase]);

  useEffect(() => {
    drawCurves();
  }, [drawCurves]);

  // Resize observer for canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver(() => drawCurves());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [drawCurves]);

  // Generate dot-pattern swatch preview
  const renderSwatch = (
    colors: string[],
    type: "angular" | "linear" | "radial",
    isActive: boolean,
  ) => {
    const gradient =
      type === "angular"
        ? `conic-gradient(${colors.join(", ")})`
        : type === "radial"
          ? `radial-gradient(circle, ${colors.join(", ")})`
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
                  : "linear";
            setResult({ ...result, type: newType });
          }
        }}
        className={`relative h-12 w-12 rounded-lg overflow-hidden transition-all duration-200 ${
          isActive
            ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0d0f14]"
            : "ring-1 ring-white/10 hover:ring-white/20"
        }`}
      >
        <div
          className="absolute inset-0"
          style={{ background: gradient }}
        />
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0"
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

  const angle = result.angle ?? 0;
  const displayType =
    result.type === "conic"
      ? "angular"
      : result.type === "radial"
        ? "radial"
        : "linear";

  return (
    <aside className="relative z-20 flex h-full w-[320px] flex-shrink-0 flex-col border-l border-border bg-[#0d0f14]/95 backdrop-blur-3xl">
      <div className="custom-scrollbar flex-1 overflow-y-auto p-5 pt-6 space-y-6">
        {/* Top Controls: Angle, Steps, Type */}
        <div className="flex items-center gap-2">
          {/* Angle */}
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-sm font-medium text-white tabular-nums">
              {angle}°
            </span>
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => {
                  const newAngle = Math.min(360, angle + 1);
                  onAngleChange?.(newAngle);
                }}
                className="text-white/40 hover:text-white transition-colors leading-none text-[8px]"
              >
                ▲
              </button>
              <button
                onClick={() => {
                  const newAngle = Math.max(0, angle - 1);
                  onAngleChange?.(newAngle);
                }}
                className="text-white/40 hover:text-white transition-colors leading-none text-[8px]"
              >
                ▼
              </button>
            </div>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-sm font-medium text-white tabular-nums">
              {steps}
            </span>
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => setSteps((s) => Math.min(50, s + 1))}
                className="text-white/40 hover:text-white transition-colors leading-none text-[8px]"
              >
                ▲
              </button>
              <button
                onClick={() => setSteps((s) => Math.max(2, s - 1))}
                className="text-white/40 hover:text-white transition-colors leading-none text-[8px]"
              >
                ▼
              </button>
            </div>
          </div>

          {/* Type Selector */}
          <Select
            value={displayType}
            onValueChange={(val: string) => {
              const type = val as "angular" | "linear" | "radial";
              setSwatchType(type);
              const gradType =
                type === "angular"
                  ? "conic"
                  : type === "radial"
                    ? "radial"
                    : "linear";
              setResult({
                ...result,
                type: gradType as "linear" | "radial" | "conic",
              });
            }}
          >
            <SelectTrigger className="h-auto flex-1 border-white/10 bg-white/5 py-2 text-sm text-white hover:bg-white/10 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#181a20] text-white">
              <SelectItem value="angular">Angular Swatches</SelectItem>
              <SelectItem value="linear">Linear Swatches</SelectItem>
              <SelectItem value="radial">Radial Swatches</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Color Swatches */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          <button
            onClick={() => setIsFavorited((f) => !f)}
            className="group transition-all duration-200"
          >
            <Heart
              className={`h-5 w-5 transition-all duration-300 ${
                isFavorited
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-white/30 group-hover:text-white/60"
              }`}
            />
          </button>
        </div>

        {/* RGB Curves Chart */}
        <div className="space-y-2">
          <canvas
            ref={canvasRef}
            className="w-full rounded-lg"
            style={{ height: 180 }}
          />
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
