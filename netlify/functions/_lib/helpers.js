import crypto from 'node:crypto';

export function safeJsonParse(str, fallback = null) {
  try { return JSON.parse(str); } catch { return fallback; }
}

export function randomId(len = 16) {
  return crypto.randomBytes(len).toString('hex');
}

export function generateKey() {
  const a = crypto.randomBytes(3).toString('hex').toUpperCase();
  const b = crypto.randomBytes(3).toString('hex').toUpperCase();
  const c = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `SP-${a}-${b}-${c}`;
}

export function nowIso() {
  return new Date().toISOString();
}

export function normalizeMembership(value) {
  const allowed = ['basic', 'medium', 'plus'];
  const v = String(value || '').toLowerCase();
  return allowed.includes(v) ? v : 'basic';
}

export function membershipLabel(value) {
  return ({ basic: 'Básico', medium: 'Medium', plus: 'Plus' })[value] || 'Básico';
}

export function maskKey(key) {
  if (!key || key.length < 8) return key || '';
  return `${key.slice(0, 6)}••••${key.slice(-4)}`;
}

export function computeExpiry(days = 7) {
  return Date.now() + (days * 24 * 60 * 60 * 1000);
}
