import { Button } from "@/shared/ui/button";
import { HeroFeatures } from "./HeroFeatures";
import { HeroHeader } from "./HeroHeader";
import Link from "next/link"; // Add this import for Next.js
// OR for React Router: import { Link } from "react-router-dom";

export const HeroSection: React.FC = () => (
  <header className="relative flex h-[60vh] w-full items-center justify-center overflow-hidden">
    {/* Background video */}
    <video
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source src="https://cdn.skiper-ui.com/loopbg.mp4" type="video/mp4" />
    </video>

    {/* Optional overlay for readability */}
    <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

    {/* Foreground content */}
    <div className="container relative z-10 mx-auto max-w-6xl space-y-2 pb-6 pt-[40px]">
      <HeroHeader />
      <HeroFeatures />
      <div className="flex w-full items-center justify-center pb-6">
        <Link href="/ai-generator">
          <Button
            className="border-none mt-4"


          >
            Generate with AI
          </Button>
        </Link>
      </div>
    </div>
  </header>
);
