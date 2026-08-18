import { ArrowDown, ArrowUpRight, Download } from "lucide-react";

import { Container, LinkButton, Reveal } from "@/components/ui/primitives";
import { resumeUrl } from "@/lib/api";
import type { Profile } from "@/lib/types";

export function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="relative overflow-hidden pt-40 pb-24 md:pt-52 md:pb-36">
      {/*
        One soft accent bloom, nothing else. Restraint here is what separates this from the
        animated-gradient look that reads as a template.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[38rem] w-[38rem] rounded-full opacity-60 blur-[120px]"
        style={{ background: "var(--accent-soft)" }}
      />

      <Container className="relative">
        {profile.availability ? (
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-2 px-4 py-1.5 text-[0.8125rem] font-medium text-muted">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              {profile.availability}
            </span>
          </Reveal>
        ) : null}

        <Reveal delay={80}>
          <h1 className="text-display mt-8 text-ink">
            {profile.name}
            <span className="text-accent">.</span>
          </h1>
        </Reveal>

        <Reveal delay={140}>
          <p className="text-lead mt-6 max-w-[44rem] text-muted">{profile.hero_line}</p>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-6 max-w-[38rem] text-muted">{profile.bio_short}</p>
        </Reveal>

        <Reveal delay={260}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <LinkButton href="#work" variant="primary">
              View work
              <ArrowUpRight size={16} aria-hidden />
            </LinkButton>
            <LinkButton href="#contact" variant="secondary">
              Get in touch
            </LinkButton>
            <LinkButton href={resumeUrl} variant="ghost" download>
              <Download size={16} aria-hidden />
              Résumé
            </LinkButton>
          </div>
        </Reveal>

        <Reveal delay={340}>
          <a
            href="#work"
            className="mt-20 hidden items-center gap-2 text-[0.8125rem] text-fade transition-colors hover:text-muted md:inline-flex"
          >
            <ArrowDown size={14} aria-hidden />
            Scroll to explore
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
