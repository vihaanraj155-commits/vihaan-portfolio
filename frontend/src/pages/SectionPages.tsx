import type { ReactNode } from "react";

import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Education } from "@/components/sections/Education";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { Writing } from "@/components/sections/Writing";
import { PageSkeleton } from "@/components/ui/primitives";
import { useDocumentTitle } from "@/lib/use-document-title";
import { useSite } from "@/lib/site-context";
import type { SiteContent } from "@/lib/types";

/**
 * Each nav item is its own route rather than a stop on one long scroll. This wrapper gives
 * them all the same loading state and tab title, so a page only says which sections it shows.
 */
function SectionPage({
  title,
  render,
}: {
  title: string;
  render: (content: SiteContent) => ReactNode;
}) {
  const { content, status } = useSite();
  useDocumentTitle(title);

  if (status === "loading" || !content) {
    return <PageSkeleton />;
  }

  return <>{render(content)}</>;
}

export function WorkPage() {
  return <SectionPage title="Work" render={(c) => <Work projects={c.projects} />} />;
}

export function ExperiencePage() {
  return <SectionPage title="Experience" render={(c) => <Experience items={c.experience} />} />;
}

export function EducationPage() {
  return <SectionPage title="Education" render={(c) => <Education items={c.education} />} />;
}

export function SkillsPage() {
  return <SectionPage title="Capabilities" render={(c) => <Skills groups={c.skills} />} />;
}

export function AboutPage() {
  return (
    <SectionPage
      title="About"
      render={(c) => (
        <>
          <About profile={c.profile} />
          <Writing items={c.writing} />
        </>
      )}
    />
  );
}

export function ContactPage() {
  return <SectionPage title="Contact" render={(c) => <Contact profile={c.profile} />} />;
}
