import { useState, useEffect, useMemo } from "react";
import axios from "@/shared/lib/axios";
import { useFavorites } from "@/features/gradients/hooks/useFavorites";
import { useDislikes } from "@/features/gradients/hooks/useDislikes";
import { useGradients } from "@/features/gradients/hooks/useGradients";
import GradientCard from "@/features/gradients/components/GradientCard";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Spinner } from "@/components/ui/spinner";

const FavoritesPage = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const { dislikes, toggleDislike } = useDislikes();
  const { gradients: libraryGradients, isLoading: loadingLibrary } = useGradients();
  const [createdGradients, setCreatedGradients] = useState<any[]>([]);
  const [loadingCreated, setLoadingCreated] = useState(true);

  useEffect(() => {
    const fetchCreated = async () => {
      try {
        const response = await axios.get<{ success: boolean; data: any[] }>("/ai/my-gradients");
        if (response.data.success) {
          setCreatedGradients(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch created gradients", err);
      } finally {
        setLoadingCreated(false);
      }
    };
    fetchCreated();
  }, []);

  // Deduplicate gradients by name to prevent favorites appearing multiple times if they exist in both library and created lists
  const allGradients = useMemo(() => {
    const map = new Map<string, any>();
    
    // Add library gradients first
    libraryGradients.forEach((g) => {
      if (g.name) map.set(g.name, g);
    });
    
    // Created gradients take priority if names clash
    createdGradients.forEach((g) => {
      if (g.name) map.set(g.name, g);
    });
    
    return Array.from(map.values());
  }, [libraryGradients, createdGradients]);

  const favoriteGradients = useMemo(() => {
    return allGradients.filter((g) => favorites.includes(g.name || ""));
  }, [allGradients, favorites]);

  const isLoading = loadingLibrary || loadingCreated;

  return (
    <div className="container min-h-screen bg-background py-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-1 pt-4">
          <h1 className="text-2xl font-bold tracking-tight">Favorites</h1>
          <p className="text-sm text-muted-foreground">
            Your saved gradient collection
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <Spinner size={64} />
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/30 italic">
              Retrieving your collection...
            </p>
          </div>
        ) : favoriteGradients.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteGradients.map((gradient, index) => (
              <motion.div
                key={gradient.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GradientCard
                  gradient={gradient as any}
                  isFavorite={true}
                  onFavoriteToggle={toggleFavorite}
                  isDisliked={dislikes.includes(gradient.name || "")}
                  onDislikeToggle={toggleDislike}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="flex flex-col border items-center justify-center space-y-4 bg-card rounded-3xl border-2 border-dashed border-[#ffffff57]  w-max mx-auto bg-white/[0.02] p-10 text-center">
            <Heart className="text-white/10" size={64} />
            <h2 className="text-xl font-semibold">No favorites yet</h2> 
            <p className="max-w-sm text-muted-foreground opacity-50">
              Gradients you love will appear here once you click the heart icon.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;

