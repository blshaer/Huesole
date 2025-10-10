import { ColorFormatSelector } from "../controls/ColorFormatSelector";
import { GradientTypeSelector } from "../controls/GradientTypeSelector";

interface GradientControlsProps {
  selectedColorFormat: string;
  setSelectedColorFormat: (format: string) => void;
  colorFormats: string[];
  gradientType: "background" | "text" | "image";
  setGradientType: (type: "background" | "text" | "image") => void;
}

export const GradientControls: React.FC<GradientControlsProps> = ({
  selectedColorFormat,
  setSelectedColorFormat,
  colorFormats,
  gradientType,
  setGradientType,
}) => (
  <div className="flex gap-1">
    <ColorFormatSelector
      selectedColorFormat={selectedColorFormat}
      setSelectedColorFormat={setSelectedColorFormat}
      colorFormats={colorFormats}
    />

    <div>{/* Placeholder for future controls */}</div>

    <GradientTypeSelector
      gradientType={gradientType}
      setGradientType={setGradientType}
    />
  </div>
);
