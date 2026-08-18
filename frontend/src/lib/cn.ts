/**
 * Join class names, dropping falsy values.
 *
 * Deliberately not clsx + tailwind-merge: nothing in this app conditionally overrides the
 * same Tailwind property twice, so the merge step would be dependency weight for no benefit.
 */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
