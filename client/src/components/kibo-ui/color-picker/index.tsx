"use client";

import Color from "color";
import { PipetteIcon } from "lucide-react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  Fragment,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { cn } from "@/shared/lib/utils";

type ColorPickerContextValue = {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
  mode: string;
  setHue: (hue: number) => void;
  setSaturation: (saturation: number) => void;
  setLightness: (lightness: number) => void;
  setAlpha: (alpha: number) => void;
  setMode: (mode: string) => void;
};

const ColorPickerContext = createContext<ColorPickerContextValue | undefined>(
  undefined
);

export const useColorPicker = () => {
  const context = useContext(ColorPickerContext);

  if (!context) {
    throw new Error("useColorPicker must be used within a ColorPickerProvider");
  }

  return context;
};

export type ColorPickerProps = HTMLAttributes<HTMLDivElement> & {
  value?: Parameters<typeof Color>[0];
  defaultValue?: Parameters<typeof Color>[0];
  onChange?: (value: string) => void;
};

export const ColorPicker = ({
  value,
  defaultValue = "#000000",
  onChange,
  className,
  ...props
}: ColorPickerProps) => {
  const initialColor = Color(value || defaultValue);
  
  const [hue, setHue] = useState(() => initialColor.hue());
  const [saturation, setSaturation] = useState(() => initialColor.saturationl());
  const [lightness, setLightness] = useState(() => initialColor.lightness());
  const [alpha, setAlpha] = useState(() => initialColor.alpha() * 100);
  const [mode, setMode] = useState("hex");

  // Update state when controlled value changes, but avoid resetting hue for grayscale
  useEffect(() => {
    if (value) {
      try {
        const color = Color(value);
        const newHue = color.hue();
        const newSat = color.saturationl();
        const newLight = color.lightness();
        const newAlpha = color.alpha() * 100;

        // Only update hue if the color actually has saturation and is not black/white
        // This prevents the hue slider from jumping to 0 when picking grayscale colors
        if (newSat > 0 && newLight > 0 && newLight < 100) {
          setHue(newHue);
        }
        
        setSaturation(newSat);
        setLightness(newLight);
        setAlpha(newAlpha);
      } catch (e) {
        // Ignore invalid colors
      }
    }
  }, [value]);

  // Notify parent of changes with careful change detection
  useEffect(() => {
    if (onChange) {
      const color = Color.hsl(hue, saturation, lightness).alpha(alpha / 100);
      let output = "";
      if (mode === "hex") output = color.hex();
      else if (mode === "rgb") output = color.rgb().string();
      else if (mode === "hsl") output = color.hsl().string();
      else output = color.rgb().string();
      
      // Prevent infinite loops by only calling onChange if color string is actually different
      const currentValString = value ? Color(value).rgb().string() : "";
      const newValString = color.rgb().string();
      
      if (currentValString !== newValString) {
        onChange(output);
      }
    }
  }, [hue, saturation, lightness, alpha, mode, onChange, value]);

  return (
    <ColorPickerContext.Provider
      value={{
        hue,
        saturation,
        lightness,
        alpha,
        mode,
        setHue,
        setSaturation,
        setLightness,
        setAlpha,
        setMode,
      }}
    >
      <div
        className={cn("flex size-full flex-col gap-4", className)}
        {...props}
      />
    </ColorPickerContext.Provider>
  );
};

export type ColorPickerSelectionProps = HTMLAttributes<HTMLDivElement>;

