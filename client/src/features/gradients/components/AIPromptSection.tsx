import { useState, useCallback, memo } from "react";
import { ArrowUp, Loader2, CheckIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  useSpeechRecognition,
} from "react-speech-recognition";

import { GeneratedGradient } from "../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Edit2, Zap, Plus, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

// New specialized components
import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
import {
  ModelSelectorItem,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
} from "@/components/ai-elements/model-selector";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import {
  PromptInput,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  usePromptInputAttachments,
  usePromptInputController,
} from "@/components/ai-elements/prompt-input";

interface AIPromptSectionProps {
  loading: boolean;
  onGenerate?: (prompt?: string) => Promise<void>;
  result: GeneratedGradient | null;
  setResult: (gradient: GeneratedGradient) => void;
}

const models = [
  {
    chef: "OpenAI",
    chefSlug: "openai",
    id: "gpt-4o",
    name: "GPT-4o",
    providers: ["openai", "azure"],
  },
  {
    chef: "OpenAI",
    chefSlug: "openai",
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    providers: ["openai", "azure"],
  },
  {
    chef: "Anthropic",
    chefSlug: "anthropic",
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    providers: ["anthropic"],
  },
  {
    chef: "Google",
    chefSlug: "google",
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    providers: ["google"],
  },
];

const AttachmentItem = memo(({ attachment, onRemove }: { attachment: any, onRemove: (id: string) => void }) => {
  const handleRemove = useCallback(
    () => onRemove(attachment.id),
    [onRemove, attachment.id]
  );
  return (
    <Attachment data={attachment} key={attachment.id} onRemove={handleRemove}>
      <AttachmentPreview />
      <AttachmentRemove />
    </Attachment>
  );
});

const ModelItem = memo(({ m, selectedModel, onSelect }: { m: any, selectedModel: string, onSelect: (id: string) => void }) => {
  const handleSelect = useCallback(() => onSelect(m.id), [onSelect, m.id]);
  return (
    <ModelSelectorItem key={m.id} onSelect={handleSelect} value={m.id}>
      <ModelSelectorLogo provider={m.chefSlug} />
      <ModelSelectorName>{m.name}</ModelSelectorName>
      <ModelSelectorLogoGroup>
        {m.providers.map((provider: string) => (
          <ModelSelectorLogo key={provider} provider={provider} />
        ))}
      </ModelSelectorLogoGroup>
      {selectedModel === m.id ? (
        <CheckIcon className="ml-auto size-4" />
      ) : (
        <div className="ml-auto size-4" />
      )}
    </ModelSelectorItem>
  );
});

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();

  const handleRemove = useCallback(
    (id: string) => attachments.remove(id),
    [attachments]
  );

  if (attachments.files.length === 0) {
    return null;
  }

  return (
    <Attachments variant="inline" className="px-3 pb-2 pt-1 border-b border-white/5 bg-black/5">
      {attachments.files.map((attachment) => (
        <AttachmentItem
          attachment={attachment}
          key={attachment.id}
          onRemove={handleRemove}
        />
      ))}
    </Attachments>
  );
};

const SubmitButton = ({ loading, isGenerating }: { loading: boolean, isGenerating: boolean }) => {
  const { textInput, attachments } = usePromptInputController();
  const hasContent = textInput.value.trim().length > 0 || attachments.files.length > 0;
  
  return (
    <div className="pr-2 flex items-center shrink-0">
      <PromptInputSubmit 
         disabled={!hasContent || loading || isGenerating}
         status={loading || isGenerating ? "streaming" : "ready"} 
         className={cn(
           "rounded-lg h-8 w-8 p-0 flex items-center justify-center transition-all shadow-sm group-active:scale-95",
           hasContent ? "bg-white hover:bg-white/90 text-black" : "bg-white/10 text-white/30 cursor-not-allowed"
         )}
      >
        {loading || isGenerating ? (
          <Loader2 className="size-4 animate-spin text-white" />
        ) : (
          <ArrowUp className="size-4 stroke-[3]" />
        )}
      </PromptInputSubmit>
    </div>
  );
};

