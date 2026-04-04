// src/features/gradients/components/GradientGrid.tsx

import { useNavigate } from "react-router-dom";
import GradientCard from "./GradientCard";
import SkeletonGradientCard from "./SkeletonGradientCard";
import { motion, AnimatePresence } from "framer-motion";

interface GradientGridProps {
  gradients: Array<{ name: string; colors: string[] }>;
  favorites: string[];
  toggleFavorite: (name: string) => void;
  isLoading: boolean;
  globalGradientType: "background" | "text" | "image";
  globalGradientShape: "linear" | "radial" | "conic";
}

export default function GradientGrid({
  gradients,
  favorites,
  toggleFavorite,
  isLoading,
  globalGradientType,
  globalGradientShape,
}: GradientGridProps) {
  const navigate = useNavigate();

  const handleEditGradient = (gradient: { name: string; colors: string[]; angle?: number; type?: string }) => {
    navigate("/ai-generator", {
      state: {
        name: gradient.name,
        colors: gradient.colors,
        angle: gradient.angle,
        type: gradient.type
      },
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3 min-h-[400px]">
      <AnimatePresence mode="wait">
        {isLoading ? (
          Array.from({ length: 9 }).map((_, index) => (
            <motion.div
              key={`skeleton-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkeletonGradientCard />
            </motion.div>
          ))
        ) : (gradients?.length ?? 0) === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="col-span-full flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="relative mb-8 flex h-48 w-48 items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-2xl opacity-50"></div>
              <motion.img
                src="/assets/error.png"
                alt="No gradients found"
                className="relative h-full w-full object-contain opacity-90 drop-shadow-2xl"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
              />
            </div>
            <h3 className="text-2xl font-bold text-white/90 tracking-tight">No gradients found</h3>
            <p className="mt-3 max-w-[320px] text-sm text-white/40 leading-relaxed font-medium">
              We couldn't find any gradients matching your current filters. Try adjusting them or start fresh.
            </p>
          </motion.div>
        ) : (
          gradients.map((gradient, index) => (
            <motion.div
              key={`${gradient.name}-${index}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <GradientCard
                gradient={gradient}
                isFavorite={favorites.includes(gradient.name || "")}
                onFavoriteToggle={() => toggleFavorite(gradient.name || "")}
                onEditClick={handleEditGradient}
                globalGradientType={globalGradientType}
                globalGradientShape={globalGradientShape}
              />
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
