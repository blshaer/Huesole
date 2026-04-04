"use client";

import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  // ModelSelectorInput, // REMOVED as per user request
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import {
  PromptInput,
  // PromptInputActionAddAttachments, // REMOVED as per user request
  // PromptInputActionAddScreenshot, // REMOVED as per user request
  // PromptInputActionMenu, // REMOVED as per user request
  // PromptInputActionMenuContent, // REMOVED as per user request
  // PromptInputActionMenuTrigger, // REMOVED as per user request
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import {
  CheckIcon,
  MoveHorizontal,
  CircleDot,
} from "lucide-react";
import { memo, useCallback, useState, useMemo, ChangeEvent } from "react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/shared/lib/utils";
import { motion, useReducedMotion } from "framer-motion";

const TriangleIcon = (props: any) => (
  <svg className={cn("coolshapes triangle-10", props.className)} height="400" width="400" fill="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#cs_clip_1_triangle-10)">
      <mask height="174" id="cs_mask_1_triangle-10" style={{ "maskType": "alpha" }} width="200" x="0" y="13" maskUnits="userSpaceOnUse">
        <path d="M100 13l100 174H0L100 13z" fill="#fff" />
      </mask>
      <g mask="url(#cs_mask_1_triangle-10)">
        <path d="M200 0H0v200h200V0z" fill="#fff" />
        <path d="M200 0H0v200h200V0z" fill="#FF6C02" fillOpacity="0.19" />
        <g filter="url(#filter0_f_748_4905)">
          <path d="M160 0H39v89h121V0z" fill="#FF58E4" />
          <path d="M158 115H41v105h117V115z" fill="#FFE500" />
          <path d="M156-9H45v121h111V-9z" fill="url(#paint0_linear_748_4905)" />
        </g>
      </g>
    </g>
    <g style={{ "mixBlendMode": "overlay" }} mask="url(#cs_mask_1_triangle-10)">
      <path d="M200 0H0v200h200V0z" fill="gray" stroke="transparent" filter="url(#cs_noise_1_triangle-10)" />
    </g>
    <defs>
      <filter height="354" id="filter0_f_748_4905" width="246" x="-23.5" y="-71.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood result="BackgroundImageFix" floodOpacity="0" />
        <feBlend result="shape" in="SourceGraphic" in2="BackgroundImageFix" />
        <feGaussianBlur result="effect1_foregroundBlur_748_4905" stdDeviation="31.25" />
      </filter>
      <linearGradient id="paint0_linear_748_4905" gradientUnits="userSpaceOnUse" x1="132.967" x2="48.334" y1="-1.438" y2="88.212">
        <stop stopColor="#0E6FFF" />
        <stop offset="1" stopColor="#00F0FF" />
      </linearGradient>
      <clipPath id="cs_clip_1_triangle-10">
        <path d="M0 0H200V200H0z" fill="#fff" />
      </clipPath>
    </defs>
    <defs>
      <filter height="100%" id="cs_noise_1_triangle-10" width="100%" x="0%" y="0%" filterUnits="objectBoundingBox">
        <feBlend result="out3" in="SourceGraphic" in2="out2" />
      </filter>
    </defs>
  </svg>
);

const promptModes = [
  {
    id: "generate",
    name: "Generate",
    description: "Create a new gradient from scratch",
    icon: (props: any) => <TriangleIcon {...props} className={cn("size-3.5", props.className)} />,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    id: "edit",
    name: "Edit",
    description: "Refine or modify the current gradient",
    icon: (props: any) => <span {...props} className={cn("text-[14px] leading-none", props.className)}>📝</span>,
    color: "text-secondary-foreground",
    bg: "bg-secondary/20",
    border: "border-secondary/30",
  },
];

const gradientStyles = [
  {
    category: "Vibes",
    description: "Moody, deep background tones",
    id: "dark",
    name: "Dark / Moody",
    icon: (props: any) => <span {...props} className={cn("text-[14px] leading-none", props.className)}>🌑</span>,
  },
  {
    category: "Vibes",
    description: "Clean, 2-color high contrast",
    id: "minimal",
    name: "Minimalist",
    icon: (props: any) => <span {...props} className={cn("text-[14px] leading-none", props.className)}>⚪</span>,
  },
  {
    category: "Vibes",
    description: "Bold, bright, high saturation",
    id: "vibrant",
    name: "Vibrant",
    icon: (props: any) => <span {...props} className={cn("text-[14px] leading-none", props.className)}>🌈</span>,
  },
  {
    category: "Complexity",
    description: "Specifically uses 3 color stops",
    id: "3-colors",
    name: "3 Colors",
    icon: () => (
      <div className="flex -space-x-1.5 p-0.5">
        <div className="size-2.5 rounded-full bg-rose-500/80 ring-1 ring-white/30" />
        <div className="size-2.5 rounded-full bg-sky-500/80 ring-1 ring-white/30" />
        <div className="size-2.5 rounded-full bg-emerald-500/80 ring-1 ring-white/30" />
      </div>
    ),
  },
  {
    category: "Complexity",
    description: "Liquid multi-stop organic flow",
    id: "mesh",
    name: "Mesh Gradient",
    icon: (props: any) => <span {...props} className={cn("text-[14px] leading-none", props.className)}>🌀</span>,
  },
  {
    category: "Type",
    description: "Standard direction flow",
    id: "linear",
    name: "Linear",
    icon: (props: any) => <MoveHorizontal {...props} className={cn("size-3.5", props.className)} />,
  },
  {
    category: "Type",
    description: "Centered circular flow",
    id: "radial",
    name: "Radial",
    icon: (props: any) => <CircleDot {...props} className={cn("size-3.5", props.className)} />,
  },
];

interface AttachmentItemProps {
  attachment: {
    id: string;
    type: "file";
    filename?: string;
    mediaType?: string;
    url: string;
  };
  onRemove: (id: string) => void;
}

const AttachmentItem = memo(({ attachment, onRemove }: AttachmentItemProps) => {
  const handleRemove = useCallback(
    () => onRemove(attachment.id),
    [onRemove, attachment.id]
  );
  return (
    <Attachment data={attachment as any} key={attachment.id} onRemove={handleRemove}>
      <AttachmentPreview />
      <AttachmentRemove />
    </Attachment>
  );
});
AttachmentItem.displayName = "AttachmentItem";

interface StyleItemProps {
  style: (typeof gradientStyles)[0];
  selectedId: string;
  onSelect: (id: string) => void;
}

const StyleItem = memo(({ style, selectedId, onSelect }: StyleItemProps) => {
  const handleSelect = useCallback(() => onSelect(style.id), [onSelect, style.id]);
  const Icon = style.icon;

  return (
    <ModelSelectorItem key={style.id} onSelect={handleSelect} value={style.id} className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 cursor-pointer rounded-lg transition-colors group">
      <div className="size-8 flex items-center justify-center rounded-md bg-white/5 text-white/70 group-aria-selected:text-white group-hover:bg-white/10">
        <Icon className="size-3.5" />
      </div>
      <div className="flex flex-col min-w-0">
        <ModelSelectorName className="text-sm font-medium text-white/90">
          {style.name}
        </ModelSelectorName>
        <span className="text-[10px] text-white/40 truncate">{style.description}</span>
      </div>
      {selectedId === style.id ? (
        <CheckIcon className="ml-auto size-4 text-primary" />
      ) : (
        <div className="ml-auto size-4" />
      )}
    </ModelSelectorItem>
  );
});
StyleItem.displayName = "StyleItem";

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();
  const handleRemove = useCallback((id: string) => attachments.remove(id), [attachments]);

  if (attachments.files.length === 0) return null;

  return (
    <Attachments variant="inline" className="px-3 pb-2 pt-1 border-b border-white/5 bg-black/5">
      {attachments.files.map((attachment) => (
        <AttachmentItem attachment={attachment} key={attachment.id} onRemove={handleRemove} />
      ))}
    </Attachments>
  );
};

