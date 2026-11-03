import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  isLiked: boolean;
  onLikeToggle: () => void;
  variant?: "pill" | "ghost";
  className?: string;
}

export function FavoriteButton({
  isLiked,
  onLikeToggle,
  variant = "pill",
  className,
}: FavoriteButtonProps) {
  if (variant === "ghost") {
    return (
      <div className={cn("flex", className)}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLikeToggle();
          }}
          className="group focus:outline-none"
          title={isLiked ? "Unlike" : "Like"}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors duration-200",
              isLiked
                ? "fill-red-500 text-red-500"
                : "text-[#a1a1a1] group-hover:text-[#fafafa]"
            )}
          />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "disable-animation-on-theme-change pointer-events-auto inline-flex items-center rounded-full border border-solid border-[#262626] bg-[#171717]/80 shadow-sm",
        className
      )}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onLikeToggle();
        }}
        className={cn(
          "inline-flex items-center justify-center w-8 h-8 p-0 rounded-full transition-colors duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-inset",
          isLiked
            ? "text-red-500 bg-red-500/10"
            : "text-[#a1a1a1] hover:text-[#fafafa] hover:bg-[#262626]"
        )}
        aria-pressed={isLiked}
        title={isLiked ? "Unlike" : "Like"}
      >
        <Heart 
          className={cn("w-4 h-4", isLiked && "fill-red-500")} 
          strokeWidth={2.5} 
        />
      </button>
    </div>
  );
}
