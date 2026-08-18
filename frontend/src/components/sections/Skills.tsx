import { Reveal, Section, SectionHeading } from "@/components/ui/primitives";
import type { SkillGroup } from "@/lib/types";

export function Skills({ groups }: { groups: SkillGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <Section id="skills" labelledBy="skills-heading">
      <SectionHeading
        id="skills-heading"
        eyebrow="Capabilities"
        title="What I work with"
        description="Tools are means, not identity — but these are the ones I reach for without thinking."
      />

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {groups.map((group, index) => (
          <Reveal
            key={group.title}
            delay={index * 70}
            className="rounded-3xl border border-hairline bg-surface p-7 md:p-8"
          >
            <h3 className="text-h3 text-ink">{group.title}</h3>
            <p className="mt-1.5 text-[0.875rem] text-fade">{group.caption}</p>

            <ul className="mt-6 space-y-3">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 border-b border-hairline pb-3 text-[0.9375rem] text-muted last:border-0 last:pb-0"
                >
                  <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
