import { Link } from "react-router-dom";


export default function Footer() {
  return (
    <div className="container pt-8">
      <div
        className="h-[1px] w-full opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--muted-foreground) 0%, var(--muted-foreground) 2px, transparent 2px, transparent 12px)",
          backgroundSize: "6px 1px",
        }}
      ></div>

      <footer className="container mx-auto flex flex-col items-center justify-between gap-6 px-0 py-10 md:flex-row md:h-20 md:py-0">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">


          <nav className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
            <Link to="/contact" className="hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Contact</Link>
            <Link to="/privacy" className="hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Terms</Link>
          </nav>
        </div>

        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">
          &copy; {new Date().getFullYear()} LumeGradients. All rights reserved.

        </p>
      </footer>
    </div>
  );
}
