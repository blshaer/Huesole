// src/shared/layout/Navbar/NavbarExportDialog.tsx

import { useState } from "react";
import { motion } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

import { GeneratedGradient } from "@/features/gradients/types";
import { ExportSection } from "@/features/gradients/components/ExportSection";

interface NavbarExportDialogProps {
  result: GeneratedGradient | null;
  isAnimated: boolean;
  animationSpeed: number;
}

export const NavbarExportDialog = ({
  result,
  isAnimated,
  animationSpeed,
}: NavbarExportDialogProps) => {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      className="sm:block"
    >
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogTrigger asChild>
          <button
            className="flex items-center gap-2 rounded-[8px] border border-border bg-card px-3 py-2 text-sm font-medium transition-all hover:bg-white/5"
            title="Export gradient"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            <span>Export</span>
          </button>
        </DialogTrigger>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="text-white">Export Gradient</DialogTitle>
            <DialogDescription className="text-white/50">
              Export your gradient in various formats and sizes
            </DialogDescription>
          </DialogHeader>

          <ExportSection
            result={result}
            isAnimated={isAnimated}
            animationSpeed={animationSpeed}
          />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
