import { useState, useEffect } from "react";
import axios from "@/shared/lib/axios";
import localGradients from "@/shared/lib/gradients.json";

// --- Types ---
interface Gradient {
  _id?: string;
  name?: string;
  colors: string[];
  type?: string;
  angle?: number;
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
    const fetchGradients = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Attempt to fetch from API
        const response = await axios.get<{ success: boolean; data: Gradient[] }>("/home-gradients");
        
        // Use API data if available, otherwise fallback to local JSON
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          setGradients(response.data.data);
        } else {
          setGradients(localGradients as Gradient[]);
        }
      } catch (err: any) {
        console.warn("API gradients fetch failed, using local fallback:", err.message);
        // Fallback to local gradients if API fails (useful for local development or fresh DBs)
        setGradients(localGradients as Gradient[]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGradients();
  }, []);

  return { gradients, isLoading, error };
}

export type { Gradient };