export const ColorPickerSelection = memo(
  ({ className, ...props }: ColorPickerSelectionProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [positionX, setPositionX] = useState(0);
    const [positionY, setPositionY] = useState(0);
    const { hue, saturation, lightness, setSaturation, setLightness } = useColorPicker();

    // Sync positions from HSL state (HSV mapping)
    useEffect(() => {
      if (isDragging) return;

      // Convert HSL to HSV for visual positioning
      const s_l = saturation / 100;
      const l = lightness / 100;

      const v = l + s_l * Math.min(l, 1 - l);
      const s_v = v === 0 ? 0 : 2 * (1 - l / v);

      setPositionX(s_v);
      setPositionY(1 - v);
    }, [hue, saturation, lightness, isDragging]);

    const backgroundGradient = useMemo(() => {
      return `linear-gradient(0deg, #000, transparent),
              linear-gradient(90deg, #fff, transparent),
              hsl(${hue}, 100%, 50%)`;
    }, [hue]);

    const handlePointerMove = useCallback(
      (event: PointerEvent) => {
        if (!(isDragging && containerRef.current)) {
          return;
        }
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        
        setPositionX(x);
        setPositionY(y);

        // Convert HSV-like coordinates to HSL
        const s_v = x;
        const v = 1 - y;

        const l = v * (1 - s_v / 2);
        const s_l = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);

        setSaturation(s_l * 100);
        setLightness(l * 100);
      },
      [isDragging, setSaturation, setLightness]
    );

    useEffect(() => {
      const handlePointerUp = () => setIsDragging(false);

      if (isDragging) {
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
      }

      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };
    }, [isDragging, handlePointerMove]);

    return (
      <div
        className={cn("relative h-40 w-full cursor-crosshair rounded", className)}
        onPointerDown={(e) => {
          e.preventDefault();
          setIsDragging(true);
          handlePointerMove(e.nativeEvent);
        }}
        ref={containerRef}
        style={{
          background: backgroundGradient,
        }}
        {...props}
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute h-4 w-4 rounded-full border-2 border-white"
          style={{
            left: `${positionX * 100}%`,
            top: `${positionY * 100}%`,
            boxShadow: "0 0 0 1px rgba(0,0,0,0.5)",
          }}
        />
      </div>
    );
  }
);

ColorPickerSelection.displayName = "ColorPickerSelection";

export type ColorPickerHueProps = ComponentProps<typeof SliderPrimitive.Root>;

