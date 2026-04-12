import { Link } from "react-router-dom";
import RichPopover from "@/components/smoothui/components/rich-popover";


export default function Footer() {
  return (
    <div className="container pt-8 max-md:pt-0">
      <div
        className="h-[1px] w-full opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--muted-foreground) 0%, var(--muted-foreground) 2px, transparent 2px, transparent 12px)",
          backgroundSize: "6px 1px",
        }}
      ></div>

      <footer className="mx-auto flex flex-col items-center justify-between gap-6 py-10 md:flex-row md:h-20 md:py-0">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">


          <nav className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
            <Link to="/contact" className="hover:text-white text-white/50 transition-colors" onClick={() => window.scrollTo({ top: 80, behavior: "smooth" })}>Contact</Link>
            <Link to="/privacy" className="hover:text-white text-white/50   transition-colors" onClick={() => window.scrollTo({ top: 80, behavior: "smooth" })}>Privacy</Link>
            <Link to="/terms" className="hover:text-white text-white/50  transition-colors" onClick={() => window.scrollTo({ top: 80, behavior: "smooth" })}>Terms</Link>

            <span className="text-white/10 mx-1 select-none max-md:hidden">|</span>

            <RichPopover
              title="Baraa Alshaer"
              description="Click to explore portfolio."
              side="top"
              align="end"
              trigger={
                <a
                  href="https://blshaer.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group max-md:hidden hover:text-white text-white/50 transition-colors flex items-center gap-2 normal-case font-medium"
                >
                  <svg
                    viewBox="0 0 88.8 111.53"
                    className="w-4 h-4 transition-colors text-white/20 group-hover:text-[#ff6333]"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="Layer_2" data-name="Layer 2">
                      <g id="Layer_1-2" data-name="Layer 1">
                        <path fill="currentColor" d="M62.72,72.59l17.89.43c.62.01,1.16-.45,1.22-1.07l6.96-63.24c.15-1.39-1.8-1.88-2.31-.57l-24.85,62.81c-.31.78.25,1.62,1.09,1.64Z" />
                        <path fill="currentColor" d="M77.13.11L18.77,25.43c-.57.25-.86.89-.66,1.49l5.69,16.97c.27.79,1.24,1.08,1.89.56L78.36,2.15c1.09-.88.05-2.6-1.23-2.04Z" />
                        <path fill="currentColor" d="M59.58,74.72l-43.16,34.66c-1.16.94.08,2.73,1.37,1.97l61.43-36.44-1.98-.05-16.87-.4c-.28,0-.56.09-.78.26Z" />
                        <path fill="currentColor" d="M56.81,74.48c.62-.49.6-1.44-.04-1.91l-15.6-11.5-15.6-11.51c-.64-.47-1.54-.21-1.83.53L3.32,101.67c-.29.73-.05,1.56.58,2.03l7.54,5.56c.63.47,1.5.45,2.11-.04,7.57-6.08,39.55-31.75,43.25-34.73Z" />
                        <path fill="currentColor" d="M22.72,46.69l-4.67-13.91c-.38-1.14-2.03-1.07-2.31.1L.04,98.26c-.35,1.45,1.74,2.11,2.29.72l11.1-28.06,9.26-23.41c.1-.26.11-.56.02-.83Z" />
                        <path fill="currentColor" d="M85.49,5.42l-25.75,65.09c-.29.73-1.19,1-1.83.53-7.77-5.74-23.43-17.27-31.21-23.01-3.82-1.44,48.07-39.6,54.59-45.62.39-.36.97-.38,1.39-.07l2.43,1.79c.4.3.56.83.37,1.29Z" />
                      </g>
                    </g>
                  </svg>
                  Developer
                </a>
              }
            />
          </nav>
        </div>

        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
          &copy; {new Date().getFullYear()} LumeGradients.

        </p>
      </footer>
    </div>
  );
}
