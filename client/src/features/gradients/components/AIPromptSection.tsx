import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
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
  onGenerate: (prompt?: string) => Promise<void>;
}

export const AIPromptSection = ({
  loading,
  onGenerate,
}: AIPromptSectionProps) => {
  const [prompt, setPrompt] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [pendingGenerate, setPendingGenerate] = useState(false);

  const shouldReduceMotion = useReducedMotion();
  const voiceSessionRef = useRef(false);

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

  const isSecureContext = useMemo(() => {
    if (typeof window === "undefined") return true;
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    return window.isSecureContext || isLocalhost;
  }, []);

  // Keep prompt in sync ONLY during an active voice session.
  useEffect(() => {
    if (!listening) return;
    if (!voiceSessionRef.current) return;

    // transcript == finalTranscript + interimTranscript, already combined by the library.
    // Using transcript keeps the textarea updated with real-time partial results.
    setPrompt(transcript);
  }, [listening, transcript]);

  // If user clicked "Generate" while listening, wait for listening to stop,
  // then generate with the final committed transcript.
  useEffect(() => {
    if (!pendingGenerate) return;
    if (listening) return;

    const text = (transcript || prompt).trim();
    if (!text) {
      setPendingGenerate(false);
      return;
    }

    (async () => {
      try {
        await onGenerate(text);
      } finally {
        resetTranscript();
        voiceSessionRef.current = false;
        setPendingGenerate(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingGenerate, listening]); // intentionally not depending on onGenerate/prompt/transcript to avoid re-triggers

  // Cleanup: stop mic when component unmounts.
  useEffect(() => {
    return () => {
      SpeechRecognition.stopListening();
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleGenerate();
    }
  };

  const handleGenerate = async () => {
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
      await onGenerate(finalText);
    } finally {
      resetTranscript();
      voiceSessionRef.current = false;
    }
  };

  const toggleListening = async () => {
    setVoiceError(null);

    if (!browserSupportsSpeechRecognition) return;

    if (!isSecureContext) {
      setVoiceError("Microphone requires HTTPS (or localhost).");
      return;
    }

    if (isMicrophoneAvailable === false) {
      setVoiceError(
        "Microphone permission is blocked. Allow it in browser settings.",
      );
      return;
    }

    try {
      if (listening) {
        // stopListening finishes processing speech in progress.
        await SpeechRecognition.stopListening();
        voiceSessionRef.current = false;
        return;
      }

      // Start a fresh voice session.
      resetTranscript();
      setPrompt("");
      voiceSessionRef.current = true;

      await SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
      });
    } catch {
      setVoiceError(
        "Could not start voice input. Check permissions and try again.",
      );
      voiceSessionRef.current = false;
    }
  };

  const placeholderSuggestions = [
    "ocean sunset gradient...",
    "vibrant purple to pink...",
    "deep blue ocean waves...",
    "warm autumn colors...",
    "neon cyberpunk vibes...",
    "pastel dreamy clouds...",
    "fiery red to orange...",
    "cool mint to teal...",
    "royal purple elegance...",
    "golden hour glow...",
  ];

  const showPlaceholder = !prompt && !isFocused && !listening;

  return (
    <section className="space-y-3">
      {!browserSupportsSpeechRecognition && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
          Voice input is not supported in your browser. Try Chrome or Edge.
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
            : { type: "spring", stiffness: 260, damping: 22 }
        }
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
                className="absolute left-4 top-4 z-10 flex items-center gap-2 text-xs text-primary"
              >
                <motion.span
                  aria-hidden="true"
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
            placeholder=""
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              // If the user manually types while voice is on, stop treating transcript as the source of truth.
              voiceSessionRef.current = false;
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={loading}
            readOnly={listening} // prevents "voice vs typing" conflicts during capture
            className={listening ? "pt-10" : ""}
          />

          <div className="border-border/50 flex items-center justify-between border-t px-3 py-2">
            {/* {browserSupportsSpeechRecognition && (
              <motion.div whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}>
                <Button
                  onClick={() => void toggleListening()}
                  disabled={loading}
                  size="sm"
                  variant={listening ? "default" : "ghost"}
                  className={[
                    "h-8 gap-2 rounded-lg px-3 font-semibold transition-all",
                    listening ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-accent",
                  ].join(" ")}
                >
                  {listening ? (
                    <>
                      <MicOff className="h-3.5 w-3.5" />
                      <span className="text-xs">Stop</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-3.5 w-3.5" />
                      <span className="text-xs">Voice</span>
                    </>
                  )}
                </Button>
              </motion.div>
            )} */}

            <motion.div
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              className="ml-auto"
            >
              <Button
                onClick={() => void handleGenerate()}
                disabled={
                  loading ||
                  (!prompt.trim() &&
                    !finalTranscript.trim() &&
                    !interimTranscript.trim())
                }
                size="sm"
                className={[
                  "h-8 gap-2 rounded-lg px-3 font-semibold shadow-md transition-all",
                  loading
                    ? "bg-primary/90"
                    : "hover:shadow-primary/30 hover:shadow-lg",
                ].join(" ")}
              >
                {loading ? (
                  <TextShimmer duration={2} spread={2} className="text-xs">
                    Generating
                  </TextShimmer>
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
              className="from-primary/20 via-primary/30 to-primary/20 pointer-events-none absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-r blur-xl"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
