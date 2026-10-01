# Product Requirements

**Status:** Proposed MVP definition grounded in the current implementation  
**Audience:** Product and engineering  
**Last updated:** 2026-10-01

## Problem

People need a quick, understandable way to learn whether an email address appears in known breach data and what exposure indicators contributed to the result.

## Users

| User                           | Need                                                                                      |
| ------------------------------ | ----------------------------------------------------------------------------------------- |
| Individual checking an address | Submit an email and understand the result without interpreting raw provider data          |
| Contributor                    | Run the frontend and API locally and understand the service boundaries                    |
| Operator                       | Configure the provider, expose a health check, and understand rate and availability risks |

## Goals

- Provide a single email exposure check workflow.
- Return a stable, small response contract suitable for the frontend.
- Explain the result with a score, level, breach names, and exposed data classes when available.
- Keep provider credentials and provider calls on the server side.

## Functional Requirements

| ID     | Requirement                                      | Acceptance criteria                                                                                  | Status    |
| ------ | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | --------- |
| FR-001 | Accept an email address from the frontend.       | A non-empty valid email can be submitted from the form and is sent as JSON.                          | Confirmed |
| FR-002 | Check the address against the breach provider.   | The API normalizes the address, calls the provider, and maps detailed or name-only breach responses. | Confirmed |
| FR-003 | Return an explainable result.                    | The response includes `email`, `score`, `level`, and `breaches`.                                     | Confirmed |
| FR-004 | Show useful UI states.                           | The frontend shows loading, failure, score, and known-breach or empty-result states.                 | Confirmed |
| FR-005 | Expose service health.                           | `GET /actuator/health` is available for deployment health checks.                                    | Confirmed |
| FR-006 | Protect the provider dependency at public scale. | Add caching and application-level throttling before meaningful public traffic.                       | Proposed  |
| FR-007 | Align frontend types and API contract.           | One documented level vocabulary and response shape are used by source, docs, and examples.           | Open      |

## Non-Functional Requirements

| ID      | Requirement                                                   | Acceptance criteria                                                                                  | Status                      |
| ------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------- |
| NFR-001 | Keep provider access server-side.                             | Browser code calls ExposureWatch, not the provider directly.                                         | Confirmed                   |
| NFR-002 | Return controlled provider and validation errors.             | Invalid requests return 400; provider failures return a non-2xx response with a problem detail.      | Confirmed for JSON requests |
| NFR-003 | Make local setup repeatable.                                  | README instructions identify frontend and backend commands and required environment values.          | Partially confirmed         |
| NFR-004 | Avoid claiming stronger privacy or security than implemented. | Privacy, retention, abuse prevention, and compliance behavior are documented as open until verified. | Proposed                    |

## Out Of Scope For The MVP

- User accounts, saved scan history, or notifications
- A proprietary breach database
- A richer risk model beyond the current breach-count score
- High-volume or commercial provider usage without a terms and quota review

## Open Questions

1. Should the public response use title-case levels (`Low`, `Medium`, `High`, `Critical`) or the frontend's uppercase union?
2. What retention and logging policy applies to submitted email addresses?
3. What production frontend origin and API hostname are authoritative?
4. What provider attribution is required by the current XposedOrNot terms?
