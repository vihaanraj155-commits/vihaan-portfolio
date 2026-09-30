import { useEffect } from "react";

const SITE = "Vihaan Rajagopal";

/** Browser-tab title for a route: "Work — Vihaan Rajagopal", or the site title on home. */
export function useDocumentTitle(page?: string) {
  useEffect(() => {
    document.title = page ? `${page} — ${SITE}` : `${SITE} — Student Researcher & Developer`;
  }, [page]);
}
