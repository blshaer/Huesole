import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Navbar } from "@/features/navbar/components/Navbar";
import { PreviewArea } from "../components/PreviewArea";
import { GeneratedGradient } from "../types";
import { useGradientGeneration } from "../hooks/useGradientGeneration";
import { Sidebar } from "../components/Sidebar";

const AIGeneratorPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [result, setResult] = useState<GeneratedGradient | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  const { handleGenerate, handleSave, loading, saving } = useGradientGeneration({
    user,
    navigate,
    setResult,
  });

  // Initialize with default gradient
  useEffect(() => {
    if (!result) {
      setResult({
        name: "New Gradient",
        colors: ["#3b82f6", "#8b5cf6"],
        type: "linear",
        angle: 45,
      });
    }
  }, [result]);

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

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.03] brightness-150 contrast-150"
        style={{
          backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`,
        }}
      />

      {/* Navbar now receives gradient + animation props */}
      <div className="relative z-50 flex-shrink-0">
        <Navbar
          result={result}
          isAnimated={isAnimated}
          setIsAnimated={setIsAnimated}
          animationSpeed={animationSpeed}
          setAnimationSpeed={setAnimationSpeed}
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
        />

        <PreviewArea
          result={result}
          isAnimated={isAnimated}
          animationSpeed={animationSpeed}
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
