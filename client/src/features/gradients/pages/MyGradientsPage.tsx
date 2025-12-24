import { useState, useEffect } from "react";
import axios from "axios";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GradientCard from "@/features/gradients/components/GradientCard";
import { useFavorites } from "@/features/gradients/hooks/useFavorites";
import { Button } from "@/shared/ui/button";
import { motion } from 'framer-motion';

interface Gradient {
  id: string;
  name: string;
  colors: string[];
}

const MyGradientsPage = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const [gradients, setGradients] = useState<Gradient[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const setBackground = (background: string) => {
    // Implement your background setting logic here
    // For example: document.body.style.background = background;
    // Or use a context/state management solution
    console.log("Setting background:", background);
  };

  const handleEditGradient = (gradient: { name: string; colors: string[] }) => {
    const css = `linear-gradient(90deg, ${gradient.colors.join(", ")})`;
    setBackground(css);

    navigate("/ai-generator", {
      state: {
        name: gradient.name,
        colors: gradient.colors,
      },
    });
  };

  useEffect(() => {
    const fetchGradients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<{ data: Gradient[] }>(
          "https://gradlyai.onrender.com/api/ai/my-gradients",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setGradients(response.data.data);
      } catch (error) {
        console.error("Failed to fetch custom gradients", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGradients();
  }, []);

  if (loading) {
    return (
      <motion.div
        className="flex h-screen items-center justify-center bg-[var(--background)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-base">
          <Button
            isLoading={true}
            className="flex cursor-text gap-0 border-none bg-transparent"
          >
            Loading...
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="container min-h-screen bg-[var(--background)] py-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {gradients.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3">
            {gradients.map((gradient) => (
              <GradientCard
                key={gradient.id}
                gradient={gradient}
                isFavorite={favorites.includes(gradient.name)}
                onFavoriteToggle={toggleFavorite}
                onEditClick={handleEditGradient}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.02] py-20 text-center">
            <Sparkles className="text-white/10" size={64} />
            <h2 className="text-xl font-semibold">No custom gradients yet</h2>
            <p className="max-w-sm text-muted-foreground">
              Use the AI Generator in the dropdown to create unique color
              schemes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGradientsPage;
