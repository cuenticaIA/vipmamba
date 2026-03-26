import { ok, badRequest, unauthorized, methodNotAllowed, serverError } from './_lib/http.js';
import { requireAdmin } from './_lib/auth.js';
import { usersStore } from './_lib/store.js';
import { nowIso } from './_lib/helpers.js';

export default async (req) => {
  if (req.httpMethod !== 'POST') return methodNotAllowed();
  const admin = requireAdmin(req);
  if (!admin) return unauthorized();
  const body = JSON.parse(req.body || '{}');
  const { userId, deviceId } = body;
  if (!userId || !deviceId) return badRequest('Faltan datos');
  try {
    const user = await usersStore.get(`user:${userId}`, { type: 'json' });
    if (!user) return badRequest('Usuario no encontrado');
    user.devices = (user.devices || []).filter((d) => d.id !== deviceId);
    user.updatedAt = nowIso();
    await usersStore.setJSON(`user:${userId}`, user);
    return ok({ ok: true, user });
  } catch (e) {
    return serverError(e.message);
  }
};
