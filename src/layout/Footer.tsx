import { Link } from "react-router-dom";

const linkClass = "text-xs text-[#a1a1a1] hover:text-[#fafafa]";

export default function Footer() {
  return (
    <div className="container">
      <footer className="mx-auto flex flex-col items-center gap-4 border-t border-[#262626] py-6 sm:flex-row sm:justify-between">
        <Link to="/" className="text-sm font-semibold text-[#fafafa]">
          Huesole
        </Link>
        <nav className="flex items-center gap-5" aria-label="Footer">
          <Link to="/privacy" className={linkClass}>
            Privacy
          </Link>
          <Link to="/terms" className={linkClass}>
            Terms
          </Link>
          <a
            href="https://github.com/blshaer/Huesole"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            GitHub
          </a>
        </nav>
      </footer>
    </div>
  );
}
