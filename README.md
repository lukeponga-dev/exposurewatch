# ExposureWatch — Email Exposure Checker

ExposureWatch is a lightweight SvelteKit 5 application that checks whether an email address has appeared in known data breaches. It communicates with the ExposureWatch Spring Boot API and displays an exposure score, risk level, and detailed breach information.

---

## 📖 Documentation

[Project documentation](docs/overview.md)

[API Reference](API-Reference.MD)

## 🚀 Features

- Check if an email appears in known data breaches
- Exposure score + risk level
- Detailed breach list with data classes
- Fast SvelteKit 5 frontend using runes
- Clean API layer with typed responses
- Vercel‑ready deployment

---

## 🧱 Tech Stack

### Frontend

- SvelteKit 5
- Svelte runes (`$state`, `$props`)
- TypeScript
- Vite
- Deployed at: <https://exposurewatch.vercel.app>

### Backend

- Spring Boot API
- JSON exposure report
- Hosted at: <https://exposurewatch-api.onrender.com>

---

## 🔄 How It Works

1. User enters an email
2. Frontend sends a POST request to the API
3. API returns exposure score + breach details
4. UI renders risk level and breach list

### Example Request

```json
{
  "email": "you@example.com"
}
```

### Example Response

```json
{
  "email": "you@example.com",
  "score": 72,
  "level": "High",
  "breaches": [
    {
      "breachName": "Example breach",
      "dataClasses": ["Email addresses", "Passwords"]
    }
  ]
}
```

---

## 🧪 Local Development

```bash
npm install
cp .env.example .env
npm run dev
```

### Required Environment Variables

```env
PUBLIC_API_BASE_URL=http://localhost:8080
PUBLIC_EXPOSURE_CHECK_PATH=/exposure/check
```

Use the deployed API origin for production builds.

## 🚀 Deployment

**Current production deployment:** verified 2026-10-02.

- Frontend: <https://exposurewatch.vercel.app>
- API: <https://exposurewatch-api.onrender.com>
- API health: <https://exposurewatch-api.onrender.com/actuator/health>

The frontend is deployed to Vercel and the Spring Boot API is deployed to Render.
The Render service is defined in [`render.yaml`](render.yaml) and builds from `server/Dockerfile`.

Configure these Vercel production variables:

```env
PUBLIC_API_BASE_URL=https://exposurewatch-api.onrender.com
PUBLIC_EXPOSURE_CHECK_PATH=/exposure/check
```

Configure this Render variable with the final Vercel origin:

```env
EXPOSUREWATCH_FRONTEND_ORIGIN=https://exposurewatch.vercel.app
```

Deploy the frontend with:

```bash
vercel --prod
```

Deploy the API with the Render Blueprint from `render.yaml`. The API health check is
`/actuator/health`; the lightweight probe is `/health`.

To test the API container locally:

```bash
cd server
docker build -t exposurewatch-api .
docker run --rm -p 8080:8080 exposurewatch-api
```

Use a different host port, such as `18080:8080`, if local Java is already using port 8080.

If your API uses different routes or JSON shapes, update:

- `src/lib/api/exposure.ts`
- `src/lib/types/exposure.ts`

---

## 📁 Project Structure

```text
src/
 ├─ lib/
 │   ├─ api/exposure.ts      # API client
 │   └─ types/exposure.ts    # Type definitions
 ├─ routes/
 │   └─ +page.svelte         # Main UI
 └─ components/
     ├─ EmailInput.svelte
     └─ ExposureResult.svelte
```

---

## 📜 License

MIT
