import { useState, useEffect } from "react";
import axios from "axios";


const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5001" : "");

const API_URL = `${BASE_URL}/api`;


// --- Types ---
interface Gradient {
  _id?: string;
  name?: string;
  colors: string[];
  type: string;
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
        const response = await axios.get<{ data: Gradient[] }>(`${API_URL}/home-gradients`);
        setGradients(response.data.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "Failed to load gradients"
        );
        // Fallback or empty state is handled by the UI
      } finally {
        setIsLoading(false);
      }
    };
    fetchGradients();
  }, []);

  return { gradients, isLoading, error };
}

export type { Gradient };
