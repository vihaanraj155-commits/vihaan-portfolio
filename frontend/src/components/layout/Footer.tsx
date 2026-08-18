import { Container } from "@/components/ui/primitives";
import { SocialIcons } from "@/components/layout/SocialIcons";
import { useSite } from "@/lib/site-context";

export function Footer() {
  const { content } = useSite();
  const profile = content?.profile;

  return (
    <footer className="border-t border-hairline py-12">
      <Container>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <span className="text-[0.9375rem] font-semibold tracking-tight text-ink">
              {profile?.initials ?? "VR"}
              <span className="text-accent">.</span>
            </span>
            <p className="text-[0.8125rem] text-fade">
              &copy; 2026 {profile?.name ?? "Vihaan Rajagopal"}. All rights reserved.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:items-end">
            {profile ? <SocialIcons socials={profile.socials} /> : null}
            <p className="text-[0.8125rem] text-fade">Built with React and FastAPI.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
