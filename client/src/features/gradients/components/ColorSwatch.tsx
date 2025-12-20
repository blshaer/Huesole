import { motion } from "framer-motion";
import { toast } from "@/shared/hooks/use-toast";
import { cn } from "@/shared/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { Copy } from "lucide-react";

interface ColorSwatchProps {
    color: string;
    formattedColor?: string;
    className?: string;
    size?: "sm" | "md" | "lg";
    shape?: "circle" | "square";
    showIcon?: boolean;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
    color,
    formattedColor,
    className,
    size = "md",
    shape = "circle",
    showIcon = false,
}) => {
    const displayColor = formattedColor || color;

    const copyColor = () => {
        navigator.clipboard.writeText(displayColor);
        toast({
            title: "Color copied!",
            description: `${displayColor} copied to clipboard`,
        });
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
                    onClick={copyColor}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Copy color: ${displayColor}`}
                >
                    {showIcon && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                            <Copy className="h-4 w-4 text-white drop-shadow-lg" />
                        </div>
                    )}
                </motion.div>
            </TooltipTrigger>
            <TooltipContent>
                <p className="text-white">Click to copy: {displayColor}</p>
            </TooltipContent>
        </Tooltip>
    );
};
