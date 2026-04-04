import { motion } from "framer-motion";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/shared/ui/dropdown-menu";

export interface CanvasSize {
  label: string;
  width: number;
  height: number;
}

interface CanvasCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  sizes: CanvasSize[];
}

const CANVAS_CATEGORIES: CanvasCategory[] = [
  {
    id: "artistic",
    label: "Artistic",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    sizes: [
      { label: "Default", width: 0, height: 0 },
    ],
  },
  {
    id: "mobile",
    label: "Mobile",
    icon: Smartphone,
    sizes: [
      { label: "iPhone SE", width: 375, height: 667 },
      { label: "iPhone 14", width: 390, height: 844 },
      { label: "iPhone 14 Pro Max", width: 430, height: 932 },
      { label: "Android (360p)", width: 360, height: 800 },
    ],
  },
  {
    id: "tablet",
    label: "Tablet",
    icon: Tablet,
    sizes: [
      { label: "iPad Mini", width: 768, height: 1024 },
      { label: "iPad Air", width: 820, height: 1180 },
      { label: 'iPad Pro 11"', width: 834, height: 1194 },
      { label: 'iPad Pro 13"', width: 1024, height: 1366 },
    ],
  },
  {
    id: "desktop",
    label: "Desktop",
    icon: Monitor,
    sizes: [
      { label: 'MacBook Air 13"', width: 2560, height: 1664 },
      { label: 'MacBook Pro 14"', width: 3024, height: 1964 },
      { label: 'MacBook Pro 16"', width: 3456, height: 2234 },
      { label: "1080p", width: 1920, height: 1080 },
      { label: "1440p", width: 2560, height: 1440 },
      { label: "4K", width: 3840, height: 2160 },
    ],
  },
  {
    id: "social",
    label: "Social Media",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
    sizes: [
      { label: "Instagram Post", width: 1080, height: 1080 },
      { label: "Instagram Story", width: 1080, height: 1920 },
      { label: "Twitter Post", width: 1200, height: 675 },
      { label: "Facebook Cover", width: 1640, height: 856 },
      { label: "YouTube Thumbnail", width: 1280, height: 720 },
      { label: "LinkedIn Banner", width: 1584, height: 396 },
    ],
  },
  {
    id: "presentation",
    label: "Presentation",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    sizes: [
      { label: "4:3 Standard", width: 1024, height: 768 },
      { label: "16:9 Widescreen", width: 1920, height: 1080 },
      { label: "16:9 4K", width: 3840, height: 2160 },
    ],
  },
];

interface NavbarCanvasSizeProps {
  onSizeSelect?: (size: CanvasSize | null) => void;
  selectedSize?: CanvasSize | null;
}

export const NavbarCanvasSize = ({ onSizeSelect, selectedSize }: NavbarCanvasSizeProps) => {
  const formatRes = (w: number, h: number) => (w === 0 ? "Original" : `${w}×${h}`);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          id="navbar-canvas-size-btn"
          title="Canvas Size"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "flex items-center justify-center rounded-lg border border-border bg-background/80 p-2 transition-all duration-200 hover:bg-white/10 hover:border-white/20 backdrop-blur-xl group outline-none"
          )}
          aria-label="Canvas Size"
        >
          <Monitor className="h-4 w-4 text-muted-foreground group-hover:text-white transition-colors" />
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[280px] bg-[#0d0f14]/98 border-white/10 backdrop-blur-3xl z-[200]">
        <div className="px-2 py-1.5 border-b border-white/5">
          <DropdownMenuLabel className="p-0 text-xs font-bold uppercase tracking-widest text-white/30">
            Canvas Size
          </DropdownMenuLabel>
          {selectedSize ? (
            <p className="mt-0.5 text-[11px] font-medium text-white/70">
              {selectedSize.label} — <span className="tabular-nums text-white/40">{formatRes(selectedSize.width, selectedSize.height)}</span>
            </p>
          ) : (
            <p className="mt-0.5 text-[11px] text-white/30 italic">No size selected</p>
          )}
        </div>

        <div className="py-1">
          {CANVAS_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <DropdownMenuSub key={category.id}>
                <DropdownMenuSubTrigger className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/5 text-white/70 hover:text-white focus:bg-white/10 focus:text-white transition-all">
                  <Icon className="h-3.5 w-3.5 text-white/40" />
                  <span className="text-sm font-bold">{category.label}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-[240px] bg-[#0d0f14]/98 border-white/10 backdrop-blur-3xl p-1">
                    {category.sizes.map((size) => {
                      const isSelected =
                        (selectedSize?.label === size.label && selectedSize?.width === size.width) ||
                        (size.label === "Default" && !selectedSize);
                      
                      return (
                        <DropdownMenuItem
                          key={size.label}
                          onClick={() => onSizeSelect?.(size.label === "Default" ? null : size)}
                          onPointerEnter={() => onSizeSelect?.(size.label === "Default" ? null : size)}
                          className={cn(
                            "flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer",
                            isSelected ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <span className="text-sm font-medium">{size.label}</span>
                          <span className="text-[10px] tabular-nums text-white/30 group-hover:text-white/50">
                            {formatRes(size.width, size.height)}
                          </span>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
