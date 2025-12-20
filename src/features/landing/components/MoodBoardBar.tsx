import { MoodBoardThemeKey, MoodBoardThemes } from "@/shared/types/types";

interface MoodBoardBarProps {
  isMoodBoard: boolean;
  currentTheme: MoodBoardThemeKey | null;
  moodBoardThemes: MoodBoardThemes;
  moodBoardGradientsCount: number;
  onViewAll: () => void;
  onThemePick: (theme?: MoodBoardThemeKey) => void;
}

export const MoodBoardBar: React.FC<MoodBoardBarProps> = ({
  isMoodBoard,
  currentTheme,
  moodBoardThemes,
  moodBoardGradientsCount,
  onViewAll,
  onThemePick,
}) => {
  if (!isMoodBoard) return null;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-500"></div>
          <div>
            <h3 className="font-medium text-foreground">
              {currentTheme
                ? moodBoardThemes[currentTheme].name
                : "Mixed Mood Board"}
            </h3>
            <p className="text-foreground/60 text-sm">
              {currentTheme
                ? moodBoardThemes[currentTheme].description
                : `${moodBoardGradientsCount} curated gradients from various themes`}
            </p>
          </div>
        </div>
        <button
          onClick={onViewAll}
          className="hover:text-primary/80 text-primary underline"
        >
          View all gradients
        </button>
      </div>
      {/* Theme selector */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onThemePick()}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
            !currentTheme
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary/80 bg-secondary text-secondary-foreground"
          }`}
        >
          Mixed
        </button>
        {Object.entries(moodBoardThemes).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => onThemePick(key as MoodBoardThemeKey)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              currentTheme === key
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary/80 bg-secondary text-secondary-foreground"
            }`}
          >
            {theme.name}
          </button>
        ))}
      </div>
    </div>
  );
};
