# Operations

**Status:** Current setup with unverified production details  
**Last updated:** 2026-10-01

## Local Development

### Frontend

```bash
npm install
cp .env.example .env
npm run dev
```

The frontend uses `PUBLIC_API_BASE_URL` and `PUBLIC_EXPOSURE_CHECK_PATH`.

### Backend

```bash
cd server
mvn spring-boot:run
```

The API defaults to `http://localhost:8080`. Its server port is controlled by `PORT`.
The API also exposes `/health` for a lightweight application probe.

## Configuration

| Variable                        | Component | Default or example                 | Purpose                                                     |
| ------------------------------- | --------- | ---------------------------------- | ----------------------------------------------------------- |
| `PUBLIC_API_BASE_URL`           | Frontend  | `http://localhost:8080`            | Local API origin; use the deployed API origin in production |
| `PUBLIC_EXPOSURE_CHECK_PATH`    | Frontend  | `/exposure/check`                  | Exposure endpoint path                                      |
| `PORT`                          | Backend   | `8080`                             | HTTP listen port                                            |
| `EXPOSUREWATCH_FRONTEND_ORIGIN` | Backend   | `https://exposurewatch.nz` in code | Allowed production CORS origin                              |
| `XPOSEDORNOT_BASE_URL`          | Backend   | `https://api.xposedornot.com`      | Upstream provider base URL                                  |

## Deployment

`render.yaml` describes a Docker-based Render web service rooted at `server`, with `/actuator/health` as the health check. The API also exposes `/health` for a lightweight application probe. The deployment plan sets the provider base URL and a frontend origin. The actual deployed hostnames and environment values require verification.

## Monitoring And Recovery

Confirmed:

- Spring Boot Actuator health is enabled.
- Provider failures are converted to HTTP 502 responses.
- Configuration failures are converted to HTTP 503 responses.

Open:

- No documented log redaction or email retention policy.
- No confirmed alerting, dashboard, backup, rollback, or incident owner.
- No cache or local rate limiter protecting the provider quota.

## Pre-Launch Checks

- Run frontend `npm run check`, `npm run lint`, and `npm run build`.
- Run backend Maven verification with the required Java version.
- Verify CORS from the deployed frontend origin.
- Verify valid, invalid, empty-result, provider-error, and health-check requests.
- Review provider limits, attribution, and permitted usage against current terms.
