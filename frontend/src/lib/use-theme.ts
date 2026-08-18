import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function readCurrentTheme(): Theme {
  // The inline script in index.html has already resolved this before first paint, so reading
  // the attribute keeps React in sync with what the user is actually looking at.
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "dark" ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readCurrentTheme);

  const apply = useCallback((next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing or blocked storage; the theme still applies for this session.
    }
    setTheme(next);
  }, []);

  const toggle = useCallback(() => {
    apply(readCurrentTheme() === "dark" ? "light" : "dark");
  }, [apply]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    // Follow the OS only while the visitor has not made an explicit choice.
    const onChange = (event: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(STORAGE_KEY);
      } catch {
        stored = null;
      }
      if (stored === "light" || stored === "dark") return;
      const next: Theme = event.matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      setTheme(next);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return { theme, toggle, setTheme: apply };
}
