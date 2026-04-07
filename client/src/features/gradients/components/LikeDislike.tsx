import { ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface LikeDislikeProps {
  isLiked: boolean;
  isDisliked?: boolean;
  onLikeToggle: () => void;
  onDislikeToggle: () => void;
  variant?: "pill" | "ghost";
  className?: string;
}

export function LikeDislike({
  isLiked,
  isDisliked = false,
  onLikeToggle,
  onDislikeToggle,
  variant = "pill",
  className,
}: LikeDislikeProps) {
  if (variant === "ghost") {
    return (
      <div className={cn("flex gap-2", className)}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLikeToggle();
          }}
          className="group focus:outline-none"
          title="Like"
        >
          <ThumbsUp
            className={cn(
              "h-5 w-5 transition-colors duration-200",
              isLiked
                ? "fill-blue-500 text-blue-500"
                : "text-white/30 group-hover:text-white/60"
            )}
          />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDislikeToggle();
          }}
          className="group focus:outline-none"
          title="Dislike"
        >
          <ThumbsDown
            className={cn(
              "h-5 w-5 transition-colors duration-200",
              isDisliked && !isLiked
                ? "text-white/60"
                : "text-white/30 group-hover:text-white/60"
            )}
          />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "disable-animation-on-theme-change pointer-events-auto inline-flex items-center rounded-md border border-solid border-white/10 backdrop-blur-sm bg-background/60 shadow-lg",
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
          "inline-flex items-center justify-center w-8 h-8 p-0 rounded-l-[5px] transition-colors duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-inset",
          isLiked
            ? "text-blue-500 bg-blue-500/10"
            : "text-white/60 hover:text-white hover:bg-background/60"
        )}
        aria-pressed={isLiked}
        title="Like"
      >
        <ThumbsUp className="w-4 h-4" strokeWidth={2.5} />
      </button>
      <div className="w-px h-4 bg-white/10"></div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDislikeToggle();
        }}
        className={cn(
          "inline-flex items-center justify-center w-8 h-8 p-0 rounded-r-[5px] transition-colors duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-inset",
          isDisliked && !isLiked
            ? "text-red-500 bg-red-500/10"
            : "text-white/60 hover:text-white hover:bg-background/60"
        )}
        aria-pressed={isDisliked}
        title="Dislike"
      >
        <ThumbsDown className="w-4 h-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}
