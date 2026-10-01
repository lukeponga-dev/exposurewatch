import {
  PUBLIC_API_BASE_URL,
  PUBLIC_EXPOSURE_CHECK_PATH,
} from "$env/static/public";
import type { ExposureResult } from "$lib/types/exposure";

export async function checkExposure(email: string): Promise<ExposureResult> {
  const baseUrl = PUBLIC_API_BASE_URL.replace(/\/$/, "");
  const path = PUBLIC_EXPOSURE_CHECK_PATH.startsWith("/")
    ? PUBLIC_EXPOSURE_CHECK_PATH
    : `/${PUBLIC_EXPOSURE_CHECK_PATH}`;

  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    let message = `Exposure API returned ${response.status}`;

    try {
      const problem = (await response.json()) as {
        detail?: string;
        title?: string;
      };
      message = problem.detail || problem.title || message;
    } catch {
      // Keep the status-based message when the server does not return JSON.
    }

    throw new Error(message);
  }

  return (await response.json()) as ExposureResult;
}
