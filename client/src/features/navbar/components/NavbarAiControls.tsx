// src/shared/layout/Navbar/NavbarAiControls.tsx

import { AnimatePresence } from "framer-motion";
import { GeneratedGradient } from "@/features/gradients/types";
import { NavbarMotionMenu } from "./NavbarMotionMenu";
import { NavbarExportDialog } from "./NavbarExportDialog";

interface NavbarAiControlsProps {
  user: any;
  isAIGeneratorPage: boolean;
  result: GeneratedGradient | null;
  isAnimated: boolean;
  setIsAnimated?: (value: boolean) => void;
  animationSpeed: number;
  setAnimationSpeed?: (value: number) => void;
  onRequireAuthNavigate: () => void;
}

export const NavbarAiControls = ({
  user,
  isAIGeneratorPage,
  result,
  isAnimated,
  setIsAnimated,
  animationSpeed,
  setAnimationSpeed,
  onRequireAuthNavigate,
}: NavbarAiControlsProps) => {
  const handleAIGenerateClick = () => {
    if (!user) {
      onRequireAuthNavigate();
      return;
    }
    onRequireAuthNavigate();
  };

  return (
    <div className="flex items-center gap-2">
      {/* AI Generate Button - Hidden on AI Generator Page */}
      {!isAIGeneratorPage && (
        <button
          onClick={handleAIGenerateClick}
          className="group hidden items-center gap-2 rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-blue-500/10 px-4 py-2 text-sm font-bold text-blue-500 transition-all hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] sm:flex"
        >
          <span>AI Generate</span>
        </button>
      )}

      {/* Motion Effects Dropdown - Only on AI Generator Page */}
      <AnimatePresence>
        {isAIGeneratorPage &&
          typeof setIsAnimated === "function" &&
          typeof setAnimationSpeed === "function" && (
            <NavbarMotionMenu
              isAnimated={isAnimated}
              setIsAnimated={setIsAnimated}
              animationSpeed={animationSpeed}
              setAnimationSpeed={setAnimationSpeed}
            />
          )}
      </AnimatePresence>

      {/* Export Dialog - Only on AI Generator Page */}
      <AnimatePresence>
        {isAIGeneratorPage && (
          <NavbarExportDialog
            result={result}
            isAnimated={isAnimated}
            animationSpeed={animationSpeed}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
