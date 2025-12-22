import { useState } from "react";
import { Loader2, Sparkles, ArrowUp } from "lucide-react";
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

    const handleGenerate = () => {
        if (prompt.trim()) {
            onGenerate(prompt);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleGenerate();
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

    return (
        <section className="space-y-3">

            {/* Modern input container with gradient border */}
            <div
                className={`group relative rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-[1px] transition-all duration-300 ${isFocused
                        ? "shadow-lg shadow-primary/20"
                        : "shadow-sm hover:shadow-md hover:shadow-primary/10"
                    }`}
            >
                {/* Inner container with glass effect */}
                <div className="relative overflow-hidden  bg-card/95 backdrop-blur-xl">
                    {/* Animated placeholder */}
                    {!prompt && !isFocused && (
                        <div className="pointer-events-none absolute left-4 top-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <TextLoop
                                    interval={3}
                                    className="font-medium text-white/50"
                                >
                                    {placeholderSuggestions.map((text, i) => (
                                        <span key={i}>{text}</span>
                                    ))}
                                </TextLoop>
                            </span>
                        </div>
                    )}

                    {/* Textarea */}
                    <Textarea
                        placeholder=""
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        disabled={loading}
                    />

                    {/* Bottom bar with generate button */}
                    <div className="flex items-center justify-between border-t border-border/50 px-3 py-2">
         
                        <Button
                            onClick={handleGenerate}
                            disabled={loading || !prompt.trim()}
                            size="sm"
                            className={`h-8 gap-2 ml-auto rounded-lg px-3 font-semibold shadow-md transition-all ${loading
                                    ? "bg-primary/90"
                                    : "hover:shadow-lg hover:shadow-primary/30"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <TextShimmer duration={2} spread={2} className="text-xs">
                                        Generating
                                    </TextShimmer>
                                </>
                            ) : (
                                <>
                                    <span className="text-xs">Generate</span>
                                    <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary-foreground/20">
                                        <ArrowUp className="h-3 w-3" />
                                    </div>
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Ambient glow effect when focused */}
                {isFocused && (
                    <div className="pointer-events-none absolute -inset-1 -z-10 animate-pulse rounded-2xl bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 opacity-75 blur-xl" />
                )}
            </div>


        </section>
    );
};
