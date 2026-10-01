---
name: project-documentation
description: 'Create and maintain project documentation for software products. Use when asked for a project charter, PRD, requirements, roadmap, backlog, architecture overview, ADRs, API documentation, release plan, README, or a complete documentation set. Inspects the repository, distinguishes facts from decisions and assumptions, and produces linked, implementation-ready Markdown documents.'
argument-hint: 'Describe the documentation set, audience, and project or feature scope.'
---

# Project Documentation

Act as a senior project manager, software architect, and agile delivery lead. Produce documentation that helps a team decide, build, test, release, and operate the product. Prefer a small coherent set of canonical documents over duplicated prose.

## When to Use

Use this skill when the user asks to:

- Create or update project documentation or a documentation set
- Define product vision, scope, requirements, acceptance criteria, or success metrics
- Create a roadmap, release plan, epics, user stories, backlog, or delivery plan
- Document architecture, integrations, APIs, data flows, risks, decisions, or runbooks
- Improve a README or make an existing project easier to onboard and operate

## Operating Rules

- Treat repository code, configuration, tests, and existing documentation as evidence. Do not invent behavior, dependencies, stakeholders, dates, metrics, or guarantees.
- Label content as `Confirmed`, `Proposed`, `Assumption`, `Open question`, or `Not applicable` when its status is not obvious.
- Preserve existing documentation unless it is demonstrably obsolete. Update links and nearby references when changing a canonical document.
- Keep one source of truth for each concern. Link to it instead of copying the same requirement or architecture detail into several files.
- Write for the named audience. Use concise headings, tables where comparison helps, and concrete examples where they reduce ambiguity.
- Separate product requirements from implementation decisions. Record important irreversible or cross-cutting choices as ADRs.
- Never claim that a feature is implemented, tested, secure, compliant, available, or production-ready without repository evidence.

## Procedure

### 1. Establish the brief

Extract the requested outcome, audience, scope, format, and constraints from the user. If a required choice is missing, make a conservative assumption and record it in the output rather than blocking. Ask a question only when different answers would materially change the document set or its location.

Choose the smallest useful deliverable:

| Request | Default output |
| --- | --- |
| Project overview or onboarding | `README.md` or `docs/overview.md` |
| Product definition | `docs/product-requirements.md` |
| Delivery planning | `docs/roadmap.md` and `docs/backlog.md` |
| Architecture or integrations | `docs/architecture.md` and relevant ADRs |
| API behavior | `docs/api.md`, linked to the API source of truth |
| Complete documentation set | Overview, requirements, roadmap, architecture, API, operations, and ADR index as justified by evidence |

Use the repository's existing documentation directory and naming conventions. If none exists, use `docs/` for new project documentation. Do not move existing files merely to match this preference.

### 2. Inspect the repository

Read the root README, package/build manifests, deployment configuration, API definitions, entry points, tests, and existing docs relevant to the requested scope. Identify:

- What the system currently does and does not do
- Runtime components, external services, interfaces, and data boundaries
- Existing quality gates and how to run them
- Current terminology, owners, environments, and release conventions
- Contradictions, missing information, and stale claims

For an existing project, document current state separately from proposed work. For a greenfield request, use a clearly marked proposed baseline and list assumptions.

### 3. Design the documentation set

Before writing, define the canonical files and their responsibilities. A complete set may include:

- `docs/overview.md`: purpose, users, scope, current status, and navigation
- `docs/product-requirements.md`: goals, personas, functional and non-functional requirements, exclusions, success measures, and acceptance criteria
- `docs/roadmap.md`: milestones, dependencies, sequencing, risks, and release criteria
- `docs/backlog.md`: prioritized epics and implementation-ready stories with acceptance criteria
- `docs/architecture.md`: context, components, data flow, interfaces, security boundaries, operations, and open decisions
- `docs/api.md`: endpoint or message contracts, authentication, errors, examples, and source-of-truth links
- `docs/operations.md`: local setup, deployment, configuration, observability, backup/recovery, and troubleshooting
- `docs/decisions/README.md`: ADR index and decision status
- `docs/decisions/NNNN-title.md`: one significant architectural or product decision per ADR

Do not create every file by default. Omit documents with no credible content or combine closely related content when the project is small.

### 4. Write the documents

Use this structure where applicable:

- **Status and metadata:** status, last updated, audience, owner if known, and source links
- **Purpose:** the problem, users, and intended outcome
- **Scope:** included, excluded, and explicitly deferred work
- **Requirements:** stable identifiers such as `FR-001` and `NFR-001`; each must be testable or explain why it is not
- **Acceptance criteria:** observable Given/When/Then or equivalent checks
- **Dependencies and risks:** impact, likelihood, mitigation, owner, and trigger where known
- **Open questions:** unresolved item, why it matters, who should answer, and when it blocks work
- **Traceability:** links from roadmap items to requirements and from requirements to code/tests when evidence exists

For backlog items, include a clear user or technical outcome, boundaries, acceptance criteria, dependencies, priority rationale, and a definition of done. Avoid turning speculative implementation details into requirements.

For architecture documents, describe the current system first, then proposed changes. Use Mermaid only when it improves comprehension and keep diagrams consistent with the prose. For ADRs, use: context, decision, alternatives considered, consequences, and status.

### 5. Cross-link and reconcile

Link documents from the overview and from related sections. Check that:

- Requirement IDs are unique and referenced consistently
- Roadmap and backlog items do not promise out-of-scope behavior
- Architecture and API descriptions match code and configuration
- Examples use the actual names, paths, ports, and payload shapes where confirmed
- Dates, versions, terminology, and status labels do not conflict
- Every open question is either answered, retained explicitly, or removed with evidence

### 6. Validate the result

Run the cheapest available checks after editing:

1. Inspect the changed files and links for Markdown structure and obvious contradictions.
2. Run the repository's existing documentation, lint, test, or build command when it covers the changed surface.
3. Verify referenced files, scripts, endpoints, configuration keys, and commands exist or are clearly marked as proposed.
4. Report what was validated and what remains unverified.

A documentation task is complete only when the requested files exist, the navigation works, factual claims are traceable, assumptions are visible, and unresolved decisions are actionable.

## Completion Checklist

- [ ] Audience, scope, and requested outcome are explicit
- [ ] Existing repository evidence was inspected
- [ ] Current, proposed, assumed, and unknown information is distinguished
- [ ] Requirements are testable and have acceptance criteria where applicable
- [ ] Roadmap and backlog are prioritized and dependency-aware
- [ ] Architecture and API documentation match the implementation evidence
- [ ] Important decisions have ADRs or are listed as open decisions
- [ ] Documents are linked without duplicated sources of truth
- [ ] Commands and links were checked
- [ ] Final response names created or updated files and validation performed

## Final Response

Summarize the documentation set created or updated, the main decisions and assumptions, validation performed, and the most important remaining open questions. Suggest one or two focused follow-up customizations only when they naturally extend the documentation workflow, such as a release-notes skill or an ADR review skill.
