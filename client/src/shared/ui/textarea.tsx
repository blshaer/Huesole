import * as React from "react";

import { cn } from "@/shared/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border-2 border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground placeholder:opacity-50 transition-colors duration-300 ease-in-out file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
