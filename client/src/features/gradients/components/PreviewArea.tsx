import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { GeneratedGradient } from "../types";
import { useState, useEffect, useRef, useCallback } from "react";

interface PreviewAreaProps {
  result: GeneratedGradient | null;
  isAnimated: boolean;
  animationSpeed: number;
  onAngleChange?: (angle: number) => void;
}

export const PreviewArea = ({
  result,
  isAnimated,
  animationSpeed,
  onAngleChange,
}: PreviewAreaProps) => {
  const [currentAngle, setCurrentAngle] = useState<number>(result?.angle ?? 0);
  const [isLightGradient, setIsLightGradient] = useState(false);

  // start hidden
  const [showAngleController, setShowAngleController] = useState(false);

  const [showTooltip, setShowTooltip] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (!result) return;
    setCurrentAngle(result.angle ?? 0);
  }, [result]);

  useEffect(() => {
    if (!result) return;

    const isLight = result.colors.every((color) => {
      const hex = color.replace(/^#/, "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 200;
    });

    setIsLightGradient(isLight);
  }, [result]);

  const handlePointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current || result?.type !== "linear") return;

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
    [onAngleChange, result?.type],
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

  const tooltipText = showAngleController
    ? "Hide angle controller"
    : "Show angle controller";

  return (
    <main className="relative flex-1 overflow-hidden">
      {result?.type === "linear" && (
        <div className="absolute right-6 top-6 z-50">
          <motion.button
            type="button"
            aria-label={tooltipText}
            className="relative flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm"
            style={{
              backgroundColor: isLightGradient
                ? "rgba(0,0,0,0.18)"
                : "rgba(255,255,255,0.18)",
              border: `1px solid ${
                isLightGradient ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.25)"
              }`,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            onClick={() => setShowAngleController((v) => !v)}
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
                  <Eye className="h-4 w-4" style={{ color: controlColor }} />
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
                  <EyeOff className="h-4 w-4" style={{ color: controlColor }} />
                </motion.span>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  key="tooltip"
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium shadow-lg"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.85)",
                    color: "white",
                  }}
                >
                  {tooltipText}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      )}

      <div className="flex h-full w-full items-center justify-center p-8">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="preview"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative h-[300px] w-[300px]"
              ref={containerRef}
            >
              <div
                className="pointer-events-none absolute inset-0 -z-10 scale-110 rounded-full opacity-70 blur-3xl"
                style={{
                  background: `${result.type}-gradient(${
                    result.type === "linear" ? `${displayAngle}deg, ` : ""
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
                  background: `${result.type}-gradient(${
                    result.type === "linear" ? `${displayAngle}deg, ` : ""
                  }${result.colors.join(", ")})`,
                  backgroundSize: isAnimated ? "400% 400%" : "cover",
                  animation: isAnimated
                    ? `gradientShift ${10 / animationSpeed}s ease infinite`
                    : "none",
                }}
              />

              <div className="pointer-events-none absolute inset-0 rounded-full border border-border" />

              {result.type === "linear" && (
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
      </div>
    </main>
  );
};
