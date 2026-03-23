import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

interface SearchBoxProps {
  value: string;
  onChange: (v: string) => void;
  gradients?: Array<{
    name?: string;
    colors?: string[];
    colorsname?: string[];
    keywords?: string[][];
  }>;
  className?: string;
  gradientType: "background" | "text" | "image";
  onGradientTypeChange: (type: "background" | "text" | "image") => void;
  gradientShape: "linear" | "radial" | "conic";
  onGradientShapeChange: (shape: "linear" | "radial" | "conic") => void;
}

const filterButtonStyle = "flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all rounded-md hover:bg-white/5";

const POPULAR_SUGGESTIONS = [
  { label: "sunset", emoji: "🌇" },
  { label: "ocean", emoji: "🌊" },
  { label: "vibrant", emoji: "✨" },
  { label: "purple", emoji: "💜" },
  { label: "dark", emoji: "🌙" },
  { label: "pastel", emoji: "🎨" },
];

const RECOMMENDED_SUGGESTIONS = [
  { label: "cyberpunk", emoji: "👾" },
  { label: "nature", emoji: "🌿" },
  { label: "minimal", emoji: "⚪" },
  { label: "royal", emoji: "👑" },
  { label: "tropical", emoji: "🌴" },
  { label: "warm", emoji: "🔥" },
];

const SEARCH_PLACEHOLDERS = [
  "Search gradients...",
  "Try 'vibrant', 'nature', 'tropical'...",
  "Search by color: 'blue', 'purple'...",
  "Find by mood: 'warm', 'cool', 'dark'...",
  "Discover: 'sunset', 'ocean', 'pastel'...",
];

