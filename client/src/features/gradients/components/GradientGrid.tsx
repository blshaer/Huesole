// src/features/gradients/components/GradientGrid.tsx

import { useNavigate } from "react-router-dom";
import GradientCard from "./GradientCard";
import SkeletonGradientCard from "./SkeletonGradientCard";

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

  const handleEditGradient = (gradient: { name: string; colors: string[] }) => {
    navigate("/ai-generator", {
      state: {
        name: gradient.name,
        colors: gradient.colors,
      },
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <div key={`skeleton-${index}`}>
            <SkeletonGradientCard />
          </div>
        ))
      ) : gradients.length === 0 ? (
        <div
          key="no-gradients"
          className="col-span-full flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="relative mb-6 flex h-64 w-64 items-center justify-center">
            <img
              src="/assets/not-found-404.png"
              alt="No gradients found"
              className="h-full w-full object-contain opacity-80"
            />
          </div>
          <h3 className="text-xl font-semibold text-white/90">No gradients found</h3>
          <p className="mt-2 text-sm text-white/40">
            We couldn't find any gradients matching your current filters.
          </p>
        </div>
      ) : (
        gradients.map((gradient) => (
          <div key={gradient.name}>
            <GradientCard
              gradient={gradient}
              isFavorite={favorites.includes(gradient.name)}
              onFavoriteToggle={() => toggleFavorite(gradient.name)}
              onEditClick={handleEditGradient}
              globalGradientType={globalGradientType}
              globalGradientShape={globalGradientShape}
            />
          </div>
        ))
      )}
    </div>
  );
}