interface AIPromptSectionProps {
  loading: boolean;
  onGenerate?: (prompt?: string) => Promise<void>;
}

export const AIPromptSection = ({ loading, onGenerate }: AIPromptSectionProps) => {
  const [selectedStyleId, setSelectedStyleId] = useState<string>("3-colors");
  const [promptMode, setPromptMode] = useState<"generate" | "edit">("generate");
  const [styleSelectorOpen, setStyleSelectorOpen] = useState(false);
  const [modeSelectorOpen, setModeSelectorOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const selectedStyle = useMemo(() => gradientStyles.find((s) => s.id === selectedStyleId), [selectedStyleId]);
  const activeMode = useMemo(() => promptModes.find((m) => m.id === promptMode), [promptMode]);

  const handleStyleSelect = useCallback((id: string) => {
    setSelectedStyleId(id);
    setStyleSelectorOpen(false);
  }, []);

  const handleModeSelect = useCallback((id: "generate" | "edit") => {
    setPromptMode(id);
    setModeSelectorOpen(false);
  }, []);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (message: PromptInputMessage) => {
      if (!onGenerate) return;
      const text = message.text.trim();
      if (!text && !message.files?.length) return;

      try {
        const modePrefix = promptMode === "edit" ? "[EDIT CURRENT GRADIENT] " : "[GENERATE NEW GRADIENT] ";
        const stylePrefix = selectedStyle ? `[STYLE: ${selectedStyle.name}] ` : "";
        await onGenerate(`${modePrefix}${stylePrefix}${text}`);
        setInputValue("");
      } catch (error) {
        console.error("Failed to generate:", error);
      }
    },
    [onGenerate, selectedStyle, promptMode]
  );

  const shouldReduceMotion = useReducedMotion();

  const isSubmitDisabled = !inputValue.trim() || loading;

  const ActiveModeIcon = activeMode?.icon;
  const SelectedStyleIcon = selectedStyle?.icon;

  return (
    <div className="w-full">
      <PromptInputProvider>
        <motion.div
          layout
          transition={
            shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 22 }
          }
          className="group relative"
        >
          <PromptInput
            globalDrop
            multiple
            onSubmit={handleSubmit}
            className="bg-background/40 border border-input rounded-2xl shadow-2xl backdrop-blur-3xl transition-all duration-300 group-focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20"
          >
            <PromptInputAttachmentsDisplay />
            <PromptInputBody>
              <PromptInputTextarea
                placeholder={promptMode === "edit" ? "Describe how to edit this gradient..." : "Describe the gradient you want..."}
                className="px-4 py-3 placeholder:text-white/20 text-white min-h-[72px] text-sm resize-none scroll-smooth custom-scrollbar"
                onChange={handleInputChange}
                value={inputValue}
              />
            </PromptInputBody>
            <PromptInputFooter className="p-2.5 bg-white/[0.02] border-t border-white/5">
              <PromptInputTools className="gap-2">
                <ModelSelector onOpenChange={setModeSelectorOpen} open={modeSelectorOpen}>
                  <ModelSelectorTrigger asChild>
                    <PromptInputButton className={cn(
                      "h-6 px-2 rounded-full bg-white/5 border transition-all gap-2 group",
                      activeMode?.border,
                      activeMode?.bg
                    )}>
                      {ActiveModeIcon && (
                        <ActiveModeIcon className={cn("size-3", activeMode.color)} />
                      )}
                      <ModelSelectorName className={cn("text-[10px] font-bold uppercase tracking-wider", activeMode?.color)}>
                        {activeMode?.name}
                      </ModelSelectorName>
                    </PromptInputButton>
                  </ModelSelectorTrigger>
                  <ModelSelectorContent title="Action Mode" className="bg-[#0d0f14] border-white/10 backdrop-blur-3xl text-white max-w-[280px] p-3 [&>button]:-right-2 [&>button]:-top-2 [&>button]:bg-black/80 [&>button]:backdrop-blur-xl [&>button]:rounded-full [&>button]:size-7 [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:border [&>button]:border-white/10 [&>button]:hover:bg-white/10 [&>button]:transition-all">
                    <ModelSelectorList className="space-y-1 pb-2">
                      {promptModes.map((m) => {
                        const MIcon = m.icon;
                        return (
                          <ModelSelectorItem
                            key={m.id}
                            onSelect={() => handleModeSelect(m.id as "generate" | "edit")}
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 cursor-pointer rounded-lg transition-colors group"
                          >
                            <div className={cn("size-8 flex items-center justify-center rounded-md bg-white/5 group-hover:bg-white/10", m.color)}>
                              <MIcon className="size-3.5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-medium text-white">{m.name}</span>
                              <span className="text-[10px] text-white/40 truncate">{m.description}</span>
                            </div>
                            {promptMode === m.id && <CheckIcon className="ml-auto size-4 text-primary" />}
                          </ModelSelectorItem>
                        );
                      })}
                    </ModelSelectorList>
                  </ModelSelectorContent>
                </ModelSelector>


                {promptMode !== "edit" && (
                  <ModelSelector
                    onOpenChange={setStyleSelectorOpen}
                    open={styleSelectorOpen}
                  >
                    <ModelSelectorTrigger asChild>
                      <PromptInputButton className="h-6 px-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-all gap-2 group">
                        {SelectedStyleIcon && (
                          <SelectedStyleIcon className="size-3 transition-transform group-hover:scale-110" />
                        )}
                        <ModelSelectorName className="text-[10px] font-medium uppercase tracking-wider max-w-[100px] text-white/50 group-hover:text-white">
                          {selectedStyle?.name || "Style"}
                        </ModelSelectorName>
                      </PromptInputButton>
                    </ModelSelectorTrigger>
                    <ModelSelectorContent title="Gradient Style Selector" className="bg-[#0d0f14] border-white/10 backdrop-blur-3xl text-white max-w-[320px] p-3 [&>button]:-right-2 [&>button]:-top-2 [&>button]:bg-black/80 [&>button]:backdrop-blur-xl [&>button]:rounded-full [&>button]:size-7 [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:border [&>button]:border-white/10 [&>button]:hover:bg-white/10 [&>button]:transition-all">
                      <ModelSelectorList className="max-h-[400px] overflow-y-auto space-y-1 pb-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
                        <ModelSelectorEmpty className="p-8 text-center text-sm text-white/30">No styles found.</ModelSelectorEmpty>

                        {["Vibes", "Complexity", "Type"].map((cat) => (
                          <ModelSelectorGroup
                            heading={cat}
                            key={cat}
                            className="pt-2 px-2"
                          >
                            <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] px-2 mb-2">{cat}</div>
                            <div className="space-y-1">
                              {gradientStyles
                                .filter((s) => s.category === cat)
                                .map((s) => (
                                  <StyleItem
                                    key={s.id}
                                    style={s}
                                    onSelect={handleStyleSelect}
                                    selectedId={selectedStyleId}
                                  />
                                ))}
                            </div>
                          </ModelSelectorGroup>
                        ))}
                      </ModelSelectorList>
                    </ModelSelectorContent>
                  </ModelSelector>
                )}
              </PromptInputTools>
              <PromptInputSubmit
                status={loading ? "submitted" : "ready"}
                disabled={isSubmitDisabled}
                className={cn(
                  "size-8 rounded-full transition-all duration-300",
                  loading || isSubmitDisabled
                    ? "bg-white/10 text-white/20 shadow-none border-none cursor-not-allowed opacity-50"
                    : "bg-white text-black hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] border-none"
                )}
              >
                {loading ? <Spinner size={14} className="text-white/40" /> : null}
              </PromptInputSubmit>
            </PromptInputFooter>
          </PromptInput>
        </motion.div>
      </PromptInputProvider>
    </div>
  );
};
