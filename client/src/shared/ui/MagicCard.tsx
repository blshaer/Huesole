"use client";

import React, { useRef } from "react";
import { cn } from "@/shared/lib/utils";

export interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
  childrenClassName?: string;
}

export function MagicCard({
  children,
  className,
  childrenClassName,
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative flex size-full overflow-hidden rounded-xl border border-border bg-card text-black dark:bg-neutral-900 dark:text-white",
        className,
      )}
    >
      <div className={cn("relative z-10 w-full", childrenClassName)}>{children}</div>
    </div>
  );
}
