import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Hero } from "@/components/sections/Hero";
import { PageSkeleton } from "@/components/ui/primitives";
import { useDocumentTitle } from "@/lib/use-document-title";
import { useSite } from "@/lib/site-context";

/**
 * The site used to be one long page with these anchors. Links to them may still be out there,
 * so each one is forwarded to the page that replaced it.
 */
const LEGACY_ANCHORS: Record<string, string> = {
  "#work": "/work",
  "#experience": "/experience",
  "#education": "/education",
  "#skills": "/skills",
  "#about": "/about",
  "#writing": "/about",
  "#contact": "/contact",
};

export function Home() {
  const { content, status } = useSite();
  const location = useLocation();
  const navigate = useNavigate();
  useDocumentTitle();

  useEffect(() => {
    const target = LEGACY_ANCHORS[location.hash];
    if (target) navigate(target, { replace: true });
  }, [location.hash, navigate]);

  if (status === "loading" || !content) {
    return <PageSkeleton />;
  }

  return <Hero profile={content.profile} />;
}
