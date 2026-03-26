import { ok, badRequest, unauthorized, methodNotAllowed, serverError } from './_lib/http.js';
import { requireAdmin } from './_lib/auth.js';
import { usersStore, keysStore } from './_lib/store.js';
import { generateKey, nowIso } from './_lib/helpers.js';

export default async (req) => {
  if (req.httpMethod !== 'POST') return methodNotAllowed();
  const admin = requireAdmin(req);
  if (!admin) return unauthorized();
  const body = JSON.parse(req.body || '{}');
  const userId = body.userId;
  if (!userId) return badRequest('Falta userId');
  try {
    const user = await usersStore.get(`user:${userId}`, { type: 'json' });
    if (!user) return badRequest('Usuario no encontrado');
    if (user.key) await keysStore.delete(`key:${user.key}`);
    user.key = generateKey();
    user.updatedAt = nowIso();
    await usersStore.setJSON(`user:${userId}`, user);
    await keysStore.setJSON(`key:${user.key}`, { userId });
    return ok({ ok: true, user });
  } catch (e) {
    return serverError(e.message);
  }
};
