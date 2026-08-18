"""Pydantic schemas shared by the content API and the contact endpoint.

These are mirrored exactly by ``frontend/src/lib/types.ts``. Changing a field here means
changing it there.
"""

from typing import Literal

from pydantic import BaseModel, EmailStr, Field

Accent = Literal["blue", "violet", "teal", "amber"]
SocialIcon = Literal["github", "linkedin", "email", "x", "scholar"]
LinkKind = Literal["repo", "demo", "paper", "writeup"]


class SocialLink(BaseModel):
    label: str
    url: str
    icon: SocialIcon


class QuickFact(BaseModel):
    label: str
    value: str


class Profile(BaseModel):
    name: str
    initials: str
    role: str
    tagline: str
    hero_line: str
    bio_short: str
    bio_long: list[str]
    location: str
    email: EmailStr
    socials: list[SocialLink]
    availability: str | None = None
    quick_facts: list[QuickFact] = Field(default_factory=list)


class ProjectLink(BaseModel):
    label: str
    url: str
    kind: LinkKind


class Project(BaseModel):
    slug: str
    title: str
    subtitle: str
    year: str
    role: str
    summary: str
    # Who the work was done with. Set on collaborative projects so a reader is never left to
    # assume solo authorship; None means the project was independent.
    context: str | None = None
    # What Vihaan personally did. Rendered as its own block on the detail page, separate from
    # `highlights`, which describe the system as a whole.
    contribution: list[str] = Field(default_factory=list)
    highlights: list[str]
    body: list[str]
    stack: list[str]
    links: list[ProjectLink] = Field(default_factory=list)
    featured: bool = False
    accent: Accent = "blue"


class ExperienceItem(BaseModel):
    org: str
    role: str
    period: str
    location: str | None = None
    summary: str
    bullets: list[str]
    tags: list[str] = Field(default_factory=list)


class EducationItem(BaseModel):
    school: str
    credential: str
    period: str
    location: str | None = None
    facts: list[QuickFact] = Field(default_factory=list)
    coursework: list[str] = Field(default_factory=list)


class SkillGroup(BaseModel):
    title: str
    caption: str
    items: list[str]


class WritingItem(BaseModel):
    title: str
    date: str
    summary: str
    url: str


class SiteContent(BaseModel):
    """Everything the frontend needs, in one response."""

    profile: Profile
    projects: list[Project]
    experience: list[ExperienceItem]
    education: list[EducationItem]
    skills: list[SkillGroup]
    writing: list[WritingItem]


class ContactRequest(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    subject: str = Field(min_length=2, max_length=120)
    message: str = Field(min_length=20, max_length=4000)
    # Honeypot. Real users never see this field, so a non-empty value means a bot.
    website: str = ""


class ContactResponse(BaseModel):
    ok: bool = True
    message: str


class HealthResponse(BaseModel):
    status: Literal["ok"] = "ok"
    version: str
    environment: str
    uptime_seconds: float


class FieldError(BaseModel):
    field: str
    message: str
