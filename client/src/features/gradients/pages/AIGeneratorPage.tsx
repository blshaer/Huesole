import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Navbar } from "@/features/navbar/components/Navbar";
import { PreviewArea } from "../components/PreviewArea";
import { GeneratedGradient } from "../types";
import { useGradientGeneration } from "../hooks/useGradientGeneration";
import { Sidebar } from "../components/Sidebar";
import { toast } from "@/shared/hooks/use-toast";

const AIGeneratorPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const state = location.state as
    | { name: string; colors: string[] }
    | undefined;

  const [result, setResult] = useState<GeneratedGradient | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAngleController, setShowAngleController] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLightGradient, setIsLightGradient] = useState(false);

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
    } else {
      setResult({
        name: "New Gradient",
        colors: ["#3b82f6", "#8b5cf6"],
        type: "linear",
        angle: 45,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Calculate if gradient is light
  useEffect(() => {
    if (!result) return;

    const isLight = result.colors.every((color) => {
      const hex = color.replace(/^#/, "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 200;
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

    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to save gradients.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        gradient: {
          name: result.name,
          colors: result.colors,
          type: result.type || "linear",
          angle: result.angle || 90,
        }
      };

      await axios.post(
        "http://localhost:5000/api/ai/save",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Saved successfully!",
        description: "Your gradient has been saved to your profile.",
      });

      setTimeout(() => {
        navigate("/my-gradients");
      }, 1000);
    } catch (error: any) {
      console.error("Failed to save gradient", error);
      
      if (error.response?.status === 401) {
        toast({
          title: "Session expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast({
          title: "Save failed",
          description:
            error.response?.data?.message || 
            error.response?.data?.error ||
            "Failed to save gradient to profile.",
          variant: "destructive",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateColor = (index: number, newColor: string) => {
    if (!result) return;
    const newColors = [...result.colors];
    newColors[index] = newColor;
    setResult({ ...result, colors: newColors });
  };

  const handleAddColor = () => {
    if (!result) return;
    const lastColor = result.colors[result.colors.length - 1];
    setResult({ ...result, colors: [...result.colors, lastColor] });
  };

  const handleRemoveColor = (index: number) => {
    if (!result || result.colors.length <= 2) return;
    const newColors = result.colors.filter((_, i) => i !== index);
    setResult({ ...result, colors: newColors });
  };

  const handleAngleChange = (angle: number) => {
    if (!result) return;
    setResult({ ...result, angle });
  };

  const toggleAngleController = () => {
    setShowAngleController((prev) => !prev);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.03] brightness-150 contrast-150"
        style={{
          backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`,
        }}
      />

      <div className="relative z-50 flex-shrink-0">
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
      </div>

      <div className="relative container p-0 flex flex-1 overflow-hidden">
        <Sidebar
          result={result}
          setResult={setResult}
          loading={loading}
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
          onToggleMobile={toggleMobileSidebar}
        />

        <PreviewArea
          result={result}
          isAnimated={isAnimated}
          animationSpeed={animationSpeed}
          onAngleChange={handleAngleChange}
          showAngleController={showAngleController}
          onToggleAngleController={toggleAngleController}
          isLightGradient={isLightGradient}
        />
      </div>

      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default AIGeneratorPage;
