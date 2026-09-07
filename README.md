# ExposureWatch

ExposureWatch is a SvelteKit frontend for checking whether an email address has appeared in known data breaches. It presents an exposure score, risk level, and breach details returned by the ExposureWatch Spring Boot API.

## Stack

- Svelte 5 + SvelteKit
- TypeScript
- Vite
- Spring Boot API at `https://api.exposurewatch.nz`
- Vercel-compatible SvelteKit adapter

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

Set the API endpoint in `.env` if the Spring Boot route differs:

```env
PUBLIC_API_BASE_URL=https://api.exposurewatch.nz
PUBLIC_EXPOSURE_CHECK_PATH=/exposure/check
```

The frontend sends `POST {PUBLIC_API_BASE_URL}{PUBLIC_EXPOSURE_CHECK_PATH}` with:

```json
{ "email": "you@example.com" }
```

and expects an `ExposureResult` shaped like:

```json
{
  "score": 72,
  "level": "HIGH",
  "breaches": [
    {
      "breachName": "Example breach",
      "dataClasses": ["Email addresses", "Passwords"]
    }
  ]
}
```

If your existing Spring Boot API uses a different route or JSON shape, update `src/lib/api/exposure.ts` and `src/lib/types/exposure.ts` to match it.

## Svelte 5 conventions

This project uses Svelte 5 runes and event attributes: `$state`, `$props`, and `onsubmit`. It does not use legacy `export let`, `on:click`, or slot APIs.

## Build

```bash
npm run check
npm run build
```
