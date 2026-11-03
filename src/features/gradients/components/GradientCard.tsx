import { cn } from "@/lib/utils";
import { useColorFormat } from "@/features/gradients/hooks/useColorFormat";
import { useCopyState } from "@/features/gradients/hooks/useCopyState";
import { gradientCode } from "@/features/gradients/utils/gradientCode";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MagicCard } from "@/features/gradients/components/MagicCard";
import { ChevronDown, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ColorSwatches } from "./ColorSwatches";
import { FavoriteButton } from "./FavoriteButton";
import { GradientPreview } from "./GradientPreview";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";


import { Gradient, GradientCardProps } from "@/features/gradients/types";
import { CodePreview } from "./CodePreview";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Icon Components for different formats
const TailwindIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C7.666,17.818,9.027,19.2,12.001,19.2c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
  </svg>
);

const CSSIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.413l.213 2.622h10.125l-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z" />
  </svg>
);

const SVGIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zM4 14h2v4h4v2H4v-6zm14 4v-4h2v6h-6v-2h4z" />
  </svg>
);

const FORMATS = [
  { key: "tailwind", label: "Tailwind CSS", icon: TailwindIcon },
  { key: "css", label: "CSS", icon: CSSIcon },
  { key: "svg", label: "SVG", icon: SVGIcon },
];

