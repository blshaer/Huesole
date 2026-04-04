import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const textVariants = {
    initial: { opacity: 1, x: 0 },
    hover: { opacity: 0, x: -15 },
};

const iconVariants = {
    initial: { opacity: 0, x: 15 },
    hover: { opacity: 1, x: 0 },
};

export function VercelStyleButton() {
    return (
        <div className="flex items-center gap-2">
            <Link to="/login">
                <motion.button
                    initial="initial"
                    whileHover="hover"
                    whileTap={{ scale: 0.98 }}
                    // I used a dark background here so the white triangle is visible, 
                    // just like your original code's "text-white" arrow.
                    className="relative overflow-hidden flex items-center justify-center w-[160px] h-10 bg-zinc-900 text-white rounded-md font-medium text-sm"
                >
                    {/* Text Layer */}
                    <motion.span
                        variants={textVariants}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="absolute"
                    >
                        Start Generating
                    </motion.span>

                    {/* Vercel Triangle Layer (Pointing Right) */}
                    <motion.span
                        variants={iconVariants}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="absolute flex items-center justify-center"
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 100 100"
                            fill="currentColor" /* Inherits text-white from parent */
                        >
                            {/* Geometric triangle pointing directly to the right */}
                            <polygon points="15,5 15,95 90,50" />
                        </svg>
                    </motion.span>
                </motion.button>
            </Link>
        </div>
    );
}