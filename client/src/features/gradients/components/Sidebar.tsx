import { useRef, useEffect, useState } from "react";
import { Loader2, Save, X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { AIPromptSection } from "./AIPromptSection";
import { StyleControls } from "./StyleControls";
import { ColorStopsSection } from "./ColorStopsSection";
import { AnimationSection } from "./AnimationSection";
import { ExportSection } from "./ExportSection";
import { GeneratedGradient } from "../types";

interface SidebarProps {
  result: GeneratedGradient | null;
  setResult: (gradient: GeneratedGradient) => void;
  loading: boolean;
  saving: boolean;
  isAnimated: boolean;
  setIsAnimated: (value: boolean) => void;
  animationSpeed: number;
  setAnimationSpeed: (value: number) => void;
  onGenerate: (prompt?: string) => Promise<void>;
  onSave: () => Promise<void>;
  onUpdateColor: (index: number, color: string) => void;
  onAddColor: () => void;
  onRemoveColor: (index: number) => void;
}

export const Sidebar = ({
  result,
  setResult,
  loading,
  saving,
  isAnimated,
  setIsAnimated,
  animationSpeed,
  setAnimationSpeed,
  onGenerate,
  onSave,
  onUpdateColor,
  onAddColor,
  onRemoveColor,
}: SidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (sidebarRef.current) {
        const scrollTop = sidebarRef.current.scrollTop;
        const scrollHeight = sidebarRef.current.scrollHeight;
        const clientHeight = sidebarRef.current.clientHeight;
        const totalScrollable = scrollHeight - clientHeight;

        if (totalScrollable > 0) {
          const progress = (scrollTop / totalScrollable) * 100;
          setScrollProgress(progress);
        } else {
          setScrollProgress(0);
        }
      }
    };

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener("scroll", handleScroll);
      return () => sidebar.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const sidebarContent = (
    <>
      <div
        ref={sidebarRef}
        className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-6 pt-8"
      >
        <AIPromptSection loading={loading} onGenerate={onGenerate} />
        <StyleControls result={result} setResult={setResult} />
        <ColorStopsSection
          result={result}
          onUpdateColor={onUpdateColor}
          onAddColor={onAddColor}
          onRemoveColor={onRemoveColor}
        />
      </div>

      <div className="bg-background/60 flex-shrink-0 border-t border-border p-6 backdrop-blur-xl">
        <Button
          onClick={onSave}
          disabled={saving || !result}
          className="w-full"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save to Profile
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button - Top Right - Hidden when sidebar is open */}
      <AnimatePresence>
        {isMobile && !isMobileOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={toggleMobileSidebar}
            className="bg-background/80 hover:bg-background/90 fixed right-4 top-20 z-[60] rounded-full border border-border p-3 shadow-lg backdrop-blur-xl transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Always Visible */}
      {!isMobile && (
        <aside className="bg-background/40 relative z-20 flex h-full w-[420px] flex-shrink-0 flex-col border-r border-border backdrop-blur-3xl">
          {sidebarContent}
        </aside>
      )}

      {/* Mobile Sidebar - Slide In/Out */}
      <AnimatePresence mode="wait">
        {isMobile && isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleMobileSidebar}
              className="fixed inset-0 z-[55] bg-black/70"
            />

            {/* Sidebar Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.3,
                ease: [0.32, 0.72, 0, 1],
              }}
              className="fixed bottom-0 left-0 top-0 z-[56] flex h-full w-[90vw] max-w-[420px] flex-col border-r border-border bg-black/95 shadow-2xl backdrop-blur-3xl"
            >
              {/* Close Button Inside Sidebar */}
              <div className="flex items-center justify-between border-b border-border p-4">
                <h2 className="text-lg font-semibold text-white"></h2>
                <button
                  onClick={toggleMobileSidebar}
                  className="hover:bg-foreground/5 rounded-lg p-2 transition-colors"
                  aria-label="Close sidebar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
