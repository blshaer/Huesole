"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";

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
        "group relative flex size-full overflow-hidden rounded-2xl border border-border bg-card text-card-foreground",
        className,
      )}
    >
      <div className={cn("relative z-10 w-full", childrenClassName)}>{children}</div>
    </div>
  );
}
