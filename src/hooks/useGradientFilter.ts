import { useMemo } from "react";
import { Gradient } from "./useGradients";

interface UseGradientFilterProps {
  gradients: Gradient[];
  debouncedSearch: string;
  favorites: string[];
  filter: string;
  selectedColors: string[];
}

export function useGradientFilter({
  gradients,
  debouncedSearch,
  favorites,
  filter,
  selectedColors,
}: UseGradientFilterProps) {
  const filteredGradients = useMemo(() => {
    if (!gradients.length) return [];
    const debouncedLower = debouncedSearch.toLowerCase();

    return gradients.filter((gradient) => {
      // Defensive fallback for missing data!
      const name = gradient.name ?? "";
      const colorsname = gradient.colorsname ?? [];
      const keywords = gradient.keywords ?? [];

      // Search match
      const matchesSearch =
        !debouncedSearch ||
        name.toLowerCase().includes(debouncedLower) ||
        colorsname.some((color) =>
          (color ?? "").toLowerCase().includes(debouncedLower)
        ) ||
        keywords.some((kwList) =>
          (kwList ?? []).some((kw) =>
            (kw ?? "").toLowerCase().includes(debouncedLower)
          )
        );

      // Favorites match
      const matchesFavorites =
        filter === "all" ||
        (filter === "favorites" && favorites.includes(name));

      // Color match
      const matchesColors =
        selectedColors.length === 0 ||
        selectedColors.some((selectedColor) =>
          colorsname.some((gradientColor) => {
            const lowerGradientColor = (gradientColor ?? "").toLowerCase();
            const lowerSelectedColor = (selectedColor ?? "").toLowerCase();

            if (lowerSelectedColor === "red" && lowerGradientColor.includes("red")) return true;
            if (lowerSelectedColor === "pink" && lowerGradientColor.includes("pink")) return true;
            if (lowerSelectedColor === "orange" && lowerGradientColor.includes("orange")) return true;
            if (lowerSelectedColor === "yellow" && lowerGradientColor.includes("yellow")) return true;
            if (lowerSelectedColor === "green" && lowerGradientColor.includes("green")) return true;
            if (lowerSelectedColor === "blue" && lowerGradientColor.includes("blue")) return true;
            if (lowerSelectedColor === "purple" && (lowerGradientColor.includes("purple") || lowerGradientColor.includes("violet"))) return true;
            if (lowerSelectedColor === "brown" && (lowerGradientColor.includes("brown") || lowerGradientColor.includes("beige"))) return true;
            if (lowerSelectedColor === "black" && lowerGradientColor.includes("black")) return true;
            if (lowerSelectedColor === "white" && lowerGradientColor.includes("white")) return true;
            if (lowerSelectedColor === "gray" && (lowerGradientColor.includes("gray") || lowerGradientColor.includes("grey"))) return true;
            if (lowerSelectedColor === "teal" && lowerGradientColor.includes("teal")) return true;
            if (lowerSelectedColor === "cyan" && lowerGradientColor.includes("cyan")) return true;

            return false;
          })
        );
      return matchesSearch && matchesFavorites && matchesColors;
    });
  }, [debouncedSearch, gradients, favorites, filter, selectedColors]);

  return { filteredGradients };
}