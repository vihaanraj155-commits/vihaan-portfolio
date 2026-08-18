import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";
import { ProjectDetail } from "@/pages/ProjectDetail";
import { SiteProvider } from "@/lib/site-context";

/**
 * Scroll to the top on navigation, but never when the URL carries a hash -- that case is a
 * jump to a section and Home handles it once content is available.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <SiteProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-contrast"
      >
        Skip to content
      </a>

      <ScrollToTop />
      <Header />

      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </SiteProvider>
  );
}
