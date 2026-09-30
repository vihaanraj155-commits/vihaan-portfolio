import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { cn } from "@/lib/cn";
import { useSite } from "@/lib/site-context";
import { useTheme } from "@/lib/use-theme";

interface NavItem {
  label: string;
  to: string;
}

// Each item is its own page, so the nav behaves like tabs rather than jump links.
const NAV: NavItem[] = [
  { label: "Work", to: "/work" },
  { label: "Experience", to: "/experience" },
  { label: "Education", to: "/education" },
  { label: "Capabilities", to: "/skills" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

/** Project detail pages live under Work, so they keep that tab lit. */
function isActive(item: NavItem, pathname: string): boolean {
  if (item.to === "/work" && pathname.startsWith("/projects/")) return true;
  return pathname === item.to;
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      className="grid h-9 w-9 place-items-center rounded-full border border-hairline text-muted transition-colors duration-200 hover:border-hairline-strong hover:text-ink"
    >
      {isDark ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
    </button>
  );
}

export function Header() {
  const { content } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the sheet on route change so a nav click never leaves it hanging open.
  useEffect(() => setMenuOpen(false), [location.pathname, location.hash]);

  // Lock body scroll and wire Escape only while the sheet is open.
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const initials = content?.profile.initials ?? "VR";
  const name = content?.profile.name ?? "Vihaan Rajagopal";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-14 backdrop-blur-xl transition-all duration-300",
        "bg-canvas/72",
        scrolled ? "border-b border-hairline" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-full w-full max-w-[1120px] items-center justify-between px-6 sm:px-8">
        <Link
          to="/"
          className="text-[0.9375rem] font-semibold tracking-tight text-ink"
          aria-label={`${name} — home`}
        >
          {initials}
          <span className="text-accent">.</span>
        </Link>

        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {NAV.map((item) => {
              const active = isActive(item, location.pathname);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative text-[0.875rem] transition-colors duration-200",
                      active ? "text-ink" : "text-muted hover:text-ink",
                    )}
                  >
                    {item.label}
                    {active ? (
                      <span
                        aria-hidden
                        className="absolute inset-x-0 -bottom-1.5 h-0.5 rounded-full bg-accent"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full border border-hairline text-muted transition-colors hover:text-ink md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={16} aria-hidden /> : <Menu size={16} aria-hidden />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 top-14 z-40 bg-canvas md:hidden">
          <nav aria-label="Sections" className="px-6 pt-6">
            <ul className="flex flex-col">
              {NAV.map((item, index) => {
                const active = isActive(item, location.pathname);
                return (
                  <li
                    key={item.to}
                    className="reveal-shown border-b border-hairline"
                    style={{ transitionDelay: `${index * 45}ms` }}
                  >
                    <Link
                      to={item.to}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "block py-5 text-2xl font-semibold tracking-tight",
                        active ? "text-accent" : "text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
