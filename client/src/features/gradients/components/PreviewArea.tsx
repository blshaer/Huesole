import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { GeneratedGradient } from "../types";

interface PreviewAreaProps {
    result: GeneratedGradient | null;
    isAnimated: boolean;
    animationSpeed: number;
}

export const PreviewArea = ({
    result,
    isAnimated,
    animationSpeed,
}: PreviewAreaProps) => {
    return (
        <main className="relative flex-1 overflow-hidden">
            <div className="flex h-full w-full items-center justify-center p-8">
                <AnimatePresence mode="wait">
                    {result ? (
                        <motion.div
                            key="preview"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="relative h-[300px] w-[300px]"
                        >
                            {/* Gradient shadow / glow */}
                            <div
                                className="pointer-events-none absolute inset-0 -z-10 scale-110 rounded-full opacity-70 blur-3xl"
                                style={{
                                    background: `${result.type}-gradient(${
                                        result.type === "linear" ? `${result.angle}deg, ` : ""
                                    }${result.colors.join(", ")})`,
                                    backgroundSize: isAnimated ? "400% 400%" : "cover",
                                    animation: isAnimated
                                        ? `gradientShift ${10 / animationSpeed}s ease infinite`
                                        : "none",
                                }}
                            />

                            {/* Main gradient circle */}
                            <div
                                className="h-full w-full rounded-full shadow-2xl transition-all duration-700"
                                style={{
                                    background: `${result.type}-gradient(${
                                        result.type === "linear" ? `${result.angle}deg, ` : ""
                                    }${result.colors.join(", ")})`,
                                    backgroundSize: isAnimated ? "400% 400%" : "cover",
                                    animation: isAnimated
                                        ? `gradientShift ${10 / animationSpeed}s ease infinite`
                                        : "none",
                                }}
                            />

                            {/* Border ring */}
                            <div className="pointer-events-none absolute inset-0 rounded-full border border-border" />
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-foreground/20" />
                            <p className="text-sm font-medium text-foreground/40">
                                Booting Creative Studio...
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
};