export const AIPromptSection = ({
  loading,
  onGenerate,
  result,
  setResult,
}: AIPromptSectionProps) => {
  const [model, setModel] = useState<string>(models[0].id);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [promptMode, setPromptMode] = useState<"generate" | "edit" | null>(null);

  const selectedModelData = models.find((m) => m.id === model);
  const shouldReduceMotion = useReducedMotion();

  const handleModelSelect = useCallback((id: string) => {
    setModel(id);
    setModelSelectorOpen(false);
  }, []);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleManualSubmit = useCallback(async (message: PromptInputMessage) => {
    if (!onGenerate) return;
    const text = message.text.trim();
    if (!text && !message.files?.length) return;

    try {
      setIsGenerating(true);
      // Inform backend of the mode: edit adjusts exposure/values, generate creates new gradient
      const mode = promptMode || "generate";
      const finalPrompt = mode === "edit" 
        ? `[EDIT CURRENT GRADIENT] ${text}` 
        : `[GENERATE NEW GRADIENT] ${text}`;
      await onGenerate(finalPrompt);
      resetTranscript();
    } catch (error) {
      console.error('Generation error:', error);
      setVoiceError('Failed to generate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [onGenerate, resetTranscript, promptMode]);

  const gradientSuggestions = [
    "Moonlight gradient",
    "Sunset glow",
    "Cyberpunk neon",
    "Ocean depths",
    "Golden hour",
    "Emerald forest",
    "Midnight purple",
    "Frosty ice",
  ];

  const placeholderSuggestions = [
    "emerald green to white forest mist...",
    "orange to pink sunset sky...",
    "deep ocean blue to turquoise lagoon...",
    "navy to neon violet cyberpunk glow...",
  ];

  return (
    <section className="space-y-4">
      {voiceError && (
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-600 dark:text-rose-400">
          {voiceError}
        </div>
      )}

      <PromptInputProvider>
        <motion.div
           layout
           transition={
             shouldReduceMotion
               ? { duration: 0 }
               : { type: "spring", stiffness: 260, damping: 22 }
           }
           className={[
             "group relative rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-[1px] transition-all duration-300",
             isFocused ? "shadow-primary/20 shadow-lg scale-[1.01]" : "shadow-sm"
           ].join(" ")}
        >
          <div className="bg-[#181a20]/95 border border-white/10 relative overflow-hidden backdrop-blur-xl rounded-2xl">
            <PromptInput 
              globalDrop 
              multiple 
              onSubmit={handleManualSubmit}
              className="bg-transparent border-none"
            >
              <PromptInputAttachmentsDisplay />
              
              <div className="px-1 py-1 flex flex-row items-center justify-between gap-2 min-h-[52px] w-full relative z-10">
                {/* Left Side: + Button or Pill */}
                <div className="flex items-center gap-2 pl-2 shrink-0">
                  {promptMode === "edit" && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium shrink-0">
                      <Edit2 className="size-3.5" />
                      <span>Edit</span>
                      <button 
                        type="button" 
                        onClick={() => setPromptMode(null)} 
                        className="hover:text-emerald-300 ml-0.5 hover:bg-emerald-500/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  )}
                  {promptMode === "generate" && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-medium shrink-0">
                      <Zap className="size-3.5" />
                      <span>Generate</span>
                      <button 
                        type="button" 
                        onClick={() => setPromptMode(null)} 
                        className="hover:text-blue-300 ml-0.5 hover:bg-blue-500/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  )}
                  {!promptMode && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button type="button" className="flex items-center justify-center size-8 flex-shrink-0 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors group">
                          <Plus className="size-4 group-hover:rotate-90 transition-transform" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="bg-black/90 backdrop-blur-xl border-white/10 text-white min-w-[140px] shadow-2xl rounded-xl p-1 z-[110]">
                        <DropdownMenuItem onClick={() => setPromptMode("generate")} className="hover:bg-white/10 cursor-pointer rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                          <Zap className="size-4 text-blue-400" />
                          <span>Generate</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPromptMode("edit")} className="hover:bg-white/10 cursor-pointer rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                          <Edit2 className="size-4 text-emerald-400" />
                          <span>Edit Current</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <div className="flex flex-1 relative min-w-0">
                  <PromptInputTextarea 
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={promptMode === "edit" ? "Describe how to edit this gradient..." : "Ask AI to generate a gradient..."}
                    className="bg-transparent border-none focus:ring-0 focus-visible:ring-0 text-white placeholder:text-white/40 min-h-[44px] w-full px-2 py-2.5 m-0 resize-none outline-none shadow-none text-sm"
                    rows={1}
                  />
                </div>

                {/* Right Side: Submit */}
                <SubmitButton loading={loading} isGenerating={isGenerating} />
              </div>
            </PromptInput>
          </div>
        </motion.div>
      </PromptInputProvider>
    </section>
  );
};
