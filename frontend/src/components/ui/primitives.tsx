import { Link } from "react-router-dom";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { useReveal } from "@/lib/use-reveal";
import type { Accent } from "@/lib/types";

/* ---------------------------------------------------------------------------------------
   Layout
   --------------------------------------------------------------------------------------- */

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1120px] px-6 sm:px-8", className)}>{children}</div>
  );
}

export function Section({
  id,
  children,
  className,
  bordered = true,
  labelledBy,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  bordered?: boolean;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "py-24 md:py-36",
        bordered && "border-t border-hairline",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}

/* ---------------------------------------------------------------------------------------
   Reveal
   --------------------------------------------------------------------------------------- */

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>({ delay });

  return (
    <Tag ref={ref} className={cn(visible ? "reveal-shown" : "reveal-hidden", className)}>
      {children}
    </Tag>
  );
}

/* ---------------------------------------------------------------------------------------
   Headings
   --------------------------------------------------------------------------------------- */

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal className="max-w-[46rem]">
      <p className="text-caption text-accent">{eyebrow}</p>
      <h2 id={id} className="text-h2 mt-4 text-ink">
        {title}
      </h2>
      {description ? <p className="text-lead mt-5 text-muted">{description}</p> : null}
    </Reveal>
  );
}

/* ---------------------------------------------------------------------------------------
   Controls
   --------------------------------------------------------------------------------------- */

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-[0.9375rem] " +
  "font-medium transition-all duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none " +
  "disabled:opacity-50";

const buttonVariants = {
  primary: "bg-accent text-accent-contrast hover:bg-accent-hi hover:-translate-y-px shadow-card",
  secondary:
    "bg-surface-2 text-ink border border-hairline hover:border-hairline-strong hover:-translate-y-px",
  ghost: "text-ink hover:bg-surface-2",
} as const;

type ButtonVariant = keyof typeof buttonVariants;

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentPropsWithoutRef<"button"> & { variant?: ButtonVariant }) {
  return <button className={cn(buttonBase, buttonVariants[variant], className)} {...props} />;
}

export function LinkButton({
  variant = "primary",
  className,
  href,
  internal = false,
  ...props
}: ComponentPropsWithoutRef<"a"> & {
  variant?: ButtonVariant;
  href: string;
  internal?: boolean;
}) {
  const classes = cn(buttonBase, buttonVariants[variant], className);

  if (internal) {
    return <Link to={href} className={classes} {...(props as Record<string, unknown>)} />;
  }
  return <a href={href} className={classes} {...props} />;
}

/* ---------------------------------------------------------------------------------------
   Chips
   --------------------------------------------------------------------------------------- */

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-hairline bg-surface-2 px-3 py-1 text-[0.8125rem] font-medium text-muted">
      {children}
    </span>
  );
}

const accentText: Record<Accent, string> = {
  blue: "text-tint-blue",
  violet: "text-tint-violet",
  teal: "text-tint-teal",
  amber: "text-tint-amber",
};

export function accentTextClass(accent: Accent): string {
  return accentText[accent];
}

/* ---------------------------------------------------------------------------------------
   Loading
   --------------------------------------------------------------------------------------- */

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-xl bg-surface-2", className)}
    />
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 pt-40 sm:px-8" aria-busy="true">
      <span className="sr-only">Loading content</span>
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-8 h-16 w-full max-w-[38rem]" />
      <Skeleton className="mt-4 h-16 w-full max-w-[30rem]" />
      <Skeleton className="mt-10 h-5 w-full max-w-[34rem]" />
      <Skeleton className="mt-3 h-5 w-full max-w-[28rem]" />
      <div className="mt-12 flex gap-3">
        <Skeleton className="h-12 w-36" />
        <Skeleton className="h-12 w-36" />
      </div>
    </div>
  );
}
