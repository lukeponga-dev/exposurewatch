import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface BreachRecord {
  breachName: string;
  breachDate?: string;
  dataClasses: string[];
}

interface BreachMetadata {
  breachedDate?: string;
  exposedData?: string[];
}

let breachMetadataCache: Map<string, BreachMetadata> | null = null;
let lastCacheFetch = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

async function getBreachMetadata(): Promise<Map<string, BreachMetadata>> {
  const now = Date.now();
  if (breachMetadataCache && now - lastCacheFetch < CACHE_TTL_MS) {
    return breachMetadataCache;
  }

  try {
    const res = await fetch('https://api.xposedornot.com/v1/breaches', {
      headers: { 'User-Agent': 'ExposureWatch/1.0' }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.exposedBreaches)) {
        const map = new Map<string, BreachMetadata>();
        for (const b of data.exposedBreaches) {
          const id = (b.breachID || '').toLowerCase();
          if (id) {
            map.set(id, {
              breachedDate: b.breachedDate || b.addedDate || undefined,
              exposedData: Array.isArray(b.exposedData) ? b.exposedData : undefined
            });
          }
        }
        breachMetadataCache = map;
        lastCacheFetch = now;
        return map;
      }
    }
  } catch (err) {
    console.warn('Failed to load breach metadata from XposedOrNot:', err);
  }

  return breachMetadataCache || new Map();
}

export const POST: RequestHandler = async ({ request }) => {
  let email = '';
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    try {
      const body = await request.json();
      email = body.email || '';
    } catch {
      return json({ detail: 'Invalid JSON body' }, { status: 400 });
    }
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    try {
      const text = await request.text();
      const params = new URLSearchParams(text);
      email = params.get('email') || '';
    } catch {
      return json({ detail: 'Invalid form data' }, { status: 400 });
    }
  } else {
    try {
      const body = await request.json();
      email = body.email || '';
    } catch {
      return json({ detail: 'Unsupported Content-Type' }, { status: 400 });
    }
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return json({ detail: 'A valid email address is required' }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const breaches: BreachRecord[] = [];

  try {
    const [metadataMap, upstreamRes] = await Promise.all([
      getBreachMetadata(),
      fetch(`https://api.xposedornot.com/v1/check-email/${encodeURIComponent(normalizedEmail)}?details=true`, {
        headers: { 'User-Agent': 'ExposureWatch/1.0' }
      })
    ]);

    if (upstreamRes.ok) {
      const data = await upstreamRes.json();
      if (data && !data.Error) {
        const detailedBreaches = data.breach_details || data.breachDetails;
        if (Array.isArray(detailedBreaches)) {
          for (const b of detailedBreaches) {
            const name = b.name || b.breach || b.Name || b.Breach;
            if (name) {
              const meta = metadataMap.get(name.toLowerCase());
              let rawDataClasses = b.exposed_data || b.xposed_data || b.exposedData || b.xposedData || [];
              let dataClasses: string[] = [];
              if (Array.isArray(rawDataClasses)) {
                dataClasses = rawDataClasses.filter((item: any) => typeof item === 'string' && item.trim().length > 0);
              } else if (typeof rawDataClasses === 'string') {
                dataClasses = rawDataClasses.split(/[;,]/).map((s: string) => s.trim()).filter(Boolean);
              }

              if (dataClasses.length === 0 && meta?.exposedData) {
                dataClasses = meta.exposedData;
              }

              const breachDate = b.breachedDate || b.breach_date || b.date || meta?.breachedDate;
              breaches.push({
                breachName: name,
                breachDate: breachDate || undefined,
                dataClasses
              });
            }
          }
        } else {
          const names = data.breaches || data.Breaches;
          if (Array.isArray(names)) {
            for (const group of names) {
              if (Array.isArray(group)) {
                for (const item of group) {
                  if (typeof item === 'string' && item.trim().length > 0) {
                    const trimmed = item.trim();
                    const meta = metadataMap.get(trimmed.toLowerCase());
                    breaches.push({
                      breachName: trimmed,
                      breachDate: meta?.breachedDate,
                      dataClasses: meta?.exposedData || []
                    });
                  }
                }
              }
            }
          }
        }
      }
    } else if (upstreamRes.status !== 404) {
      console.warn(`XposedOrNot returned status ${upstreamRes.status}`);
    }
  } catch (err) {
    console.warn('Failed to reach XposedOrNot API:', err);
  }

  // Sort breaches by date descending (most recent breaches first)
  breaches.sort((a, b) => {
    if (a.breachDate && b.breachDate) {
      return new Date(b.breachDate).getTime() - new Date(a.breachDate).getTime();
    }
    if (a.breachDate) return -1;
    if (b.breachDate) return 1;
    return a.breachName.localeCompare(b.breachName);
  });

  const score = Math.min(100, breaches.length * 20);
  let level = 'Low';
  if (score > 75) level = 'Critical';
  else if (score > 50) level = 'High';
  else if (score > 20) level = 'Medium';

  return json({
    email: normalizedEmail,
    score,
    level,
    breaches
  });
};
