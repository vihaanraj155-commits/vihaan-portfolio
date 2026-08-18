"""Content endpoints must stay valid against their models and consistent with /api/site."""

import pytest
from fastapi.testclient import TestClient

from app.models import EducationItem, ExperienceItem, Profile, Project, SiteContent, SkillGroup


def test_site_payload_validates(client: TestClient) -> None:
    response = client.get("/api/site")
    assert response.status_code == 200
    site = SiteContent.model_validate(response.json())
    assert site.profile.name == "Vihaan Rajagopal"
    assert len(site.projects) >= 3
    assert len(site.experience) >= 1
    assert len(site.education) >= 1
    assert len(site.skills) >= 1


def test_profile_endpoint(client: TestClient) -> None:
    response = client.get("/api/profile")
    assert response.status_code == 200
    profile = Profile.model_validate(response.json())
    assert profile.initials
    assert profile.bio_long, "About section needs at least one paragraph"
    assert profile.socials, "Contact section renders social links"


def test_projects_endpoint(client: TestClient) -> None:
    response = client.get("/api/projects")
    assert response.status_code == 200
    projects = [Project.model_validate(item) for item in response.json()]
    slugs = [project.slug for project in projects]
    assert len(slugs) == len(set(slugs)), "project slugs must be unique -- they are routes"
    assert sum(project.featured for project in projects) == 1, "exactly one hero card"
    for project in projects:
        assert project.highlights, f"{project.slug} needs highlights for its detail page"
        assert project.body, f"{project.slug} needs body copy for its detail page"
        assert project.stack, f"{project.slug} needs stack chips for its card"


def test_collaborative_projects_state_the_contribution(client: TestClient) -> None:
    """Attribution guard.

    Any project naming collaborators must also say what Vihaan personally did. Without this,
    a reader could reasonably read shared research as solo work.
    """
    projects = [Project.model_validate(item) for item in client.get("/api/projects").json()]
    for project in projects:
        if project.context:
            assert project.contribution, (
                f"{project.slug} names collaborators but lists no personal contribution"
            )


@pytest.mark.parametrize(
    "path", ["/api/experience", "/api/education", "/api/skills", "/api/writing"]
)
def test_list_endpoints_return_arrays(client: TestClient, path: str) -> None:
    response = client.get(path)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_experience_and_skills_validate(client: TestClient) -> None:
    experience = [ExperienceItem.model_validate(i) for i in client.get("/api/experience").json()]
    skills = [SkillGroup.model_validate(i) for i in client.get("/api/skills").json()]
    assert all(item.bullets for item in experience)
    assert all(group.items for group in skills)


def test_education_validates(client: TestClient) -> None:
    education = [EducationItem.model_validate(i) for i in client.get("/api/education").json()]
    assert education, "the Education section needs at least one entry"
    assert all(item.school and item.period for item in education)


def test_single_project_by_slug(client: TestClient) -> None:
    first_slug = client.get("/api/projects").json()[0]["slug"]
    response = client.get(f"/api/projects/{first_slug}")
    assert response.status_code == 200
    assert response.json()["slug"] == first_slug


def test_unknown_project_returns_404(client: TestClient) -> None:
    response = client.get("/api/projects/does-not-exist")
    assert response.status_code == 404


def test_site_matches_granular_endpoints(client: TestClient) -> None:
    """The aggregate must not drift from the individual routes."""
    site = client.get("/api/site").json()
    assert site["profile"] == client.get("/api/profile").json()
    assert site["projects"] == client.get("/api/projects").json()
    assert site["experience"] == client.get("/api/experience").json()
    assert site["education"] == client.get("/api/education").json()
    assert site["skills"] == client.get("/api/skills").json()
    assert site["writing"] == client.get("/api/writing").json()


def test_health(client: TestClient) -> None:
    response = client.get("/api/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["uptime_seconds"] >= 0
