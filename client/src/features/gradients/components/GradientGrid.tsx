import { motion, AnimatePresence } from "framer-motion";
import GradientCard from "./GradientCard";
import SkeletonGradientCard from "./SkeletonGradientCard";
import { FileWarningIcon } from "lucide-react";

interface GradientGridProps {
  gradients: Array<{ name: string; colors: string[] }>;
  favorites: string[];
  toggleFavorite: (name: string) => void;
  setBackground: (background: string) => void;
  isLoading: boolean;
}

export default function GradientGrid({
  gradients,
  favorites,
  toggleFavorite,
  isLoading,
}: GradientGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="wait">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={`skeleton-${index}`}
              layout
          
            >
              <SkeletonGradientCard />
            </motion.div>
          ))
        ) : gradients.length === 0 ? (
          <motion.div
            key="no-gradients"
            layout
        
            className="col-span-full flex min-h-[20vh] items-center justify-center gap-1 pt-16 text-center text-muted-foreground"
          >
            <FileWarningIcon />
            <span>No gradients found</span>
          </motion.div>
        ) : (
          gradients.map((gradient) => (
            <motion.div
              key={gradient.name}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GradientCard
                gradient={gradient}
                isFavorite={favorites.includes(gradient.name)}
                onFavoriteToggle={() => toggleFavorite(gradient.name)}
              />
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
