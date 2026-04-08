import { motion, MotionProps } from "framer-motion";
import { useEffect, useState } from "react";

export type TextScrambleProps = {
  children: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  as?: React.ElementType;
  className?: string;
  trigger?: boolean;
  onScrambleComplete?: () => void;
} & MotionProps;

const defaultChars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = defaultChars,
  className,
  as: Component = "p",
  trigger = true,
  onScrambleComplete,
  ...props
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(children);

  useEffect(() => {
    if (!trigger) {
      setDisplayText(children);
      return;
    }

    let isCancelled = false;
    const steps = duration / speed;
    let step = 0;

    const interval = setInterval(() => {
      if (isCancelled) {
        clearInterval(interval);
        return;
      }

      let scrambled = "";
      const progress = step / steps;

      for (let i = 0; i < children.length; i++) {
        if (children[i] === " " || children[i] === "\n") {
          scrambled += children[i];
          continue;
        }

        if (progress * children.length > i) {
          scrambled += children[i];
        } else {
          scrambled +=
            characterSet[Math.floor(Math.random() * characterSet.length)];
        }
      }

      setDisplayText(scrambled);
      step++;

      if (step > steps) {
        clearInterval(interval);
        setDisplayText(children);
        onScrambleComplete?.();
      }
    }, speed * 1000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [trigger, children, duration, speed, characterSet, onScrambleComplete]);

  // Use a simple motion element if Component is a string, else use motion(Component)
  const MotionComponent = typeof Component === 'string' 
    ? (motion as any)[Component] 
    : motion(Component as any);

  return (
    <MotionComponent className={className} {...props}>
      {displayText}
    </MotionComponent>
  );
}
