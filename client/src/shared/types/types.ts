export interface GradientCardProps {
  gradient: { name: string; colors: string[] };
  isFavorite: boolean;
  onFavoriteToggle: (name: string) => void;
  editable?: boolean;
  onColorsChange?: (newColors: string[]) => void;
  onEditClick?: (gradient: {
    name: string;
    colors: string[];
    angle?: number;
    type?: string;
    exposure?: number;
    contrast?: number;
    frequency?: number;
    phase?: number;
    steps?: number | null;
  }) => void;
  onDeleteClick?: (gradient: {
    id: string;
    name: string;
    colors: string[];
  }) => void;
  globalGradientType?: "background" | "text" | "image";
  globalGradientShape?: "linear" | "radial" | "conic";
}

export interface Gradient {
  name: string;
  colors: string[];
  angle?: number;
  type?: string;
  isAnimated?: boolean;
  animationSpeed?: number;
  colorsname?: string[];
  keywords?: string[][];
  exposure?: number;
  contrast?: number;
  frequency?: number;
  phase?: number;
  steps?: number | null;
}

export type MoodBoardThemeKey =
  | "sunset"
  | "ocean"
  | "nature"
  | "mystic"
  | "minimal"
  | "vibrant";

export interface MoodBoardTheme {
  name: string;
  description: string;
  colors: string[];
  keywords: string[];
  count: number;
}

export interface MoodBoardThemes {
  [key: string]: MoodBoardTheme;
}
