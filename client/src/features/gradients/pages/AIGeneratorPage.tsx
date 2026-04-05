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
      const { name, colors, angle, type, exposure, contrast, frequency, phase, steps } = location.state as any;
      if (colors && colors.length > 0) {
        return {
          name: name || "Custom Gradient",
          colors: colors,
          angle: angle || 135,
          type: type || "linear",
          exposure,
          contrast,
          frequency,
          phase,
          steps,
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
        // Use replace: true to avoid cluttering browser history with every slider move
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
    if (!result?.colors) return false;
    return false; 
  }, [result]);

  const handleUpdateColor = useCallback((index: number, newColor: string) => {
    setResult((prev) => {
      const newColors = [...prev.colors];
      newColors[index] = newColor;
      return { ...prev, colors: newColors };
    });
  }, []);

  const handleAddColor = useCallback(() => {
    setResult((prev) => ({ 
      ...prev, 
      colors: [...prev.colors, "#6366f1"] 
    }));
  }, []);

  const handleRemoveColor = useCallback((index: number) => {
    setResult((prev) => {
      const newColors = prev.colors.filter((_, i) => i !== index);
      return { ...prev, colors: newColors };
    });
  }, []);

  const handleMoveColor = useCallback((index: number, direction: 'up' | 'down') => {
    setResult((prev) => {
      const newColors = [...prev.colors];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= newColors.length) return prev;
      
      [newColors[index], newColors[newIndex]] = [newColors[newIndex], newColors[index]];
      return { ...prev, colors: newColors };
    });
  }, []);

  return (
    <div className="flex min-h-[115vh] flex-col bg-background text-foreground overflow-x-hidden md:pb-12">
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

      <main className="flex-1 container py-4 md:py-6">
        <div className="grid h-full grid-cols-1 md:grid-cols-[380px_1fr] xl:grid-cols-[380px_1fr_320px] gap-6">
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

      <Footer />
    </div>
  );
};

export default AIGeneratorPage;
