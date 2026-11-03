import React from "react";
import { RetroGrid } from "@/components/RetroGrid";
import { motion } from "framer-motion";

interface BaseErrorLayoutProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionHref?: string;
}

export const BaseErrorLayout: React.FC<BaseErrorLayoutProps> = ({
  title,
  description,
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
      className="fixed inset-0 z-[200] flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-black leading-none tracking-tighter text-[#fafafa] sm:text-6xl">
          {title}
        </h1>

        <p className="mt-3 max-w-sm text-base font-medium text-[#d4d4d4]">
          {description}
        </p>

        {onAction ? (
          <button
            onClick={onAction}
            className="mt-6 rounded-full bg-[#fafafa] px-6 py-2.5 text-xs font-bold text-[#0a0a0a] transition-all hover:bg-[#e5e5e5]"
          >
            {actionText}
          </button>
        ) : (
          <a
            href={actionHref}
            className="mt-6 rounded-full bg-[#fafafa] px-6 py-2.5 text-xs font-bold text-[#0a0a0a] transition-all hover:bg-[#e5e5e5]"
          >
            {actionText}
          </a>
        )}
      </div>

      <RetroGrid />
    </motion.div>
  );
};
