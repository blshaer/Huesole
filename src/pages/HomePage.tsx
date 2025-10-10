/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import GradientGrid from "@/components/sections/GradientGrid";
import Pagination from "@/components/layouts/Pagination";
import Footer from "@/components/layouts/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { SearchAndFilters } from "@/components/sections/SearchAndFilters";
import { FilterStatus } from "@/components/sections/FilterStatus";
import { ErrorDisplay } from "@/components/sections/ErrorDisplay";
import { colorUtils } from "@/utils/colorUtils";
import { useGradients } from "@/hooks/useGradients";
import { useFavorites } from "@/hooks/useFavorites";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useGradientFilter } from "@/hooks/useGradientFilter";

// --- Main Component ---
const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 250);

  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [background, setBackground] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const gradientsPerPage = 9;

  const { gradients, isLoading, error } = useGradients();
  const { favorites, toggleFavorite } = useFavorites();

  // Get available colors for filtering (simplified)
  const availableColors = useMemo(() => {
    return colorUtils.getSimplifiedColors(gradients);
  }, [gradients]);

  // --- Filtering Logic ---
  const { filteredGradients } = useGradientFilter({
    gradients,
    debouncedSearch,
    favorites,
    filter,
    selectedColors,
  });

  const totalPages = Math.ceil(filteredGradients.length / gradientsPerPage);
  const currentGradients = useMemo(() => {
    const start = (currentPage - 1) * gradientsPerPage;
    return filteredGradients
      .slice(start, start + gradientsPerPage)
      .filter((gradient): gradient is { name: string; colors: string[] } =>
        gradient.name !== undefined &&
        gradient.colors !== undefined &&
        gradient.name.length > 0 &&
        gradient.colors.length > 0
      );
  }, [currentPage, filteredGradients, gradientsPerPage]);

  // --- Handlers ---
  const handlePageChange = (direction: "next" | "prev") => {
    setCurrentPage((prev) => (direction === "next" ? prev + 1 : prev - 1));
  };

  // --- Render ---
  return (
    <TooltipProvider>
      <div className="container relative " style={{ background }}>
        <div className="mx-auto  space-y-2 pt-12">
          <HeroSection />

          <div className="flex flex-col gap-4">
            <SearchAndFilters
              searchTerm={searchTerm}
              onSearchChange={(value) => {
                setSearchTerm(value);
                setCurrentPage(1);
              }}
              availableColors={availableColors}
              selectedColors={selectedColors}
              onColorChange={(colors) => {
                setSelectedColors(colors);
                setCurrentPage(1);
              }}
              filter={filter}
              onFilterChange={(value) => {
                setFilter(value);
                setCurrentPage(1);
              }}
              gradients={gradients}
            />

            <FilterStatus
              filteredCount={filteredGradients.length}
              selectedColors={selectedColors}
              searchTerm={searchTerm}
              filter={filter}
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
              setBackground={setBackground}
              isLoading={isLoading}
            />
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        <Footer />
      </div>
    </TooltipProvider>
  );
};

export default HomePage;