export const SearchBox: FC<SearchBoxProps> = ({
  value,
  onChange,
  gradients = [],
  className,
  gradientType,
  onGradientTypeChange,
  gradientShape,
  onGradientShapeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(
    SEARCH_PLACEHOLDERS[0],
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Dynamic placeholder rotation
  useEffect(() => {
    if (!value) {
      const interval = setInterval(() => {
        setCurrentPlaceholder((prev) => {
          const currentIndex = SEARCH_PLACEHOLDERS.indexOf(prev);
          return SEARCH_PLACEHOLDERS[
            (currentIndex + 1) % SEARCH_PLACEHOLDERS.length
          ];
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [value]);

  // Generate autocomplete suggestions
  const suggestions = useMemo(() => {
    if (!value || value.length < 2) {
      return [...POPULAR_SUGGESTIONS, ...RECOMMENDED_SUGGESTIONS].map(
        (ps) => ps.emoji ? `${ps.emoji} ${ps.label}` : ps.label
      );
    }

    const searchTerm = value.toLowerCase();
    const matches = new Set<string>();

    gradients.forEach((gradient) => {
      if (gradient.name?.toLowerCase().includes(searchTerm)) {
        matches.add(gradient.name);
      }
      gradient.colorsname?.forEach((color) => {
        if (color?.toLowerCase().includes(searchTerm)) {
          matches.add(color);
        }
      });
      gradient.keywords?.flat().forEach((keyword) => {
        if (keyword?.toLowerCase().includes(searchTerm)) {
          matches.add(keyword);
        }
      });
    });

    return Array.from(matches)
      .filter((item) => item.toLowerCase() !== searchTerm)
      .slice(0, 10)
      .sort((a, b) => {
        const aStarts = a.toLowerCase().startsWith(searchTerm);
        const bStarts = b.toLowerCase().startsWith(searchTerm);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.length - b.length;
      });
  }, [value, gradients]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && suggestions.length > 0) {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setSelectedIndex((prev) =>
              prev < suggestions.length - 1 ? prev + 1 : 0,
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setSelectedIndex((prev) =>
              prev > 0 ? prev - 1 : suggestions.length - 1,
            );
            break;
          case "Enter":
            e.preventDefault();
            if (selectedIndex >= 0) {
              const selectedValue = suggestions[selectedIndex].replace(/^[^\s]+\s/, "");
              onChange(selectedValue);
            }
            setIsOpen(false);
            setSelectedIndex(-1);
            break;
          case "Escape":
            setIsOpen(false);
            setSelectedIndex(-1);
            inputRef.current?.blur();
            break;
        }
      } else if (e.key === "Enter") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, suggestions, selectedIndex, onChange, value]);

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    setSelectedIndex(-1);
    setIsOpen(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    const cleanValue = suggestion.replace(/^[^\s]+\s/, "");
    onChange(cleanValue);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 200);
  };

  const hasDropdown = isOpen && suggestions.length > 0;

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "h-12 w-full border border-white/5 px-6 pr-[280px] transition-all duration-200",
            "bg-neutral-900/90 backdrop-blur-md text-white shadow-xl",
            "hover:border-white/10 focus:border-white/10 focus:outline-none focus:ring-0 focus:ring-offset-0",
            "placeholder:text-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]",
            hasDropdown ? "rounded-t-2xl rounded-b-none border-b-0" : "rounded-full"
          )}
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder=""
        />

        {!value && (
          <div className="pointer-events-none absolute inset-y-0 left-6 flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPlaceholder}
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={{ duration: 0.15 }}
                className="text-sm text-white/30"
              >
                {currentPlaceholder}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
          <div className="flex items-center bg-white/[0.03] border border-white/5 rounded-full p-1 pr-3 gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger className={filterButtonStyle}>
                <span>{gradientType}</span>
                <ChevronDown className="h-2.5 w-2.5 opacity-30" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-neutral-900 border-white/10 p-1 min-w-[120px] backdrop-blur-xl">
                {(["background", "text", "image"] as const).map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onSelect={() => onGradientTypeChange(type)}
                    className="capitalize text-white/70 focus:bg-white/5 focus:text-white cursor-pointer text-[10px] font-bold uppercase tracking-wider rounded-md"
                  >
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-[1px] h-3 bg-white/10" />

            <DropdownMenu>
              <DropdownMenuTrigger className={filterButtonStyle}>
                <span>{gradientShape}</span>
                <ChevronDown className="h-2.5 w-2.5 opacity-30" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-neutral-900 border-white/10 p-1 min-w-[120px] backdrop-blur-xl">
                {(["linear", "radial", "conic"] as const).map((shape) => (
                  <DropdownMenuItem
                    key={shape}
                    onSelect={() => onGradientShapeChange(shape)}
                    className="capitalize text-white/70 focus:bg-white/5 focus:text-white cursor-pointer text-[10px] font-bold uppercase tracking-wider rounded-md"
                  >
                    {shape}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </div>

      <AnimatePresence>
        {hasDropdown && (
          <motion.div
            ref={listRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute left-0 right-0 z-50 max-h-[450px] overflow-y-auto custom-scrollbar",
              "rounded-b-2xl border border-white/5 border-t-0 bg-neutral-900/95 backdrop-blur-xl shadow-2xl"
            )}
          >
            <div className="p-2">
              {!value || value.length < 2 ? (
                <>
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white/30">
                    Popular Searches
                  </div>
                  {suggestions.slice(0, POPULAR_SUGGESTIONS.length).map((suggestion, index) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={cn(
                        "group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-all",
                        selectedIndex === index 
                          ? "bg-white/10 text-white" 
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <span className="truncate">{suggestion}</span>
                    </button>
                  ))}
                  
                  <div className="mt-3 border-t border-white/5 pt-3 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white/30">
                    Recommended for You
                  </div>
                  {suggestions.slice(POPULAR_SUGGESTIONS.length).map((suggestion, index) => {
                    const actualIndex = index + POPULAR_SUGGESTIONS.length;
                    return (
                      <button
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={cn(
                          "group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-all",
                          selectedIndex === actualIndex 
                            ? "bg-white/10 text-white" 
                            : "text-white/60 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <span className="truncate">{suggestion}</span>
                      </button>
                    );
                  })}
                </>
              ) : (
                suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={cn(
                      "group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-all",
                      selectedIndex === index 
                        ? "bg-white/10 text-white" 
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <span className="truncate">{suggestion}</span>
                  </button>
                ))
              )}
            </div>

            <div className="border-t border-white/5 bg-white/[0.02] px-4 py-2 text-[10px] text-white/20">
              <div className="flex items-center justify-between">
                <span>Navigate with ↑↓ and Enter</span>
                <span>{suggestions.length} results</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
