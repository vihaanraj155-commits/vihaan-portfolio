"""Read-only content endpoints.

``/api/site`` is what the frontend actually calls: one request, no waterfall. The granular
routes exist for direct consumption and are covered by the test suite.
"""

from fastapi import APIRouter, HTTPException, status

from ..content import (
    EDUCATION,
    EXPERIENCE,
    PROFILE,
    PROJECTS,
    SKILLS,
    WRITING,
    get_project,
    get_site_content,
)
from ..models import (
    EducationItem,
    ExperienceItem,
    Profile,
    Project,
    SiteContent,
    SkillGroup,
    WritingItem,
)

router = APIRouter(prefix="/api", tags=["content"])


@router.get("/site", response_model=SiteContent, summary="Entire site payload")
def read_site() -> SiteContent:
    return get_site_content()


@router.get("/profile", response_model=Profile)
def read_profile() -> Profile:
    return PROFILE


@router.get("/projects", response_model=list[Project])
def read_projects() -> list[Project]:
    return PROJECTS


@router.get("/projects/{slug}", response_model=Project)
def read_project(slug: str) -> Project:
    project = get_project(slug)
    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"No project with slug {slug!r}"
        )
    return project


@router.get("/experience", response_model=list[ExperienceItem])
def read_experience() -> list[ExperienceItem]:
    return EXPERIENCE


@router.get("/education", response_model=list[EducationItem])
def read_education() -> list[EducationItem]:
    return EDUCATION


@router.get("/skills", response_model=list[SkillGroup])
def read_skills() -> list[SkillGroup]:
    return SKILLS


@router.get("/writing", response_model=list[WritingItem])
def read_writing() -> list[WritingItem]:
    return WRITING
