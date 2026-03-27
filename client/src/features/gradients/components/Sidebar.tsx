import { useRef, useEffect, useState } from "react";
import { AIPromptSection } from "./AIPromptSection";
import { ColorStopsSection } from "./ColorStopsSection";
import { ExportSection } from "./ExportSection";
import { GeneratedGradient } from "../types";

interface SidebarProps {
  result: GeneratedGradient | null;
  setResult: (gradient: GeneratedGradient) => void;
  loading: boolean;
  isAnimated: boolean;
  setIsAnimated: (value: boolean) => void;
  animationSpeed: number;
  setAnimationSpeed: (value: number) => void;
  onGenerate: (prompt?: string) => Promise<void>;
  onUpdateColor: (index: number, color: string) => void;
  onAddColor: () => void;
  onRemoveColor: (index: number) => void;
  onMoveColor: (index: number, direction: "up" | "down") => void;
  isMobileOpen: boolean;
  onToggleMobile: () => void;
}

export const Sidebar = ({
  result,
  setResult,
  loading,
  onGenerate,
  onUpdateColor,
  onAddColor,
  onRemoveColor,
  onMoveColor,
  isMobileOpen,
  onToggleMobile,
}: SidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768 && isMobileOpen) {
        onToggleMobile();
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

  const sidebarContent = (
    <>
      <div
        ref={sidebarRef}
        className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-6 max-md:pt-0 pt-8"
      >
        <div className="max-md:hidden">
          <AIPromptSection loading={loading} onGenerate={onGenerate} result={result} setResult={setResult} />
        </div>

        <ColorStopsSection
          result={result}
          onUpdateColor={onUpdateColor}
          onAddColor={onAddColor}
          onRemoveColor={onRemoveColor}
          onMoveColor={onMoveColor}
        />

        <div className="max-md:block hidden">


        <ExportSection result={result} />
        </div>

      </div>

    </>
  );

  return (
    <>
      {/* Desktop Sidebar - Always Visible */}
      {!isMobile && (
        <aside className="bg-background/40 relative z-20 flex h-full w-[420px] flex-shrink-0 flex-col border-r border-border backdrop-blur-3xl">
          {sidebarContent}
        </aside>
      )}

      {/* Mobile Sidebar - Toggle */}
      {isMobile && isMobileOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={onToggleMobile}
            className="fixed inset-0 z-[55] bg-black/70"
          />

          {/* Sidebar Panel */}
          <aside className="fixed bottom-0 left-0 top-0 z-[56] flex h-full w-[90vw] max-w-[420px] flex-col border-r border-border bg-black/95 shadow-2xl backdrop-blur-3xl">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
};
