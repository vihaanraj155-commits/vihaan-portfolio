import { Chip, Reveal, Section, SectionHeading } from "@/components/ui/primitives";
import type { EducationItem } from "@/lib/types";

export function Education({ items }: { items: EducationItem[] }) {
  if (items.length === 0) return null;

  return (
    <Section id="education" labelledBy="education-heading">
      <SectionHeading id="education-heading" eyebrow="Education" title="Where I study" />

      <div className="mt-14 grid grid-cols-1 gap-5">
        {items.map((item, index) => (
          <Reveal
            key={`${item.school}-${item.period}`}
            delay={index * 70}
            className="rounded-3xl border border-hairline bg-surface p-7 md:p-9"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <div>
                <h3 className="text-h3 text-ink">{item.school}</h3>
                <p className="mt-1 text-[0.9375rem] font-medium text-accent">
                  {item.credential}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-[0.875rem] font-medium text-muted">{item.period}</p>
                {item.location ? (
                  <p className="mt-1 text-[0.8125rem] text-fade">{item.location}</p>
                ) : null}
              </div>
            </div>

            {item.facts.length > 0 ? (
              <dl className="mt-7 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-3">
                {item.facts.map((fact) => (
                  <div key={fact.label} className="bg-surface-2 px-5 py-4">
                    <dt className="text-caption text-fade">{fact.label}</dt>
                    <dd className="mt-1.5 text-[1.0625rem] font-semibold tracking-tight text-ink">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {item.coursework.length > 0 ? (
              <div className="mt-7">
                <p className="text-caption text-fade">Relevant coursework</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.coursework.map((course) => (
                    <Chip key={course}>{course}</Chip>
                  ))}
                </div>
              </div>
            ) : null}
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
