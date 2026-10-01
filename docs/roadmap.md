# Roadmap And Backlog

**Status:** Proposed sequencing based on the current MVP and documented risks  
**Last updated:** 2026-10-01

## Milestones

| Milestone                | Outcome                                                                         | Exit criteria                                                                             | Status      |
| ------------------------ | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------- |
| M0: Contract alignment   | Frontend, backend, and docs agree on the exposure response.                     | Contract decision is implemented and checked by a focused test.                           | In progress |
| M1: MVP hardening        | The public service tolerates normal low-volume use.                             | Caching, throttling, provider failure behavior, and observability are verified.           | Proposed    |
| M2: Production readiness | Deployment and operational ownership are explicit.                              | Domain, CORS, quotas, terms, health checks, rollback, and support procedure are verified. | Proposed    |
| M3: Risk-model evolution | Exposure score reflects more than breach count if product evidence supports it. | A versioned scoring policy and evaluation examples are approved.                          | Later       |

## Prioritized Backlog

### P0: Confirm response-contract ownership

**Outcome:** The stable, tested contract has an explicitly accountable product owner.

Acceptance criteria:

- Confirm ownership of the canonical level casing and allowed values.
- Keep `src/lib/types/exposure.ts`, API examples, and backend serialization aligned as the contract evolves.
- Preserve contract tests for success, validation, provider errors, and scoring boundaries.

Dependencies: product decision on public vocabulary.

### P0: Add provider protection

**Outcome:** A public user cannot exhaust the upstream free quota through the API.

Acceptance criteria:

- Add short-lived caching using a one-way email key.
- Add application-level rate limiting with a documented policy.
- Return a controlled response when the local or upstream limit is reached.
- Verify that logs do not expose raw email addresses unnecessarily.

Dependencies: chosen cache and rate-limit mechanism; deployment constraints.

### P1: Add automated backend coverage

**Outcome:** Core behavior can be checked without a live provider call.

Acceptance criteria:

- Test normalization and score boundaries.
- Test detailed and name-only provider response mapping.
- Test invalid JSON requests and provider failures.
- Use a stubbed provider client for deterministic tests.

### P1: Verify deployment operations

**Outcome:** Contributors and operators can deploy and recover the service predictably.

Acceptance criteria:

- Verify Render health checks and environment variables.
- Verify frontend API variables and CORS origins in each environment.
- Document logs, rollback, and provider outage response.
- Confirm the deployed API and frontend URLs.

## Definition Of Done

- Acceptance criteria are met and checked.
- Documentation and examples match the implementation.
- Relevant automated checks pass.
- Security, privacy, quota, and operational implications are recorded.
- The change has an owner and a follow-up decision where required.
