import { HeroFeatures } from "./HeroFeatures";
import { HeroHeader } from "./HeroHeader";
import DarkVeil from "./DarkVeil";

export const HeroSection: React.FC = () => (
  <header className="relative w-full  overflow-hidden">
    {/* Full-width, full-height DarkVeil background */}
    <div className="pointer-events-none absolute inset-0 m-auto w-full h-full -z-10">
      <DarkVeil />
    </div>

    {/* Existing content centered in a max-width container */}
    <div className="relative container mx-auto max-w-6xl space-y-2 pb-6 pt-[40px]">
      <HeroHeader />
      <HeroFeatures />
      <div className="flex w-full items-center justify-center pb-6" />
    </div>
  </header>
);
