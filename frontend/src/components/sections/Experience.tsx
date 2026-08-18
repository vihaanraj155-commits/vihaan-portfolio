import { Chip, Reveal, Section, SectionHeading } from "@/components/ui/primitives";
import type { ExperienceItem } from "@/lib/types";

export function Experience({ items }: { items: ExperienceItem[] }) {
  if (items.length === 0) return null;

  return (
    <Section id="experience" labelledBy="experience-heading">
      <SectionHeading
        id="experience-heading"
        eyebrow="Experience"
        title="Where I have worked"
      />

      <ol className="mt-14">
        {items.map((item, index) => (
          <Reveal
            key={`${item.org}-${item.period}`}
            delay={index * 70}
            as="li"
            className="grid grid-cols-1 gap-4 border-t border-hairline py-10 md:grid-cols-12 md:gap-8"
          >
            <div className="md:col-span-3">
              <p className="text-[0.875rem] font-medium text-muted">{item.period}</p>
              {item.location ? (
                <p className="mt-1 text-[0.8125rem] text-fade">{item.location}</p>
              ) : null}
            </div>

            <div className="md:col-span-9">
              <h3 className="text-h3 text-ink">{item.org}</h3>
              <p className="mt-1 text-[0.9375rem] font-medium text-accent">{item.role}</p>
              <p className="mt-4 max-w-[46rem] text-muted">{item.summary}</p>

              <ul className="mt-5 space-y-2.5">
                {item.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="relative max-w-[46rem] pl-5 text-[0.9375rem] leading-relaxed text-muted"
                  >
                    <span
                      aria-hidden
                      className="absolute left-0 top-[0.65em] h-1 w-1 rounded-full bg-fade"
                    />
                    {bullet}
                  </li>
                ))}
              </ul>

              {item.tags.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Chip key={tag}>{tag}</Chip>
                  ))}
                </div>
              ) : null}
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
