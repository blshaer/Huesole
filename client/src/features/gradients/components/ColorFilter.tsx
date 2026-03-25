import { useState } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import { FaCircle } from "react-icons/fa";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

interface ColorFilterProps {
  availableColors: string[];
  selectedColors: string[];
  onColorChange: (colors: string[]) => void;
  className?: string;
  triggerClassName?: string;
}

export function ColorFilter({
  availableColors,
  selectedColors,
  onColorChange,
  className,
  triggerClassName,
}: ColorFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleColorToggle = (color: string) => {
    const newSelectedColors = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];
    onColorChange(newSelectedColors);
  };

  const handleClearAll = () => {
    onColorChange([]);
  };

  const handleSelectAll = () => {
    onColorChange(availableColors);
  };

  // Map color name to a React Icon style
  const getColorIcon = (color: string) => {
    const lowerColor = (color || "").toLowerCase();
    let colorValue = "#cbd5e1"; // default grey (tailwind slate-400)

    if (lowerColor.includes("red")) colorValue = "#ef4444";
    else if (lowerColor.includes("pink")) colorValue = "#ec4899";
    else if (lowerColor.includes("orange") || lowerColor.includes("peach"))
      colorValue = "#f97316";
    else if (lowerColor.includes("yellow")) colorValue = "#eab308";
    else if (lowerColor.includes("green") || lowerColor.includes("olive"))
      colorValue = "#22c55e";
    else if (lowerColor.includes("teal")) colorValue = "#14b8a6";
    else if (lowerColor.includes("cyan")) colorValue = "#22d3ee";
    else if (lowerColor.includes("blue") || lowerColor.includes("indigo"))
      colorValue = "#3b82f6";
    else if (
      lowerColor.includes("purple") ||
      lowerColor.includes("violet") ||
      lowerColor.includes("magenta")
    )
      colorValue = "#a21caf";
    else if (lowerColor.includes("brown") || lowerColor.includes("beige"))
      colorValue = "#b45309";
    else if (lowerColor.includes("gray") || lowerColor.includes("grey"))
      colorValue = "#6b7280";
    else if (lowerColor.includes("black")) colorValue = "#000000";
    else if (lowerColor.includes("white")) colorValue = "#ffffff";

    return (
      <FaCircle
        style={{
          color: colorValue,
          border:
            lowerColor === "white" ? "1px solid var(--border)" : "none",
          borderRadius: "50%",
          fontSize: "1.1rem",
          flexShrink: 0,
        }}
      />
    );
  };

  const renderColorItem = (color: string) => {
    const isSelected = selectedColors.includes(color);
    return (
      <DropdownMenuItem
        key={color}
        className={cn(
          "flex cursor-pointer items-center justify-between gap-2 px-3 py-2",
          isSelected && "bg-accent",
        )}
        onSelect={(e) => {
          e.preventDefault();
          handleColorToggle(color);
        }}
      >
        <div className="flex items-center gap-2">
          {getColorIcon(color)}
          <span className="capitalize">{color}</span>
        </div>
        {isSelected && <FiCheck className="h-4 w-4 text-primary" />}
      </DropdownMenuItem>
    );
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className={cn(triggerClassName || "h-[48px] w-full justify-between text-left font-normal border-2 rounded-lg px-3 hover:bg-accent flex items-center")}>
          <div className="flex items-center gap-2 truncate">
            {selectedColors.length > 0 && selectedColors.length <= 3 && (
              <div className="flex gap-1">
                {selectedColors.slice(0, 3).map((color) => (
                  <div key={color} className="scale-75">
                    {getColorIcon(color)}
                  </div>
                ))}
              </div>
            )}
            <span className="truncate">
              {selectedColors.length === 0
                ? "Select colors"
                : `${selectedColors.length} selected`}
            </span>
          </div>
          <FiChevronDown className={cn("h-4 w-4 opacity-50", triggerClassName && "ml-2")} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-96 w-64 overflow-y-auto  mt-0 pt-0 bg-card border-[var(--border)] text-[var(--headline)] outline-none">
          <div className="flex items-center justify-between border-b border-[var(--border)] p-2 sticky top-0 bg-card z-10 mt-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="h-auto p-2 text-xs hover:bg-accent"
              disabled={availableColors.length === 0}
            >
              Select All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-auto p-2 text-xs hover:bg-accent"
              disabled={selectedColors.length === 0}
            >
              Clear All
            </Button>
          </div>
          {availableColors.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No colors found
            </div>
          ) : (
            availableColors.map(renderColorItem)
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
