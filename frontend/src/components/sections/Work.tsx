import { ArrowUpRight, Users } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Chip,
  Reveal,
  Section,
  SectionHeading,
  accentTextClass,
} from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import type { Project } from "@/lib/types";

/**
 * Column span for a card at position `index`.
 *
 * The first row is deliberately asymmetric (7 + 5) so the featured project reads as the lead;
 * every later row is an even 6 + 6. Giving all non-featured cards the same span would leave a
 * ragged two-column hole at the end of row two.
 */
function spanFor(index: number): string {
  if (index === 0) return "md:col-span-12 lg:col-span-7";
  if (index === 1) return "md:col-span-6 lg:col-span-5";
  return "md:col-span-6 lg:col-span-6";
}

function ProjectCard({
  project,
  featured,
  index,
  delay,
}: {
  project: Project;
  featured: boolean;
  index: number;
  delay: number;
}) {
  return (
    <Reveal delay={delay} className={cn(spanFor(index))}>
      <Link
        to={`/projects/${project.slug}`}
        className="group flex h-full flex-col rounded-3xl border border-hairline bg-surface p-7 transition-all duration-300 ease-out hover:-translate-y-[3px] hover:border-hairline-strong hover:shadow-lift md:p-9"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={cn("text-caption", accentTextClass(project.accent))}>
              {project.subtitle}
            </p>
            <h3 className={cn("mt-3 font-semibold tracking-tight text-ink", featured ? "text-[1.75rem] leading-tight" : "text-h3")}>
              {project.title}
            </h3>
          </div>
          <ArrowUpRight
            size={20}
            aria-hidden
            className="shrink-0 text-fade transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
          />
        </div>

        <p className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-muted">
          {project.summary}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.slice(0, featured ? 6 : 4).map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-hairline pt-5 text-[0.8125rem] text-fade">
          <span>{project.year}</span>
          <span aria-hidden>·</span>
          <span>{project.role}</span>
          {project.context ? (
            <span className="flex items-center gap-1.5">
              <span aria-hidden>·</span>
              <Users size={12} aria-hidden />
              Collaborative
            </span>
          ) : null}
        </div>
      </Link>
    </Reveal>
  );
}

export function Work({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  // Featured first, so the asymmetric 7/5 grid always leads with the strongest piece.
  const ordered = [...projects].sort(
    (a, b) => Number(b.featured) - Number(a.featured),
  );

  return (
    <Section id="work" labelledBy="work-heading">
      <SectionHeading
        id="work-heading"
        eyebrow="Selected work"
        title="Things I have built"
        description="Systems that had to be correct, not just working — and the interfaces that make them usable."
      />

      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-12">
        {ordered.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            featured={project.featured}
            index={index}
            delay={index * 70}
          />
        ))}
      </div>
    </Section>
  );
}
