import { ArrowLeft, ArrowUpRight, Users } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import {
  Chip,
  Container,
  LinkButton,
  PageSkeleton,
  Reveal,
  accentTextClass,
} from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { useSite } from "@/lib/site-context";

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { content, status } = useSite();

  if (status === "loading" || !content) {
    return <PageSkeleton />;
  }

  // Read from the already-loaded site payload rather than fetching again.
  const project = content.projects.find((item) => item.slug === slug);

  if (!project) {
    return (
      <Container className="pt-40 pb-32 text-center">
        <p className="text-caption text-accent">404</p>
        <h1 className="text-h2 mt-4 text-ink">That project does not exist</h1>
        <p className="mt-4 text-muted">It may have been renamed or removed.</p>
        <div className="mt-10 flex justify-center">
          <LinkButton href="/" internal variant="secondary">
            <ArrowLeft size={16} aria-hidden />
            Back to home
          </LinkButton>
        </div>
      </Container>
    );
  }

  const others = content.projects.filter((item) => item.slug !== project.slug).slice(0, 3);

  return (
    <article className="pt-32 pb-24 md:pt-40">
      <Container>
        <Reveal>
          <Link
            to="/#work"
            className="inline-flex items-center gap-2 text-[0.875rem] text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft size={15} aria-hidden />
            All work
          </Link>
        </Reveal>

        <header className="mt-10 border-b border-hairline pb-12">
          <Reveal delay={60}>
            <p className={cn("text-caption", accentTextClass(project.accent))}>
              {project.subtitle}
            </p>
            <h1 className="text-display mt-4 text-ink">{project.title}</h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="text-lead mt-6 max-w-[46rem] text-muted">{project.summary}</p>
          </Reveal>

          {project.context ? (
            <Reveal delay={150}>
              <p className="mt-6 flex max-w-[46rem] items-start gap-2.5 rounded-2xl border border-hairline bg-surface-2 px-5 py-4 text-[0.875rem] leading-relaxed text-muted">
                <Users size={15} aria-hidden className="mt-1 shrink-0 text-fade" />
                {project.context}
              </p>
            </Reveal>
          ) : null}

          <Reveal delay={180}>
            <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              <div>
                <dt className="text-caption text-fade">Year</dt>
                <dd className="mt-1.5 text-[0.9375rem] text-ink">{project.year}</dd>
              </div>
              <div>
                <dt className="text-caption text-fade">Role</dt>
                <dd className="mt-1.5 text-[0.9375rem] text-ink">{project.role}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-caption text-fade">Stack</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <Chip key={tech}>{tech}</Chip>
                  ))}
                </dd>
              </div>
            </dl>
          </Reveal>

          {project.links.length > 0 ? (
            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap gap-3">
                {project.links.map((link) => (
                  <LinkButton
                    key={link.url}
                    href={link.url}
                    variant="secondary"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {link.label}
                    <ArrowUpRight size={15} aria-hidden />
                  </LinkButton>
                ))}
              </div>
            </Reveal>
          ) : null}
        </header>

        <div className="grid grid-cols-1 gap-12 pt-14 lg:grid-cols-12 lg:gap-16">
          {/* Spacing on the container -- see the note in About.tsx. */}
          <div className="space-y-6 lg:col-span-7">
            {project.body.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 32)} delay={index * 60}>
                <p className="max-w-[68ch] text-[1.0625rem] leading-[1.7] text-muted">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          <aside className="space-y-5 lg:col-span-5">
            {project.contribution.length > 0 ? (
              <Reveal delay={60}>
                {/*
                  Deliberately the first thing in the sidebar and visually the loudest block on
                  the page. On collaborative work, what this person actually did is the single
                  most important thing a reader needs, and burying it would be misleading.
                */}
                <div className="rounded-3xl border border-accent/30 bg-accent-soft p-7 md:p-8">
                  <h2 className="text-h3 text-ink">My contribution</h2>
                  <ul className="mt-6 space-y-4">
                    {project.contribution.map((item) => (
                      <li
                        key={item}
                        className="relative pl-5 text-[0.9375rem] leading-relaxed text-ink"
                      >
                        <span
                          aria-hidden
                          className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-accent"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ) : null}

            <Reveal delay={80}>
              <div className="rounded-3xl border border-hairline bg-surface p-7 md:p-8">
                <h2 className="text-h3 text-ink">
                  {project.context ? "About the system" : "Highlights"}
                </h2>
                <ul className="mt-6 space-y-4">
                  {project.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="relative pl-5 text-[0.9375rem] leading-relaxed text-muted"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full",
                          accentTextClass(project.accent),
                        )}
                        style={{ backgroundColor: "currentColor" }}
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </aside>
        </div>

        {others.length > 0 ? (
          <section aria-labelledby="more-work" className="mt-24 border-t border-hairline pt-14">
            <h2 id="more-work" className="text-caption text-fade">
              More work
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {others.map((other, index) => (
                <Reveal key={other.slug} delay={index * 60}>
                  <Link
                    to={`/projects/${other.slug}`}
                    className="group flex h-full flex-col rounded-3xl border border-hairline bg-surface p-6 transition-all duration-300 hover:-translate-y-[3px] hover:border-hairline-strong hover:shadow-lift"
                  >
                    <p className={cn("text-caption", accentTextClass(other.accent))}>
                      {other.year}
                    </p>
                    <h3 className="mt-2 text-[1.0625rem] font-semibold tracking-tight text-ink">
                      {other.title}
                    </h3>
                    <p className="mt-2 flex-1 text-[0.875rem] text-muted">{other.subtitle}</p>
                    <ArrowUpRight
                      size={17}
                      aria-hidden
                      className="mt-4 text-fade transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    />
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </article>
  );
}
