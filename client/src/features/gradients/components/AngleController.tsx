import React, { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/shared/lib/utils";

interface AngleControllerProps {
  angle: number;
  onChange: (angle: number) => void;
  isDragging?: boolean;
  onDraggingChange?: (isDragging: boolean) => void;
  size?: number;
}

export const AngleController = ({
  angle,
  onChange,
  onDraggingChange,
  size = 220,
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
      <div className="absolute inset-0 rounded-full border border-white/5 bg-white/[0.01] pointer-events-none" />
      
      {/* Unified 'Clock Hand' (Needle + Handle) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        {/* Needle */}
        <div
          className="absolute w-[2px] bg-gradient-to-t from-transparent via-white/50 to-white/80 origin-bottom"
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
            className="h-4 w-4 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.4)] flex items-center justify-center border border-primary/50"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          </div>
        </div>
      </div>

      {/* Angle Display Center - Optional aesthetic */}
      <div className="absolute flex flex-col items-center justify-center pointer-events-none bg-black/40 backdrop-blur-md rounded-full w-12 h-12 border border-white/10 shadow-lg">
        <span className="text-[10px] font-bold text-white leading-none">
          {angle}°
        </span>
      </div>
    </div>
  );
};
