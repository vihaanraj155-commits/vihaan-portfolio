import { Reveal, Section, SectionHeading } from "@/components/ui/primitives";
import type { Profile } from "@/lib/types";

export function About({ profile }: { profile: Profile }) {
  return (
    <Section id="about" labelledBy="about-heading">
      <SectionHeading id="about-heading" eyebrow="About" title="A little more context" />

      <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/*
          Spacing lives on this container, not on the paragraphs. Each <p> is the only child
          of its own Reveal wrapper, so a `last:mb-0` utility would match every paragraph and
          collapse the gaps entirely.
        */}
        <div className="space-y-6 lg:col-span-7">
          {profile.bio_long.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 32)} delay={index * 70}>
              <p className="max-w-[68ch] text-[1.0625rem] leading-[1.7] text-muted">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        <aside className="lg:col-span-5">
          <Reveal delay={80}>
            {/*
              Portrait slot. Drop an image at public/portrait.jpg and it renders; until then
              this monogram placeholder holds the composition rather than collapsing it.
            */}
            <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-hairline bg-surface-2">
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <span className="text-[5rem] font-semibold tracking-tight text-fade opacity-40">
                  {profile.initials}
                </span>
              </div>
              <img
                src="/portrait.jpg"
                alt={`Portrait of ${profile.name}`}
                loading="lazy"
                className="relative h-full w-full object-cover"
                onError={(event) => {
                  // No portrait supplied yet: hide the broken image and let the monogram show.
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
          </Reveal>

          <Reveal delay={160}>
            <dl className="mt-6 rounded-3xl border border-hairline bg-surface p-7">
              {profile.quick_facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex flex-col gap-1 border-b border-hairline py-4 first:pt-0 last:border-0 last:pb-0 sm:flex-row sm:justify-between sm:gap-6"
                >
                  <dt className="text-caption text-fade">{fact.label}</dt>
                  <dd className="text-[0.9375rem] text-ink sm:text-right">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </aside>
      </div>
    </Section>
  );
}
