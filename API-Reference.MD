# Full API Reference (Frontend + Backend)

> [Return to README](https://github.com/lukeponga-dev/exposurewatch/README.md)

## 1. POST /exposure/check

### Request

`POST {PUBLIC_API_BASE_URL}{PUBLIC_EXPOSURE_CHECK_PATH}`
 `Content-Type: application/json`

### Body

```json
{
  "email": "string"
}
```

### Response

```json
{
  "email": "test@example.com",
  "score": number,
  "level": "Low" | "Medium" | "High" | "Critical",
  "breaches": [
    {
      "breachName": "string",
      "dataClasses": ["string", ...]
    }
  ]
}
```

### Status Codes

| Code | Meaning |
| --- | --- |
| 200 | Exposure report returned |
| 400 | Invalid JSON request |
| 502 | Exposure provider unavailable |
| 503 | Exposure service is not configured |

---

## 2. Frontend API Wrapper

`fetchExposure(email: string): Promise<ExposureResult>`
 Located in: `src/lib/api/exposure.ts`

### Types

```typescript
export interface ExposureResult {
  email: string;
  score: number;
  level: "Low" | "Medium" | "High" | "Critical";
  breaches: Breach[];
}

export interface Breach {
  breachName: string;
  dataClasses: string[];
}
```

The backend controller and model records are authoritative for the wire contract. See the [canonical API contract](docs/api.md) for normalization, scoring, form requests, health, and error details.

### 🔁 Sequence Diagrams

**1. Email Exposure Check Flow**

```mermaid
sequenceDiagram 
     participant U as User
    participant F as SvelteKit Frontend
    participant A as ExposureWatch API

    U->>F: Enter email + submit
    F->>A: POST /exposure/check { email }
    A->>A: Validate + compute score
    A-->>F: JSON exposure result
    F-->>U: Render score, level, breaches
```

**2. Frontend Internal Flow**

```mermaid
 sequenceDiagram
    participant P as +page.svelte
    participant C as EmailInput.svelte
    participant API as exposure.ts
    participant R as ExposureResult.svelte

    P->>C: Render input component
    C->>API: fetchExposure(email)
    API->>API: Fetch + parse JSON
    API-->>C: ExposureResult
    C->>R: Pass result as props
    R-->>P: Render final UI
```

---

## **Deployment Architecture Diagrams**

**1. High-Level Deployment**

```mermaid
flowchart LR
    U(User Browser)
    F(SvelteKit Frontend<br/>Vercel Deployment)
    A(Spring Boot API<br/>exposurewatch.nz)

    U --> F
    F --> A
```

**2. Infrastructure Layout**

```mermaid
flowchart TD
    subgraph Vercel
        F[SvelteKit App]
    end

    subgraph Backend
        A[Spring Boot API]
        DB[(Breach Data Sources)]
    end

    F --> A
    A --> DB
```
