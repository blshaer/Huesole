import { motion } from "framer-motion";

interface LogoIconProps {
  className?: string;
  isHovered?: boolean;
  size?: number;
}

export default function LogoIcon({ className, isHovered, size = 6 }: LogoIconProps) {
  const sizeClass = `h-${size} w-${size}`;
  const svgSizeClass = `h-${Math.max(2, Math.floor(size * 0.4))} w-${Math.max(2, Math.floor(size * 0.4))}`;

  return (
    <motion.div 
        className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-[#172554] via-[#1E40AF] to-[#1D4ED8] bg-[length:300%_300%] shadow-lg shadow-blue-500/20 transition-all duration-300 ${sizeClass} ${className}`}
        animate={{ 
          backgroundPosition: isHovered ? ["0% 50%", "100% 100%", "0% 50%"] : "0% 50%" 
        }}
        transition={{ 
          backgroundPosition: {
            duration: isHovered ? 8 : 0.8,
            repeat: isHovered ? Infinity : 0,
            ease: "easeInOut"
          }
        }}
      >
        <svg 
          viewBox="0 0 256 222" 
          preserveAspectRatio="xMidYMid" 
          className={`${svgSizeClass} drop-shadow-sm`}
        >
          <path fill="#fff" d="m128 0 128 221.705H0z" />
        </svg>
        <div className="absolute inset-0 rounded-full border border-white/20" />
      </motion.div>
  );
}
