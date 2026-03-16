import { useState, useEffect } from "react";
import axios from "@/shared/lib/axios";
import { toast } from "@/shared/hooks/use-toast";
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
      toast({
        title: "Authentication Required",
        description: "Please login first to use the AI Generator.",
        variant: "destructive",
      });
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
        toast({
          title: "Masterpiece Created!",
          description: "Gemini has painted a new gradient for you.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description:
          error.response?.data?.message ||
          "The AI artist is busy. Please try again.",
        variant: "destructive",
      });
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
        toast({
          title: "Gallery Updated!",
          description: "Your gradient is now in 'My Gradients'.",
        });
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Please log in to save your creations.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return { handleGenerate, handleSave, loading, saving };
};
