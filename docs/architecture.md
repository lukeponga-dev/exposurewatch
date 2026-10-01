# Architecture

**Status:** Current-state architecture with proposed hardening items  
**Last updated:** 2026-10-01

## Context

The system has a browser frontend and a Spring Boot API. The API validates JSON requests, normalizes submitted email values, calls XposedOrNot, maps provider data into an internal model, and computes a score. The browser receives only the ExposureWatch response.

```mermaid
flowchart LR
    User[User browser]
    Frontend[SvelteKit frontend]
    API[Spring Boot API]
    Provider[XposedOrNot API]

    User --> Frontend
    Frontend -->|POST /exposure/check| API
    API -->|GET /v1/check-email/{email}?details=true| Provider
    Provider --> API
    API --> Frontend
    Frontend --> User
```

## Components

| Component                 | Responsibility                                                               | Evidence       |
| ------------------------- | ---------------------------------------------------------------------------- | -------------- |
| `src/routes/+page.svelte` | Owns page state and composes form, score, and breach list.                   | Current source |
| `src/lib/api/exposure.ts` | Builds the configured API URL and sends JSON requests.                       | Current source |
| `ExposureController`      | Exposes JSON and form variants of `/exposure/check`.                         | Current source |
| `ExposureService`         | Normalizes email, maps provider records, and calculates the response.        | Current source |
| `ExposureScoring`         | Applies 20 points per breach, capped at 100, then maps levels.               | Current source |
| `XposedOrNotClient`       | Calls the upstream endpoint and supports detailed/name-only response shapes. | Current source |
| `ApiExceptionHandler`     | Maps validation, configuration, and provider exceptions to problem details.  | Current source |

## Request Flow

1. The form requires an email-shaped value and submits it to the frontend API wrapper.
2. The API validates JSON requests, trims and lowercases the email, then calls XposedOrNot.
3. Provider details are mapped to `BreachRecord` values; missing data classes become empty lists.
4. The scoring service returns a value from 0 to 100 and a level.
5. The frontend renders the score and breach list or an error state.

## Boundaries And Risks

- The provider is an external availability, quota, and terms dependency.
- No cache or application-level rate limit is present in the inspected implementation.
- CORS allows the configured production origin and `http://localhost:5173` for `/exposure/**`.
- Raw email handling, logging, retention, and privacy policy require explicit verification.
- The frontend and backend currently expose different level conventions; see [ADR-0001](decisions/0001-exposure-level-contract.md).

## Proposed Hardening

Add provider protection, automated tests with a stubbed client, contract alignment, and environment-specific deployment checks before treating the service as production-ready.
