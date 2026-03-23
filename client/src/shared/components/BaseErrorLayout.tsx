import React from "react";
import { RetroGrid } from "@/shared/ui/RetroGrid";

interface BaseErrorLayoutProps {
  title: string;
  description: string;
  image?: string;
  actionText?: string;
  onAction?: () => void;
  actionHref?: string;
}

export const BaseErrorLayout: React.FC<BaseErrorLayoutProps> = ({
  title,
  description,
  image = "/assets/not-found-404.png",
  actionText = "Back to Home",
  onAction,
  actionHref = "/",
}) => {
  return (
    <div className="relative flex h-[100vh] w-full flex-col items-center justify-center overflow-hidden bg-background">
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        {image && (
          <div className="mb-8 h-48 w-48 animate-pulse-slow">
            <img
              src={image}
              alt="Error Illustration"
              className="h-full w-full object-contain"
            />
          </div>
        )}

        <h1 className="text-5xl font-black leading-none tracking-tighter text-white sm:text-8xl">
          {title}
        </h1>

        <p className="mt-4 max-w-md text-lg font-medium text-white">
          {description}
        </p>

        {onAction ? (
          <button
            onClick={onAction}
            className="mt-8 rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/20"
          >
            {actionText}
          </button>
        ) : (
          <a
            href={actionHref}
            className="mt-8 rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/20"
          >
            {actionText}
          </a>
        )}
      </div>

      <RetroGrid />
    </div>
  );
};
