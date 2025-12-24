import { useState } from "react";
import axios from "axios";
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
        "https://gradlyai.onrender.com/api/ai/generate",
        { prompt: customPrompt }
      );
      setLocalResult(response.data.data); // store locally
      setResult(response.data.data); // call parent callback
      toast({
        title: "Masterpiece Created!",
        description: "Gemini has painted a new gradient for you.",
      });
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
    if (!result) return; // nothing to save

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://gradlyai.onrender.com/api/ai/save",
        { gradient: result },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        title: "Gallery Updated!",
        description: "Your gradient is now in 'My Gradients'.",
      });
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
