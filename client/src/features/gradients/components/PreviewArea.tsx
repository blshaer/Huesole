import { useState, useEffect, useCallback } from "react";
import { VercelSpinner } from "@/shared/ui/VercelSpinner";
import { GeneratedGradient } from "../types";
import { AngleController } from "./AngleController";
import { motion, AnimatePresence } from "framer-motion";
import { AIPromptSection } from "./AIPromptSection";
import { CanvasSize } from "@/features/navbar/components/NavbarCanvasSize";

interface PreviewAreaProps {
  result: GeneratedGradient | null;
  isAnimated: boolean;
  animationSpeed: number;
  onAngleChange?: (angle: number) => void;
  showAngleController: boolean;
  onToggleAngleController: () => void;
  isLightGradient: boolean;
  loading: boolean;
  onGenerate: (prompt?: string) => Promise<void>;
  setResult: React.Dispatch<React.SetStateAction<GeneratedGradient>>;
  canvasSize?: CanvasSize | null;
}

export const PreviewArea = ({
  result,
  isAnimated,
  animationSpeed,
  onAngleChange,
  showAngleController,
  loading,
  onGenerate,
  canvasSize,
}: PreviewAreaProps) => {
  const [currentAngle, setCurrentAngle] = useState<number>(result?.angle ?? 0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Sync angle and trigger thinking state when a new result with reasoning arrives
  useEffect(() => {
    if (result?.angle !== undefined) {
      setCurrentAngle(result.angle);
    }
  }, [result?.angle]);


  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const height = window.innerHeight;
      setIsKeyboardOpen(isMobile && height < 500);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAngleUpdate = useCallback((angle: number) => {
    setCurrentAngle(angle);
    onAngleChange?.(angle);
  }, [onAngleChange]);

  const isMobile = window.innerWidth < 768;
  const displayAngle = currentAngle;

  return (
    <div className="flex flex-1 flex-col items-center justify-center relative bg-transparent p-4 min-h-[300px] overflow-hidden">
      <div className="w-full h-full flex items-center justify-center relative max-w-full max-h-full">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <VercelSpinner size={64} />
              <p className="text-sm font-medium text-white/40">AI is composing your masterpiece...</p>
            </motion.div>
          ) : result ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={canvasSize?.label || "default-orb"}
                initial={{ opacity: 0, aspectRatio: "1 / 1" }}
                animate={{
                  opacity: 1,
                  width: canvasSize ? "100%" : isMobile && isKeyboardOpen ? "120px" : "300px",
                  maxWidth: canvasSize ? "min(100%, 500px)" : isMobile && !isKeyboardOpen ? "50vw" : "300px",
                  aspectRatio: canvasSize ? `${canvasSize.width} / ${canvasSize.height}` : "1 / 1",
                  borderRadius: (canvasSize?.label === "Default" || !canvasSize) ? "999px" : "16px",
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.2,
                }}
                className="relative group flex items-center justify-center overflow-hidden"
                style={{
                  maxHeight: canvasSize ? "60vh" : "none",
                }}
              >
                {/* Visual Backdrop Pulse */}
                <motion.div
                  className="pointer-events-none absolute inset-0 -z-10 scale-105 opacity-60 blur-3xl transition-all duration-700"
                  layout
                  animate={{
                    borderRadius: (canvasSize?.label === "Default" || !canvasSize) ? "999px" : "16px",
                  }}
                  style={{
                    backgroundImage: `${result.type}-gradient(${
                      result.type === "linear"
                        ? `${displayAngle}deg, `
                        : result.type === "conic"
                        ? `from ${displayAngle}deg, `
                        : `circle at ${
                            50 + Math.cos(((displayAngle - 90) * Math.PI) / 180) * 30
                          }% ${50 + Math.sin(((displayAngle - 90) * Math.PI) / 180) * 30}%, `
                    }${result.colors.join(", ")})`,
                    backgroundSize: isAnimated ? "400% 400%" : "cover",
                    animation: isAnimated
                      ? `gradientShift ${10 / animationSpeed}s ease infinite`
                      : "none",
                  }}
                />

                {/* Main Gradient Display */}
                <motion.div
                  layout
                  animate={{
                    borderRadius: (canvasSize?.label === "Default" || !canvasSize) ? "999px" : "16px",
                  }}
                  className="h-full w-full shadow-2xl transition-all duration-700 relative z-10"
                  style={{
                    backgroundImage: `${result.type}-gradient(${
                      result.type === "linear"
                        ? `${displayAngle}deg, `
                        : result.type === "conic"
                        ? `from ${displayAngle}deg, `
                        : `circle at ${
                            50 + Math.cos(((displayAngle - 90) * Math.PI) / 180) * 30
                          }% ${50 + Math.sin(((displayAngle - 90) * Math.PI) / 180) * 30}%, `
                    }${result.colors.join(", ")})`,
                    backgroundSize: isAnimated ? "400% 400%" : "cover",
                    animation: isAnimated
                      ? `gradientShift ${10 / animationSpeed}s ease infinite`
                      : "none",
                  }}
                />

                {/* Sleek Border Overlay */}
                <motion.div 
                  layout
                  animate={{
                    borderRadius: (canvasSize?.label === "Default" || !canvasSize) ? "999px" : "16px",
                  }}
                  className="pointer-events-none absolute inset-0 z-20 border border-white/10 overflow-hidden shadow-inner" 
                />

                {/* Interactive Angle Controller Overlay */}
                {!isKeyboardOpen && showAngleController && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="pointer-events-auto">
                      <AngleController 
                        angle={displayAngle} 
                        onChange={handleAngleUpdate}
                        size={220}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Main AI Prompt Input - Always visible in the preview area */}
      <div className="w-full max-w-2xl mt-8 relative z-[60]">
        <AIPromptSection loading={loading} onGenerate={onGenerate} />
      </div>
    </div>
  );
};

export default PreviewArea;
