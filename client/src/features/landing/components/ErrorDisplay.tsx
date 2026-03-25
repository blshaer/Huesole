import React from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";


interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  title?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  title = "Error loading gradients",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="mb-6 h-20 w-20">
        <img
          src="/assets/error.png"
          alt="Error Illustration"
          className="h-full w-full object-contain animate-pulse-slow"
        />
      </div>


      <h3 className="mb-2 text-xl font-bold text-white tracking-tight">{title}</h3>
      <p className="mb-8 max-w-md text-sm font-medium text-white/50 leading-relaxed">
        {error}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="group relative flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
        >
          <RefreshCw className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 duration-500" />
          Retry Connection
        </button>
      )}
    </motion.div>
  );
};

export default ErrorDisplay;

