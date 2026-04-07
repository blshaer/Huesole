// src/shared/layout/Navbar/NavbarAiControls.tsx

import { AnimatePresence } from "framer-motion";
import { GeneratedGradient } from "@/features/gradients/types";
import { NavbarMotionMenu } from "./NavbarMotionMenu";
import { NavbarExportDialog } from "./NavbarExportDialog";


interface NavbarAiControlsProps {
  isAIGeneratorPage: boolean;
  result: GeneratedGradient | null;
  isAnimated: boolean;
  setIsAnimated?: (value: boolean) => void;
  animationSpeed: number;
  setAnimationSpeed?: (value: number) => void;
}

export const NavbarAiControls = ({
  isAIGeneratorPage,
  result,
  isAnimated,
  setIsAnimated,
  animationSpeed,
  setAnimationSpeed,
}: NavbarAiControlsProps) => {


  return (
    <div className="flex items-center gap-2">


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