function cssAngleToSvgPoints(angle: number) {
  const normalized = ((angle % 360) + 360) % 360;
  const rad = (normalized * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  const tx = dx === 0 ? Number.POSITIVE_INFINITY : (dx > 0 ? 50 : -50) / dx;
  const ty = dy === 0 ? Number.POSITIVE_INFINITY : (dy > 0 ? 50 : -50) / dy;
  const reach = Math.min(tx, ty);

  const percent = (value: number) => `${(50 + value).toFixed(2)}%`;
  return {
    x1: percent(-dx * reach),
    y1: percent(-dy * reach),
    x2: percent(dx * reach),
    y2: percent(dy * reach),
  };
}

function buildSvg(name: string | undefined, colors: string[], angle: number, css: string) {
  const id = (name || "gradient")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "gradient";
  const stops = colors
    .map((color, index) => {
      const offset = colors.length === 1 ? 0 : (index / (colors.length - 1)) * 100;
      return `    <stop offset="${offset.toFixed(2)}%" stop-color="${color}" />`;
    })
    .join("\n");
  const shape = /^\s*radial-gradient\(/.test(css)
    ? "radial"
    : /^\s*conic-gradient\(/.test(css)
      ? "conic"
      : "linear";

  if (shape === "conic") {
    const safeCss = css.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
    return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800" role="img" aria-label="${id}">
  <foreignObject width="800" height="800">
    <div xmlns="http://www.w3.org/1999/xhtml" style="width:800px;height:800px;background:${safeCss}"></div>
  </foreignObject>
</svg>`;
  }

  const points = cssAngleToSvgPoints(angle);
  const paint = shape === "radial"
    ? `<radialGradient id="${id}" cx="50%" cy="50%" r="71%">
${stops}
  </radialGradient>`
    : `<linearGradient id="${id}" x1="${points.x1}" y1="${points.y1}" x2="${points.x2}" y2="${points.y2}">
${stops}
  </linearGradient>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800" role="img" aria-label="${id}">
  <defs>
  ${paint}
  </defs>
  <rect width="800" height="800" fill="url(#${id})" />
</svg>`;
}

export default function GradientCard({
  gradient,
  isFavorite,
  onFavoriteToggle,
  editable = false,
  onColorsChange,
  onEditClick,
  onDeleteClick,
  globalGradientType,
  globalGradientShape,
  isDisliked: _isDisliked,
  onDislikeToggle: _onDislikeToggle,
}: GradientCardProps) {
  const [activeTab, setActiveTab] = useState("tailwind");
  const [angle, setAngle] = useState((gradient as any).angle ?? 90);
  const [showAngleController, setShowAngleController] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (gradient.angle !== undefined) {
      setAngle(gradient.angle);
    }
  }, [gradient]);

  const {
    selectedColorFormat,
    setSelectedColorFormat,
    getColorInFormat,
    // Remove local gradientType/setGradientType
  } = useColorFormat();

  // Use props instead of local state
  // Derive shape from: global override > gradient's stored type > rawCss > default linear
  const getDefaultShape = () => {
    if (gradient.rawCss) return "auto";
    const t = (gradient as any).type;
    if (t === "conic") return "conic";
    if (t === "radial") return "radial";
    if (t === "default") return "auto";
    return "linear";
  };
  const gradientShape = globalGradientShape || getDefaultShape();
  const gradientType = globalGradientType || "background";
  const { copiedStates, copyToClipboard } = useCopyState();
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const SelectedFormatIcon = useMemo(() => {
    return FORMATS.find((f) => f.key === activeTab)?.icon;
  }, [activeTab]);

  const selectedFormatLabel = useMemo(() => {
    return FORMATS.find((f) => f.key === activeTab)?.label || activeTab;
  }, [activeTab]);

  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...gradient.colors];
    newColors[index] = newColor;
    onColorsChange?.(newColors);
  };

  const isLightGradient = useMemo(() => {
    return gradient.colors.every((color) => {
      const hex = color.replace(/^#/, "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 200;
    });
  }, [gradient.colors]);

  const handlePointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = clientX - centerX;
      const dy = clientY - centerY;

      // Invert dy for standard coordinate system if needed, but atan2(dy, dx) is fine
      // We want 0 degrees to be TOP (linear-gradient style)
      // Atan2(dy, dx) returns 0 for RIGHT, Math.PI/2 for BOTTOM, -Math.PI/2 for TOP
      // Adding 90 degrees (Math.PI/2) makes:
      // RIGHT: 0 + 90 = 90
      // BOTTOM: 90 + 90 = 180
      // LEFT: 180 + 90 = 270
      // TOP: -90 + 90 = 0
      let calculatedAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

      // Normalize to 0-360
      if (calculatedAngle < 0) calculatedAngle += 360;
      if (calculatedAngle >= 360) calculatedAngle -= 360;

      const roundedAngle = Math.round(calculatedAngle);
      setAngle(roundedAngle);
    },
    [setAngle],
  );

  const controlColor = isLightGradient ? "black" : "white";
  const lineLength = 80;
  const pad = 70;
  const size = (lineLength + pad) * 2;
  const cx = lineLength + pad;
  const cy = lineLength + pad;
  const angleInRadians = ((angle - 90) * Math.PI) / 180;
  const labelX = Math.cos(angleInRadians) * lineLength;
  const labelY = Math.sin(angleInRadians) * lineLength;
  const tooltipText = showAngleController
    ? "Hide angle controller"
    : "Show angle controller";
  const editTooltipText = "Edit gradient";
  const deleteTooltipText = "Delete gradient";

  const handleEditButtonClick = () => {
    if (onEditClick) {
      // Determine the actual rendered type from the card's current display
      const editType = (gradient as any).type || 
        (gradientShape === "conic" ? "conic" :
         gradientShape === "radial" ? "radial" :
         gradientShape === "auto" ? "default" : "linear");

      // Capture the EXACT CSS being rendered so the PreviewArea shows the same visual
      const computedCss = getGradientStyle();

      onEditClick({
        ...gradient,
        angle: gradient.angle ?? angle,
        type: editType,
        rawCss: computedCss, // Pass exact rendered CSS for perfect visual match
        exposure: gradient.exposure,
        contrast: gradient.contrast,
        frequency: gradient.frequency,
        phase: gradient.phase,
        steps: gradient.steps,
        baseColors: gradient.baseColors || gradient.colors,
      });
    } else {
      console.warn("onEditClick prop is not provided");
    }
  };

  const handleDeleteButtonClick = () => {
    if (onDeleteClick && gradient.id) {
      onDeleteClick(gradient as Gradient & { id: string });
    } else {
      console.warn("onDeleteClick prop is not provided or gradient id is missing");
    }
  };


  const formattedColors = gradient.colors.map((color) =>
    getColorInFormat(color),
  );

  const getGradientStyle = () => {
    // 1. Check for global force-shape overrides from SearchBox (if not "auto")
    if (globalGradientShape && globalGradientShape !== "auto") {
      if (globalGradientShape === "linear") {
        return `linear-gradient(${angle}deg, ${formattedColors.join(", ")})`;
      }
      if (globalGradientShape === "radial") {
        return `radial-gradient(circle, ${formattedColors.join(", ")})`;
      }
      if (globalGradientShape === "conic") {
        return `conic-gradient(from ${angle}deg, ${formattedColors.join(", ")})`;
      }
    }

    // 2. Handle native/auto rendering logic
    const nativeType = (gradient as any).type || "linear";

    // AI / High-fidelity logic for "default", "auto" or rawCss gradients
    if (nativeType === "default" || nativeType === "auto" || (gradient.rawCss && (!globalGradientShape || globalGradientShape === "auto"))) {
      if (gradient.rawCss) {
        let css = gradient.rawCss;
        // Convert all colors in the raw CSS to the selected format
        gradient.colors.forEach((hexColor, index) => {
          const formattedColor = formattedColors[index];
          css = css.split(new RegExp(hexColor, "i")).join(formattedColor);
        });

        // Inject current angle into CSS if possible
        if (css.includes("linear-gradient")) {
          return css.replace(
            /(-?\d+(\.\d+)?deg|to (top|bottom|left|right|top right|top left|bottom right|bottom left))/,
            `${angle}deg`
          );
        } else if (css.includes("conic-gradient")) {
          return css.replace(
            /from\s+(-?\d+(\.\d+)?deg)/,
            `from ${angle}deg`
          );
        }
        return css;
      }

      // Default AI style is the new Segmented Conic
      if (nativeType === "default" || nativeType === "auto") {
        return gradientCode.generateSegmentedConic(
          formattedColors,
          angle
        );
      }
    }

    // 3. Fallback to standard shapes based on native type
    if (nativeType === "conic") {
      return `conic-gradient(from ${angle}deg, ${formattedColors.join(", ")})`;
    }
    if (nativeType === "radial") {
      return `radial-gradient(circle, ${formattedColors.join(", ")})`;
    }

    // Standard Linear fallback
    return `linear-gradient(${angle}deg, ${formattedColors.join(", ")})`;
  };

  const getCodePreview = (): React.CSSProperties => {
    const gradientStyle = getGradientStyle();
    return gradientType === "background"
      ? { background: gradientStyle }
      : {
        color: "transparent",
        backgroundImage: gradientStyle,
        WebkitBackgroundClip: "text",
      };
  };

  const getCode = (format: string) => {
    const animationOptions = {
      colors: formattedColors,
      angle,
      isAnimated: false,
      animationSpeed: 1,
      gradientType,
      customCss: getGradientStyle(),
    };

    switch (format) {
      case "tailwind":
        return gradientCode.generateAnimatedTailwind(animationOptions);
      case "css":
        return gradientCode.generateAnimatedCSS(animationOptions);
      case "sass":
        return gradientCode.generateAnimatedSass(animationOptions);
      case "bootstrap":
        return gradientCode.generateAnimatedBootstrap(
          animationOptions,
        );
      case "react-native":
        return gradientCode.generateAnimatedReactNative(
          animationOptions,
        );
      case "flutter":
        return gradientCode.generateAnimatedFlutter(animationOptions);
      case "swiftui":
        return gradientCode.generateAnimatedSwiftUI(animationOptions);
      case "kotlin":
        return gradientCode.generateAnimatedKotlin(animationOptions);
      case "vue":
        return gradientCode.generateAnimatedVue(animationOptions);
      case "angular":
        return gradientCode.generateAnimatedAngular(animationOptions);
      case "react":
        return gradientCode.generateAnimatedReact(animationOptions);
      case "xml":
        return gradientCode.generateAnimatedXML(animationOptions);
      case "svg":
        return buildSvg(gradient.name, formattedColors, angle, getGradientStyle());
      case "json": {
        const gradientStyle = getGradientStyle();
        return JSON.stringify(
          {
            name: gradient.name,
            colors: formattedColors,
            angle: angle,
            type:
              gradientShape === "linear"
                ? "linear-gradient"
                : gradientShape === "radial"
                  ? "radial-gradient"
                  : "conic-gradient",
            format: selectedColorFormat,
            gradientType: gradientType,
            isAnimated: false,
            animationSpeed: 1,
            css: gradientStyle,
            animatedCSS: null,
            metadata: {
              exportedAt: new Date().toISOString(),
              tool: "GradientsCSS",
              version: "1.0.0",
            },
          },
          null,
          2,
        );
      }
      default:
        return "";
    }
  };



  return (
    <MagicCard
      gradientColor="#404040"
      className="group relative overflow-hidden transition-all duration-300"
    >
      <div className="relative md:absolute md:left-0 md:right-0 md:top-3.5 z-[70] flex items-center justify-between px-3.5 py-4 md:py-0 md:px-3.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 md:pointer-events-none">
        {/* User-specified Like/Dislike UI in TOP LEFT */}
        <FavoriteButton
          isLiked={isFavorite}
          onLikeToggle={() => onFavoriteToggle(gradient.name)}
        />

        <TooltipProvider>
          <div className="relative pointer-events-auto flex gap-0.5 px-1 py-1 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 hover:bg-white/5"
            style={{
              backgroundColor: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {onEditClick && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleEditButtonClick}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5 text-white" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-black/90 border-white/10">
                  <p className="text-white">{editTooltipText}</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Delete Button */}
            {onDeleteClick && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleDeleteButtonClick}
                    className="p-1 rounded-full hover:bg-red-500/20 transition-colors group"
                  >
                    <Trash2 className="h-3.5 w-3.5 transition-colors group-hover:text-red-500" style={{ color: "rgba(239, 68, 68, 0.7)" }} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-red-950 border-red-500/20 text-white">
                  <p className="text-white">{deleteTooltipText}</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Eye/EyeOff Toggle Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={tooltipText}
                  onClick={() => setShowAngleController((v) => !v)}
                  className="p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  {showAngleController ? (
                    <Eye className="h-3.5 w-3.5 text-white" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5 text-white" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-black/90 border-white/10">
                <p className="text-white">{tooltipText}</p>
              </TooltipContent>
            </Tooltip>

          </div>
        </TooltipProvider>
      </div>

      <div key={gradientType}>
        <div
          className="relative mx-auto flex h-48 w-48 sm:h-56 sm:w-56 items-center justify-center"
          ref={containerRef}
        >
          <GradientPreview
            style={getCodePreview()}
            gradientType={gradientType}
            gradient={gradient}
          />

          {showAngleController && (
              <div className="pointer-events-none absolute inset-0 z-[40] flex items-center justify-center">
                <div
                  className="absolute h-2 w-2 rounded-full"
                  style={{ backgroundColor: controlColor, opacity: 0.5 }}
                />

                <svg
                  className="pointer-events-auto absolute"
                  width={size}
                  height={size}
                  viewBox={`0 0 ${size} ${size}`}
                  style={{
                    overflow: "visible",
                    touchAction: "none",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    isDraggingRef.current = true;
                    (e.currentTarget as SVGSVGElement).setPointerCapture(
                      e.pointerId,
                    );
                    handlePointer(e.clientX, e.clientY);
                  }}
                  onPointerMove={(e) => {
                    if (!isDraggingRef.current) return;
                    handlePointer(e.clientX, e.clientY);
                  }}
                  onPointerUp={(e) => {
                    isDraggingRef.current = false;
                    try {
                      (
                        e.currentTarget as SVGSVGElement
                      ).releasePointerCapture(e.pointerId);
                    } catch {
                      // ignore
                    }
                  }}
                >
                  <g transform={`rotate(${angle} ${cx} ${cy})`}>
                    <line
                      x1={cx}
                      y1={cy}
                      x2={cx}
                      y2={cy - lineLength}
                      stroke={controlColor}
                      strokeWidth={2}
                      opacity={0.4}
                      pointerEvents="none"
                    />

                    <circle
                      cx={cx}
                      cy={cy - lineLength}
                      r={20}
                      fill={
                        isLightGradient
                          ? "rgba(0,0,0,0.15)"
                          : "rgba(255,255,255,0.15)"
                      }
                      stroke={
                        isLightGradient
                          ? "rgba(0,0,0,0.3)"
                          : "rgba(255,255,255,0.3)"
                      }
                      strokeWidth={2}
                      style={{ cursor: "grab" }}
                    />

                    <circle
                      cx={cx}
                      cy={cy - lineLength}
                      r={6}
                      fill={controlColor}
                      opacity={0.95}
                      pointerEvents="none"
                    />
                  </g>
                </svg>

                <div
                  className="absolute"
                  style={{ transform: `translate(${labelX}px, ${labelY}px)` }}
                >
                  <div
                    className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium backdrop-blur-sm"
                    style={{
                      backgroundColor: isLightGradient
                        ? "rgba(0,0,0,0.75)"
                        : "rgba(0,0,0,0.8)",
                      color: "white",
                      pointerEvents: "none",
                    }}
                  >
                    {angle}°
                  </div>
                </div>
              </div>
            )}
        </div>


      </div>

      <footer className="flex flex-col items-start space-y-3 p-4 pt-2 max-md:pt-[30px]">
        <div className="w-full">
          <ColorSwatches
            colors={gradient.colors}
            getColorInFormat={getColorInFormat}
            editable={editable}
            onColorChange={handleColorChange}
            copyToClipboard={(text) => copyToClipboard(text, "colors")}
          />
        </div>




        <>
          {isMobile ? (
            <Drawer open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DrawerTrigger className="nofocus relative w-full">
                <div className="flex items-center justify-between rounded-lg border border-border bg-secondary p-2 text-sm text-primary">
                  <div className="flex items-center gap-2">
                    {SelectedFormatIcon && <SelectedFormatIcon />}
                    <span>{selectedFormatLabel}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </DrawerTrigger>
              <DrawerContent className="bg-[#171717] border-[#262626] p-5">
                <DrawerHeader>
                  <DrawerTitle className="text-[#fafafa] text-lg font-bold mb-4">Select Code Format</DrawerTitle>
                </DrawerHeader>
                <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[60vh] custom-scrollbar pb-10">
                  {FORMATS.map((format) => (
                    <button
                      key={format.key}
                      onClick={() => {
                        setActiveTab(format.key);
                        setIsDialogOpen(false);
                      }}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border p-3 transition-all",
                        activeTab === format.key
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-[#262626] border-transparent text-[#d4d4d4] hover:bg-[#404040]"
                      )}
                    >
                      <format.icon />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-center">{format.label}</span>
                    </button>
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="nofocus relative w-full">
                <div className="flex items-center justify-between rounded-lg border border-border bg-secondary p-2 text-sm text-primary">
                  <div className="flex items-center gap-2">
                    {SelectedFormatIcon && <SelectedFormatIcon />}
                    <span>{selectedFormatLabel}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 rounded-2xl border border-border bg-secondary p-1"
              >
                {FORMATS.map((format) => (
                  <DropdownMenuItem
                    key={format.key}
                    onSelect={() => {
                      setActiveTab(format.key);
                    }}
                    className="hover:bg-primary/10 cursor-pointer rounded-xl px-2 py-1.5 text-sm text-primary"
                  >
                    <div className="flex items-center gap-2">
                      <format.icon />
                      <span>{format.label}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <CodePreview
            code={getCode(activeTab)}
            copiedStates={copiedStates}
            activeTab={activeTab as any}
            copyToClipboard={(text, key) => {
              copyToClipboard(text, key);
            }}
            selectedColorFormat={selectedColorFormat}
            onColorFormatChange={setSelectedColorFormat}
          />
        </>
      </footer>


    </MagicCard>
  );
}
