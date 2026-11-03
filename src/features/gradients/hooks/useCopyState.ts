import { toastCopied, toastProblem } from "@/components/Toaster";
import { useEffect, useState } from "react";
import { useCopyHistory } from "./useCopyHistory";

export const useCopyState = (
  gradientName?: string,
  gradientColors?: string[],
) => {
  const { addToCopyHistory } = useCopyHistory();
  const [copiedStates, setCopiedStates] = useState({
    tailwind: false,
    css: false,
    sass: false,
    bootstrap: false,
    "react-native": false,
    flutter: false,
    swiftui: false,
    kotlin: false,
    vue: false,
    angular: false,
    react: false,
    xml: false,
    svg: false,
    json: false,
    colors: false,
  });

  const copyToClipboard = async (text: string, key: keyof typeof copiedStates) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      toastProblem("Couldn't copy that code.");
      return;
    }
    setCopiedStates((prev) => ({ ...prev, [key]: true }));
    
    // Check if we are on mobile to suppress toast
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (!isMobile) {
      toastCopied("Code copied");
    }

    // Add to copy history if gradient info is available
    if (gradientName && gradientColors) {
      addToCopyHistory(gradientName, gradientColors, key);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopiedStates({
        tailwind: false,
        css: false,
        sass: false,
        bootstrap: false,
        "react-native": false,
        flutter: false,
        swiftui: false,
        kotlin: false,
        vue: false,
        angular: false,
        react: false,
        xml: false,
        svg: false,
        json: false,
        colors: false,
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [copiedStates]);

  return { copiedStates, copyToClipboard };
};
