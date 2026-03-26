import { ok, badRequest, unauthorized, methodNotAllowed, serverError } from './_lib/http.js';
import { requireAdmin } from './_lib/auth.js';
import { usersStore, keysStore, auditStore } from './_lib/store.js';
import { generateKey, normalizeMembership, nowIso, randomId } from './_lib/helpers.js';

export default async (req) => {
  if (req.httpMethod !== 'POST') return methodNotAllowed();
  const admin = requireAdmin(req);
  if (!admin) return unauthorized();
  const body = JSON.parse(req.body || '{}');
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const phone = String(body.phone || '').trim();
  const membership = normalizeMembership(body.membership);
  if (!name) return badRequest('El nombre es obligatorio');
  const userId = randomId(8);
  const key = generateKey();
  const user = {
    id: userId,
    name,
    email,
    phone,
    membership,
    key,
    active: true,
    devices: [],
    blockedAttempts: [],
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
  try {
    await usersStore.setJSON(`user:${userId}`, user);
    await keysStore.setJSON(`key:${key}`, { userId });
    await auditStore.setJSON(`event:${Date.now()}:${userId}`, { type: 'user_created', by: admin.username, at: nowIso(), userId });
    return ok({ ok: true, user });
  } catch (e) {
    return serverError(`No se pudo crear el usuario: ${e.message}`);
  }
};
