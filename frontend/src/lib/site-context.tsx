import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { fetchSite, type SiteSource } from "@/lib/api";
import type { SiteContent } from "@/lib/types";

type Status = "loading" | "ready";

interface SiteState {
  content: SiteContent | null;
  status: Status;
  /** Whether the rendered content came from the API or the bundled snapshot. */
  source: SiteSource | null;
}

const SiteContext = createContext<SiteState>({
  content: null,
  status: "loading",
  source: null,
});

/**
 * Loads the whole site once and shares it.
 *
 * There is intentionally no error state: `fetchSite` resolves to the bundled snapshot when
 * the API is unreachable, so consumers only ever deal with loading or ready.
 */
export function SiteProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SiteState>({
    content: null,
    status: "loading",
    source: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetchSite().then(({ content, source }) => {
      if (cancelled) return;
      setState({ content, status: "ready", source });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return <SiteContext.Provider value={state}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteState {
  return useContext(SiteContext);
}
