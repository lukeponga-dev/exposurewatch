# ExposureWatch

**Status:** MVP implementation; deployment and production readiness are not fully verified  
**Audience:** Contributors, product stakeholders, and operators  
**Last updated:** 2026-10-01

## Purpose

ExposureWatch checks whether an email address appears in known data breaches and presents a simple exposure score, risk level, and breach details.

## System At A Glance

- **Frontend:** SvelteKit 5, TypeScript, Vite, deployed separately from the API.
- **Backend:** Spring Boot API on Java 21, built with Maven.
- **Provider:** XposedOrNot public API, called server-side.
- **Primary workflow:** Submit an email, call `POST /exposure/check`, calculate a score, and render the result.
- **Health endpoint:** `GET /actuator/health`.

## Documentation

- [Product requirements](product-requirements.md)
- [Roadmap and backlog](roadmap.md)
- [Architecture](architecture.md)
- [API contract](api.md)
- [Operations](operations.md)
- [Architecture decision records](decisions/README.md)
- [Existing API reference](../API-Reference.MD) (legacy reference; reconcile with the canonical contract before relying on it)

## Current Scope

### Confirmed

- JSON and form submissions are exposed by the backend endpoint.
- Email values are trimmed and lowercased before the provider lookup.
- The score is capped at 100 and currently assigns 20 points per returned breach.
- The frontend displays loading, error, score, and breach-list states.

### Not confirmed

- Automated tests are not present in the inspected source tree.
- Production deployment health, domain ownership, quotas, and provider terms have not been verified here.
- Caching and application-level rate limiting are planned but not implemented in the inspected code.
