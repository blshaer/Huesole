"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Brain } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface AIThinkingProcessProps {
  reasoning: string | undefined;
  loading: boolean;
  gradientName?: string;
  onComplete?: () => void;
}

export const AIThinkingProcess = ({
  reasoning,
  loading,
  gradientName,
  onComplete,
}: AIThinkingProcessProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevReasoningRef = useRef<string | undefined>(undefined);

  // Reset and start typing animation when new reasoning arrives
  useEffect(() => {
    if (!reasoning || reasoning === prevReasoningRef.current) return;

    prevReasoningRef.current = reasoning;
    setDisplayedText("");
    setIsTypingDone(false);
    setIsOpen(true);

    let i = 0;
    const speed = 8; // ms per character — fast but readable
    const timer = setInterval(() => {
      i++;
      setDisplayedText(reasoning.slice(0, i));
      if (i >= reasoning.length) {
        clearInterval(timer);
        setIsTypingDone(true);
        // Wait a small moment after typing finishes, then trigger completion
        setTimeout(() => {
          onComplete?.();
        }, 1500);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [reasoning, onComplete]);

  // Auto-scroll the content as text types
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedText]);

  if (!reasoning && !loading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl"
      >
        {/* Header - clickable toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center gap-2 text-sm transition-colors hover:text-foreground mb-1"
        >
          <div className="flex items-center gap-2 flex-1">
            <Brain className="h-3.5 w-3.5 text-primary/80" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary/80">
              AI Thinking Process
            </span>
            {loading && (
              <motion.div
                className="flex gap-1 ml-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="inline-block w-1.5 h-1.5 rounded-full bg-primary/60"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            )}
            {isTypingDone && gradientName && (
              <span className="text-[10px] text-white/30 ml-auto mr-2 font-medium">
                {gradientName}
              </span>
            )}
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-3.5 w-3.5 text-white/30" />
          </motion.div>
        </button>

        {/* Collapsible content */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="thinking-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div
                ref={scrollRef}
                className={cn(
                  "mt-3 text-sm text-white/60 leading-relaxed overflow-y-auto custom-scrollbar",
                  "max-h-[120px]"
                )}
              >
                <div className="space-y-3 whitespace-normal">
                  {displayedText.split("\n\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                  {/* Blinking cursor while typing */}
                  {!isTypingDone && (
                    <motion.span
                      className="inline-block w-[2px] h-4 bg-primary/70 ml-0.5 align-middle"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};
