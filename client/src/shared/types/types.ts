export interface GradientCardProps {
  gradient: Gradient;
  isFavorite: boolean;
  onFavoriteToggle: (name: string) => void;
  editable?: boolean;
  onColorsChange?: (newColors: string[]) => void;
  onEditClick?: (gradient: Gradient) => void;
  onDeleteClick?: (gradient: Gradient & { id: string }) => void;
  globalGradientType?: "background" | "text";
  globalGradientShape?: "linear" | "radial" | "conic" | "auto";
  isDisliked?: boolean;
  onDislikeToggle?: (name: string) => void;
  isSelected?: boolean;
  onSelectToggle?: (name: string) => void;
}

export interface Gradient {
  id?: string;
  name: string;
  colors: string[];
  angle?: number;
  type?: string;
  rawCss?: string;
  isAnimated?: boolean;
  animationSpeed?: number;
  colorsname?: string[];
  keywords?: string[][];
  exposure?: number;
  contrast?: number;
  frequency?: number;
  phase?: number;
  steps?: number | null;
  baseColors?: string[];
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
