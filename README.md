
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

### Backend

- Spring Boot API
- JSON exposure report
- Hosted at: `https://api.exposurewatch.nz`

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
PUBLIC_API_BASE_URL=https://api.exposurewatch.nz
PUBLIC_EXPOSURE_CHECK_PATH=/exposure/check
```

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
