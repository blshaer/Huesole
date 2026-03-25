import React from "react";
import { RetroGrid } from "@/shared/ui/RetroGrid";
import { motion } from "framer-motion";

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
  image = "/assets/error.png",
  actionText = "Back to Home",
  onAction,
  actionHref = "/",
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[200] flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black"
    >
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        {image && (
          <div className="mb-6 h-32 w-32 animate-pulse-slow">
            <img
              src={image}
              alt="Error Illustration"
              className="h-full w-full object-contain"
            />
          </div>
        )}

        <h1 className="text-4xl font-black leading-none tracking-tighter text-white sm:text-6xl">
          {title}
        </h1>

        <p className="mt-3 max-w-sm text-base font-medium text-white/80">
          {description}
        </p>

        {onAction ? (
          <button
            onClick={onAction}
            className="mt-6 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/10 hover:border-white/20"
          >
            {actionText}
          </button>
        ) : (
          <a
            href={actionHref}
            className="mt-6 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/10 hover:border-white/20"
          >
            {actionText}
          </a>
        )}
      </div>

      <RetroGrid />
    </motion.div>
  );
};
