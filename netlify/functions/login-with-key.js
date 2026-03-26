import { ok, badRequest, methodNotAllowed, unauthorized, forbidden, serverError } from './_lib/http.js';
import { keysStore, usersStore } from './_lib/store.js';
import { createSession, makeSessionCookie } from './_lib/auth.js';
import { computeExpiry, nowIso } from './_lib/helpers.js';

export default async (req) => {
  if (req.httpMethod !== 'POST') return methodNotAllowed();
  const body = JSON.parse(req.body || '{}');
  const key = String(body.key || '').trim();
  const deviceId = String(body.deviceId || '').trim();
  const deviceLabel = String(body.deviceLabel || '').trim();
  if (!key || !deviceId) return badRequest('Faltan key o deviceId');
  try {
    const keyRef = await keysStore.get(`key:${key}`, { type: 'json' });
    if (!keyRef?.userId) return unauthorized('Key inválida');
    const user = await usersStore.get(`user:${keyRef.userId}`, { type: 'json' });
    if (!user || !user.active) return forbidden('Usuario inactivo o no encontrado');

    const devices = user.devices || [];
    const exists = devices.find((d) => d.id === deviceId);
    if (!exists && devices.length >= 2) {
      user.blockedAttempts = user.blockedAttempts || [];
      user.blockedAttempts.unshift({ id: deviceId, label: deviceLabel, at: nowIso() });
      user.blockedAttempts = user.blockedAttempts.slice(0, 20);
      await usersStore.setJSON(`user:${user.id}`, user);
      return forbidden('Se alcanzó el máximo de 2 dispositivos. El tercer dispositivo quedó bloqueado.');
    }
    if (!exists) devices.push({ id: deviceId, label: deviceLabel || 'Dispositivo', firstSeenAt: nowIso(), lastSeenAt: nowIso() });
    if (exists) exists.lastSeenAt = nowIso();
    user.devices = devices;
    user.updatedAt = nowIso();
    await usersStore.setJSON(`user:${user.id}`, user);

    const token = createSession({ role: 'user', userId: user.id, membership: user.membership, exp: computeExpiry(7) }, process.env.SESSION_SECRET || 'change-me');
    return ok({ ok: true, user: { id: user.id, name: user.name, membership: user.membership } }, { 'Set-Cookie': makeSessionCookie(token) });
  } catch (e) {
    return serverError(e.message);
  }
};
