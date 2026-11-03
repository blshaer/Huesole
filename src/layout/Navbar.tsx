import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Github } from "lucide-react";
import { toastColorCopied, toastProblem } from "@/components/Toaster";
import { cn } from "@/lib/utils";
import { NavbarLogo } from "./NavbarLogo";
import { NavbarColorPicker } from "./NavbarColorPicker";

export const Navbar = () => {
  const location = useLocation();
  const [isEyeDropperSupported, setIsEyeDropperSupported] = useState(false);

  useEffect(() => {
    setIsEyeDropperSupported("EyeDropper" in window);
  }, []);

  const handleColorPick = async () => {
    if (!("EyeDropper" in window)) {
      toastProblem("Color picker isn't available in this browser.");
      return;
    }

    try {
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();

      if (result?.sRGBHex) {
        const hex = result.sRGBHex.toUpperCase();
        try {
          await navigator.clipboard.writeText(hex);
        } catch {
          toastProblem("Couldn't copy that color.");
          return;
        }
        toastColorCopied(hex);
      }
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toastProblem("Couldn't pick a color.");
    }
  };

  const linkClass = (active: boolean) =>
    cn(
      "inline-flex h-9 items-center rounded-full px-3.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#525252]",
      active
        ? "bg-[#171717] text-[#fafafa]"
        : "text-[#a1a1a1] hover:bg-[#171717] hover:text-[#fafafa]",
    );

  return (
    <header className="disable-animation-on-theme-change sticky top-0 z-[100] border-b border-[#262626] bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <NavbarLogo />
          <nav className="flex items-center gap-1" aria-label="Primary navigation">
            <Link
              to="/"
              aria-current={location.pathname === "/" ? "page" : undefined}
              className={linkClass(location.pathname === "/")}
            >
              Explore
            </Link>
            <Link
              to="/favorites"
              aria-current={location.pathname === "/favorites" ? "page" : undefined}
              className={linkClass(location.pathname === "/favorites")}
            >
              Favorites
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <a
            href="https://github.com/blshaer/Huesole"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#a1a1a1] hover:bg-[#171717] hover:text-[#fafafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#525252]"
            aria-label="GitHub"
            title="View source on GitHub"
          >
            <Github size={18} />
          </a>
          <NavbarColorPicker
            isEyeDropperSupported={isEyeDropperSupported}
            onPickColor={handleColorPick}
          />
        </div>
      </div>
    </header>
  );
};
