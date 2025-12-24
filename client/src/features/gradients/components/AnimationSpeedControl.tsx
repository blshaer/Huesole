import { AnimatePresence, motion } from "framer-motion";
import { Gauge } from "lucide-react";

interface AnimationSpeedControlProps {
  speed: number;
  onChange: (speed: number) => void;
  disabled?: boolean;
  className?: string;
  visible?: boolean;
}

export const AnimationSpeedControl: React.FC<AnimationSpeedControlProps> = ({
  speed,
  onChange,
  disabled = false,
  className = "",
  visible = true,
}) => {
  const speedOptions = [
    { value: 0.5, label: "Slow" },
    { value: 1, label: "Normal" },
    { value: 2, label: "Fast" },
    { value: 3, label: "Very Fast" },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`flex items-center gap-2 ${className}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          <Gauge className="h-4 w-4 text-white/70" />
          <div className="flex items-center gap-1">
            {speedOptions.map((option) => (
              <motion.button
                key={option.value}
                className={`rounded px-2 py-1 text-xs transition-colors ${speed === option.value
                    ? "bg-blue-500 text-white"
                    : "hover:bg-primary/10 bg-secondary text-white/90"
                  } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                onClick={() => !disabled && onChange(option.value)}
                whileHover={!disabled ? { scale: 1.05 } : {}}
                whileTap={!disabled ? { scale: 0.95 } : {}}
                disabled={disabled}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
