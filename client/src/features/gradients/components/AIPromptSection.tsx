import React, { useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { TextLoop } from "@/shared/ui/text-loop";
import { TextShimmer } from "@/shared/ui/text-shimmer";

interface AIPromptSectionProps {
  loading: boolean;
  onGenerate?: (prompt?: string) => Promise<void>;
}

export const AIPromptSection = ({
  loading,
  onGenerate,
}: AIPromptSectionProps) => {
  const [prompt, setPrompt] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [pendingGenerate, setPendingGenerate] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const shouldReduceMotion = useReducedMotion();
  const voiceSessionRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    transcript,
    interimTranscript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition({
    clearTranscriptOnListen: true,
  });

  // Detect iOS for platform-specific messages
  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);
  }, []);

  // Keep prompt in sync ONLY during an active voice session.
  useEffect(() => {
    if (!listening) return;
    if (!voiceSessionRef.current) return;

    setPrompt(transcript);
  }, [listening, transcript]);

  // If user clicked "Generate" while listening, wait for listening to stop,
  // then generate with the final committed transcript.
  useEffect(() => {
    if (!pendingGenerate) return;
    if (listening) return;
    if (!onGenerate) return;

    const text = (transcript || prompt).trim();
    if (!text) {
      setPendingGenerate(false);
      return;
    }

    (async () => {
      try {
        setIsGenerating(true);
        await onGenerate(text);
      } catch (error) {
        console.error('Generation error:', error);
        setVoiceError('Failed to generate. Please try again.');
      } finally {
        setIsGenerating(false);
        resetTranscript();
        voiceSessionRef.current = false;
        setPendingGenerate(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingGenerate, listening, onGenerate]);

  // Cleanup: stop mic when component unmounts.
  useEffect(() => {
    return () => {
      SpeechRecognition.stopListening();
    };
  }, []);

  // Mobile textarea scroll handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLTextAreaElement>) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const { scrollTop } = textarea;

    (textarea as any)._startY = e.touches[0].clientY;
    (textarea as any)._startScrollTop = scrollTop;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLTextAreaElement>) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const { scrollHeight, clientHeight } = textarea;
    const currentY = e.touches[0].clientY;
    const startY = (textarea as any)._startY;
    const deltaY = startY - currentY;

    const isScrollable = scrollHeight > clientHeight;

    if (isScrollable) {
      const newScrollTop = (textarea as any)._startScrollTop + deltaY;

      if (newScrollTop >= 0 && newScrollTop <= scrollHeight - clientHeight) {
        e.preventDefault();
        e.stopPropagation();

        textarea.scrollTo({
          top: newScrollTop,
          behavior: "smooth",
        });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleGenerate();
    }
  };

  const handleGenerate = async () => {
    if (!onGenerate) {
      setVoiceError('Configuration error: onGenerate function is missing.');
      console.error('onGenerate prop is required but was not provided');
      return;
    }

    setVoiceError(null);

    const text = prompt.trim();
    if (!text && !transcript.trim()) return;

    // If still listening, request stop and generate after final transcript lands.
    if (listening) {
      setPendingGenerate(true);
      await SpeechRecognition.stopListening();
      return;
    }

    const finalText = (text || transcript).trim();
    if (!finalText) return;

    try {
      setIsGenerating(true);
      await onGenerate(finalText);
    } catch (error) {
      console.error('Generation error:', error);
      setVoiceError('Failed to generate. Please try again.');
    } finally {
      setIsGenerating(false);
      resetTranscript();
      voiceSessionRef.current = false;
    }
  };
  const placeholderSuggestions = [
    "emerald green to white forest mist...",
    "orange to pink sunset sky...",
    "deep ocean blue to turquoise lagoon...",
    "navy to neon violet cyberpunk glow...",
    "gold to cream luxury gradient...",
    "icy blue to frosty white winter...",
    "lavender to peach pastel dream...",
    "teal to sandy beige tropical shore...",
  ];

  const showPlaceholder = !prompt && !isFocused && !listening;

  // Check for missing onGenerate AFTER all hooks
  if (!onGenerate) {
    return (
      <section className="space-y-3">
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-400">
          <strong>Configuration Error:</strong> The onGenerate function is missing. Please check that the parent component is passing the onGenerate prop correctly.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {!browserSupportsSpeechRecognition && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
          {isIOS
            ? "Voice input is not supported on iOS devices. Please type your prompt."
            : "Voice input is not supported in your browser. Try Chrome or Edge on desktop/Android."}
        </div>
      )}

      {isMicrophoneAvailable === false && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
          Microphone access is blocked. Enable it in your browser site settings.
        </div>
      )}

      {voiceError && (
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-600 dark:text-rose-400">
          {voiceError}
        </div>
      )}

      <motion.div
        layout
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
              type: "spring",
              stiffness: 260,
              damping: 22,
              velocity: 0
            }
        }
        style={{
          willChange: (isFocused || listening) ? 'transform' : 'auto'
        }}
        className={[
          "from-primary/20 via-primary/10 to-primary/20 group relative rounded-2xl bg-gradient-to-r p-[1px] transition-all duration-300",
          isFocused || listening
            ? "shadow-primary/20 shadow-lg"
            : "hover:shadow-primary/10 shadow-sm hover:shadow-md",
        ].join(" ")}
        animate={
          shouldReduceMotion
            ? undefined
            : isFocused || listening
              ? { scale: 1.01 }
              : { scale: 1 }
        }
      >
        <div className="bg-card/95 relative overflow-hidden backdrop-blur-xl">
          <AnimatePresence>
            {listening && (
              <motion.div
                key="listening"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={
                  shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }
                }
                className="absolute left-4 top-4 z-10 flex items-center gap-2 text-xs text-primary"
              >
                <motion.span
                  aria-hidden="true"
                  animate={shouldReduceMotion ? undefined : { scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative inline-flex h-2 w-2 rounded-full bg-primary"
                />
                <span className="font-medium">Listening...</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showPlaceholder && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={
                  shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }
                }
                className="pointer-events-none absolute left-4 top-4 text-sm text-muted-foreground"
              >
                <span className="flex items-center gap-1.5">
                  <TextLoop interval={3} className="font-medium text-white/50">
                    {placeholderSuggestions.map((text, i) => (
                      <span key={i}>{text}</span>
                    ))}
                  </TextLoop>
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <Textarea
            ref={textareaRef}
            placeholder=""
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              voiceSessionRef.current = false;
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            disabled={loading || isGenerating}
            readOnly={listening}
            className={[
              listening ? "pt-10" : "",
              "touch-action-pan-y overflow-auto scroll-smooth"
            ].join(" ")}
            style={{
              WebkitOverflowScrolling: 'touch'
            }}
          />

          <div className="border-border/50 flex items-center justify-between border-t px-3 py-2">
            <motion.div
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              className="ml-auto"
            >
              <Button
                onClick={() => void handleGenerate()}
                disabled={
                  loading ||
                  isGenerating ||
                  (!prompt.trim() &&
                    !finalTranscript.trim() &&
                    !interimTranscript.trim())
                }
                size="sm"
                className={[
                  "h-8 gap-2 rounded-lg px-3 font-semibold shadow-md transition-all",
                  loading || isGenerating
                    ? "bg-primary/90"
                    : "hover:shadow-primary/30 hover:shadow-lg",
                ].join(" ")}
              >
                {loading || isGenerating ? (
                  <>
                    <motion.div
                      animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Loader2 className="h-3.5 w-3.5" />
                    </motion.div>
                    <TextShimmer duration={2} spread={2} className="text-xs">
                      Generating
                    </TextShimmer>
                  </>
                ) : (
                  <>
                    <span className="text-xs">
                      {pendingGenerate ? "Finishing..." : "Generate"}
                    </span>
                    <div className="bg-primary-foreground/20 flex h-5 w-5 items-center justify-center rounded-md">
                      <ArrowUp className="h-3 w-3" />
                    </div>
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {(isFocused || listening) && (
            <motion.div
              key="glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              exit={{ opacity: 0 }}
              transition={
                shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }
              }
              style={{
                willChange: (isFocused || listening) ? 'opacity' : 'auto'
              }}
              className="from-primary/20 via-primary/30 to-primary/20 pointer-events-none absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-r blur-xl"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
