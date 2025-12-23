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
        <div className="hidden origin-center transform-gpu sm:block">
            <button
                onClick={onPickColor}
                disabled={!isEyeDropperSupported}
                className="rounded-[8px] border bg-card p-2 transition-all hover:bg-white/5 disabled:opacity-50 pipette-button"
                aria-label="Pick color from screen"
                title={
                    isEyeDropperSupported
                        ? "Pick color from screen"
                        : "Not supported in this browser"
                }
            >
                <Pipette size={18} className="transition-transform" />
                <span className="sr-only">Pick color from screen</span>
            </button>
        </div>
    );
};
