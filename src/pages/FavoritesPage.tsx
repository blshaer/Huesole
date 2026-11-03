import { useMemo } from "react";
import { useFavorites } from "@/features/gradients/hooks/useFavorites";
import { useDislikes } from "@/features/gradients/hooks/useDislikes";
import { useGradients } from "@/features/gradients/hooks/useGradients";
import GradientCard from "@/features/gradients/components/GradientCard";
import { Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/PageTitle";

const FavoritesPage = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const { dislikes, toggleDislike } = useDislikes();
  const { gradients } = useGradients();

  const favoriteGradients = useMemo(() => {
    return gradients.filter((gradient) => gradient.name && favorites.includes(gradient.name));
  }, [gradients, favorites]);

  return (
    <div className="container min-h-screen bg-background py-6">
      <PageTitle title="Favorites — Huesole" />
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-1 pt-4">
          <h1 className="text-2xl font-bold tracking-tight">Favorites</h1>
          <p className="text-sm text-muted-foreground">
            Saved in this browser. No account required.
          </p>
        </div>

        {favoriteGradients.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteGradients.map((gradient) => (
              <div key={gradient.name}>
                <GradientCard
                  gradient={gradient as never}
                  isFavorite={true}
                  onFavoriteToggle={toggleFavorite}
                  isDisliked={dislikes.includes(gradient.name || "")}
                  onDislikeToggle={toggleDislike}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card className="mx-auto flex w-max flex-col items-center justify-center space-y-4 rounded-2xl border-2 border-dashed border-[#262626] bg-[#171717] p-10 text-center">
            <Heart className="text-[#a1a1a1]" size={64} />
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
