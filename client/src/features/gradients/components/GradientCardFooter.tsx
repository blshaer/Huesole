import { AngleSlider } from "./AngleSlider";
import { AnimatedCheckbox } from "./AnimatedCheckbox";
import { AnimationSpeedControl } from "./AnimationSpeedControl";
import { ColorSwatches } from "./ColorSwatches";
import { ColorPalette } from "./ColorPalette";
import { CopyCodeSection } from "./CopyCodeSection";
import { ColorFormatSelector } from "./ColorFormatSelector";
import { GradientTypeSelector } from "./GradientTypeSelector";

interface GradientCardFooterProps {
  gradient: { name: string; colors: string[] };
  getColorInFormat: (color: string) => string;
  copyToClipboard: (
    text: string,
    key:
      | "tailwind"
      | "css"
      | "sass"
      | "bootstrap"
      | "react-native"
      | "flutter"
      | "swiftui"
      | "kotlin"
      | "vue"
      | "angular"
      | "react"
      | "xml"
      | "svg"
      | "json"
      | "colors",
  ) => void;
  selectedColorFormat: string;
  setSelectedColorFormat: (format: string) => void;
  colorFormats: string[];
  gradientType: "background" | "text";
  setGradientType: (type: "background" | "text") => void;
  angle: number;
  setAngle: (angle: number) => void;
  getCode: (format: string) => string;
  copiedStates: Record<string, boolean>;
  isAnimated: boolean;
  setIsAnimated: (animated: boolean) => void;
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
}

export const GradientCardFooter: React.FC<GradientCardFooterProps> = ({
  gradient,
  getColorInFormat,
  copyToClipboard,
  selectedColorFormat,
  setSelectedColorFormat,
  colorFormats,
  gradientType,
  setGradientType,
  angle,
  setAngle,
  getCode,
  copiedStates,
  isAnimated,
  setIsAnimated,
  animationSpeed,
  setAnimationSpeed,
}) => (
  <div className="flex max-w-full flex-col items-start space-y-5 sm:space-y-6">
    <div className="flex w-full items-center justify-between gap-3 sm:gap-4">
      <ColorSwatches
        colors={gradient.colors}
        getColorInFormat={getColorInFormat}
        copyToClipboard={(text) => navigator.clipboard.writeText(text)}
      />

      <div className="flex items-center gap-2">
        <ColorFormatSelector
          selectedColorFormat={selectedColorFormat}
          setSelectedColorFormat={setSelectedColorFormat}
          colorFormats={colorFormats}
        />
        <GradientTypeSelector
          gradientType={gradientType}
          setGradientType={setGradientType}
        />
      </div>
    </div>

    <AngleSlider
      angle={angle}
      setAngle={(newAngle) => {
        setAngle(newAngle);
      }}
    />

    {/* Animation Controls */}
    <div className="flex w-full flex-col gap-3 sm:gap-4">
      <AnimatedCheckbox checked={isAnimated} onChange={setIsAnimated} />

      <AnimationSpeedControl
        speed={animationSpeed}
        onChange={setAnimationSpeed}
        disabled={!isAnimated}
      />
    </div>

    {/* Color Palette */}
    <ColorPalette colors={gradient.colors} gradientName={gradient.name} />

    {/* Copy Code Section */}
    <CopyCodeSection
      getCode={getCode}
      copiedStates={copiedStates}
      copyToClipboard={copyToClipboard}
    />
  </div>
);
