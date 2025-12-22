import { useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "@/shared/hooks/use-toast";
import { cn } from "@/shared/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { Copy, Edit2 } from "lucide-react";

interface ColorSwatchProps {
  color: string;
  formattedColor?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "square";
  showIcon?: boolean;
  editable?: boolean;
  onColorChange?: (newColor: string) => void;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  formattedColor,
  className,
  size = "md",
  shape = "circle",
  showIcon = false,
  editable = false,
  onColorChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const displayColor = formattedColor || color;

  const copyColor = () => {
    if (editable) return;
    navigator.clipboard.writeText(displayColor);
    toast({
      title: "Color copied!",
      description: `${displayColor} copied to clipboard`,
    });
  };

  const handleSwatchClick = () => {
    if (editable) {
      inputRef.current?.click();
    } else {
      copyColor();
    }
  };

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const shapeClasses = {
    circle: "rounded-full",
    square: "rounded",
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          className={cn(
            "group relative cursor-pointer border border-white/20 transition-all",
            sizeClasses[size],
            shapeClasses[shape],
            className,
          )}
          style={{ backgroundColor: color }}
          onClick={handleSwatchClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={
            editable
              ? `Change color: ${displayColor}`
              : `Copy color: ${displayColor}`
          }
        >
          {editable ? (
            <div className="rounded-inherit h-5 w-5 absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
              <Edit2 className="h-full w-full text-white drop-shadow-lg" />
            </div>
          ) : (
            showIcon && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <Copy className="h-4 w-4 text-white drop-shadow-lg" />
              </div>
            )
          )}

          {editable && (
            <input
              ref={inputRef}
              type="color"
              value={color}
              onChange={(e) => onColorChange?.(e.target.value)}
              className="sr-only"
            />
          )}
        </motion.div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-white">
          {editable
            ? `Click to change color: ${displayColor}`
            : `Click to copy: ${displayColor}`}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
