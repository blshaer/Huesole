import { ExternalLinkIcon } from "lucide-react";

export default function Footer() {
  return (
    <div className="container pt-8">
      <div
        className="h-[1px] w-full opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--muted-foreground) 0%, var(--muted-foreground) 2px, transparent 2px, transparent 12px)",
          backgroundSize: "6px 1px",
        }}
      ></div>

      <footer className="container mx-auto flex h-16 items-center justify-between gap-2 px-0 py-4 max-md:h-auto max-md:flex-col max-md:items-center max-md:justify-center max-md:gap-2 max-md:text-center">
        <p className="flex items-center text-sm text-primary">
          Designed & Developed by{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center ps-1 font-medium text-[var(--link)] hover:text-[var(--link-hover)]"
            href={"https://https://blshaer.gt.tc//"}
          >
            Baraa
            <ExternalLinkIcon className="ms-1 h-3 w-3" />
          </a>
        </p>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} GradlyAI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
