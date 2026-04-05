import { AnimatePresence, motion } from "framer-motion";

interface GradientPreviewProps {
  style: React.CSSProperties;
  gradientType: "background" | "text";
  gradient: { name: string; colors: string[] };
}

export const GradientPreview: React.FC<GradientPreviewProps> = ({
  style,
  gradientType,
  gradient,
}) => {
  const glowColor = gradient.colors[0];

  // For text gradients, ensure proper text styling
  const textGradientStyle =
    gradientType === "text"
      ? {
        ...style,
        color: "transparent",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
      }
      : style;

  return (
    <div className="relative flex h-48 w-48 items-center justify-center">
      <div
        className="absolute inset-0 opacity-50 blur-[42px]"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 30%)`,
          transform: "scale(1.5)",
        }}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={gradientType}
          className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-full`}
          style={gradientType === "background" ? style : {}}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {gradientType === "text" ? (
            <span
              className="text-center break-words px-4 text-2xl font-black leading-tight"
              style={textGradientStyle}
            >
              {gradient.name}
            </span>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
