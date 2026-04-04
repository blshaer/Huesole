import { HeroFeatures } from "./HeroFeatures";
import { HeroHeader } from "./HeroHeader";

export const HeroSection: React.FC = () => (
  <header className="relative flex min-h-[40vh] w-full items-center justify-center overflow-hidden bg-background py-10">
    {/* Foreground content */}
    <div className="container relative z-10 mx-auto max-w-6xl space-y-4 pb-4 pt-4">
      <HeroHeader />
      <HeroFeatures />
    </div>
  </header>
);
