// src/features/gradients/components/GradientGrid.tsx

import { useNavigate } from "react-router-dom";
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
  setBackground,
  isLoading,
}: GradientGridProps) {
  const navigate = useNavigate();

  const handleEditGradient = (gradient: { name: string; colors: string[] }) => {
    const css = `linear-gradient(90deg, ${gradient.colors.join(", ")})`;
    setBackground(css);

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
          className="col-span-full flex min-h-[20vh] items-center justify-center gap-1 pt-16 text-center text-muted-foreground"
        >
          <FileWarningIcon />
          <span>No gradients found</span>
        </div>
      ) : (
        gradients.map((gradient) => (
          <div key={gradient.name}>
            <GradientCard
              gradient={gradient}
              isFavorite={favorites.includes(gradient.name)}
              onFavoriteToggle={() => toggleFavorite(gradient.name)}
              onEditClick={handleEditGradient}
            />
          </div>
        ))
      )}
    </div>
  );
}
