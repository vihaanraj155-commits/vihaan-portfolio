import { ArrowUpRight } from "lucide-react";

import { Reveal, Section, SectionHeading } from "@/components/ui/primitives";
import type { WritingItem } from "@/lib/types";

/**
 * Renders nothing until the backend's WRITING list has entries, so the section can be wired
 * now and switched on later by editing content.py alone.
 */
export function Writing({ items }: { items: WritingItem[] }) {
  if (items.length === 0) return null;

  return (
    <Section id="writing" labelledBy="writing-heading">
      <SectionHeading id="writing-heading" eyebrow="Writing" title="Notes and essays" />

      <ul className="mt-14">
        {items.map((item, index) => (
          <Reveal key={item.url} delay={index * 70} as="li">
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex flex-col gap-2 border-t border-hairline py-8 transition-colors hover:border-hairline-strong sm:flex-row sm:items-baseline sm:gap-8"
            >
              <span className="w-32 shrink-0 text-[0.875rem] text-fade">{item.date}</span>
              <span className="flex-1">
                <span className="flex items-center gap-2 text-h3 text-ink">
                  {item.title}
                  <ArrowUpRight
                    size={18}
                    aria-hidden
                    className="text-fade transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </span>
                <span className="mt-2 block max-w-[52rem] text-[0.9375rem] text-muted">
                  {item.summary}
                </span>
              </span>
            </a>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
