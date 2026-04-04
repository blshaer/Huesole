import { useState, useEffect } from "react";
import axios from "@/shared/lib/axios";
import { toast } from "sonner";
import { GeneratedGradient } from "../types";


interface UseGradientGenerationProps {
  user: any;
  navigate: any;
  setResult: React.Dispatch<React.SetStateAction<GeneratedGradient>>;
}

export const useGradientGeneration = ({
  user,
  navigate,
  setResult,
}: UseGradientGenerationProps) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setLocalResult] = useState<GeneratedGradient | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleGenerate = async (customPrompt?: string) => {
    if (!user) {
      toast.error("Authentication Required", { description: "Please login first to use the AI Generator." });
      navigate("/login");
      return;
    }

    if (!customPrompt) return;

    setLoading(true);
    try {
      const response = await axios.post<{ data: GeneratedGradient }>(
        "/ai/generate",
        { prompt: customPrompt }
      );
      const generated = {
        ...response.data.data,
        id: crypto.randomUUID(),
      };
      setLocalResult(generated);
      setResult((prev: any) => ({ ...prev, ...generated }));

      // Only show toast on desktop
      if (!isMobile) {
        toast("Masterpiece Created!", { description: "Gemini has painted a new gradient for you." });
      }
    } catch (error: any) {
      const isOverloaded = error.response?.status === 503 || error.message?.includes("503");
      toast.error(isOverloaded ? "AI Artist is Busy" : "Generation Failed", { 
        description: isOverloaded 
          ? "Gemini is currently experiencing high demand. Please try again in 30 seconds." 
          : (error.response?.data?.message || "Something went wrong while painting. Please try again.") 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (gradientOverride?: GeneratedGradient) => {
    const gradientToSave = gradientOverride || result;
    if (!gradientToSave) return;

    setSaving(true);
    try {
      await axios.post(
        "/ai/save",
        { gradient: gradientToSave }
      );

      // Only show toast on desktop
      if (!isMobile) {
        toast("Gallery Updated!", { description: "Your gradient is now in 'My Gradients'." });
      }
    } catch (error) {
      toast.error("Save Failed", { description: "Please log in to save your creations." });
    } finally {
      setSaving(false);
    }
  };

  return { handleGenerate, handleSave, loading, saving };
};
