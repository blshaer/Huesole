import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { TextScramble } from "@/shared/ui/text-scramble";
import { cn } from "@/shared/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CodePreviewProps {
  code: string;
  copiedStates: Record<string, boolean>;
  activeTab:
  | "tailwind"
  | "css"
  | "sass"
  | "bootstrap"
  | "react-native"
  | "flutter"
  | "swiftui"
  | "kotlin"
  | "vue"
  | "angular"
  | "react"
  | "xml"
  | "svg"
  | "json"
  | "colors";
  copyToClipboard: (
    text: string,
    key:
      | "tailwind"
      | "css"
      | "sass"
      | "bootstrap"
      | "react-native"
      | "flutter"
      | "swiftui"
      | "kotlin"
      | "vue"
      | "angular"
      | "react"
      | "xml"
      | "svg"
      | "json"
      | "colors",
  ) => void;
  selectedColorFormat: string;
  onColorFormatChange: (format: string) => void;
}

export const CodePreview: React.FC<CodePreviewProps> = ({
  code,
  copiedStates,
  activeTab,
  copyToClipboard,
  selectedColorFormat,
  onColorFormatChange,
}) => {
  const [open, setOpen] = useState(false);

  const handleAction = () => {
    copyToClipboard(code, activeTab);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="relative mt-2 w-full">
        <pre className="w-full max-w-full overflow-hidden truncate max-md:w-full whitespace-nowrap rounded-md border border-border bg-secondary p-2 pr-14 text-[10px] text-white/50 h-10 flex items-center shadow-inner">
          {code}
        </pre>
        <div className="absolute right-0 top-0 z-10 flex h-full items-stretch">
          <DialogTrigger asChild>
            <button
              className="bg-neutral-800 flex h-full w-[48px] items-center justify-center rounded-r-md border border-l-border border-border p-0 text-white/80 transition-all hover:bg-neutral-700 hover:text-white"
              onClick={handleAction}
              type="button"
              aria-label="Copy and Preview code"
              title="Copy and Preview code"
            >
              <AnimatePresence mode="wait">
                {copiedStates[activeTab] ? (
                  <motion.div
                    key="check"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="text-success h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Copy className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </DialogTrigger>
        </div>
      </div>

      <DialogContent className="max-w-4xl border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-sm font-semibold uppercase tracking-widest text-white/40">
              Code Preview
            </DialogTitle>
            <div className="text-lg font-bold text-white">
              {String(activeTab).charAt(0).toUpperCase() + String(activeTab).slice(1)}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 p-1">
            {["HEX", "RGB", "HSL"].map((format) => (
              <button
                key={format}
                onClick={() => onColorFormatChange(format)}
                className={cn(
                  "px-3 py-1.5 text-[10px] font-bold tracking-wider transition-all rounded-full",
                  selectedColorFormat === format
                    ? "bg-white text-black"
                    : "text-white/40 hover:text-white"
                )}
              >
                {format}
              </button>
            ))}
          </div>
        </DialogHeader>

        <div className="bg-neutral-900/50 relative mt-4 overflow-hidden rounded-xl border border-white/5">
          <div className="absolute right-4 top-4 z-10">
            <button
              onClick={handleAction}
              className="bg-white/5 hover:bg-white/10 flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 text-white transition-all active:scale-95"
            >
              {copiedStates[activeTab] ? (
                <Check className="text-success h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
          <div className="max-h-[60vh] overflow-auto p-6 pt-10">
            <TextScramble
              className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-white/70"
              trigger={open}
            >
              {code}
            </TextScramble>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
