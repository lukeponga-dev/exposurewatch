import { PUBLIC_API_BASE_URL, PUBLIC_EXPOSURE_CHECK_PATH } from '$env/static/public';
import type { ExposureResult } from '$lib/types/exposure';

export async function checkExposure(email: string): Promise<ExposureResult> {
  const baseUrl = PUBLIC_API_BASE_URL.replace(/\/$/, '');
  const path = PUBLIC_EXPOSURE_CHECK_PATH.startsWith('/')
    ? PUBLIC_EXPOSURE_CHECK_PATH
    : `/${PUBLIC_EXPOSURE_CHECK_PATH}`;

  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email })
  });

  if (!response.ok) {
    throw new Error(`Exposure API returned ${response.status}`);
  }

  return (await response.json()) as ExposureResult;
}
