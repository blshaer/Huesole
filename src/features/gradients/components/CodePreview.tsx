import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { Check, Copy, X } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAction = () => {
    copyToClipboard(code, activeTab);
  };

  const formatLabel =
    activeTab === "svg" ? "SVG" : activeTab === "css" ? "CSS" : "Tailwind CSS";

  const CodeHeader = ({ showClose = false }: { showClose?: boolean }) => (
    <div className="flex items-center justify-between gap-4 border-b border-[#262626] pb-4">
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#a1a1a1]">
          Code
        </p>
        <h2 className="mt-1 text-base font-semibold leading-none text-[#fafafa]">
          {formatLabel}
        </h2>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="flex items-center rounded-full bg-[#262626] p-1">
          {["HEX", "RGB", "HSL"].map((format) => (
            <button
              key={format}
              type="button"
              onClick={() => onColorFormatChange(format)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[10px] font-bold tracking-wider",
                selectedColorFormat === format
                  ? "bg-[#fafafa] text-[#0a0a0a]"
                  : "text-[#a1a1a1] hover:text-[#fafafa]",
              )}
            >
              {format}
            </button>
          ))}
        </div>
        {showClose && (
          <DialogClose className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#a1a1a1] hover:bg-[#262626] hover:text-[#fafafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#525252]">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
      </div>
    </div>
  );

  const CodeMain = () => (
    <div className="bg-[#262626] relative mt-4 overflow-hidden rounded-2xl border border-[#262626]">
      <div className="absolute right-4 top-4 z-10">
        <button
          onClick={handleAction}
          className="bg-[#171717] hover:bg-[#404040] flex h-8 w-8 items-center justify-center rounded-lg border border-[#404040] text-[#fafafa]"
        >
          {copiedStates[activeTab] ? (
            <Check className="text-success h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      <div className="max-h-[60vh] overflow-auto p-6 pt-10">
        <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-[#d4d4d4]">
          {code}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <div className="relative mt-2 w-full">
            <pre className="w-full max-w-full overflow-hidden truncate max-md:w-full whitespace-nowrap rounded-lg border border-border bg-secondary p-2 pr-14 text-[10px] text-[#a1a1a1] h-10 flex items-center shadow-inner">
              {code}
            </pre>
            <div className="absolute right-0 top-0 z-10 flex h-full items-stretch">
              <DrawerTrigger asChild>
                <button
                  className="bg-[#262626] max-md:w-[40px] flex h-full w-[48px] items-center justify-center rounded-r-lg border border-l-border border-border p-0 text-[#fafafa] hover:bg-[#404040] hover:text-[#fafafa]"
                  onClick={handleAction}
                  type="button"
                  aria-label="Copy and Preview code"
                  title="Copy and Preview code"
                >
                  {copiedStates[activeTab] ? (
                    <Check className="text-success h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </DrawerTrigger>
            </div>
          </div>
          <DrawerContent className="bg-[#171717] border-[#262626] p-5 backdrop-blur-xl">
            <DrawerHeader>
              <CodeHeader />
            </DrawerHeader>
            <div className="px-1 pb-10">
              <CodeMain />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <div className="relative mt-2 w-full">
            <pre className="w-full max-w-full overflow-hidden truncate max-md:w-full whitespace-nowrap rounded-lg border border-border bg-secondary p-2 pr-14 text-[10px] text-[#a1a1a1] h-10 flex items-center shadow-inner">
              {code}
            </pre>
            <div className="absolute right-0 top-0 z-10 flex h-full items-stretch">
              <DialogTrigger asChild>
                <button
                  className="bg-[#262626] max-md:w-[40px] flex h-full w-[48px] items-center justify-center rounded-r-lg border border-l-border border-border p-0 text-[#fafafa] hover:bg-[#404040] hover:text-[#fafafa]"
                  onClick={handleAction}
                  type="button"
                  aria-label="Copy and Preview code"
                  title="Copy and Preview code"
                >
                  {copiedStates[activeTab] ? (
                    <Check className="text-success h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </DialogTrigger>
            </div>
          </div>

          <DialogContent className="max-w-4xl border-[#262626] bg-[#171717] [&>button]:hidden">
            <DialogHeader>
              <CodeHeader showClose />
            </DialogHeader>
            <CodeMain />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
