import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import LogoIcon from "@/shared/ui/LogoIcon";

const textVariants = {
    initial: { x: 8 },
    hover: { x: 0 },
};

const iconVariants = {
    initial: { opacity: 0, x: 10, scale: 0.5 },
    hover: { opacity: 1, x: 0, scale: 1 },
};

export function VercelStyleButton() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="flex items-center gap-2">
            <Link 
                to="/login"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <motion.button
                    initial="initial"
                    animate={isHovered ? "hover" : "initial"}
                    whileTap={{ scale: 0.96 }}
                    className="relative flex items-center justify-center w-[180px] h-10 bg-zinc-950 text-white rounded-lg font-medium text-sm border border-white/10 hover:border-white/20 transition-colors shadow-xl"
                >
                    <div className="flex items-center justify-center gap-3">
                        {/* Text Layer */}
                        <motion.span
                            variants={textVariants}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            Start Generating
                        </motion.span>

                        {/* Logo Layer */}
                        <motion.div
                            variants={iconVariants}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="flex items-center justify-center"
                        >
                            <LogoIcon size={5} isHovered={isHovered} />
                        </motion.div>
                    </div>
                </motion.button>
            </Link>
        </div>
    );
}