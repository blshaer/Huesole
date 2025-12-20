import { HeroFeatures } from "./HeroFeatures";
import { HeroHeader } from "./HeroHeader";

export const HeroSection: React.FC = () => (
  <header className="relative pb-6 mx-auto max-w-6xl space-y-2 pt-[20px]">
    <HeroHeader />
    <HeroFeatures />
    {/* <div className="flex w-full items-center justify-center pb-6">
      <HeroUsers />
    </div> */}
  </header>
);
