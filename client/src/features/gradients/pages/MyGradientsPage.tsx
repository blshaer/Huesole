import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Sparkles } from "lucide-react";
import GradientCard from "@/features/gradients/components/GradientCard";
import { useFavorites } from "@/features/gradients/hooks/useFavorites";

interface Gradient {
  id: string;
  name: string;
  colors: string[];
}

const MyGradientsPage = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const [gradients, setGradients] = useState<Gradient[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="flex min-h-screen items-center justify-center pt-20">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
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
