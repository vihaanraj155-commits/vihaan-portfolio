"""Every word on the site lives here.

Edit this file to change the portfolio. No rebuild of the frontend is required - the React
app fetches this content at runtime from ``/api/site``.

Sourced from Vihaan's resume (Vihaan_Rajagopal_Resume_2026.docx) plus the project
repositories on this machine. Items still marked ``# [CONFIRM]`` were inferred rather than
stated and should be checked.

Attribution note: the smart-space research projects below are collaborative. Each carries a
``context`` naming the team and a ``contribution`` list stating exactly what Vihaan did, so a
reader is never left to infer sole authorship.
"""

from .models import (
    EducationItem,
    ExperienceItem,
    Profile,
    Project,
    QuickFact,
    SiteContent,
    SkillGroup,
    SocialLink,
    WritingItem,
)

# --------------------------------------------------------------------------------------
# Profile
# --------------------------------------------------------------------------------------

PROFILE = Profile(
    name="Vihaan Rajagopal",
    initials="VR",
    role="Student Researcher & Developer",
    tagline="I build systems for smart spaces that are secure and private by design.",
    hero_line=(
        "I am a high school researcher working on smart-street and smart-room systems — "
        "the kind that can answer useful questions about a space without giving away who "
        "was in it."
    ),
    bio_short=(
        "I work on smart-space research at Rutgers WINLAB with the NSF Center for Smart "
        "Streetscapes, compete in cybersecurity and robotics, and build the software that "
        "turns research systems into something people can actually use."
    ),
    bio_long=[
        "A room or a street full of sensors can answer a remarkable number of useful "
        "questions. The catch is that the easy way to answer them — collect everything, hand "
        "it to a model, and hope — gives away identities and raw footage in exchange for "
        "convenience. The research I contribute to is about the harder version: deciding what "
        "a system is allowed to know before it is allowed to answer.",
        "I work on that with a team at Rutgers WINLAB, part of the NSF Center for Smart "
        "Streetscapes, led by Prof. Jorge Ortiz and with PhD mentors including Taqiya "
        "Ehsan. My own contribution has been mostly on TeLLMe, the layer that decides what an "
        "agent is allowed to touch before it plans anything: I built the frontend, the "
        "integration layer binding a live instrumented room and the CARLA simulator into one "
        "context format, and the proxy routes that filter everything on its way to the "
        "browser. On the planner side I widened the library of pre-verified templates that "
        "lets common requests skip a full model-checking run. Being the person who connects "
        "the parts turns out to be a good way to learn how all of them work.",
        "Outside the lab I spend a lot of time in cybersecurity labs — reverse engineering, "
        "Linux internals, memory and binary analysis — because understanding how systems fail "
        "is the fastest way to learn to build ones that do not. I also write the control "
        "software for my school's competition robot, contribute product and engineering work "
        "to a sports platform used by hundreds of athletes and coaches, and have played Indian "
        "classical violin for eight years, which is better training in pattern recognition and "
        "real-time adaptation than anything else I do.",
    ],
    location="Edison, New Jersey, United States",
    email="vihaanraj155@gmail.com",
    availability="Open to research and engineering opportunities",
    socials=[
        SocialLink(label="GitHub", url="https://github.com/vihaanraj155-commits", icon="github"),
        SocialLink(label="Email", url="mailto:vihaanraj155@gmail.com", icon="email"),
    ],
    quick_facts=[
        QuickFact(label="Focus", value="Smart spaces, security, applied AI"),
        QuickFact(label="Working in", value="Python, TypeScript, Java"),
        QuickFact(label="Based in", value="Edison, NJ"),
    ],
)

# --------------------------------------------------------------------------------------
# Projects
# --------------------------------------------------------------------------------------

RESEARCH_CONTEXT = (
    "Collaborative research at Rutgers WINLAB with the NSF Center for Smart Streetscapes, "
    "led by Prof. Jorge Ortiz, with PhD mentors including Taqiya Ehsan alongside other "
    "graduate and undergraduate researchers."
)

