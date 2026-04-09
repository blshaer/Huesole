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
import { ChevronDown } from "lucide-react";

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
              isMobileOpen={false}
              onToggleMobile={() => {}}
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
            <svg viewBox="0 0 90.88 109" className="h-4 w-4 shrink-0 transition-opacity">
              <g fill="white">
                <path d="M26.07,98.72c-4.95-5.62-8.17-12.47-9.31-19.82-1.31-8.42.22-16.87,4.42-24.45l.02-.03s0-.01.01-.02l13.57-23.51c.24-.41.68-.67,1.16-.67s.92.25,1.16.67l16.95,29.35c2.83,4.9,3.57,10.57,2.07,15.96-1.28,4.62-4.12,8.69-7.93,11.46,2.11.84,4.37,1.26,6.74,1.26,7.27,0,13.65-4.13,16.64-10.78,0,0,0,0,0,0,2.43-5.39,2.12-11.43-.85-16.57l-3.37-5.84s-.02-.03-.02-.04h0c-.1-.18-.19-.35-.29-.52L35.95,1.34,4.87,55.17c-6.49,11.24-6.49,24.65,0,35.89,6.49,11.24,18.11,17.94,31.08,17.94,1.4,0,2.78-.08,4.15-.23-5.34-2.21-10.13-5.63-14.03-10.06Z" />
                <path d="M86.01,55.17L54.16,0h-15.89l31.08,53.83c.11.19.22.38.32.57,0,0,0,.01,0,.02l3.36,5.82c3.4,5.89,3.76,12.82.97,19-1.62,3.59-4.18,6.65-7.41,8.83-3.42,2.31-7.45,3.53-11.67,3.53-3.63,0-7.05-.87-10.14-2.59-4.87-2.71-8.53-7.37-10.04-12.81-1.49-5.39-.76-11.06,2.07-15.96l7.07-12.24-7.95-13.76-12.41,21.49v.02c-3.92,7.05-5.35,14.92-4.13,22.74,1.06,6.84,4.06,13.23,8.67,18.46,4.73,5.37,10.85,9.14,17.7,10.91,2.95.76,6.03,1.15,9.16,1.15,9.89,0,19.06-3.88,25.82-10.94h0c5.22-5.45,8.69-12.54,9.76-19.96,1.14-7.92-.41-15.85-4.5-22.93Z" />
              </g>
            </svg>
            Colors
          </button>
          <button
            onClick={() => openMobileSheet("adjustments")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-3 px-4 text-sm font-semibold text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <svg viewBox="0 0 88.8 111.53" className="h-4 w-4 shrink-0 transition-opacity">
              <path fill="white" d="M62.72,72.59l17.89.43c.62.01,1.16-.45,1.22-1.07l6.96-63.24c.15-1.39-1.8-1.88-2.31-.57l-24.85,62.81c-.31.78.25,1.62,1.09,1.64Z" />
              <path fill="white" d="M77.13.11L18.77,25.43c-.57.25-.86.89-.66,1.49l5.69,16.97c.27.79,1.24,1.08,1.89.56L78.36,2.15c1.09-.88.05-2.6-1.23-2.04Z" />
              <path fill="white" d="M59.58,74.72l-43.16,34.66c-1.16.94.08,2.73,1.37,1.97l61.43-36.44-1.98-.05-16.87-.4c-.28,0-.56.09-.78.26Z" />
              <path fill="white" d="M56.81,74.48c.62-.49.6-1.44-.04-1.91l-15.6-11.5-15.6-11.51c-.64-.47-1.54-.21-1.83.53L3.32,101.67c-.29.73-.05,1.56.58,2.03l7.54,5.56c.63.47,1.5.45,2.11-.04,7.57-6.08,39.55-31.75,43.25-34.73Z" />
              <path fill="white" d="M22.72,46.69l-4.67-13.91c-.38-1.14-2.03-1.07-2.31.1L.04,98.26c-.35,1.45,1.74,2.11,2.29.72l11.1-28.06,9.26-23.41c.1-.26.11-.56.02-.83Z" />
              <path fill="white" d="M85.49,5.42l-25.75,65.09c-.29.73-1.19,1-1.83.53-7.77-5.74-23.43-17.27-31.21-23.01-3.82-1.44,48.07-39.6,54.59-45.62.39-.36.97-.38,1.39-.07l2.43,1.79c.4.3.56.83.37,1.29Z" />
            </svg>
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
                      <svg viewBox="0 0 90.88 109" className={`h-3.5 w-3.5 shrink-0 transition-colors ${mobileActiveTab === 'colors' ? 'fill-black' : 'fill-white'}`}>
                        <g>
                          <path d="M26.07,98.72c-4.95-5.62-8.17-12.47-9.31-19.82-1.31-8.42.22-16.87,4.42-24.45l.02-.03s0-.01.01-.02l13.57-23.51c.24-.41.68-.67,1.16-.67s.92.25,1.16.67l16.95,29.35c2.83,4.9,3.57,10.57,2.07,15.96-1.28,4.62-4.12,8.69-7.93,11.46,2.11.84,4.37,1.26,6.74,1.26,7.27,0,13.65-4.13,16.64-10.78,0,0,0,0,0,0,2.43-5.39,2.12-11.43-.85-16.57l-3.37-5.84s-.02-.03-.02-.04h0c-.1-.18-.19-.35-.29-.52L35.95,1.34,4.87,55.17c-6.49,11.24-6.49,24.65,0,35.89,6.49,11.24,18.11,17.94,31.08,17.94,1.4,0,2.78-.08,4.15-.23-5.34-2.21-10.13-5.63-14.03-10.06Z" />
                          <path d="M86.01,55.17L54.16,0h-15.89l31.08,53.83c.11.19.22.38.32.57,0,0,0,.01,0,.02l3.36,5.82c3.4,5.89,3.76,12.82.97,19-1.62,3.59-4.18,6.65-7.41,8.83-3.42,2.31-7.45,3.53-11.67,3.53-3.63,0-7.05-.87-10.14-2.59-4.87-2.71-8.53-7.37-10.04-12.81-1.49-5.39-.76-11.06,2.07-15.96l7.07-12.24-7.95-13.76-12.41,21.49v.02c-3.92,7.05-5.35,14.92-4.13,22.74,1.06,6.84,4.06,13.23,8.67,18.46,4.73,5.37,10.85,9.14,17.7,10.91,2.95.76,6.03,1.15,9.16,1.15,9.89,0,19.06-3.88,25.82-10.94h0c5.22-5.45,8.69-12.54,9.76-19.96,1.14-7.92-.41-15.85-4.5-22.93Z" />
                        </g>
                      </svg> Colors
                    </button>
                    <button
                      onClick={() => setMobileActiveTab("adjustments")}
                      className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                        mobileActiveTab === "adjustments"
                          ? "bg-white text-black shadow"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      <svg viewBox="0 0 88.8 111.53" className={`h-3.5 w-3.5 shrink-0 transition-colors ${mobileActiveTab === 'adjustments' ? 'fill-black' : 'fill-white'}`}>
                        <path d="M62.72,72.59l17.89.43c.62.01,1.16-.45,1.22-1.07l6.96-63.24c.15-1.39-1.8-1.88-2.31-.57l-24.85,62.81c-.31.78.25,1.62,1.09,1.64Z" />
                        <path d="M77.13.11L18.77,25.43c-.57.25-.86.89-.66,1.49l5.69,16.97c.27.79,1.24,1.08,1.89.56L78.36,2.15c1.09-.88.05-2.6-1.23-2.04Z" />
                        <path d="M59.58,74.72l-43.16,34.66c-1.16.94.08,2.73,1.37,1.97l61.43-36.44-1.98-.05-16.87-.4c-.28,0-.56.09-.78.26Z" />
                        <path d="M56.81,74.48c.62-.49.6-1.44-.04-1.91l-15.6-11.5-15.6-11.51c-.64-.47-1.54-.21-1.83.53L3.32,101.67c-.29.73-.05,1.56.58,2.03l7.54,5.56c.63.47,1.5.45,2.11-.04,7.57-6.08,39.55-31.75,43.25-34.73Z" />
                        <path d="M22.72,46.69l-4.67-13.91c-.38-1.14-2.03-1.07-2.31.1L.04,98.26c-.35,1.45,1.74,2.11,2.29.72l11.1-28.06,9.26-23.41c.1-.26.11-.56.02-.83Z" />
                        <path d="M85.49,5.42l-25.75,65.09c-.29.73-1.19,1-1.83.53-7.77-5.74-23.43-17.27-31.21-23.01-3.82-1.44,48.07-39.6,54.59-45.62.39-.36.97-.38,1.39-.07l2.43,1.79c.4.3.56.83.37,1.29Z" />
                      </svg> Adjustments
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


