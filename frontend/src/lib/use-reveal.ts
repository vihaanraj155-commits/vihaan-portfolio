import { useEffect, useRef, useState } from "react";

/**
 * True when the visitor has asked for reduced motion.
 *
 * Read eagerly rather than in an effect: reveal components need the answer on their very
 * first render so reduced-motion users never see the hidden state at all.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface RevealOptions {
  /** Delay in milliseconds before the element transitions in. Used for stagger. */
  delay?: number;
  /** How far into the viewport the element must travel before it fires. */
  rootMargin?: string;
}

/**
 * Reveal an element once as it scrolls into view.
 *
 * The reduced-motion check short-circuits to `visible: true` on the first render, which is
 * stronger than merely shortening the CSS transition -- there is no animation to skip.
 */
export function useReveal<T extends HTMLElement>({
  delay = 0,
  rootMargin = "0px 0px -12% 0px",
}: RevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const reduced = prefersReducedMotion();
  const [visible, setVisible] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    // Elements already in view on load (the hero) should not wait for a scroll event.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const timer = window.setTimeout(() => setVisible(true), delay);
          observer.disconnect();
          return () => window.clearTimeout(timer);
        }
      },
      { rootMargin, threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delay, reduced, rootMargin]);

  return { ref, visible };
}
