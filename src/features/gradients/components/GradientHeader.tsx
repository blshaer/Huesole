import { motion } from "framer-motion";
import { Heart, Download, Grid, Palette } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { cn } from "@/shared/lib/utils";

interface GradientHeaderProps {
  name: string;
  isFavorite: boolean;
  onFavoriteToggle: (name: string) => void;
  onExport?: () => void;
  onPatternGenerator?: () => void;
  onBrandKitBuilder?: () => void;
}

export const GradientHeader: React.FC<GradientHeaderProps> = ({
  name,
  isFavorite,
  onFavoriteToggle,
  onExport,
  onPatternGenerator,
  onBrandKitBuilder,
}) => (
  <div className="flex w-full items-start justify-between">
    <div className="min-w-0 flex-1 pr-4">
      <h3 className="truncate text-lg font-bold leading-tight text-primary sm:text-xl">
        {name}
      </h3>
      <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
        Gradient Colors
      </p>
    </div>
    <div className="flex flex-shrink-0 items-center gap-1">
      {onExport && (
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              className="rounded-full p-2 transition-colors hover:bg-muted"
              onClick={onExport}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Download className="h-4 w-4 text-gray-400 hover:text-primary" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export gradient</p>
          </TooltipContent>
        </Tooltip>
      )}

      {onPatternGenerator && (
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              className="rounded-full p-2 transition-colors hover:bg-muted"
              onClick={onPatternGenerator}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Grid className="h-4 w-4 text-gray-400 hover:text-primary" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Generate patterns</p>
          </TooltipContent>
        </Tooltip>
      )}

      {onBrandKitBuilder && (
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              className="rounded-full p-2 transition-colors hover:bg-muted"
              onClick={onBrandKitBuilder}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Palette className="h-4 w-4 text-gray-400 hover:text-primary" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Build brand kit</p>
          </TooltipContent>
        </Tooltip>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            className="rounded-full p-2 transition-colors hover:bg-muted"
            onClick={() => onFavoriteToggle(name)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart
              className={cn(
                "h-5 w-5",
                isFavorite
                  ? "fill-current text-red-400"
                  : "text-gray-400 hover:text-red-400",
              )}
            />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isFavorite ? "Remove from favorites" : "Add to favorites"}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  </div>
);
