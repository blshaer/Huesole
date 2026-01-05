import { useAuth } from "@/features/auth/context/AuthContext";
import { Navbar } from "@/features/navbar/components/Navbar";
import { toast } from "@/shared/hooks/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PreviewArea } from "../components/PreviewArea";
import { Sidebar } from "../components/Sidebar";
import { useGradientGeneration } from "../hooks/useGradientGeneration";
import { GeneratedGradient } from "../types";

import { API_URL } from "@/shared/config";

const AIGeneratorPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as
    | { name: string; colors: string[] }
    | undefined;

  const [result, setResult] = useState<GeneratedGradient | null>(() => {
    const saved = localStorage.getItem("gradly-latest-gradient");
    return saved ? JSON.parse(saved) : null;
  });

  const [isAnimated, setIsAnimated] = useState(
    () => localStorage.getItem("gradly-is-animated") === "true",
  );

  const [animationSpeed, setAnimationSpeed] = useState(() => {
    const saved = localStorage.getItem("gradly-animation-speed");
    return saved ? parseFloat(saved) : 1;
  });

  const [saving, setSaving] = useState(false);
  const [showAngleController, setShowAngleController] = useState(true);
  const [isLightGradient, setIsLightGradient] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleAngleController = () =>
    setShowAngleController((prev) => !prev);

  const toggleMobileSidebar = () =>
    setIsMobileSidebarOpen((prev) => !prev);

  const { handleGenerate } = useGradientGeneration({
    user,
    navigate,
    setResult,
  });

  // Initialize gradient
  useEffect(() => {
    if (state) {
      setResult({
        name: state.name,
        colors: state.colors,
        type: "linear",
        angle: 90,
      });
      window.history.replaceState({}, document.title);
    } else if (!result) {
      setResult({
        name: "New Gradient",
        colors: ["#3b82f6", "#8b5cf6"],
        type: "linear",
        angle: 45,
      });
    }
  }, [state]);

  // Persist state
  useEffect(() => {
    if (result) {
      localStorage.setItem(
        "gradly-latest-gradient",
        JSON.stringify(result),
      );
    }
    localStorage.setItem("gradly-is-animated", String(isAnimated));
    localStorage.setItem(
      "gradly-animation-speed",
      String(animationSpeed),
    );
  }, [result, isAnimated, animationSpeed]);

  // Light gradient detection
  useEffect(() => {
    if (!result) return;

    const isLight = result.colors.every((color) => {
      const hex = color.replace("#", "");
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return (r * 299 + g * 587 + b * 114) / 1000 > 200;
    });

    setIsLightGradient(isLight);
  }, [result]);

  const handleSave = async () => {
    if (!result) {
      toast({
        title: "No gradient to save",
        description: "Please generate or edit a gradient first.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await axios.post(`${API_URL}/ai/save`, {
        gradient: {
          name: result.name,
          colors: result.colors,
          type: result.type || "linear",
          angle: result.angle || 90,
        },
      });

      toast({
        title: "Saved successfully!",
        description: "Your gradient has been saved to your profile.",
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast({
          title: "Session expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        logout();
      } else {
        toast({
          title: "Save failed",
          description:
            error.response?.data?.message ||
            "Failed to save gradient.",
          variant: "destructive",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateColor = (index: number, newColor: string) => {
    if (!result) return;
    const colors = [...result.colors];
    colors[index] = newColor;
    setResult({ ...result, colors });
  };

  const handleAddColor = () => {
    if (!result) return;
    setResult({
      ...result,
      colors: [...result.colors, result.colors.at(-1)!],
    });
  };

  const handleRemoveColor = (index: number) => {
    if (!result || result.colors.length <= 2) return;
    setResult({
      ...result,
      colors: result.colors.filter((_, i) => i !== index),
    });
  };

  const handleAngleChange = (angle: number) => {
    if (!result) return;
    setResult({ ...result, angle });
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background text-foreground">
      <Navbar
        result={result}
        isAnimated={isAnimated}
        setIsAnimated={setIsAnimated}
        animationSpeed={animationSpeed}
        setAnimationSpeed={setAnimationSpeed}
        showAngleController={showAngleController}
        onToggleAngleController={toggleAngleController}
        onToggleSidebar={toggleMobileSidebar}
        isLightGradient={isLightGradient}
      />

      <div className="container flex flex-1 overflow-hidden p-0">
        <Sidebar
          result={result}
          setResult={setResult}
          saving={saving}
          isAnimated={isAnimated}
          setIsAnimated={setIsAnimated}
          animationSpeed={animationSpeed}
          setAnimationSpeed={setAnimationSpeed}
          onGenerate={handleGenerate}
          onSave={handleSave}
          onUpdateColor={handleUpdateColor}
          onAddColor={handleAddColor}
          onRemoveColor={handleRemoveColor}
          isMobileOpen={isMobileSidebarOpen}
          onToggleMobile={toggleMobileSidebar} loading={false} />

        <PreviewArea
          result={result}
          isAnimated={isAnimated}
          animationSpeed={animationSpeed}
          onAngleChange={handleAngleChange}
          showAngleController={showAngleController}
          onToggleAngleController={toggleAngleController}
          isLightGradient={isLightGradient}
          onGenerate={handleGenerate}
          loading={false}
        />
      </div>
    </div>
  );
};

export default AIGeneratorPage;
