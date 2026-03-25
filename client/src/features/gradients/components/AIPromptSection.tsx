import { useState, useCallback, memo } from "react";
import { ArrowUp, Loader2, CheckIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  useSpeechRecognition,
} from "react-speech-recognition";

import { GeneratedGradient } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Context,
  ContextContent,
  ContextContentBody,
  ContextContentHeader,
  ContextInputUsage,
  ContextOutputUsage,
  ContextTrigger,
} from "@/components/ai-elements/context";

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
  PromptInputBody,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  usePromptInputAttachments,
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
      await onGenerate(text);
      resetTranscript();
    } catch (error) {
      console.error('Generation error:', error);
      setVoiceError('Failed to generate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [onGenerate, resetTranscript]);

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
          <div className="bg-card/95 relative overflow-hidden backdrop-blur-xl rounded-[15px]">
            <PromptInput 
              globalDrop 
              multiple 
              onSubmit={handleManualSubmit}
              className="bg-transparent border-none"
            >
              <PromptInputAttachmentsDisplay />
              
              <PromptInputBody className="px-1 pt-2">
                <PromptInputTextarea 
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Ask AI to generate a gradient..."
                  className="bg-transparent border-none focus:ring-0 focus-visible:ring-0 text-white placeholder:text-white/20 px-4 min-h-[80px]"
                />
              </PromptInputBody>

              <PromptInputFooter className="border-t border-white/5 px-2 py-2 bg-black/20 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-1 overflow-hidden">
                  <div className="flex items-center gap-2 border border-white/5 bg-white/5 px-3 py-1.5 rounded-xl h-9 shrink-0">
                    <Context
                      maxTokens={10}
                      modelId="free-tier"
                      usage={{
                        inputTokens: 8,
                        outputTokens: 0,
                        totalTokens: 8,
                      }}
                      usedTokens={8}
                    >
                      <ContextTrigger className="p-0 h-auto hover:bg-transparent text-[11px] font-medium text-white/60 hover:text-white transition-colors" />
                      <ContextContent className="border-white/10 bg-background/95 backdrop-blur-xl text-white !min-w-[150px] z-[100]">
                        <ContextContentHeader className="pb-2 pt-3 px-3" />
                        <ContextContentBody className="py-2 px-3">
                          <p className="text-[10px] text-white/40 mb-2">Daily Generation Limit</p>
                          <ContextInputUsage className="text-[10px] text-white/60" />
                          <ContextOutputUsage className="text-[10px] text-white/60" />
                        </ContextContentBody>
                      </ContextContent>
                    </Context>
                  </div>

                  {result && (
                    <div className="flex items-center shrink-0 border border-white/5 bg-white/5 rounded-xl h-9 overflow-hidden">
                       <Select
                          value={result.type}
                          onValueChange={(val: any) => setResult({ ...result, type: val })}
                        >
                          <SelectTrigger className="w-[85px] h-full bg-transparent border-none text-[11px] font-medium text-white/60 hover:text-white transition-all shadow-none px-3 focus:ring-0">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent className="border-white/10 bg-background/95 backdrop-blur-xl text-white shadow-xl">
                            <SelectItem value="linear">Linear</SelectItem>
                            <SelectItem value="radial">Radial</SelectItem>
                            <SelectItem value="conic">Conic</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  <PromptInputSubmit 
                     status={loading || isGenerating ? "streaming" : "ready"} 
                     className="bg-white hover:bg-white/90 text-black rounded-xl h-9 w-9 p-0 flex items-center justify-center transition-all shadow-sm group-active:scale-95"
                  >
                    {loading || isGenerating ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <ArrowUp className="size-4 stroke-[3]" />
                    )}
                  </PromptInputSubmit>
                </div>
              </PromptInputFooter>
            </PromptInput>
          </div>
        </motion.div>
      </PromptInputProvider>
    </section>
  );
};
