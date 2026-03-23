import { RetroGrid } from "@/shared/ui/RetroGrid";

export function NotFoundPage() {
  return (
    <div className="relative flex h-[100vh] w-full flex-col items-center justify-center overflow-hidden bg-background">
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="mb-8 h-48 w-48 animate-pulse-slow">
          <img
            src="/assets/not-found-404.png"
            alt="Page not found illustration"
            className="h-full w-full object-contain"
          />
        </div>
        
        <h1 className="text-5xl font-black leading-none tracking-tighter text-white sm:text-8xl">
          404 Not Found
        </h1>
        
        <p className="mt-4 text-lg text-white font-medium">
          Oops! The page you're searching for seems to have vanished into the gradient cosmos.
        </p>

        <a 
          href="/"
          className="mt-8 rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/20"
        >
          Back to Home
        </a>
      </div>

      <RetroGrid />
    </div>
  );
}
