// src/shared/layout/Navbar/NavbarMotionMenu.tsx

import { motion, AnimatePresence } from "framer-motion";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import { AnimationSection } from "@/features/gradients/components/AnimationSection";

interface NavbarMotionMenuProps {
  isAnimated: boolean;
  setIsAnimated: (value: boolean) => void;
  animationSpeed: number;
  setAnimationSpeed: (value: number) => void;
}

// Variants for the dropdown panel
const panelVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.98,
    transition: { duration: 0.12, ease: "easeIn" },
  },
};

export const NavbarMotionMenu = ({
  isAnimated,
  setIsAnimated,
  animationSpeed,
  setAnimationSpeed,
}: NavbarMotionMenuProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="hidden sm:block"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className={`flex items-center gap-2 rounded-[8px] border px-3 py-2 text-sm font-medium transition-all ${
              isAnimated
                ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                : "border-border bg-card text-foreground/70 hover:bg-white/5"
            }`}
            title={isAnimated ? "Animation Active" : "Animation Inactive"}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              // Slight rotation when active to give subtle feedback
              animate={isAnimated ? { rotate: 90 } : { rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              {!isAnimated ? (
                <polygon points="6 3 20 12 6 21 6 3" />
              ) : (
                <>
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                </>
              )}
            </motion.svg>
            <span>Motion</span>
          </motion.button>
        </DropdownMenuTrigger>

        {/* AnimatePresence to smoothly mount/unmount the dropdown panel */}
        <AnimatePresence>
          <DropdownMenuContent
            asChild
            align="end"
            sideOffset={8}
            className="z-[150] w-80 overflow-hidden rounded-2xl border border-white/10 bg-gray-950/90 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] backdrop-blur-xl dark:bg-gray-950/90"
          >
            <motion.div
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DropdownMenuLabel className="px-3 py-2 backdrop-blur-sm">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none text-white">
                    Motion Effects
                  </p>
                  <p className="text-xs leading-none text-gray-400">
                    Control animation settings for your gradient
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 bg-white/10" />
              <div className="px-3 py-3">
                <AnimationSection
                  isAnimated={isAnimated}
                  setIsAnimated={setIsAnimated}
                  animationSpeed={animationSpeed}
                  setAnimationSpeed={setAnimationSpeed}
                />
              </div>
            </motion.div>
          </DropdownMenuContent>
        </AnimatePresence>
      </DropdownMenu>
    </motion.div>
  );
};