PROJECTS: list[Project] = [
    Project(
        slug="tellme",
        title="TeLLMe",
        subtitle="Grounded, privacy-bounded smart-space query",
        year="2026",
        role="Frontend & systems integration",
        featured=True,
        accent="violet",
        context=RESEARCH_CONTEXT,
        summary=(
            "A grounded query interface for an instrumented space: a policy layer that decides "
            "which operations and data an agent may use before any planning begins, with the "
            "interface and integration layer that connect it to live sensors and the CARLA "
            "simulator."
        ),
        contribution=[
            "Built the frontend for TeLLMe, the policy layer that determines which operations "
            "and data an agent may use before any planning begins.",
            "Built the API integration layer binding live smart-room sensors and the CARLA city "
            "simulator into a single normalized, timestamped context format, letting one query "
            "pipeline run over both physical and simulated environments.",
            "Implemented the server-side proxy routes that validate and privacy-filter every "
            "browser-facing response, keeping raw video, identities, and backend addresses off "
            "the client.",
        ],
        highlights=[
            "The policy layer runs first and deterministically: a query outside its bounds is "
            "refused before a model is ever involved.",
            "Allowed queries become constrained execution plans rather than open-ended prompts.",
            "Fuses timestamped context from video, audio, radar, and Wi-Fi into occupancy, "
            "motion, and room-state JSON carrying confidence scores and evidence references "
            "instead of the evidence itself.",
            "One normalized interface accepts context from both a physical instrumented room "
            "and the CARLA simulator.",
            "A single server-side choke point validates and filters every response, so raw "
            "captures, identities, and internal addresses never reach the browser.",
        ],
        body=[
            "The easy way to answer questions about a room is to pipe everything the sensors "
            "saw into a model and trust the prompt to behave. That trade — identities and raw "
            "captures for convenience — is the one TeLLMe exists to avoid. It answers natural "
            "language questions about an instrumented space without handing over the footage "
            "or the identities behind the answer.",
            "The grounding happens before any planning does. A policy layer reads the query and "
            "decides which operations and which data an agent is allowed to touch; anything "
            "outside those bounds is refused up front, deterministically, with no model in the "
            "loop. What survives is compiled into a constrained plan, and the context it runs "
            "against is already filtered — occupancy, motion, audio events, room state, each "
            "with a confidence value and a pointer to the evidence rather than the evidence.",
            "It is team research. My part was the frontend and the plumbing: everything between "
            "the sensors and the person asking the question. The integration side was the "
            "harder half, because context arrives from two very different places — a real smart "
            "room full of sensors, and CARLA, the driving simulator used to model street scenes "
            "— and the pipeline needs one consistent shape regardless of origin. I built the "
            "API layer that binds both and normalizes them into the same timestamped format.",
            "The browser also never talks to the query runner directly. It calls same-origin "
            "routes and the server contacts the runner, which keeps the backend address "
            "server-side and creates exactly one place where responses are validated and "
            "privacy-filtered before anyone can see them.",
        ],
        stack=["Next.js", "React", "TypeScript", "Tailwind CSS", "Python", "CARLA"],
        links=[],
    ),
    Project(
        slug="cityos-agentic-stack-planner",
        title="CityOS Agentic Stack Planner",
        subtitle="Verified multi-agent coordination",
        year="2026",
        role="Research contributor",
        featured=False,
        accent="blue",
        context=RESEARCH_CONTEXT,
        summary=(
            "A planner that turns a natural-language request into a multi-agent protocol, "
            "model-checks it with TLA+ before anything runs, and synthesizes deployable "
            "applications from the verified plan."
        ),
        contribution=[
            "Expanded the verified-template library behind the planner's deterministic fast "
            "path, authoring and stress-testing templates for previously unseen query types.",
            "Contributed to a group effort that cut runtime from roughly 20 minutes to 20-30 "
            "seconds with no loss of model-checking coverage.",
            "Contributed to the wider stack primarily through TeLLMe, the layer that feeds "
            "requirements into the planner.",
        ],
        highlights=[
            "Decomposes user intent into structured application requirements, then generates "
            "an explicit agent / resource / channel intermediate representation.",
            "Compiles that IR to PlusCal and checks it with the TLC model checker for deadlock "
            "freedom, mutual exclusion, and hand-written safety invariants.",
            "Runs an automated repair loop — up to five attempts — that reads the TLC "
            "counterexample and revises the protocol rather than failing the run.",
            "Exports a verified module plan and synthesizes one application per agent plus a "
            "dedicated monitor app.",
            "Ships a benchmark harness for comparing verified and unverified agent stacks on "
            "the same task set.",
            "A library of pre-verified templates gives common request shapes a deterministic "
            "fast path, skipping the full model-checking run without weakening its guarantees.",
        ],
        body=[
            "A group of agents working on the same task is really just a concurrent program, "
            "and we already know how to reason about concurrent programs. We mostly stop doing "
            "it when the processes happen to be language models. This is a team attempt to "
            "keep doing it. I contributed through TeLLMe, which feeds the planner, and by "
            "expanding the verified-template library behind its fast path.",
            "A request enters as plain language and is broken into structured requirements. "
            "From those, the planner builds an intermediate representation naming every agent, "
            "the resources they compete for, and the channels they talk over. That "
            "representation is the part worth verifying, so it is translated into PlusCal and "
            "handed to TLC, which explores the state space looking for deadlock, "
            "mutual-exclusion violations, and broken invariants.",
            "When TLC finds a counterexample the run does not simply fail. The trace feeds back "
            "into a repair loop that revises the protocol and checks again, up to five times. "
            "Whatever survives becomes a verified module plan, which a synthesizer turns into "
            "one deployable app per agent plus a monitor. The planner never runs the agents "
            "itself — keeping that line sharp is what makes the guarantee mean anything.",
            "Full verification is expensive, so requests matching an already-verified template "
            "take a deterministic fast path instead. Widening that library is most of what I "
            "did here: writing templates for query shapes it had not seen and stress-testing "
            "them. Together with the rest of the group's work it brought a run down from "
            "roughly twenty minutes to twenty or thirty seconds, without giving up any "
            "model-checking coverage.",
        ],
        stack=["Python", "TLA+ / PlusCal", "TLC", "Pydantic", "FastAPI", "pytest"],
        links=[],
    ),
    Project(
        slug="blue-ocean-smart-faucet",
        title="Smart Faucet Leak Detection",
        subtitle="Backend for a water-efficiency device",
        year="2026",
        role="Backend & system logic",
        featured=False,
        accent="teal",
        context="Built with a team for the Blue Ocean Entrepreneurship Competition.",
        summary=(
            "The backend for a smart faucet attachment that watches household water flow "
            "continuously and catches the small persistent leaks a person never notices. The "
            "entry placed in the top 1,000 worldwide out of more than 5,000 submissions."
        ),
        contribution=[
            "Built the backend logic behind leak detection and real-time monitoring.",
            "Designed the data flow and system logic carrying continuous sensor readings "
            "through to a usable signal.",
        ],
        highlights=[
            "Targets micro-leaks specifically: the slow, steady losses that never announce "
            "themselves the way a burst pipe does.",
            "Monitors continuously rather than sampling, so a leak is caught while it is "
            "happening instead of showing up on a bill weeks later.",
            "Attaches to an existing faucet rather than requiring new plumbing, which is what "
            "makes it deployable in an ordinary home.",
            "Estimated to cut household water waste by 10-20%.",
        ],
        body=[
            "Most household water loss is not dramatic. A burst pipe gets noticed within "
            "minutes; a faucet losing a little continuously can run for months, and the only "
            "evidence is a bill that seems slightly high. That gap between the leaks people "
            "notice and the leaks that actually waste the most water is what this device aims "
            "at.",
            "It is an attachment rather than a replacement, so it fits a faucet that already "
            "exists. My work was the backend: taking a continuous stream of sensor readings "
            "and turning it into something that can actually say a leak is happening now. That "
            "means deciding what the data flow looks like end to end, and what separates a "
            "genuine slow leak from the ordinary noise of a tap being used.",
            "It went in to the Blue Ocean Entrepreneurship Competition and placed in the top "
            "1,000 of more than 5,000 submissions worldwide.",
        ],
        stack=["JavaScript"],
        links=[],
    ),
    Project(
        slug="parallax-vex-pushback",
        title="VEX Push Back Robot",
        subtitle="Competition robot control system",
        year="2025 — 2026",
        role="Programming & systems",
        featured=False,
        accent="amber",
        context="Built with a 5-10 member school engineering team.",
        summary=(
            "Driver and autonomous control software for the team's VEX V5 robot, which placed "
            "16th out of 100+ teams at the regional competition."
        ),
        contribution=[
            "Wrote the driver control and autonomous routines for the V5 platform.",
            "Tuned the autonomous algorithm iteratively, cutting task completion time by "
            "roughly 30%.",
            "Optimized drivetrain control and stopping behavior for movement precision and "
            "match-to-match consistency.",
        ],
        highlights=[
            "Improved autonomous routine efficiency by roughly 30% in task completion time "
            "through algorithm tuning and iterative testing.",
            "Arcade drive mixing throttle and steering on one stick, which proved easier to "
            "drive accurately under match pressure than tank.",
            "Brake-mode drivetrain for repeatable positioning, with hold-mode intake and "
            "conveyor so scored elements stay seated when the motors idle.",
            "Centralized port and hardware map, so a wiring change touches exactly one file.",
        ],
        body=[
            "Competition robotics teaches one lesson very efficiently: the elegant solution and "
            "the one that survives a match are not always the same, and the gap between them "
            "is usually driver ergonomics.",
            "The control stack is deliberately plain. Arcade drive mixes throttle and steering "
            "into left and right motor power, which turned out to be meaningfully easier to "
            "drive accurately than tank when the clock is running. The drivetrain brakes "
            "instead of coasting so positions repeat, and the intake and conveyor hold instead "
            "of releasing so nothing slips when the operator lets go.",
            "The autonomous side was where the real gains were. Tuning the routine and testing "
            "it iteratively cut task completion time by about 30%, which is the difference "
            "between finishing a scoring cycle inside the autonomous period and not. All port "
            "assignments live in one module separate from behavior — hardware changes between "
            "competitions are constant, and confining them to a single file is the difference "
            "between a five-minute fix and a debugging session in the pit.",
        ],
        stack=["Python", "VEX V5", "VEXcode"],
        links=[],
    ),
]

