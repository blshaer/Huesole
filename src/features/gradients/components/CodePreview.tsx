import {
  Dialog,
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
import { Check, Copy } from "lucide-react";
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

  const CodeHeader = () => (
    <div className="flex flex-row items-center max-md:flex-col max-md:py-4 max-md:gap-4 justify-between border-b border-[#262626] pb-4">
      <div className="flex flex-col gap-1">
        <div className="text-sm font-semibold uppercase tracking-widest text-[#a1a1a1]">
          Code Preview
        </div>
        <div className="text-lg font-bold text-[#fafafa]">
          {String(activeTab).charAt(0).toUpperCase() + String(activeTab).slice(1)}
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-[#262626] bg-[#262626] p-1">
        {["HEX", "RGB", "HSL"].map((format) => (
          <button
            key={format}
            onClick={() => onColorFormatChange(format)}
            className={cn(
              "px-3 py-1.5 text-[10px] font-bold tracking-wider transition-all rounded-full",
              selectedColorFormat === format
                ? "bg-[#fafafa] text-[#0a0a0a]"
                : "text-[#a1a1a1] hover:text-[#fafafa]"
            )}
          >
            {format}
          </button>
        ))}
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

          <DialogContent className="max-w-4xl border-[#262626] bg-[#171717]">
            <DialogHeader>
              <CodeHeader />
            </DialogHeader>
            <CodeMain />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
