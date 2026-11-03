import localGradients from "@/lib/gradients.json";

interface Gradient {
  _id?: string;
  name?: string;
  colors: string[];
  type?: string;
  angle?: number;
  colorsname?: string[];
  keywords?: (string | string[])[];
}

interface UseGradientsReturn {
  gradients: Gradient[];
  isLoading: boolean;
  error: string | null;
}

export function useGradients(): UseGradientsReturn {
  return {
    gradients: localGradients as Gradient[],
    isLoading: false,
    error: null,
  };
}

export type { Gradient };
