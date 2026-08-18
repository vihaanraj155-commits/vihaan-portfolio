import { ArrowLeft } from "lucide-react";

import { Container, LinkButton } from "@/components/ui/primitives";

export function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center pt-32 text-center">
      <p className="text-caption text-accent">404</p>
      <h1 className="text-display mt-4 text-ink">Not found</h1>
      <p className="mt-6 max-w-[32rem] text-muted">
        The page you were looking for does not exist. It may have moved, or the link may have
        been mistyped.
      </p>
      <div className="mt-10">
        <LinkButton href="/" internal variant="primary">
          <ArrowLeft size={16} aria-hidden />
          Back to home
        </LinkButton>
      </div>
    </Container>
  );
}
