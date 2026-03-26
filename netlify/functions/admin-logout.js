import { ok } from './_lib/http.js';
import { clearSessionCookie } from './_lib/auth.js';

export default async () => ok({ ok: true }, { 'Set-Cookie': clearSessionCookie() });
