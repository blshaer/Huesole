import { useMemo } from "react";
import { Gradient } from "./useGradients";

interface UseGradientFilterProps {
  gradients: Gradient[];
  debouncedSearch: string;
}

export function useGradientFilter({
  gradients,
  debouncedSearch,
}: UseGradientFilterProps) {
  const filteredGradients = useMemo(() => {
    if (!gradients.length) return [];
    const debouncedLower = debouncedSearch.toLowerCase();

    return gradients.filter((gradient) => {
      const name = gradient.name ?? "";
      const colorsname = gradient.colorsname ?? [];
      const keywords = gradient.keywords ?? [];

      return (
        !debouncedSearch ||
        name.toLowerCase().includes(debouncedLower) ||
        colorsname.some((color) =>
          (color ?? "").toLowerCase().includes(debouncedLower),
        ) ||
        keywords.some((kwOrList) => {
          if (Array.isArray(kwOrList)) {
            return kwOrList.some((kw) =>
              (kw ?? "").toLowerCase().includes(debouncedLower),
            );
          }
          return (kwOrList ?? "").toLowerCase().includes(debouncedLower);
        })
      );
    });
  }, [debouncedSearch, gradients]);

  return { filteredGradients };
}
