// src/shared/layout/Navbar/NavbarColorPicker.tsx

import { Pipette } from "lucide-react";

interface NavbarColorPickerProps {
  isEyeDropperSupported: boolean;
  onPickColor: () => void;
}

export const NavbarColorPicker = ({
  isEyeDropperSupported,
  onPickColor,
}: NavbarColorPickerProps) => {
  return (
    <div className="hidden sm:block">
      <button
        type="button"
        onClick={onPickColor}
        disabled={!isEyeDropperSupported}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#a1a1a1] hover:bg-[#171717] hover:text-[#fafafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#525252] disabled:opacity-50"
        aria-label="Pick color from screen"
        title={
          isEyeDropperSupported
            ? "Pick a color from the screen and copy it"
            : "Not supported in this browser"
        }
      >
        <Pipette size={18} />
      </button>
    </div>
  );
};
