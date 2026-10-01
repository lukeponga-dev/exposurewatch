# ADR-0001: Exposure Level Contract

**Status:** Accepted  
**Date:** 2026-10-01

## Context

The backend serializes levels as title-case strings (`Low`, `Medium`, `High`, `Critical`). The frontend type permits uppercase values and the legacy API reference documents only `LOW`, `MEDIUM`, and `HIGH`. The backend also includes `email` in the response while some examples omit it.

## Decision

Use the backend model records and controller behavior as the wire-contract source of truth, including title-case levels (`Low`, `Medium`, `High`, `Critical`) and the `email` response field. The frontend types and published examples are aligned to that contract.

## Alternatives Considered

- Change the backend to uppercase levels: consistent with the current frontend union, but changes the existing API output.
- Change the frontend and docs to title-case levels: matches the current backend and adds `Critical`, but requires consumer updates.
- Support both values permanently: reduces immediate breakage but creates ambiguity and weakens contract validation.

## Consequences

- Documentation and the frontend describe the current implementation accurately.
- Consumers should not assume the legacy uppercase-only contract is authoritative.
- The focused contract tests are in place; explicit product ownership remains required before the API is treated as stable.
