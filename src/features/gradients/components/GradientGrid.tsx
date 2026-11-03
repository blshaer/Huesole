// src/features/gradients/components/GradientGrid.tsx

import GradientCard from "./GradientCard";
import SkeletonGradientCard from "./SkeletonGradientCard";

interface GradientGridProps {
  gradients: Array<{ name: string; colors: string[] }>;
  favorites: string[];
  toggleFavorite: (name: string) => void;
  dislikes?: string[];
  toggleDislike?: (name: string) => void;
  isLoading: boolean;
  globalGradientType: "background" | "text";
  globalGradientShape: "linear" | "radial" | "conic" | "auto";
  selectedNames?: string[];
  onSelectToggle?: (name: string) => void;
}

export default function GradientGrid({
  gradients,
  favorites,
  toggleFavorite,
  dislikes = [],
  toggleDislike,
  isLoading,
  globalGradientType,
  globalGradientShape,
  selectedNames = [],
  onSelectToggle,
}: GradientGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3 min-h-[400px]">
      {isLoading ? (
          Array.from({ length: 9 }).map((_, index) => (
            <div key={`skeleton-${index}`}>
              <SkeletonGradientCard />
            </div>
          ))
        ) : (gradients?.length ?? 0) === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-2xl font-bold text-[#fafafa] tracking-tight">No gradients found</h3>
            <p className="mt-3 max-w-[320px] text-sm text-[#a1a1a1] leading-relaxed font-medium">
              We couldn't find any gradients matching your current filters. Try adjusting them or start fresh.
            </p>
          </div>
        ) : (
          gradients.map((gradient, index) => (
            <div key={`${gradient.name}-${index}`}>
              <GradientCard
                gradient={gradient}
                isFavorite={favorites.includes(gradient.name || "")}
                onFavoriteToggle={() => toggleFavorite(gradient.name || "")}
                isDisliked={dislikes.includes(gradient.name || "")}
                onDislikeToggle={toggleDislike ? () => toggleDislike(gradient.name || "") : undefined}
                globalGradientType={globalGradientType}
                globalGradientShape={globalGradientShape}
                isSelected={selectedNames.includes(gradient.name || "")}
                onSelectToggle={onSelectToggle}
              />
            </div>
          ))
        )}
    </div>
  );
}
