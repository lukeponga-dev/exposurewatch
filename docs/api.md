# API Contract

**Status:** Canonical contract derived from the current backend implementation  
**Base path:** `/`  
**Last updated:** 2026-10-01

## `POST /exposure/check`

Checks whether an email appears in known breach data.

### JSON request

```http
POST /exposure/check
Content-Type: application/json
```

```json
{
  "email": "test@example.com"
}
```

The JSON request requires a non-blank, valid email address. The service trims and lowercases the value before the provider lookup.

### Form request

```http
POST /exposure/check
Content-Type: application/x-www-form-urlencoded
```

```text
email=test@example.com
```

The form route is implemented separately from the validated JSON request; validation parity is an open hardening item.

### Success response

```json
{
  "email": "test@example.com",
  "score": 40,
  "level": "Medium",
  "breaches": [
    {
      "breachName": "Example breach",
      "dataClasses": ["Email addresses", "Passwords"]
    }
  ]
}
```

The current score is `min(100, breachCount * 20)`. Current levels are `Low` for 0-20, `Medium` for 21-50, `High` for 51-75, and `Critical` for 76-100.

### Error behavior

| Status | Current meaning                         |
| ------ | --------------------------------------- |
| `400`  | Invalid JSON request validation         |
| `502`  | Upstream exposure provider failure      |
| `503`  | Exposure provider configuration failure |

Error bodies use Spring `ProblemDetail` with a title and detail. A complete error contract and rate-limit response are proposed work.

## Health

- `GET /health` returns `{"status":"UP"}` as a lightweight application health check.
- `GET /actuator/health` remains available for deployment health checks and is configured as the Render health path.

## Frontend client

The frontend calls `${PUBLIC_API_BASE_URL}${PUBLIC_EXPOSURE_CHECK_PATH}` from `src/lib/api/exposure.ts`. The default documented values are:

```env
PUBLIC_API_BASE_URL=http://localhost:8080
PUBLIC_EXPOSURE_CHECK_PATH=/exposure/check
```

Production builds should set `PUBLIC_API_BASE_URL` to the deployed API origin.

## Source Of Truth

The backend controller and model records are authoritative for the wire contract. The older [API-Reference.MD](../API-Reference.MD) now matches the response fields and status codes, but its diagrams and component names remain legacy material.
