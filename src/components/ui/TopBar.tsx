"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

const CONTACT_EMAIL = "abbas.work0007@gmail.com";

export default function TopBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickEmail, setQuickEmail] = useState("");

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleQuickInquiry = useCallback(() => {
    const email = quickEmail.trim();
    if (!email) return;

    const body = `Quick inquiry from portfolio top bar.\n\nReply to: ${email}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      "Portfolio quick inquiry",
    )}&body=${encodeURIComponent(body)}`;
    setQuickEmail("");
  }, [quickEmail]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 px-5 pt-4 md:px-10 lg:px-16">
        <div className="glass mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-2xl px-3 py-2 md:rounded-full md:px-4">
          <Link
            href="/"
            aria-label="Syed Abbas home"
            className="tap-target flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-xs font-medium tracking-[0.12em] text-accent transition hover:border-mint/40"
          >
            SA
          </Link>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleQuickInquiry();
            }}
            className="hidden min-h-11 flex-1 items-center gap-2 rounded-full border border-border bg-surface px-3 md:flex md:max-w-md lg:max-w-lg"
          >
            <input
              type="email"
              value={quickEmail}
              onChange={(e) => setQuickEmail(e.target.value)}
              placeholder="Got an idea for a shoot? Send your e-mail"
              disabled={!quickEmail.trim()}
              className="min-w-0 flex-1 bg-transparent px-2 py-2 text-xs text-accent placeholder:text-muted outline-none"
              aria-label="Your email for quick inquiry"
            />
            <button
              type="submit"
              disabled={!quickEmail.trim()}
              className="tap-target shrink-0 rounded-full bg-accent px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-background transition hover:bg-accent/90 disabled:opacity-50"
            >
              Send
            </button>
          </form>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className="tap-target flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full border border-border bg-surface transition hover:border-mint/35 md:hidden"
          >
            <span
              className={`block h-px w-5 bg-accent transition ${menuOpen ? "translate-y-[5px] rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-accent transition ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-accent transition ${menuOpen ? "-translate-y-[5px] -rotate-45" : ""}`}
            />
          </button>
        </div>

        <nav
          aria-label="Primary"
          className="mx-auto mt-2 hidden max-w-7xl justify-center gap-1 md:flex"
        >
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`tap-target rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition ${
                  active
                    ? "bg-surface text-accent"
                    : "text-muted hover:text-accent"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] md:hidden"
          >
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-background/97 backdrop-blur-md"
              onClick={closeMenu}
            />

            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 flex h-full w-[min(100%,320px)] flex-col border-l border-border bg-background px-6 pb-10 pt-20"
            >
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map(({ href, label }, i) => {
                  const active = pathname === href;
                  return (
                    <motion.li
                      key={href}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.05 }}
                    >
                      <Link
                        href={href}
                        onClick={closeMenu}
                        className={`tap-target flex items-center rounded-xl px-4 py-4 text-sm uppercase tracking-[0.22em] transition ${
                          active
                            ? "bg-surface text-accent"
                            : "text-muted hover:bg-surface hover:text-accent"
                        }`}
                      >
                        {label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-auto border-t border-border pt-6">
                <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-muted">
                  Quick inquiry
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void handleQuickInquiry();
                    closeMenu();
                  }}
                  className="flex flex-col gap-3"
                >
                  <input
                    type="email"
                    value={quickEmail}
                    onChange={(e) => setQuickEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="tap-target w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-accent placeholder:text-muted outline-none focus:border-mint/50"
                    aria-label="Your email for quick inquiry"
                  />
                  <button
                    type="submit"
                    disabled={!quickEmail.trim()}
                    className="tap-target w-full rounded-xl bg-accent py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-background disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
