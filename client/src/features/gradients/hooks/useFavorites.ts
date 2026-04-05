import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toggleFavorite as toggleFavoriteService } from "@/features/auth/services/authService";

export function useFavorites() {
  const { user, updateFavorites } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<string[]>([]);

  // Sync local state with AuthContext user favorites
  useEffect(() => {
    if (user) {
      setFavorites(user.favorites || []);
    } else {
      // If not logged in, we can optionally load from localStorage if we want to allow guest favorites
      // but the user specifically asked to ask for login.
      const stored = localStorage.getItem("gradientFavorites");
      if (stored) setFavorites(JSON.parse(stored));
    }
  }, [user]);

  const toggleFavorite = async (name: string) => {
    if (!user) {
      // Redirect to login if user tries to favorite while not authenticated
      navigate("/login");
      return;
    }

    // Optimistic update
    const previousFavorites = [...favorites];
    const isFavorited = favorites.includes(name);
    const newFavorites = isFavorited
      ? favorites.filter((f) => f !== name)
      : [...favorites, name];

    // Apply immediately
    setFavorites(newFavorites);
    updateFavorites(newFavorites);

    try {
      const data = await toggleFavoriteService(name);
      if (!data.success) {
        // Rollback if the service explicitly returns success: false
        setFavorites(previousFavorites);
        updateFavorites(previousFavorites);
      } else {
        // Final sync with server data
        setFavorites(data.favorites);
        updateFavorites(data.favorites);
      }
    } catch (error) {
      console.error("Failed to toggle favorite", error);
      // Rollback on network error or exception
      setFavorites(previousFavorites);
      updateFavorites(previousFavorites);
    }
  };

  return { favorites, toggleFavorite };
}
