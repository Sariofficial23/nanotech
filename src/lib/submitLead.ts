import type { Lang } from '../i18n/langs';
import type { Lead } from './leadSchema';

/**
 * Sends a lead to the backend.
 * Default endpoint: the Vercel function in /api/lead (forwards to Telegram).
 * Set VITE_LEAD_ENDPOINT to post to another service instead; it must answer `{ "ok": true }` with a 2xx status.
 *
 * Resolves only when the server confirms delivery; otherwise throws LeadSubmitError.
 */
export type LeadErrorReason = 'not-configured' | 'invalid' | 'network' | 'server';

export class LeadSubmitError extends Error {
  readonly reason: LeadErrorReason;

  constructor(reason: LeadErrorReason) {
    super(`Lead submission failed: ${reason}`);
    this.name = 'LeadSubmitError';
    this.reason = reason;
  }
}

const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT?.trim() || '/api/lead';
const TIMEOUT_MS = 15_000;

export async function submitLead(lead: Lead, lang: Lang = 'uz'): Promise<void> {
  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...lead, lang, page: window.location.href }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new LeadSubmitError('network');
  }

  const body: unknown = await response.json().catch(() => null);
  const confirmed = typeof body === 'object' && body !== null && (body as { ok?: unknown }).ok === true;
  if (response.ok && confirmed) return;

  if (response.status === 404 || response.status === 503) throw new LeadSubmitError('not-configured');
  if (response.status === 400 || response.status === 422) throw new LeadSubmitError('invalid');
  throw new LeadSubmitError('server');
}
