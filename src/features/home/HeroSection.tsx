import { HeroFeatures } from "./HeroFeatures";
import { HeroHeader } from "./HeroHeader";

export const HeroSection: React.FC = () => (
  <header className="relative flex min-h-[30vh] max-md:min-h-0 w-full items-center justify-center overflow-hidden bg-background py-10 max-md:pt-16 max-md:pb-6">
    {/* Foreground content */}
    <div className="container relative z-10 mx-auto max-w-6xl space-y-4 max-md:space-y-3 pb-4 pt-4 max-md:pt-0">
      <HeroHeader />
      <HeroFeatures />
    </div>
  </header>
);
