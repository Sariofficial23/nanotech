// Vercel Function: POST /api/lead
// Validates a contact-form lead and forwards it to a Telegram chat.
// Required environment variables (Vercel → Project → Settings → Environment Variables):
//   TELEGRAM_BOT_TOKEN — token from @BotFather
//   TELEGRAM_CHAT_ID   — chat/group id that receives leads (the bot must be a member)
// Without them the function answers 503, and the form shows an error — never a fake success.

import { interestLabel, leadSchema } from '../src/lib/leadSchema';

const json = (status: number, body: Record<string, unknown>) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return json(503, { ok: false, error: 'not_configured' });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json(400, { ok: false, error: 'invalid_json' });
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) return json(422, { ok: false, error: 'invalid' });

  const { name, phone, interest, comment } = parsed.data;
  const page = typeof (payload as { page?: unknown }).page === 'string' ? (payload as { page: string }).page : '';
  const time = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });

  const text = [
    '<b>Saytdan yangi so‘rov</b>',
    '',
    `<b>Ism:</b> ${escapeHtml(name)}`,
    `<b>Telefon:</b> ${escapeHtml(phone)}`,
    `<b>Yo‘nalish:</b> ${escapeHtml(interestLabel(interest))}`,
    comment ? `<b>Izoh:</b> ${escapeHtml(comment)}` : null,
    '',
    `<i>${escapeHtml(time)}${page ? ` · ${escapeHtml(page.slice(0, 200))}` : ''}</i>`,
  ]
    .filter((line) => line !== null)
    .join('\n');

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error('Telegram sendMessage failed', res.status, await res.text().catch(() => ''));
      return json(502, { ok: false, error: 'delivery_failed' });
    }
  } catch (err) {
    console.error('Telegram sendMessage error', err);
    return json(502, { ok: false, error: 'delivery_failed' });
  }

  return json(200, { ok: true });
}

export function GET() {
  return json(405, { ok: false, error: 'method_not_allowed' });
}
