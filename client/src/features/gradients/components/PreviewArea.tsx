import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { GeneratedGradient } from "../types";
import { useState, useEffect, useRef, useCallback } from "react";
import { AIPromptSection } from "./AIPromptSection";

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

}

export const PreviewArea = ({
  result,
  isAnimated,
  animationSpeed,
  onAngleChange,
  showAngleController,
  isLightGradient,
  loading,
  onGenerate,
}: PreviewAreaProps) => {
  console.log('PreviewArea props:', { loading, onGenerate: typeof onGenerate });

  const [currentAngle, setCurrentAngle] = useState<number>(result?.angle ?? 0);
  const [isMobile, setIsMobile] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const initialViewportHeight = useRef<number>(0);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Detect keyboard open/close on mobile
  useEffect(() => {
    if (!isMobile) return;

    // Store initial viewport height
    initialViewportHeight.current = window.visualViewport?.height || window.innerHeight;

    const handleViewportResize = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const heightDifference = initialViewportHeight.current - currentHeight;

      // If viewport shrinks by more than 150px, keyboard is likely open
      setIsKeyboardOpen(heightDifference > 150);
    };

    // Use visualViewport API for better keyboard detection
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportResize);
      return () => {
        window.visualViewport?.removeEventListener("resize", handleViewportResize);
      };
    } else {
      // Fallback for browsers without visualViewport
      window.addEventListener("resize", handleViewportResize);
      return () => window.removeEventListener("resize", handleViewportResize);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!result) return;
    setCurrentAngle(result.angle ?? 0);
  }, [result]);

  const handlePointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = clientX - centerX;
      const dy = clientY - centerY;

      // 0° at top, clockwise increasing
      let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;

      const roundedAngle = Math.round(angle);
      setCurrentAngle(roundedAngle);
      onAngleChange?.(roundedAngle);
    },
    [onAngleChange],
  );

  const displayAngle = currentAngle;
  const controlColor = isLightGradient ? "black" : "white";

  const lineLength = 80;

  // For placing the angle label
  const angleInRadians = ((displayAngle - 90) * Math.PI) / 180;
  const labelX = Math.cos(angleInRadians) * lineLength;
  const labelY = Math.sin(angleInRadians) * lineLength;

  // SVG geometry
  const pad = 70;
  const size = (lineLength + pad) * 2;
  const cx = lineLength + pad;
  const cy = lineLength + pad;

  return (
    <main className="relative flex-1 overflow-hidden">
      <div
        className={`flex h-full w-full flex-col items-center p-4 transition-all duration-300 md:justify-center md:p-8 ${isMobile && !isKeyboardOpen
          ? "justify-between gap-6"
          : "justify-end gap-3"
          }`}
      >
        {/* Gradient Preview - Responsive sizing based on keyboard state */}
        <AnimatePresence>
          {(!isMobile || !isKeyboardOpen) && (
            <motion.div
              initial={isMobile ? { opacity: 0, scale: 0.9, y: -20 } : false}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-1 items-center max-md:items-start max-md:pt-20 justify-center md:flex-none"
            >
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="preview"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`relative ${isMobile && isKeyboardOpen
                      ? "h-[120px] w-[120px]"
                      : "h-[300px] w-[300px] max-md:h-[50vw] max-md:w-[50vw]"
                      }`}
                    ref={containerRef}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 -z-10 scale-110 rounded-full opacity-70 blur-3xl"
                      style={{
                        background: `${result.type}-gradient(${result.type === "linear"
                          ? `${displayAngle}deg, `
                          : result.type === "conic"
                            ? `from ${displayAngle}deg, `
                            : ""
                          }${result.colors.join(", ")})`,
                        backgroundSize: isAnimated ? "400% 400%" : "cover",
                        animation: isAnimated
                          ? `gradientShift ${10 / animationSpeed}s ease infinite`
                          : "none",
                      }}
                    />
                    <div
                      className="h-full w-full rounded-full shadow-2xl transition-all duration-700"
                      style={{
                        background: `${result.type}-gradient(${result.type === "linear"
                          ? `${displayAngle}deg, `
                          : result.type === "conic"
                            ? `from ${displayAngle}deg, `
                            : ""
                          }${result.colors.join(", ")})`,
                        backgroundSize: isAnimated ? "400% 400%" : "cover",
                        animation: isAnimated
                          ? `gradientShift ${10 / animationSpeed}s ease infinite`
                          : "none",
                      }}
                    />

                    <div className="pointer-events-none absolute inset-0 rounded-full border border-border" />

                    {!isKeyboardOpen && (
                      <AnimatePresence initial={false}>
                        {showAngleController && (
                          <motion.div
                            key="angle-controller"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="pointer-events-none absolute inset-0 flex items-center justify-center"
                          >
                            <div
                              className="absolute h-2 w-2 rounded-full"
                              style={{ backgroundColor: controlColor, opacity: 0.5 }}
                            />

                            <svg
                              className="pointer-events-auto absolute"
                              width={size}
                              height={size}
                              style={{ overflow: "visible", touchAction: "none" }}
                              onPointerDown={(e) => {
                                isDraggingRef.current = true;
                                (e.currentTarget as SVGSVGElement).setPointerCapture(
                                  e.pointerId,
                                );
                                handlePointer(e.clientX, e.clientY);
                              }}
                              onPointerMove={(e) => {
                                if (!isDraggingRef.current) return;
                                handlePointer(e.clientX, e.clientY);
                              }}
                              onPointerUp={(e) => {
                                isDraggingRef.current = false;
                                try {
                                  (
                                    e.currentTarget as SVGSVGElement
                                  ).releasePointerCapture(e.pointerId);
                                } catch {
                                  // ignore
                                }
                              }}
                              onPointerCancel={() => {
                                isDraggingRef.current = false;
                              }}
                            >
                              <g transform={`rotate(${displayAngle} ${cx} ${cy})`}>
                                <line
                                  x1={cx}
                                  y1={cy}
                                  x2={cx}
                                  y2={cy - lineLength}
                                  stroke={controlColor}
                                  strokeWidth={2}
                                  opacity={0.4}
                                  pointerEvents="none"
                                />

                                <circle
                                  cx={cx}
                                  cy={cy - lineLength}
                                  r={20}
                                  fill={
                                    isLightGradient
                                      ? "rgba(0,0,0,0.15)"
                                      : "rgba(255,255,255,0.15)"
                                  }
                                  stroke={
                                    isLightGradient
                                      ? "rgba(0,0,0,0.3)"
                                      : "rgba(255,255,255,0.3)"
                                  }
                                  strokeWidth={2}
                                  style={{ cursor: "grab" }}
                                />

                                <circle
                                  cx={cx}
                                  cy={cy - lineLength}
                                  r={6}
                                  fill={controlColor}
                                  opacity={0.95}
                                  pointerEvents="none"
                                />
                              </g>
                            </svg>

                            <div
                              className="absolute"
                              style={{
                                transform: `translate(${labelX}px, ${labelY}px)`,
                              }}
                            >
                              <motion.div
                                className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium backdrop-blur-sm"
                                style={{
                                  backgroundColor: isLightGradient
                                    ? "rgba(0,0,0,0.75)"
                                    : "rgba(0,0,0,0.8)",
                                  color: "white",
                                  pointerEvents: "none",
                                }}
                              >
                                {displayAngle}°
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="text-foreground/20 h-10 w-10 animate-spin" />
                    <p className="text-foreground/40 text-sm font-medium">
                      Booting Creative Studio...
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile AI Prompt Section - Sticky at bottom, expands when keyboard opens */}
        {isMobile && (
          <motion.div
            layout
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <AIPromptSection loading={loading} onGenerate={onGenerate} />

          </motion.div>
        )}
      </div>
    </main>
  );
};
