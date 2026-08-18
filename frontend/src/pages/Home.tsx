import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Education } from "@/components/sections/Education";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { Writing } from "@/components/sections/Writing";
import { PageSkeleton } from "@/components/ui/primitives";
import { useSite } from "@/lib/site-context";

export function Home() {
  const { content, status } = useSite();
  const location = useLocation();

  // Arriving at "/#work" from a project page: the target only exists after content loads,
  // so the scroll has to wait for it rather than firing on mount.
  useEffect(() => {
    if (status !== "ready" || !location.hash) return;
    const target = document.querySelector(location.hash);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [status, location.hash]);

  if (status === "loading" || !content) {
    return <PageSkeleton />;
  }

  return (
    <>
      <Hero profile={content.profile} />
      <Work projects={content.projects} />
      <Experience items={content.experience} />
      <Education items={content.education} />
      <Skills groups={content.skills} />
      <About profile={content.profile} />
      <Writing items={content.writing} />
      <Contact profile={content.profile} />
    </>
  );
}
