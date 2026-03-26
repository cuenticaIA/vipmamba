import crypto from 'node:crypto';

const COOKIE_NAME = 'studiopro_session';

function b64url(input) {
  return Buffer.from(input).toString('base64url');
}

function sign(data, secret) {
  return crypto.createHmac('sha256', secret).update(data).digest('base64url');
}

export function createSession(payload, secret) {
  const encoded = b64url(JSON.stringify(payload));
  const signature = sign(encoded, secret);
  return `${encoded}.${signature}`;
}

export function readSession(token, secret) {
  if (!token || !secret) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;
  const expected = sign(encoded, secret);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function parseCookies(header = '') {
  const out = {};
  header.split(/;\s*/).filter(Boolean).forEach((part) => {
    const idx = part.indexOf('=');
    if (idx > -1) out[part.slice(0, idx)] = decodeURIComponent(part.slice(idx + 1));
  });
  return out;
}

export function makeSessionCookie(token, maxAgeSeconds = 60 * 60 * 24 * 7) {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${maxAgeSeconds}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`;
}

export function getSessionFromEvent(event) {
  const secret = process.env.SESSION_SECRET || 'change-me';
  const cookies = parseCookies(event.headers.cookie || event.headers.Cookie || '');
  return readSession(cookies[COOKIE_NAME], secret);
}

export function requireAdmin(event) {
  const session = getSessionFromEvent(event);
  return session && session.role === 'admin' ? session : null;
}

export function requireUser(event) {
  const session = getSessionFromEvent(event);
  return session && session.role === 'user' ? session : null;
}

export { COOKIE_NAME };
