import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toggleDislike as toggleDislikeService } from "@/features/auth/services/authService";

export function useDislikes() {
  const { user, updateDislikes } = useAuth();
  const navigate = useNavigate();
  const [dislikes, setDislikes] = useState<string[]>([]);

  // Sync local state with AuthContext user dislikes
  useEffect(() => {
    if (user) {
      setDislikes(user.dislikes || []);
    } else {
      const stored = localStorage.getItem("gradientDislikes");
      if (stored) setDislikes(JSON.parse(stored));
    }
  }, [user]);

  const toggleDislike = async (name: string) => {
    if (!user) {
      // Redirect to login if user tries to dislike while not authenticated
      navigate("/login");
      return;
    }

    // Optimistic update
    const previousDislikes = [...dislikes];
    const isDisliked = dislikes.includes(name);
    const newDislikes = isDisliked
      ? dislikes.filter((f) => f !== name)
      : [...dislikes, name];

    // Apply immediately
    setDislikes(newDislikes);
    updateDislikes(newDislikes);

    try {
      const data = await toggleDislikeService(name);
      if (!data.success) {
        // Rollback if the service explicitly returns success: false
        setDislikes(previousDislikes);
        updateDislikes(previousDislikes);
      } else {
        // Final sync with server data
        setDislikes(data.dislikes);
        updateDislikes(data.dislikes);
      }
    } catch (error) {
      console.error("Failed to toggle dislike", error);
      // Rollback on network error or exception
      setDislikes(previousDislikes);
      updateDislikes(previousDislikes);
    }
  };

  return { dislikes, toggleDislike };
}
