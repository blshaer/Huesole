import { forwardRef, useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";
import { Copy, Check } from "lucide-react";
import { TextScramble } from "@/shared/ui/text-scramble";

interface CodePreviewInlineProps {
  code: string;
  formatKey: string;
  copied: boolean;
  onCopy: () => void;
}

// forwardRef so ExportSection can pass ref for html2canvas
export const CodePreviewInline = forwardRef<
  HTMLDivElement,
  CodePreviewInlineProps
>(({ code, formatKey, copied, onCopy }, ref) => {
  const [trigger, setTrigger] = useState(false);

  // Trigger scramble effect when code or format changes
  useEffect(() => {
    setTrigger(false);
    const timer = setTimeout(() => {
      setTrigger(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [code, formatKey]);

  return (
    <div
      ref={ref}
      className="bg-card/80 text-foreground/80 mt-2 w-full rounded-md border border-border p-3 font-mono text-xs shadow-sm"
    >
      <div className="text-foreground/40 mb-2 flex items-center justify-between text-[10px]">
        <span className="uppercase tracking-[0.18em]">
          {formatKey.toUpperCase()} snippet
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground/60 h-7 w-7 hover:text-foreground"
          type="button"
          onClick={onCopy}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <pre className="custom-scrollbar max-h-56 overflow-auto whitespace-pre-wrap text-[11px] leading-relaxed">
        <code>
          <TextScramble
            as="span"
            duration={1.5}
            speed={0.015}
            trigger={trigger}
            className="inline"
          >
            {code || "// Generate a gradient first..."}
          </TextScramble>
        </code>
      </pre>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          transition: background 0.2s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
});

CodePreviewInline.displayName = "CodePreviewInline";
