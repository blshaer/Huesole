// src/shared/layout/Navbar/Navbar.tsx

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

import { useAuth } from "@/features/auth/context/AuthContext";
import { toast } from "@/shared/hooks/use-toast";
import { GeneratedGradient } from "@/features/gradients/types";

import { NavbarLogo } from "./NavbarLogo";
import { NavbarAiControls } from "./NavbarAiControls";
import { NavbarColorPicker } from "./NavbarColorPicker";
import { NavbarUserMenu } from "./NavbarUserMenu";
import { NavbarAngleToggle } from "./NavbarAngleToggle";

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
}

export const Navbar = ({
  result = null,
  isAnimated = false,
  animationSpeed = 1,
  setAnimationSpeed,
  onToggleSidebar,
  onToggleAngleController,
  showAngleController = false,
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
      toast({
        title: "Error",
        description: "Color picker is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    try {
      // @ts-ignore
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();

      if (result?.sRGBHex) {
        await navigator.clipboard.writeText(result.sRGBHex);
        toast({
          title: "Copied!",
          description: `Color ${result.sRGBHex} copied to clipboard!`,
        });
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        toast({
          title: "Error",
          description: "Failed to pick color",
          variant: "destructive",
        });
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAIGenerateClick = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login first to use the AI Generator.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    navigate("/ai-generator");
  };

  return (
    <header className="disable-animation-on-theme-change container sticky top-0 z-[100] w-full bg-background backdrop-blur-sm">
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

      <div className="container mx-auto flex w-full items-center justify-between px-0 py-3 lg:py-5">
        <nav
          className="flex items-center gap-6 md:gap-10"
          aria-label="Primary navigation"
        >
          <NavbarLogo />
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
              isAngleSupported={result?.type === "linear" || result?.type === "conic"}
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
            user={user}
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
