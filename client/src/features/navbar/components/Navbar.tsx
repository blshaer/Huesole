// src/shared/layout/Navbar/Navbar.tsx

import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { toast } from "sonner";
import { GeneratedGradient } from "@/features/gradients/types";
import { cn } from "@/shared/lib/utils";

import { NavbarLogo } from "./NavbarLogo";
import { NavbarAiControls } from "./NavbarAiControls";
import { NavbarColorPicker } from "./NavbarColorPicker";
import { NavbarUserMenu } from "./NavbarUserMenu";
import { NavbarAngleToggle } from "./NavbarAngleToggle";
import { NavbarCanvasSize, CanvasSize } from "./NavbarCanvasSize";

interface NavbarProps {
  result?: GeneratedGradient | null;
  isAnimated?: boolean;
  setIsAnimated?: (value: boolean) => void;
  animationSpeed?: number;
  setAnimationSpeed?: (value: number) => void;
  onToggleAngleController?: () => void;
  onToggleSidebar?: () => void;
  isLightGradient?: boolean;
  showAngleController?: boolean;
  onCanvasSizeSelect?: (size: CanvasSize | null) => void;
  canvasSize?: CanvasSize | null;
}

export const Navbar = ({
  result = null,
  isAnimated = false,
  animationSpeed = 1,
  setAnimationSpeed,
  onToggleSidebar,
  onToggleAngleController,
  showAngleController = false,
  onCanvasSizeSelect,
  canvasSize,
}: NavbarProps) => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isEyeDropperSupported, setIsEyeDropperSupported] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isAIGeneratorPage = location.pathname.startsWith("/ai-generator");

  useEffect(() => {
    setIsEyeDropperSupported("EyeDropper" in window);
  }, []);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleColorPick = async () => {
    if (!("EyeDropper" in window)) {
      toast.error("Error", { description: "Color picker is not supported in your browser." });
      return;
    }

    try {
      // @ts-ignore
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();

      if (result?.sRGBHex) {
        await navigator.clipboard.writeText(result.sRGBHex);
        toast("Copied!", { description: `Color ${result.sRGBHex} copied to clipboard!` });
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        toast.error("Error", { description: "Failed to pick color" });
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAIGenerateClick = () => {
    if (!user) {
      toast.error("Authentication Required", { description: "Please login first to use the AI Generator." });
      navigate("/login");
      return;
    }
    navigate("/ai-generator");
  };

  return (
    <header className="disable-animation-on-theme-change container sticky top-0 z-[100] bg-background backdrop-blur-sm">
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .pipette-button:hover {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      <div className="mx-auto flex w-full items-center justify-between py-3 lg:py-5">
        <nav
          className="flex items-center gap-6 md:gap-4"
          aria-label="Primary navigation"
        >
          <NavbarLogo />

          {user && (
            <div className="hidden items-center gap-3 ps-4 md:flex pt-1">


              <Link
                to="/ai-generator"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-white",
                  location.pathname === "/favorites" ? "text-white" : "text-muted-foreground"
                )}
              >
                AI Generator

              </Link>
              <Link
                to="/favorites"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-white",
                  location.pathname === "/favorites" ? "text-white" : "text-muted-foreground"
                )}
              >
                Favorites
              </Link>
            </div>
          )}
        </nav>

        <div className="relative z-50 flex items-center  gap-3">
          {/* Sidebar Toggle Button - Only show on AI Generator page and mobile */}
          {isAIGeneratorPage && isMobile && onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="flex items-center justify-center rounded-lg border border-border bg-background/80 p-2 transition-colors hover:bg-background/90 backdrop-blur-xl"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Angle Controller Toggle - Only show on AI Generator page when angle is supported (linear/conic) */}
          {isAIGeneratorPage && onToggleAngleController && (
            <NavbarAngleToggle
              showAngleController={showAngleController}
              onToggle={onToggleAngleController}
            />
          )}

          {/* Canvas Size Selector - Only show on AI Generator page */}
          {isAIGeneratorPage && (
            <NavbarCanvasSize
              onSizeSelect={onCanvasSizeSelect}
              selectedSize={canvasSize}
            />
          )}

          <NavbarAiControls
            user={user}
            isAIGeneratorPage={isAIGeneratorPage}
            result={result}
            isAnimated={isAnimated}
            animationSpeed={animationSpeed}
            setAnimationSpeed={setAnimationSpeed}
            onRequireAuthNavigate={handleAIGenerateClick}
          />

          <NavbarColorPicker
            isEyeDropperSupported={isEyeDropperSupported}
            onPickColor={handleColorPick}
          />

          <NavbarUserMenu
            user={user!}
            loading={isLoading}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Bottom Border Line */}
      <div
        className="h-[1px] w-full opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--muted-foreground) 0%, var(--muted-foreground) 2px, transparent 2px, transparent 12px)",
          backgroundSize: "6px 1px",
        }}
      ></div>
    </header>
  );
};
