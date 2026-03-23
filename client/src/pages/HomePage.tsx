/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo } from "react";
import { TooltipProvider } from "@/shared/ui/tooltip";
import GradientGrid from "@/features/gradients/components/GradientGrid";
import Pagination from "@/features/landing/components/Pagination";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { SearchAndFilters } from "@/features/search/components/SearchAndFilters";
import { FilterStatus } from "@/features/search/components/FilterStatus";
import { ErrorDisplay } from "@/features/landing/components/ErrorDisplay";
import { useGradients, type Gradient } from "@/features/gradients/hooks/useGradients";
import { useFavorites } from "@/features/gradients/hooks/useFavorites";
import { useGradientFilter } from "@/features/gradients/hooks/useGradientFilter";

// --- Main Component ---
const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [globalGradientType, setGlobalGradientType] = useState<"background" | "text" | "image">("background");
  const [globalGradientShape, setGlobalGradientShape] = useState<"linear" | "radial" | "conic">("linear");

  const gradientsPerPage = 9;

  const { gradients, isLoading, error } = useGradients();
  const { favorites, toggleFavorite } = useFavorites();

  // --- Filtering Logic (auto-search as you type) ---
  const { filteredGradients } = useGradientFilter({
    gradients,
    debouncedSearch: searchTerm,
  });

  const totalPages = Math.ceil(filteredGradients.length / gradientsPerPage);
  const currentGradients = useMemo(() => {
    const start = (currentPage - 1) * gradientsPerPage;
    return filteredGradients
      .slice(start, start + gradientsPerPage)
      .filter(
        (gradient): gradient is Gradient & { name: string } =>
          gradient.name !== undefined &&
          gradient.colors !== undefined &&
          gradient.name.length > 0 &&
          gradient.colors.length > 0,
      );
  }, [currentPage, filteredGradients, gradientsPerPage]);

  // --- Handlers ---
  const handlePageChange = (direction: "next" | "prev") => {
    setCurrentPage((prev) => (direction === "next" ? prev + 1 : prev - 1));
  };

  // --- Render ---
  return (
    <TooltipProvider>
      <div>
        <div className="mx-auto space-y-2">
          <HeroSection />

          <div className="container max-md:pt-8">
            <div className="flex flex-col gap-4">
              <SearchAndFilters
                searchTerm={searchTerm}
                onSearchChange={(value) => {
                  setSearchTerm(value);
                  setCurrentPage(1);
                }}
                gradients={gradients}
                gradientType={globalGradientType}
                onGradientTypeChange={setGlobalGradientType}
                gradientShape={globalGradientShape}
                onGradientShapeChange={setGlobalGradientShape}
              />

              <FilterStatus
                filteredCount={filteredGradients.length}
                searchTerm={searchTerm}
              />
            </div>

            {error && (
              <ErrorDisplay
                error={error}
                onRetry={() => window.location.reload()}
              />
            )}

            {!error && (
              <GradientGrid
                gradients={currentGradients}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                isLoading={isLoading}
                globalGradientType={globalGradientType}
                globalGradientShape={globalGradientShape}
              />
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default HomePage;
