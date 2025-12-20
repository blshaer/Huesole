import { useState } from "react";
import { Clock, Copy, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/shared/ui/dropdown-menu";
import { useCopyHistory } from "@/features/gradients/hooks/useCopyHistory";
import { toast } from "@/shared/hooks/use-toast";

interface CopyHistorySectionProps {
  onGradientSelect?: (gradientName: string) => void;
}

export function CopyHistorySection({
  onGradientSelect,
}: CopyHistorySectionProps) {
  const { clearCopyHistory, getRecentCopies, getCopyCount } = useCopyHistory();
  const [isOpen, setIsOpen] = useState(false);

  const recentCopies = getRecentCopies(10);

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleCopyAgain = (colors: string[], copyType: string) => {
    const gradientCSS = `linear-gradient(135deg, ${colors.join(", ")})`;
    navigator.clipboard.writeText(gradientCSS);
    toast({
      title: "Copied to clipboard ✅",
      description: `The ${copyType} code has been copied again.`,
    });
  };

  const handleClearHistory = () => {
    clearCopyHistory();
    toast({
      title: "History cleared",
      description: "Your copy history has been cleared.",
    });
    setIsOpen(false);
  };

  if (getCopyCount() === 0) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex h-11 items-center gap-2 whitespace-nowrap"
        >
          <Clock className="h-4 w-4" />
          <span className="hidden sm:inline">
            Recent Copies ({getCopyCount()})
          </span>
          <span className="sm:hidden">Recent ({getCopyCount()})</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-96 w-80 overflow-y-auto"
      >
        <div className="px-2 py-1.5 text-sm font-medium text-white">
          Recent Copies
        </div>
        <DropdownMenuSeparator />

        {recentCopies.length === 0 ? (
          <div className="px-2 py-4 text-center text-sm text-white/70">
            No recent copies
          </div>
        ) : (
          recentCopies.map((item, index) => (
            <DropdownMenuItem
              key={`${item.name}-${item.timestamp}-${index}`}
              className="flex cursor-pointer flex-col items-start gap-1 p-3"
              onSelect={(e) => {
                e.preventDefault();
                if (onGradientSelect) {
                  onGradientSelect(item.name);
                }
              }}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex-1 truncate text-sm font-medium">
                  {item.name}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-1 hover:bg-muted"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyAgain(item.colors, item.copyType);
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex w-full items-center gap-2 text-xs text-white/70">
                <span className="capitalize">{item.copyType}</span>
                <span>•</span>
                <span>{formatTimestamp(item.timestamp)}</span>
              </div>
              <div className="mt-1 flex gap-1">
                {item.colors.slice(0, 4).map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="h-3 w-3 rounded-full border border-border"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
                {item.colors.length > 4 && (
                  <div className="flex h-3 w-3 items-center justify-center rounded-full border border-border bg-muted text-[8px] text-white/90">
                    +{item.colors.length - 4}
                  </div>
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}

        {recentCopies.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={handleClearHistory}
              className="flex items-center gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Clear History
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
