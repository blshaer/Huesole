import { SearchBox } from "@/features/search/components/SearchBox";

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
  gradients?: Array<{
    name?: string;
    colors?: string[];
    colorsname?: string[];
    keywords?: (string | string[])[];
  }>;
  gradientType: "background" | "text";
  onGradientTypeChange: (type: "background" | "text") => void;
  gradientShape: "linear" | "radial" | "conic" | "auto";
  onGradientShapeChange: (shape: "linear" | "radial" | "conic" | "auto") => void;
}


export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  onSearchChange,
  isLoading,
  gradients,
  gradientType,
  onGradientTypeChange,
  gradientShape,
  onGradientShapeChange,
}) => {
  return (
    <div className="mt-8 max-md:mt-0  flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-center lg:gap-6">
      <div className="flex-1  w-full lg:max-w-xl">
        <SearchBox
          value={searchTerm}
          onChange={onSearchChange}
          isLoading={isLoading}
          gradients={gradients}
          gradientType={gradientType}
          onGradientTypeChange={onGradientTypeChange}
          gradientShape={gradientShape}
          onGradientShapeChange={onGradientShapeChange}
        />
      </div>
    </div>
  );
};
