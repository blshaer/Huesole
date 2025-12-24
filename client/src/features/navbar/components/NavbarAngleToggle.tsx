// src/shared/layout/Navbar/NavbarAngleToggle.tsx

import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarAngleToggleProps {
  showAngleController: boolean;
  onToggle: () => void;
  isLinearGradient: boolean;
}

export const NavbarAngleToggle = ({
  showAngleController,
  onToggle,
  isLinearGradient,
}: NavbarAngleToggleProps) => {
  if (!isLinearGradient) return null;

  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-center rounded-lg border border-border bg-background/80 p-2 transition-colors hover:bg-background/90 backdrop-blur-xl"
      aria-label={showAngleController ? "Hide angle controller" : "Show angle controller"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {showAngleController ? (
          <motion.span
            key="eye-on"
            initial={{ opacity: 0, rotate: -20, scale: 0.9 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 20, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="flex"
          >
            <Eye className="h-5 w-5" />
          </motion.span>
        ) : (
          <motion.span
            key="eye-off"
            initial={{ opacity: 0, rotate: -20, scale: 0.9 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 20, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="flex"
          >
            <EyeOff className="h-5 w-5" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};
