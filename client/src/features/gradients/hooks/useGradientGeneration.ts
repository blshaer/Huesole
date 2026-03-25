import { useState, useEffect } from "react";
import axios from "@/shared/lib/axios";
import { toast } from "sonner";
import { GeneratedGradient } from "../types";


interface UseGradientGenerationProps {
  user: any;
  navigate: any;
  setResult: (gradient: GeneratedGradient) => void;
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
      setLocalResult(response.data.data);
      setResult(response.data.data);

      // Only show toast on desktop
      if (!isMobile) {
        toast("Masterpiece Created!", { description: "Gemini has painted a new gradient for you." });
      }
    } catch (error: any) {
      toast.error("Generation Failed", { description: error.response?.data?.message ||
          "The AI artist is busy. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;

    setSaving(true);
    try {
      await axios.post(
        "/ai/save",
        { gradient: result }
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
