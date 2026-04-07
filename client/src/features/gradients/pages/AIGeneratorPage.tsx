"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/features/navbar/components/Navbar";
import Sidebar from "@/features/gradients/components/Sidebar";
import PreviewArea from "@/features/gradients/components/PreviewArea";
import RightSidebar from "@/features/gradients/components/RightSidebar";
import { GeneratedGradient as GradientResult } from "@/features/gradients/types";
import { useGradientGeneration } from "@/features/gradients/hooks/useGradientGeneration";
import { useAuth } from "@/features/auth/context/AuthContext";
import { CanvasSize } from "@/features/navbar/components/NavbarCanvasSize";
import Footer from "@/features/footer/components/Footer";
import { serializeGradientToParams, deserializeGradientFromParams } from "@/features/gradients/utils/urlParams";
import { Palette, SlidersHorizontal, ChevronDown } from "lucide-react";

const AIGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [result, setResult] = useState<GradientResult>(() => {
    // 1. Check for URL parameters first (Highest priority for sharing)
    const fromUrl = deserializeGradientFromParams(location.search);
    if (fromUrl) {
      return {
        ...fromUrl,
        name: fromUrl.name || "Custom Design",
      } as GradientResult;
    }

    // 2. Check for navigation state
    if (location.state) {
      const { name, colors, angle, type, exposure, contrast, frequency, phase, steps, baseColors, rawCss } = location.state as any;
      if (colors && colors.length > 0) {
        return {
          name: name || "Custom Gradient",
          colors: colors,
          baseColors: baseColors || colors,
          angle: angle ?? 135,
          type: type || "linear",
          rawCss: rawCss || undefined,
          exposure: exposure ?? 0,
          contrast: contrast ?? 1,
          frequency: frequency ?? 0,
          phase: phase ?? 0,
          steps: steps ?? null,
        };
      }
    }

    // 2. Check for saved gradient during initialization
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("current_gradient");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved gradient", e);
        }
      }
    }

    // 3. Fallback to default
    return {
      colors: ["#6366f1", "#a855f7", "#ec4899"],
      type: "linear",
      angle: 135,
      name: "Midnight Aurora",
    };
  });
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(4);
  const [showAngleController, setShowAngleController] = useState(true);
  const [canvasSize, setCanvasSize] = useState<CanvasSize | null>(null);

  // Mobile bottom sheet state
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<"colors" | "adjustments">("colors");

  const { handleGenerate, loading } = useGradientGeneration({
    user,
    navigate,
    setResult,
  });

  // Update URL whenever result changes (Unique ID per state)
  useEffect(() => {
    if (result) {
      const params = serializeGradientToParams(result);
      if (params) {
        navigate({ search: params }, { replace: true });
      }
      localStorage.setItem("current_gradient", JSON.stringify(result));
    }
  }, [result, navigate]);

  const handleAngleChange = (angle: number) => {
    setResult((prev) => ({ ...prev, angle }));
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const toggleAngleController = () => {
    setShowAngleController(!showAngleController);
  };

  const isLightGradient = useMemo(() => {
    if (!result?.colors || result.colors.length === 0) return false;
    const totalLuminance = result.colors.reduce((acc, hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return acc + (0.299 * r + 0.587 * g + 0.114 * b);
    }, 0);
    return (totalLuminance / result.colors.length) > 128;
  }, [result?.colors]);

  const handleUpdateColor = useCallback((index: number, newColor: string) => {
    setResult((prev) => {
      const newColors = [...prev.colors];
      newColors[index] = newColor;
      return { ...prev, colors: newColors, baseColors: newColors };
    });
  }, []);

  const handleAddColor = useCallback((color?: string) => {
    setResult((prev) => {
      const lastColor = prev.colors[prev.colors.length - 1] || "#6366f1";
      const newColors = [...prev.colors, color ?? lastColor];
      return { 
        ...prev, 
        colors: newColors,
        baseColors: newColors 
      };
    });
  }, []);

  const handleRemoveColor = useCallback((index: number) => {
    setResult((prev) => {
      const newColors = prev.colors.filter((_, i) => i !== index);
      return { ...prev, colors: newColors, baseColors: newColors };
    });
  }, []);

  const handleMoveColor = useCallback((index: number, direction: 'up' | 'down') => {
    setResult((prev) => {
      const newColors = [...prev.colors];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= newColors.length) return prev;
      [newColors[index], newColors[newIndex]] = [newColors[newIndex], newColors[index]];
      return { ...prev, colors: newColors, baseColors: newColors };
    });
  }, []);

  const openMobileSheet = (tab: "colors" | "adjustments") => {
    setMobileActiveTab(tab);
    setMobileSheetOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      <Navbar
        result={result}
        isAnimated={isAnimated}
        setIsAnimated={setIsAnimated}
        animationSpeed={animationSpeed}
        setAnimationSpeed={setAnimationSpeed}
        showAngleController={showAngleController}
        onToggleAngleController={toggleAngleController}
        onToggleSidebar={toggleMobileSidebar}
        isLightGradient={isLightGradient}
        onCanvasSizeSelect={setCanvasSize}
        canvasSize={canvasSize}
      />

      {/* ========== DESKTOP LAYOUT (md+) — UNCHANGED ========== */}
      <main className="hidden md:flex flex-1 container py-4 md:py-8 overflow-hidden">
        <div className="grid h-full md:h-[78vh] w-full grid-cols-1 md:grid-cols-[380px_1fr] xl:grid-cols-[380px_1fr_320px] gap-6">
          {/* Left Section: Main Sidebar */}
          <div className="hidden md:flex flex-col h-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-3xl shadow-2xl">
            <Sidebar
              result={result}
              isAnimated={isAnimated}
              setIsAnimated={setIsAnimated}
              animationSpeed={animationSpeed}
              setAnimationSpeed={setAnimationSpeed}
              onUpdateColor={handleUpdateColor}
              onAddColor={handleAddColor}
              onRemoveColor={handleRemoveColor}
              onMoveColor={handleMoveColor}
              isMobileOpen={isMobileSidebarOpen}
              onToggleMobile={toggleMobileSidebar}
            />
          </div>

          {/* Center Section: Preview Area */}
          <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-black/20 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
            <PreviewArea
              result={result}
              isAnimated={isAnimated}
              animationSpeed={animationSpeed}
              onAngleChange={handleAngleChange}
              showAngleController={showAngleController}
              onToggleAngleController={toggleAngleController}
              isLightGradient={isLightGradient}
              onGenerate={handleGenerate}
              loading={loading}
              setResult={setResult}
              canvasSize={canvasSize}
            />
          </div>

          {/* Right Section: Adjustments */}
          <div className="hidden xl:flex flex-col h-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-3xl shadow-2xl">
            <RightSidebar
              result={result}
              setResult={setResult}
            />
          </div>
        </div>
      </main>

      {/* ========== MOBILE LAYOUT (<md) ========== */}
      <main className="flex md:hidden flex-1 flex-col overflow-hidden">
        {/* Full-screen Preview */}
        <div className="flex-1 relative overflow-hidden">
          <PreviewArea
            result={result}
            isAnimated={isAnimated}
            animationSpeed={animationSpeed}
            onAngleChange={handleAngleChange}
            showAngleController={showAngleController}
            onToggleAngleController={toggleAngleController}
            isLightGradient={isLightGradient}
            onGenerate={handleGenerate}
            loading={loading}
            setResult={setResult}
            canvasSize={canvasSize}
          />
        </div>

        {/* Mobile Floating Action Bar */}
        <div className="sticky bottom-0 z-40 flex items-center justify-center gap-3 px-4 py-3 bg-black/80 backdrop-blur-2xl border-t border-white/10">
          <button
            onClick={() => openMobileSheet("colors")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-3 px-4 text-sm font-semibold text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <Palette className="h-4 w-4 text-violet-400" />
            Colors
          </button>
          <button
            onClick={() => openMobileSheet("adjustments")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-3 px-4 text-sm font-semibold text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <SlidersHorizontal className="h-4 w-4 text-blue-400" />
            Adjustments
          </button>
        </div>

        {/* Mobile Bottom Sheet */}
        {mobileSheetOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileSheetOpen(false)}
            />

            {/* Sheet Panel */}
            <div className="fixed bottom-0 left-0 right-0 z-[101] flex flex-col rounded-t-[28px] bg-[#0b0d12] border border-white/10 border-b-0 shadow-[0_-20px_60px_rgba(0,0,0,0.6)] max-h-[85vh]">
              {/* Handle + Header */}
              <div className="flex flex-col items-center pt-3 pb-0 px-4">
                <div className="h-1 w-10 rounded-full bg-white/20 mb-4" />
                {/* Tab Row */}
                <div className="flex w-full items-center justify-between">
                  <div className="flex gap-1 rounded-xl bg-white/5 p-1">
                    <button
                      onClick={() => setMobileActiveTab("colors")}
                      className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                        mobileActiveTab === "colors"
                          ? "bg-white text-black shadow"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      <Palette className="h-3.5 w-3.5" /> Colors
                    </button>
                    <button
                      onClick={() => setMobileActiveTab("adjustments")}
                      className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                        mobileActiveTab === "adjustments"
                          ? "bg-white text-black shadow"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5" /> Adjustments
                    </button>
                  </div>
                  <button
                    onClick={() => setMobileSheetOpen(false)}
                    className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Sheet Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-8 pt-2">
                {mobileActiveTab === "colors" ? (
                  <Sidebar
                    result={result}
                    isAnimated={isAnimated}
                    setIsAnimated={setIsAnimated}
                    animationSpeed={animationSpeed}
                    setAnimationSpeed={setAnimationSpeed}
                    onUpdateColor={handleUpdateColor}
                    onAddColor={handleAddColor}
                    onRemoveColor={handleRemoveColor}
                    onMoveColor={handleMoveColor}
                    isMobileOpen={false}
                    onToggleMobile={() => {}}
                    forceMobileVisible
                  />
                ) : (
                  <RightSidebar
                    result={result}
                    setResult={setResult}
                    forceMobileVisible
                  />
                )}
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AIGeneratorPage;


