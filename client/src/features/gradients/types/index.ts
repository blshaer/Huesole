export interface GeneratedGradient {
  name: string;
  colors: string[];
  type: "linear" | "radial" | "conic" | "default";
  angle?: number;
  reasoning?: string;
  // Adjustment parameters
  exposure?: number;
  contrast?: number;
  frequency?: number;
  phase?: number;
  steps?: number | null;
  baseColors?: string[];
}
