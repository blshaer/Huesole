import { useFavorites } from "@/features/gradients/hooks/useFavorites";
import { useGradients } from "@/features/gradients/hooks/useGradients";
import GradientCard from "@/features/gradients/components/GradientCard";
import { motion } from "framer-motion";
import { Heart, Loader2 } from "lucide-react";

const FavoritesPage = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const { gradients, isLoading, error } = useGradients();

  const favoriteGradients = gradients.filter((g) =>
    favorites.includes(g.name || ""),
  );

  return (
    <div className="container min-h-screen bg-[var(--background)] py-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-1 pt-4">
          <h1 className="text-2xl font-bold tracking-tight">Favorites</h1>
          <p className="text-sm text-muted-foreground">
            Your saved gradient collection
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Loading your favorites...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl border-2 border-dashed border-red-500/10 bg-red-500/[0.02] py-20 text-center">
            <p className="text-sm text-red-400">{error}</p>
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
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.02] py-20 text-center">
            <Heart className="text-white/10" size={64} />
            <h2 className="text-xl font-semibold">No favorites yet</h2>
            <p className="max-w-sm text-muted-foreground">
              Gradients you love will appear here once you click the heart icon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;

