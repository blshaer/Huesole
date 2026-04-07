import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, LayoutDashboard, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { User } from "@/features/auth/context/AuthContext";
import { getFullImageUrl } from "@/shared/utils/imageUrl";
import { Switch } from "@/shared/ui/switch";
import { Label } from "@/shared/ui/label";

interface NavbarUserMenuProps {
  user: User;
  loading: boolean;
  onLogout: () => void;
  showAngleController?: boolean;
  onToggleAngleController?: () => void;
  isAIGeneratorPage?: boolean;
}

const textVariants = {
  initial: { opacity: 1, x: 0 },
  hover: { opacity: 0, x: -15 },
};

const iconVariants = {
  initial: { opacity: 0, x: 15 },
  hover: { opacity: 1, x: 0 },
};

export function NavbarUserMenu({ 
  user, 
  loading, 
  onLogout,
  showAngleController,
  onToggleAngleController,
  isAIGeneratorPage
}: NavbarUserMenuProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (loading) return null;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login">
          <motion.button
            initial="initial"
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden flex items-center justify-center w-[130px] h-9 bg-[#E0E0E0] text-black border border-black/10 rounded-md font-medium text-xs shadow-sm"
          >
            <motion.span
              variants={textVariants}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              Start Generating
            </motion.span>

            <motion.span
              variants={iconVariants}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <ChevronRight className="h-4 w-4 stroke-[2.5px]" />
            </motion.span>
          </motion.button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-10 w-10 overflow-hidden items-center justify-center rounded-full border border-border hover:opacity-90 transition-all active:scale-95 shadow-sm outline-none">
          <Avatar className="h-full w-full">
            <AvatarImage
              src={user.picture && user.picture !== "no-photo.jpg" ? getFullImageUrl(user.picture) : undefined}
              alt={user.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-[#92A1C6] via-[#146A7C] to-[#C271B4] text-white text-[10px] font-bold uppercase transition-all">
              {user.name
                ? user.name.split(" ").length > 1
                  ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                  : user.name.slice(0, 2)
                : "UA"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-background border-border z-[9999] p-2">
        <DropdownMenuLabel className="font-normal px-2 py-1.5">
          <div className="flex flex-col space-y-1">
            <p className="text-xs leading-none text-muted-foreground opacity-70 hover:text-primary transition-colors truncate max-w-[180px]">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Mobile-only Angle Switch */}
        {isMobile && isAIGeneratorPage && (
          <>
            <div className="flex items-center justify-between px-2 py-2 hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors">
              <div className="flex items-center gap-2">
                {showAngleController ? (
                  <Eye className="h-4 w-4 text-primary" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
                <Label htmlFor="angle-toggle" className="text-sm cursor-pointer">Angle Guide</Label>
              </div>
              <Switch 
                id="angle-toggle"
                checked={showAngleController}
                onCheckedChange={onToggleAngleController}
              />
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        <Link to="/profile">
          <DropdownMenuItem className="cursor-pointer">

            <svg viewBox="0 0 107.18 107.18" className="mr-2 h-4 w-4 shrink-0">
              <g fill="white">
                <path d="M3.9,49.12h12.35c1.03,0,2.03-.41,2.76-1.14l28.98-28.98c.73-.73,1.14-1.72,1.14-2.76V3.9c0-2.15-1.75-3.9-3.9-3.9H3.9C1.75,0,0,1.75,0,3.9v41.33c0,2.15,1.75,3.9,3.9,3.9Z" />
                <path d="M103.28,49.12h-12.35c-1.03,0-2.03-.41-2.76-1.14l-28.98-28.98c-.73-.73-1.14-1.72-1.14-2.76V3.9C58.05,1.75,59.8,0,61.95,0h41.33c2.15,0,3.9,1.75,3.9,3.9v41.33c0,2.15-1.75,3.9-3.9,3.9Z" />
                <path d="M3.9,58.05h12.35c1.03,0,2.03.41,2.76,1.14l28.98,28.98c.73.73,1.14,1.72,1.14,2.76v12.35c0,2.15-1.75,3.9-3.9,3.9H3.9c-2.15,0-3.9-1.75-3.9-3.9v-41.33c0-2.15,1.75-3.9,3.9-3.9Z" />
                <path d="M103.28,58.05h-12.35c-1.03,0-2.03.41-2.76,1.14l-28.98,28.98c-.73.73-1.14,1.72-1.14,2.76v12.35c0,2.15,1.75,3.9,3.9,3.9h41.33c2.15,0,3.9-1.75,3.9-3.9v-41.33c0-2.15-1.75-3.9-3.9-3.9Z" />
                <circle cx="53.59" cy="53.59" r="22.33" />
              </g>
            </svg>
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>

        {user.role === "admin" && (
          <Link to="/admin">
            <DropdownMenuItem className="cursor-pointer text-primary focus:text-primary">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
          <svg viewBox="0 0 99.58 106.61" className="mr-2 h-4 w-4 shrink-0">
            <g fill="white">
              <path d="M51.24,38.47c-.58,1.8-3.13,1.8-3.71,0L35.91,2.55c-.41-1.26.53-2.55,1.86-2.55h23.24c1.32,0,2.26,1.29,1.86,2.55l-11.62,35.92Z" />
              <path d="M51.24,68.14c-.58-1.8-3.13-1.8-3.71,0l-11.62,35.92c-.41,1.26.53,2.55,1.86,2.55h23.24c1.32,0,2.26-1.29,1.86-2.55l-11.62-35.92Z" />
              <path d="M61.01,54.85c-1.8-.6-1.78-3.14.03-3.71l36.01-11.35c1.26-.4,2.55.55,2.54,1.87l-.18,23.24c0,1.32-1.31,2.25-2.57,1.84l-35.83-11.89Z" />
              <path d="M38.57,55.21c1.8-.6,1.78-3.14-.03-3.71L2.54,40.14C1.27,39.75,0,40.7,0,42.02l.18,23.24c.01,1.32,1.31,2.25,2.56,1.84l35.83-11.89Z" />
              <path d="M58.22,48.52c-2.83,1.47-5.87-1.59-4.37-4.41L74.07,6.13c.63-1.18,1.91-1.85,3.23-1.7l16.12,1.81c1.45.16,2.61,1.27,2.85,2.71l2.58,15.93c.22,1.38-.46,2.76-1.71,3.4l-38.92,20.24Z" />
              <path d="M58.26,58.68c-2.83-1.47-5.87,1.59-4.37,4.41l20.22,37.98c.63,1.18,1.91,1.85,3.23,1.7l16.12-1.81c1.45-.16,2.61-1.27,2.85-2.71l2.58-15.93c.22-1.38-.46-2.76-1.71-3.4l-38.92,20.24Z" />
              <path d="M41.12,48.4c2.83,1.48,5.88-1.59,4.37-4.41L25.11,5.84c-.63-1.17-1.9-1.84-3.22-1.7l-16.17,1.77c-1.46.16-2.63,1.27-2.86,2.72L.32,24.61c-.22,1.38.47,2.75,1.71,3.39l39.1,20.4Z" />
              <path d="M2.03,79.27c-1.24.65-1.93,2.01-1.71,3.39l2.54,15.97c.23,1.45,1.4,2.56,2.86,2.72l16.17,1.77c1.32.14,2.6-.53,3.22-1.7l20.38-38.15c1.51-2.82-1.54-5.89-4.37-4.41L2.03,79.27Z" />
            </g>
          </svg>
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}