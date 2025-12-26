import { Eye, EyeOff } from "lucide-react";

interface NavbarAngleToggleProps {
  showAngleController: boolean;
  onToggle: () => void;
  isAngleSupported: boolean;
}

export const NavbarAngleToggle = ({
  showAngleController,
  onToggle,
  isAngleSupported,
}: NavbarAngleToggleProps) => {
  if (!isAngleSupported) return null;

  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-center rounded-lg border border-border bg-background/80 p-2 transition-colors hover:bg-background/90 backdrop-blur-xl"
      aria-label={showAngleController ? "Hide angle controller" : "Show angle controller"}
    >
      {showAngleController ? (
        <span className="flex">
          <Eye className="h-5 w-5" />
        </span>
      ) : (
        <span className="flex">
          <EyeOff className="h-5 w-5" />
        </span>
      )}
    </button>
  );
};
