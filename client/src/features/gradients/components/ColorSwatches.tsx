import { ColorSwatch } from "./ColorSwatch";

interface ColorSwatchesProps {
  colors: string[];
  getColorInFormat: (color: string) => string;
}

export const ColorSwatches: React.FC<ColorSwatchesProps> = ({
  colors,
  getColorInFormat,
}) => (
  <div className="flex flex-wrap gap-2">
    {colors.map((color, index) => (
      <ColorSwatch
        key={index}
        color={color}
        formattedColor={getColorInFormat(color)}
        size="sm"
      />
    ))}
  </div>
);
