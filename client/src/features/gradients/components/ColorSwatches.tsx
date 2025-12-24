import { ColorSwatch } from "./ColorSwatch";

interface ColorSwatchesProps {
  colors: string[];
  getColorInFormat: (color: string) => string;
  editable?: boolean;
  onColorChange?: (index: number, newColor: string) => void;
  copyToClipboard: (text: string, key?: string) => void;

}

export const ColorSwatches: React.FC<ColorSwatchesProps> = ({
  colors,
  getColorInFormat,
  editable = false,
  onColorChange,
}) => (
  <div className="flex flex-wrap gap-2">
    {colors.map((color, index) => (
      <ColorSwatch
        key={index}
        color={color}
        formattedColor={getColorInFormat(color)}
        size="sm"
        editable={editable}
        onColorChange={(newColor) => onColorChange?.(index, newColor)}
      />
    ))}
  </div>
);
