import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Logo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      to={"/"} 
      className="group flex items-center gap-3 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon: Blue Gradient Circle with Triangle */}
      <motion.div 
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#172554] via-[#1E40AF] to-[#1D4ED8] bg-[length:300%_300%] shadow-lg shadow-blue-500/20 transition-all duration-300 group-hover:shadow-blue-500/40"
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
          className="h-4 w-4 drop-shadow-sm"
        >
          <path fill="#fff" d="m128 0 128 221.705H0z" />
        </svg>
        {/* Inner subtle glow */}
        <div className="absolute inset-0 rounded-full border border-white/20" />
      </motion.div>

      {/* Text Branding */}
      <div className="relative text-left">
        <h1 className="text-2xl font-black tracking-tighter text-white">
          LumeGradients
        </h1>
      </div>
    </Link>
  );
}

