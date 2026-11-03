import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7S2.5 12 2.5 12Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M12 15.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5Z"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const EyeOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M3 3l18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M10.6 10.6a2.5 2.5 0 0 0 3.3 3.3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M6.2 6.6C3.7 8.4 2.5 12 2.5 12s3.5 7 9.5 7c1.8 0 3.4-.5 4.8-1.3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M9.1 5.4C10 5.1 11 5 12 5c6 0 9.5 7 9.5 7s-1.1 2.3-3 4.2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, id, disabled, value, defaultValue, onChange, ...props },
    ref,
  ) => {
    const reactId = React.useId();
    const inputId = id ?? reactId;

    const isPassword = type === "password";
    const [isVisible, setIsVisible] = React.useState(false);

    // Support both controlled (value) and uncontrolled (defaultValue) usage
    const isControlled = value !== undefined;

    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      () => (defaultValue ?? "") as string | number | readonly string[],
    );

    const currentValue = (isControlled ? value : uncontrolledValue) ?? "";
    const hasText = String(currentValue).length > 0;

    const resolvedType = isPassword ? (isVisible ? "text" : "password") : type;

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      if (!isControlled) setUncontrolledValue(e.target.value);
      onChange?.(e);
    };

    // If user clears the field, re-hide the password
    React.useEffect(() => {
      if (isPassword && !hasText && isVisible) setIsVisible(false);
    }, [hasText, isPassword, isVisible]);

    if (!isPassword) {
      return (
        <input
          id={inputId}
          type={resolvedType}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={cn(
            "flex h-10 w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-sm text-foreground transition-colors duration-300 ease-in-out file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground placeholder:opacity-50 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <div className="relative w-full">
        <input
          id={inputId}
          type={resolvedType}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={cn(
            "flex h-10 w-full rounded-lg border-2 border-border bg-background px-3 py-2 pr-11 text-sm text-foreground transition-colors duration-300 ease-in-out file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground placeholder:opacity-50 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />

        <AnimatePresence initial={false}>
          {hasText && (
            <motion.button
              key="toggle"
              type="button"
              disabled={disabled}
              aria-controls={inputId}
              aria-pressed={isVisible}
              aria-label={isVisible ? "Hide password" : "Show password"}
              className={cn(
                "absolute inset-y-0 right-2 flex items-center rounded-full p-1.5 text-muted-foreground transition-colors",
                "hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                disabled && "pointer-events-none opacity-50",
              )}
              // Prevent input losing focus when clicking the icon
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setIsVisible((v) => !v)}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.12 }}
              whileTap={{ scale: 0.96 }} // press feedback only; no hover movement
            >
              <AnimatePresence mode="wait" initial={false}>
                {isVisible ? (
                  <motion.span
                    key="eye-off"
                    initial={{ opacity: 0, rotate: -10 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 10 }}
                    transition={{ duration: 0.12 }}
                    className="block"
                  >
                    <EyeOffIcon className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="eye"
                    initial={{ opacity: 0, rotate: 10 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -10 }}
                    transition={{ duration: 0.12 }}
                    className="block"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
