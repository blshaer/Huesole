// Controls/SearchBox.tsx
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Command, SearchIcon } from "lucide-react";
import { FC, useEffect, useMemo, useRef, useState } from "react";

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
}

const SEARCH_PLACEHOLDERS = [
  "Search gradients...",
  "Try 'sunset', 'ocean', 'purple'...",
  "Search by color: 'blue', 'red'...",
  "Find gradients: 'gradient name'...",
  "Discover: 'warm', 'cool', 'dark'...",
];

export const SearchBox: FC<SearchBoxProps> = ({
  value,
  onChange,
  gradients = [],
  className,
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
    if (!value || value.length < 2) return [];

    const searchTerm = value.toLowerCase();
    const matches = new Set<string>();

    gradients.forEach((gradient) => {
      // Match gradient names
      if (gradient.name?.toLowerCase().includes(searchTerm)) {
        matches.add(gradient.name);
      }

      // Match color names
      gradient.colorsname?.forEach((color) => {
        if (color?.toLowerCase().includes(searchTerm)) {
          matches.add(color);
        }
      });

      // Match keywords
      gradient.keywords?.flat().forEach((keyword) => {
        if (keyword?.toLowerCase().includes(searchTerm)) {
          matches.add(keyword);
        }
      });
    });

    return Array.from(matches)
      .filter((item) => item.toLowerCase() !== searchTerm)
      .slice(0, 6)
      .sort((a, b) => {
        // Prioritize exact starts
        const aStarts = a.toLowerCase().startsWith(searchTerm);
        const bStarts = b.toLowerCase().startsWith(searchTerm);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.length - b.length;
      });
  }, [value, gradients]);

  // Keyboard shortcuts and navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search with Cmd/Ctrl + K using metaKey property
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }

      // Handle dropdown navigation
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
              onChange(suggestions[selectedIndex]);
              setIsOpen(false);
              setSelectedIndex(-1);
            }
            break;
          case "Escape":
            setIsOpen(false);
            setSelectedIndex(-1);
            inputRef.current?.blur();
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, suggestions, selectedIndex, onChange]);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[
        selectedIndex
      ] as HTMLElement;
      selectedElement?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    setSelectedIndex(-1);
    setIsOpen(newValue.length >= 2);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    if (value.length >= 2) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    // Delay to allow click on suggestions
    setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          placeholder=""
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "h-12 w-full rounded-lg border px-4 pr-20 transition-all duration-200",
            "hover:border-border focus:border-blue-400 focus:outline-none focus:ring-0 focus:ring-offset-0",
            "placeholder:text-muted-foreground/60",
            isOpen && "rounded-b-none border-b-0",
          )}
          type="text"
          autoComplete="off"
          spellCheck={false}
        />

        {/* Animated Placeholder */}
        {!value && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPlaceholder}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500"
            >
              {currentPlaceholder}
            </motion.div>
          </AnimatePresence>
        )}

        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <div className="hidden items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground sm:flex">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            ref={listRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute left-0 right-0 z-50 max-h-64 overflow-y-auto",
              "rounded-b-lg border border-t-0 bg-background shadow-lg",
            )}
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  "w-full px-4 py-3 text-left text-sm transition-colors",
                  "hover:bg-muted focus:bg-muted focus:outline-none",
                  "border-b border-border last:border-b-0",
                  "flex items-center justify-between",
                  selectedIndex === index && "bg-muted",
                )}
              >
                <span className="truncate">{suggestion}</span>
                <SearchIcon className="text-muted-foreground/50 ml-2 h-3 w-3 flex-shrink-0" />
              </button>
            ))}

            {/* Footer with shortcut hints */}
            <div className="bg-muted/50 border-t px-4 py-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>↑↓ Navigate • Enter Select • Esc Close</span>
                <span>
                  {suggestions.length} result
                  {suggestions.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No results message */}
      {isOpen && value.length >= 2 && suggestions.length === 0 && (
        <div
          className={cn(
            "absolute left-0 right-0 z-50",
            "rounded-b-lg border border-t-0 bg-background shadow-lg",
            "duration-200 animate-in fade-in-0 slide-in-from-top-2",
          )}
        >
          <div className="px-4 py-6 text-center text-sm text-white">
            <SearchIcon className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p>No matches found for "{value}"</p>
            <p className="mt-1 text-xs">
              Try searching for colors, gradient names, or keywords
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
