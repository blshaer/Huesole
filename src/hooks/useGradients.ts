import { useState, useEffect } from "react";
import gradientsData from "@/data/gradients.json";

// --- Types ---
interface Gradient {
  name?: string;
  colors?: string[];
  colorsname?: string[];
  keywords?: string[][];
}

interface UseGradientsReturn {
  gradients: Gradient[];
  isLoading: boolean;
  error: string | null;
}

export function useGradients(): UseGradientsReturn {
  const [gradients, setGradients] = useState<Gradient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGradients = () => {
      setIsLoading(true);
      setError(null);
      try {
        // Use the imported local data
        setGradients(gradientsData as Gradient[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load gradients");
      } finally {
        setIsLoading(false);
      }
    };
    loadGradients();
  }, []);

  return { gradients, isLoading, error };
}

export type { Gradient };