/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [globalGradientType, setGlobalGradientType] = useState<"background" | "text">((searchParams.get("type") as any) || "background");
  const [globalGradientShape, setGlobalGradientShape] = useState<"linear" | "radial" | "conic" | "auto">((searchParams.get("shape") as any) || "auto");

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (globalGradientType !== "background") params.set("type", globalGradientType);
    if (globalGradientShape !== "auto") params.set("shape", globalGradientShape);
    
    // Use replace: true to avoid polluting history while typing/clicking
    setSearchParams(params, { replace: true });
  }, [searchTerm, currentPage, globalGradientType, globalGradientShape]);

  const gradientsPerPage = 9;

  const { gradients, isLoading, error } = useGradients();
  const { favorites, toggleFavorite } = useFavorites();
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  const handleSelectToggle = (name: string) => {
    setSelectedNames(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const handleCopyNames = () => {
    navigator.clipboard.writeText(selectedNames.join(", "));
    import("sonner").then(({ toast }) => {
      toast.success("Names Copied!", { description: `${selectedNames.length} names copied to clipboard` });
    });
    setSelectedNames([]);
  };

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
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // --- Render ---
  return (
    <TooltipProvider>
      <div className="relative min-h-screen">
        <div className="mx-auto space-y-2">
          <HeroSection />

          <div className="container max-md:pt-8 pb-16 home-page-header">
            <div className="flex flex-col gap-4">
              <SearchAndFilters
                searchTerm={searchTerm}
                onSearchChange={(value) => {
                  setSearchTerm(value);
                  setCurrentPage(1);
                }}
                isLoading={isLoading}
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
                selectedNames={selectedNames}
                onSelectToggle={handleSelectToggle}
              />
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Floating Batch Action Bar */}
        <AnimatePresence>
          {selectedNames.length > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]"
            >
              <div className="flex items-center gap-4 bg-neutral-900/90 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-2xl">
                <span className="text-sm font-medium text-white/60">
                  <span className="text-white font-bold">{selectedNames.length}</span> items selected
                </span>
                <div className="w-px h-4 bg-white/10" />
                <button
                  onClick={handleCopyNames}
                  className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-neutral-200 transition-colors"
                >
                  Copy Names
                </button>
                <button
                  onClick={() => setSelectedNames([])}
                  className="text-white/40 hover:text-white text-xs font-bold transition-colors"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
};

export default HomePage;
