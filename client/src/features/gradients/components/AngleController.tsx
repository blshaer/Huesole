import React, { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/shared/lib/utils";

interface AngleControllerProps {
  angle: number;
  onChange: (angle: number) => void;
  isDragging?: boolean;
  onDraggingChange?: (isDragging: boolean) => void;
  size?: number;
  isLight?: boolean;
}

export const AngleController = ({
  angle,
  onChange,
  onDraggingChange,
  size = 220,
  isLight = false,
}: AngleControllerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const controllerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback(
    (e: PointerEvent | React.PointerEvent) => {
      if (!isDragging || !controllerRef.current) return;

      const rect = controllerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      let newAngle = Math.atan2(dy, dx) * (180 / Math.PI);
      // Offset by 90 so that 0 is at the top (standard for linear-gradient)
      newAngle = (newAngle + 90 + 360) % 360;

      onChange(Math.round(newAngle));
    },
    [isDragging, onChange]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    onDraggingChange?.(false);
  }, [onDraggingChange]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    onDraggingChange?.(true);
    e.preventDefault();
    handlePointerMove(e);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      document.body.style.cursor = "grabbing";
    } else {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      document.body.style.cursor = "";
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      document.body.style.cursor = "";
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  return (
    <div
      ref={controllerRef}
      className="relative flex items-center justify-center pointer-events-auto"
      style={{
        width: size,
        height: size,
      }}
      onPointerDown={handlePointerDown}
    >
      {/* Visual background guide */}
      <div className={cn(
        "absolute inset-0 rounded-full border pointer-events-none transition-colors duration-500",
        isLight ? "border-black/10 bg-black/[0.02]" : "border-white/5 bg-white/[0.01]"
      )} />
      
      {/* Unified 'Clock Hand' (Needle + Handle) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        {/* Needle */}
        <div
          className={cn(
            "absolute w-[2px] origin-bottom transition-colors duration-500",
            isLight 
              ? "bg-gradient-to-t from-transparent via-black/40 to-black/70"
              : "bg-gradient-to-t from-transparent via-white/50 to-white/80"
          )}
          style={{ 
            height: size / 2 - 10,
            bottom: '50%',
            left: 'calc(50% - 1px)'
          }}
        />

        {/* Handle */}
        <div
          className="absolute cursor-grab active:cursor-grabbing"
          style={{
            top: 10, // Orbit edge
            left: 'calc(50% - 8px)',
            pointerEvents: "auto",
          }}
        >
          <div 
            className={cn(
              "h-4 w-4 rounded-full flex items-center justify-center border transition-all duration-500",
              isLight
                ? "bg-black shadow-[0_0_10px_rgba(0,0,0,0.3)] border-black/50"
                : "bg-white shadow-[0_0_10px_rgba(255,255,255,0.4)] border-white/50"
            )}
          >
            <div className={cn(
              "h-1.5 w-1.5 rounded-full",
              isLight ? "bg-white" : "bg-black"
            )} />
          </div>
        </div>
      </div>

      {/* Angle Display Center - Optional aesthetic */}
      <div className={cn(
        "absolute flex flex-col items-center justify-center pointer-events-none backdrop-blur-md rounded-full w-12 h-12 border shadow-lg transition-all duration-500",
        isLight
          ? "bg-white/40 border-black/10"
          : "bg-black/40 border-white/10"
      )}>
        <span className={cn(
          "text-[10px] font-black leading-none",
          isLight ? "text-black" : "text-white"
        )}>
          {angle}°
        </span>
      </div>
    </div>
  );
};
