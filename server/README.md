# ExposureWatch API

Spring Boot API for checking whether an email address appears in known breaches.

## Stack

- Java 21
- Spring Boot 4.1.1
- Maven
- Have I Been Pwned API v3

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

Copy `server/.env.example` into your deployment environment and set `HIBP_API_KEY`.

The HIBP API key must remain server-side. HIBP requires an API key and a descriptive `user-agent` for authenticated breach searches, so the browser should only call ExposureWatch. See the official HIBP API documentation: https://haveibeenpwned.com/API/v3

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

This is a replaceable service rather than a permanent product rule.