# --------------------------------------------------------------------------------------
# Experience
# --------------------------------------------------------------------------------------

EXPERIENCE: list[ExperienceItem] = [
    ExperienceItem(
        org="Rutgers WINLAB — NSF Center for Smart Streetscapes (CS3)",
        role="Research Intern",
        period="July 2026 — Present",
        location="WINLAB, Rutgers University",
        summary=(
            "Research on privacy-bounded smart-space query systems with Prof. Jorge Ortiz, "
            "PhD mentors including Taqiya Ehsan, and a team of graduate and undergraduate "
            "researchers."
        ),
        bullets=[
            "Selected as one of 8 high school interns across four research groups building an "
            "agentic stack that turns a natural-language prompt into a verified, deployable "
            "distributed application.",
            "Built the frontend for TeLLMe, the policy layer that determines which operations "
            "and data an agent may use before any planning begins.",
            "Built the API integration layer binding live smart-room sensors and the CARLA city "
            "simulator into a single normalized, timestamped context format, letting one query "
            "pipeline run over both physical and simulated environments.",
            "Implemented server-side proxy routes that validate and privacy-filter every "
            "browser-facing response, keeping raw video, identities, and backend addresses off "
            "the client.",
            "Expanded the verified-template library behind the planner's deterministic fast "
            "path, contributing to a group effort that cut runtime from roughly 20 minutes to "
            "20-30 seconds with no loss of model-checking coverage.",
            "Invited by the faculty lead to continue on the project through the academic year.",
        ],
        tags=["Smart Spaces", "Privacy", "Systems Integration", "React", "Python"],
    ),
    ExperienceItem(
        org="Waresport",
        role="Product & Growth Contributor",
        period="December 2025 — Present",
        location=None,
        summary=(
            "Product and engineering work on an all-in-one sports management platform used by "
            "500+ athletes, coaches, and administrators."
        ),
        bullets=[
            "Led product iteration cycles by identifying user pain points in scheduling, "
            "payments, and communication workflows, improving usability and feature adoption.",
            "Designed and refined core features — event scheduling, registration flows, "
            "communication tools — reducing administrative friction by roughly 60%.",
            "Drove user growth and onboarding across multiple teams and clubs, contributing to "
            "platform expansion and retention.",
            "Worked closely with engineering to translate user needs into scalable features "
            "and system requirements.",
        ],
        tags=["Product", "Growth", "Systems Design"],
    ),
    ExperienceItem(
        org="VEX Robotics Competition",
        role="Engineering, Programming & Systems Optimization",
        period="August 2025 — Present",
        location=None,
        summary=(
            "Robot software and systems work for the team's V5 platform across the Push Back "
            "season."
        ),
        bullets=[
            "Placed 16th out of 100+ teams at the regional competition.",
            "Improved autonomous routine efficiency by roughly 30% in task completion time "
            "through algorithm tuning and iterative testing.",
            "Optimized drivetrain control and mechanical performance for better movement "
            "precision and consistency during matches.",
            "Collaborated across a 5–10 member engineering team, integrating software, "
            "hardware, and control systems.",
        ],
        tags=["Robotics", "Controls", "Python"],
    ),
    ExperienceItem(
        org="Lockheed Martin CyberQuest",
        role="Competitor — Cybersecurity & Reverse Engineering",
        period="March 2026",
        location=None,
        summary=(
            "State-level cybersecurity competition covering reverse engineering, Linux "
            "systems, and network analysis."
        ),
        bullets=[
            "Ranked 5th in the state, in the top ~25% of competing teams.",
            "Solved 10+ challenges spanning reverse engineering, Linux internals, and network "
            "analysis.",
            "Applied binary analysis, debugging, and exploitation techniques under "
            "time-constrained conditions.",
        ],
        tags=["Cybersecurity", "Reverse Engineering", "Linux"],
    ),
    ExperienceItem(
        org="Blue Ocean Entrepreneurship Competition",
        role="Software Developer — Backend",
        period="2026",
        location=None,
        summary=(
            "Backend engineering for a smart faucet attachment aimed at reducing micro-leaks "
            "and improving household water efficiency."
        ),
        bullets=[
            "Selected in the top 1,000 worldwide out of 5,000+ submissions.",
            "Built the backend logic for leak detection and real-time monitoring.",
            "Designed the data flow and system logic supporting continuous sensor readings.",
        ],
        tags=["Backend", "IoT", "Sustainability"],
    ),
    ExperienceItem(
        org="School Newspaper",
        role="Technical Writer & Editor",
        period="2024 — Present",
        location=None,
        summary=(
            "Technical writing on engineering, computing, and emerging technology for a "
            "student readership of 1,000+."
        ),
        bullets=[
            "Authored 10+ technical articles on engineering, computing, and emerging tech.",
            "Translated complex topics such as AI and cybersecurity into accessible "
            "explanations for a general student audience.",
            "Onboarded and mentored 50+ new student writers into the editorial workflow.",
        ],
        tags=["Technical Writing", "STEM Communication"],
    ),
    ExperienceItem(
        org="Indian Classical Violin",
        role="Performer & Student Teacher",
        period="2018 — Present",
        location=None,
        summary=(
            "Eight-plus years of training in Indian classical violin, performing publicly and "
            "teaching students one-on-one."
        ),
        bullets=[
            "Accompanied vocalists at paid performances across the tri-state area, adapting in "
            "real time to live musical direction.",
            "Taught 5–10 students through structured one-on-one lessons, building technical "
            "proficiency and music theory foundations.",
            "Designed individualized lesson plans and practice strategies with measurable "
            "student progress.",
        ],
        tags=["Performance", "Teaching", "Mentorship"],
    ),
]

