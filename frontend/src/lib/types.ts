/**
 * Mirrors `backend/app/models.py`. If a field changes there, change it here.
 */

export type Accent = "blue" | "violet" | "teal" | "amber";
export type SocialIcon = "github" | "linkedin" | "email" | "x" | "scholar";
export type LinkKind = "repo" | "demo" | "paper" | "writeup";

export interface SocialLink {
  label: string;
  url: string;
  icon: SocialIcon;
}

export interface QuickFact {
  label: string;
  value: string;
}

export interface Profile {
  name: string;
  initials: string;
  role: string;
  tagline: string;
  hero_line: string;
  bio_short: string;
  bio_long: string[];
  location: string;
  email: string;
  socials: SocialLink[];
  availability: string | null;
  quick_facts: QuickFact[];
}

export interface ProjectLink {
  label: string;
  url: string;
  kind: LinkKind;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  role: string;
  summary: string;
  /** Who the work was done with. null means the project was independent. */
  context: string | null;
  /** What Vihaan personally did, shown separately from `highlights`. */
  contribution: string[];
  highlights: string[];
  body: string[];
  stack: string[];
  links: ProjectLink[];
  featured: boolean;
  accent: Accent;
}

export interface ExperienceItem {
  org: string;
  role: string;
  period: string;
  location: string | null;
  summary: string;
  bullets: string[];
  tags: string[];
}

export interface EducationItem {
  school: string;
  credential: string;
  period: string;
  location: string | null;
  facts: QuickFact[];
  coursework: string[];
}

export interface SkillGroup {
  title: string;
  caption: string;
  items: string[];
}

export interface WritingItem {
  title: string;
  date: string;
  summary: string;
  url: string;
}

export interface SiteContent {
  profile: Profile;
  projects: Project[];
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillGroup[];
  writing: WritingItem[];
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
}

export interface FieldError {
  field: string;
  message: string;
}
