import { motion } from "framer-motion";

interface GradientPreviewProps {
  style: React.CSSProperties;
  gradientType: "background" | "text" | "image";
  gradient: { name: string; colors: string[] };
  isAnimated?: boolean;
  animationSpeed?: number;
}

export const GradientPreview: React.FC<GradientPreviewProps> = ({
  style,
  gradientType,
  gradient,
  isAnimated = false,
  animationSpeed = 1,
}) => {
  const glowColor = gradient.colors[0];

  // Create animated style if animation is enabled
  const animatedStyle = isAnimated
    ? {
      ...style,
      backgroundSize: "400% 400%",
      animation: `gradientShift ${4 / animationSpeed}s ease infinite`,
    }
    : style;

  // For text gradients, ensure proper text styling
  const textGradientStyle =
    gradientType === "text"
      ? {
        ...animatedStyle,
        color: "transparent",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
      }
      : animatedStyle;

  return (
    <div className="relative flex h-48 w-48 items-center justify-center">
      <div
        className="absolute inset-0 opacity-50 blur-[42px]"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 30%)`,
          transform: "scale(1.5)",
        }}
      />
      <motion.div
        className={`relative flex h-full w-full items-center justify-center overflow-hidden ${
          gradientType === "image" ? "rounded-[12px]" : "rounded-full"
        }`}
        style={gradientType === "background" ? animatedStyle : {}}
        transition={{ duration: 0.3 }}
      >
        {gradientType === "text" ? (
          <motion.span
            className="text-center break-words px-4 text-2xl font-black leading-tight"
            style={textGradientStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {gradient.name}
          </motion.span>
        ) : gradientType === "image" ? (
          <motion.div
            className="relative h-full w-full overflow-hidden rounded-lg border-4 border-white/20 shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              background:
                animatedStyle.backgroundImage || style.backgroundImage,
              backgroundSize: isAnimated ? "400% 400%" : "100% 100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              animation: isAnimated
                ? `gradientShift ${4 / animationSpeed}s ease infinite`
                : undefined,
            }}
          ></motion.div>
        ) : null}
      </motion.div>
    </div>
  );
};
