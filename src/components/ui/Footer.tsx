import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-border px-5 py-8 md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center text-xs uppercase tracking-[0.16em] text-muted sm:flex-row sm:text-left">
        <p>© {year} Syed Abbas</p>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-end">
          <a
            href="https://www.instagram.com/beingsyedabbas_7/"
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target inline-flex items-center text-muted transition hover:text-accent"
          >
            @beingsyedabbas_7
          </a>
          <Link
            href="/privacy"
            className="tap-target inline-flex items-center text-muted transition hover:text-accent"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
