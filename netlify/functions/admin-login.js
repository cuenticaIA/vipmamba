import { ok, badRequest, methodNotAllowed, unauthorized } from './_lib/http.js';
import { createSession, makeSessionCookie } from './_lib/auth.js';
import { computeExpiry } from './_lib/helpers.js';

export default async (req) => {
  if (req.httpMethod !== 'POST') return methodNotAllowed();
  const body = JSON.parse(req.body || '{}');
  const user = body.username || '';
  const pass = body.password || '';
  if (!user || !pass) return badRequest('Faltan credenciales');
  if (user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASS) {
    return unauthorized('Credenciales inválidas');
  }
  const token = createSession({ role: 'admin', username: user, exp: computeExpiry(7) }, process.env.SESSION_SECRET || 'change-me');
  return ok({ ok: true, username: user }, { 'Set-Cookie': makeSessionCookie(token) });
};
