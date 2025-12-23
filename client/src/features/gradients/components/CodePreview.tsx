import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { TextScramble } from "@/shared/ui/text-scramble";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Eye } from "lucide-react";
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
}

export const CodePreview: React.FC<CodePreviewProps> = ({
  code,
  copiedStates,
  activeTab,
  copyToClipboard,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="relative mt-2 max-w-full">
        <pre className="w-full max-w-full overflow-hidden  text-blue-200/50 truncate whitespace-nowrap rounded-md border border-border bg-secondary p-2 pr-24 text-xs ">
          {code}
        </pre>
        <div className="absolute right-0 top-0 z-10 flex h-full items-stretch">
          <DialogTrigger asChild>
            <button
              className="flex h-full w-[36px] items-center justify-center border border-border border-l-0 bg-secondary/95 p-0 text-primary"
              type="button"
              aria-label="Open full code preview"
              title="Open full code preview"
            >
              <Eye className="h-4 w-4" />
            </button>
          </DialogTrigger>
          <button
            className="flex h-full w-[36px] items-center justify-center border border-border border-l-0 bg-secondary/95 p-0 text-primary"
            onClick={() => copyToClipboard(code, activeTab)}
            type="button"
            aria-label="Copy code"
            title="Copy code"
          >
            <AnimatePresence>
              {copiedStates[activeTab] ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="text-success h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div
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
        </div>
      </div>

      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Preview • {String(activeTab).toUpperCase()}
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[65vh] overflow-auto rounded-md border border-border bg-secondary/70 p-4 text-xs ">
          <TextScramble className="font-mono whitespace-pre-wrap text-blue-200/50" trigger={open}>
            {code}
          </TextScramble>
        </div>
      </DialogContent>
    </Dialog>
  );
};
