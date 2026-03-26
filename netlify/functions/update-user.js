import { ok, badRequest, unauthorized, methodNotAllowed, serverError } from './_lib/http.js';
import { requireAdmin } from './_lib/auth.js';
import { usersStore } from './_lib/store.js';
import { normalizeMembership, nowIso } from './_lib/helpers.js';

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
    if (body.membership) user.membership = normalizeMembership(body.membership);
    if (typeof body.active === 'boolean') user.active = body.active;
    if (body.name) user.name = String(body.name).trim();
    if (body.email !== undefined) user.email = String(body.email || '').trim();
    if (body.phone !== undefined) user.phone = String(body.phone || '').trim();
    user.updatedAt = nowIso();
    await usersStore.setJSON(`user:${userId}`, user);
    return ok({ ok: true, user });
  } catch (e) {
    return serverError(e.message);
  }
};