export const ColorPickerHue = ({
  className,
  ...props
}: ColorPickerHueProps) => {
  const { hue, setHue } = useColorPicker();

  return (
    <SliderPrimitive.Root
      className={cn("relative flex h-4 w-full touch-none items-center", className)}
      max={360}
      onValueChange={([hue]) => setHue(hue)}
      step={1}
      value={[hue]}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-3 w-full grow rounded-full bg-[linear-gradient(90deg,#FF0000,#FFFF00,#00FF00,#00FFFF,#0000FF,#FF00FF,#FF0000)]">
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-4 w-4 cursor-pointer rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  );
};

export type ColorPickerAlphaProps = ComponentProps<typeof SliderPrimitive.Root>;

export const ColorPickerAlpha = ({
  className,
  ...props
}: ColorPickerAlphaProps) => {
  const { hue, saturation, lightness, alpha, setAlpha } = useColorPicker();

  return (
    <SliderPrimitive.Root
      className={cn("relative flex h-4 w-full touch-none items-center", className)}
      max={100}
      onValueChange={([alpha]) => setAlpha(alpha)}
      step={1}
      value={[alpha]}
      {...props}
    >
      <SliderPrimitive.Track 
        className="relative h-3 w-full grow rounded-full bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==')] bg-center bg-repeat-x"
      >
        <div 
          className="absolute inset-0 rounded-full" 
          style={{
            background: `linear-gradient(90deg, transparent, hsl(${hue}, ${saturation}%, ${lightness}%))`
          }}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-4 w-4 cursor-pointer rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  );
};

export type ColorPickerEyeDropperProps = ComponentProps<typeof Button>;

export const ColorPickerEyeDropper = ({
  className,
  ...props
}: ColorPickerEyeDropperProps) => {
  const { setHue, setSaturation, setLightness, setAlpha } = useColorPicker();

  const handleEyeDropper = async () => {
    try {
      // @ts-expect-error - EyeDropper API is experimental
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      const color = Color(result.sRGBHex);
      const [h, s, l] = color.hsl().array();

      setHue(h);
      setSaturation(s);
      setLightness(l);
      setAlpha(100);
    } catch (error) {
      console.error("EyeDropper failed:", error);
    }
  };

  return (
    <Button
      className={cn(
        "shrink-0 h-10 w-10 text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors",
        className
      )}
      onClick={handleEyeDropper}
      size="icon"
      type="button"
      variant="ghost"
      {...props}
    >
      <PipetteIcon size={16} />
    </Button>
  );
};

export type ColorPickerOutputProps = ComponentProps<typeof SelectTrigger>;

const formats = ["hex", "rgb", "hsl"];

export const ColorPickerOutput = ({
  className,
  ...props
}: ColorPickerOutputProps) => {
  const { mode, setMode } = useColorPicker();

  return (
    <Select onValueChange={setMode} value={mode}>
      <SelectTrigger className="h-10 w-24 shrink-0 text-xs" {...props}>
        <SelectValue placeholder="Mode" />
      </SelectTrigger>
      <SelectContent>
        {formats.map((format) => (
          <SelectItem className="text-xs" key={format} value={format}>
            {format.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

type PercentageInputProps = ComponentProps<typeof Input>;

const PercentageInput = ({ className, ...props }: PercentageInputProps) => {
  return (
    <div className="relative">
      <Input
        readOnly
        type="text"
        {...props}
        className={cn(
          "h-10 w-[4rem] border-0 rounded-none bg-transparent px-2 text-xs shadow-none focus-visible:ring-0",
          className
        )}
      />
      <span className="-translate-y-1/2 absolute top-1/2 right-2 text-muted-foreground text-[10px] pointer-events-none opacity-50 font-bold">
        %
      </span>
    </div>
  );
};

export type ColorPickerFormatProps = HTMLAttributes<HTMLDivElement>;

export const ColorPickerFormat = ({
  className,
  ...props
}: ColorPickerFormatProps) => {
  const { hue, saturation, lightness, alpha, mode } = useColorPicker();
  const color = Color.hsl(hue, saturation, lightness).alpha(alpha / 100);

  if (mode === "hex") {
    const hex = color.hex();

    return (
      <div
        className={cn(
          "relative flex w-full items-center rounded-xl bg-white/5 border border-white/10 overflow-hidden shadow-sm",
          className
        )}
        {...props}
      >
        <Input
          className="h-10 border-0 rounded-none bg-transparent px-2 text-xs shadow-none focus-visible:ring-0 flex-1"
          readOnly
          type="text"
          value={hex}
        />
        <div className="w-px h-4 bg-white/10" />
        <PercentageInput value={Math.round(alpha)} />
      </div>
    );
  }

  if (mode === "rgb") {
    const rgb = color
      .rgb()
      .array()
      .map((value) => Math.round(value));

    return (
      <div
        className={cn(
          "relative flex w-full items-center rounded-xl bg-white/5 border border-white/10 overflow-hidden shadow-sm",
          className
        )}
        {...props}
      >
        {rgb.map((value, index) => (
          <Fragment key={index}>
            <Input
              className="h-10 border-0 rounded-none bg-transparent px-2 text-xs shadow-none flex-1 focus-visible:ring-0"
              readOnly
              type="text"
              value={value}
            />
            <div className="w-px h-4 bg-white/10" />
          </Fragment>
        ))}
        <PercentageInput value={Math.round(alpha)} />
      </div>
    );
  }

  if (mode === "hsl") {
    const hsl = color
      .hsl()
      .array()
      .map((value) => Math.round(value));

    return (
      <div
        className={cn(
          "relative flex w-full items-center rounded-xl bg-white/5 border border-white/10 overflow-hidden shadow-sm",
          className
        )}
        {...props}
      >
        {hsl.map((value, index) => (
          <Fragment key={index}>
            <Input
              className="h-10 border-0 rounded-none bg-transparent px-2 text-xs shadow-none flex-1 focus-visible:ring-0"
              readOnly
              type="text"
              value={value}
            />
            <div className="w-px h-4 bg-white/10" />
          </Fragment>
        ))}
        <PercentageInput value={Math.round(alpha)} />
      </div>
    );
  }

  return null;
};
