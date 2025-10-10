import { ColorFilter } from "@/components/controls/ColorFilter";
import { SearchBox } from "@/components/controls/SearchBox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
;

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  availableColors: string[];
  selectedColors: string[];
  onColorChange: (colors: string[]) => void;
  filter: string;
  onFilterChange: (value: string) => void;
  gradients?: Array<{ name?: string; colors?: string[]; colorsname?: string[]; keywords?: string[][] }>;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  onSearchChange,
  availableColors,
  selectedColors,
  onColorChange,
  filter,
  onFilterChange,
  gradients,
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <SearchBox
        value={searchTerm}
        onChange={onSearchChange}
        gradients={gradients}
        className="flex-1"
      />

      <div className="">
        <ColorFilter
        className="h-full "
          availableColors={availableColors}
          selectedColors={selectedColors}
          onColorChange={onColorChange}
        />
      </div>

      <div className="rounded-[12px] ">
        <DropdownMenu  >
          <DropdownMenuTrigger className="h-full rounded-lg  w-full border-2 justify-between text-left font-normal hover:bg-accent sm:w-[180px] flex items-center px-3">
            {filter === "all" ? "All Gradients" : filter === "favorites" ? "Favorites" : "Filter"}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-card outline-none">
            <DropdownMenuItem className="bg-card cursor-pointer" onClick={() => onFilterChange("all")}>
              All Gradients
            </DropdownMenuItem>
            <DropdownMenuItem className="bg-card cursor-pointer" onClick={() => onFilterChange("favorites")}>
              Favorites
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
