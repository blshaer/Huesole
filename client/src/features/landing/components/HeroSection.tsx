import { Button } from "@/shared/ui/button";
import { HeroFeatures } from "./HeroFeatures";
import { HeroHeader } from "./HeroHeader";

import { Link } from "react-router-dom";

export const HeroSection: React.FC = () => (
  <header className="relative flex min-h-[40vh] w-full items-center justify-center overflow-hidden bg-background py-10">
    {/* Foreground content */}
    <div className="container relative z-10 mx-auto max-w-6xl space-y-4 pb-4 pt-4">
      <HeroHeader />
      <HeroFeatures />
      <div className="flex w-full items-center justify-center pb-6">
        <Link to="/ai-generator">
          <Button className="mt-4 rounded-full bg-white px-8 py-6 text-base font-bold text-black transition-all hover:bg-neutral-200 hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            Generate Gradients
          </Button>
        </Link>
      </div>
    </div>
  </header>
);