# --------------------------------------------------------------------------------------
# Education
# --------------------------------------------------------------------------------------

EDUCATION: list[EducationItem] = [
    EducationItem(
        school="Edison High School",
        credential="High School Diploma",
        period="Expected 2028",
        location="Edison, NJ",
        facts=[
            QuickFact(label="Unweighted GPA", value="4.20"),
            QuickFact(label="Weighted GPA", value="5.93"),
            QuickFact(label="SAT", value="1540 superscore"),
        ],
        coursework=[
            "AP Biology",
            "AP Chemistry",
            "AP US History",
            "AP Psychology",
        ],
    ),
]

# --------------------------------------------------------------------------------------
# Capabilities
# --------------------------------------------------------------------------------------

SKILLS: list[SkillGroup] = [
    SkillGroup(
        title="Languages & Core",
        caption="What I write in day to day",
        items=["Python", "TypeScript", "Java", "Linux", "HTML & CSS", "Bash"],
    ),
    SkillGroup(
        title="Building & Integration",
        caption="Connecting systems that were not built to talk",
        items=[
            "React & Next.js",
            "REST API design & integration",
            "Sensor and simulator data pipelines",
            "End-to-end system bring-up",
            "Debugging across service boundaries",
        ],
    ),
    SkillGroup(
        title="Security",
        caption="Learning how systems fail",
        items=[
            "Penetration testing concepts",
            "Reverse engineering & binary analysis",
            "Linux internals & system hardening",
            "Network analysis",
            "25+ labs on Hack The Box and TryHackMe",
        ],
    ),
    SkillGroup(
        title="Cloud & AI",
        caption="Where most of my study time goes",
        items=[
            "AWS (certifications in progress)",
            "Cloud architecture & distributed systems",
            "LLM integration & tool-calling",
            "Structured output & schema validation",
            "Applied AI inside real products",
        ],
    ),
]

# --------------------------------------------------------------------------------------
# Writing - intentionally empty. The section hides itself until this list has entries.
# --------------------------------------------------------------------------------------

WRITING: list[WritingItem] = []


def get_site_content() -> SiteContent:
    """Assemble the full payload served by ``GET /api/site``."""
    return SiteContent(
        profile=PROFILE,
        projects=PROJECTS,
        experience=EXPERIENCE,
        education=EDUCATION,
        skills=SKILLS,
        writing=WRITING,
    )


def get_project(slug: str) -> Project | None:
    """Look up a single project by slug, or ``None`` if it does not exist."""
    return next((project for project in PROJECTS if project.slug == slug), None)
