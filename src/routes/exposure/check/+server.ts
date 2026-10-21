import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface BreachRecord {
  breachName: string;
  dataClasses: string[];
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
    // Try parsing json anyway
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
    const upstreamRes = await fetch(`https://api.xposedornot.com/v1/check-email/${encodeURIComponent(normalizedEmail)}?details=true`);
    
    if (upstreamRes.ok) {
      const data = await upstreamRes.json();
      if (data && !data.Error) {
        const detailedBreaches = data.breach_details || data.breachDetails;
        if (Array.isArray(detailedBreaches)) {
          for (const b of detailedBreaches) {
            const name = b.name || b.breach || b.Name || b.Breach;
            if (name) {
              let rawDataClasses = b.exposed_data || b.xposed_data || b.exposedData || b.xposedData || [];
              let dataClasses: string[] = [];
              if (Array.isArray(rawDataClasses)) {
                dataClasses = rawDataClasses.filter((item: any) => typeof item === 'string' && item.trim().length > 0);
              } else if (typeof rawDataClasses === 'string') {
                dataClasses = rawDataClasses.split(/[;,]/).map((s: string) => s.trim()).filter(Boolean);
              }
              breaches.push({ breachName: name, dataClasses });
            }
          }
        } else {
          const names = data.breaches || data.Breaches;
          if (Array.isArray(names)) {
            for (const group of names) {
              if (Array.isArray(group)) {
                for (const item of group) {
                  if (typeof item === 'string' && item.trim().length > 0) {
                    breaches.push({ breachName: item.trim(), dataClasses: [] });
                  }
                }
              }
            }
          }
        }
      }
    } else if (upstreamRes.status !== 404) {
      // 404 means email not found in breaches, which is normal. Other errors could be upstream failure.
      console.warn(`XposedOrNot returned status ${upstreamRes.status}`);
    }
  } catch (err) {
    console.warn('Failed to reach XposedOrNot API:', err);
  }

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
