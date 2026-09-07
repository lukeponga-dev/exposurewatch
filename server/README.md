# ExposureWatch API

Spring Boot API for checking whether an email address appears in known breaches and turning the result into a simple exposure score.

## Stack

- Java 21
- Spring Boot 4.1.1
- Maven
- XposedOrNot free breach intelligence API

## Free-data architecture

ExposureWatch does **not** require a paid breach-search API key.

The server calls XposedOrNot's public `/v1/breach-analytics` endpoint. The free API provides email breach lookups and breach analytics without an API key, with published per-IP rate limits. ExposureWatch keeps the provider call server-side so the frontend never depends directly on the upstream API.

Provider: `https://api.xposedornot.com`

Free-tier limits are important for an MVP: email breach analytics is limited to 2 requests/second, 25 requests/hour, and 100 requests/day per IP. The application should therefore add caching and request throttling before any public launch with meaningful traffic.

## Endpoint

`POST /exposure/check`

JSON request:

```json
{
  "email": "test@example.com"
}
```

Form request is also supported:

```text
email=test@example.com
```

Example response:

```json
{
  "email": "test@example.com",
  "score": 42,
  "level": "Medium",
  "breaches": [
    {
      "breachName": "Adobe",
      "dataClasses": ["Email addresses", "Passwords"]
    }
  ]
}
```

## Configuration

No breach-provider API key is required.

Copy `server/.env.example` into your deployment environment. The upstream base URL defaults to the public XposedOrNot API and can be overridden with `XPOSEDORNOT_BASE_URL` if required.

## Run locally

```bash
cd server
mvn spring-boot:run
```

The API starts on `http://localhost:8080` by default.

Test with:

```bash
curl -X POST http://localhost:8080/exposure/check \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com"}'
```

## Health

Spring Boot Actuator exposes:

`GET /actuator/health`

## Scoring

The initial MVP scoring policy is intentionally simple: 20 points per breach, capped at 100. Levels are:

- 0–20: Low
- 21–50: Medium
- 51–75: High
- 76–100: Critical

This scoring layer is independent of the breach provider and can be replaced later with a richer risk model.

## Production roadmap

1. Add short-lived caching keyed by a one-way email hash.
2. Add application-level rate limiting so the upstream free quota is protected.
3. Add provider attribution in the UI where required by the provider's current terms.
4. Add a second independent source later rather than coupling the product permanently to one breach database.
5. Treat the current free API as an MVP/low-volume dependency; higher-volume or commercial use should be reviewed against the provider's current terms and limits.
