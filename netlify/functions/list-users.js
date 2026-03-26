import { ok, unauthorized, serverError } from './_lib/http.js';
import { requireAdmin } from './_lib/auth.js';
import { usersStore } from './_lib/store.js';

export default async (req) => {
  const admin = requireAdmin(req);
  if (!admin) return unauthorized();
  try {
    const list = await usersStore.list({ prefix: 'user:' });
    const users = [];
    for (const blob of list.blobs || []) {
      const item = await usersStore.get(blob.key, { type: 'json' });
      if (item) users.push(item);
    }
    users.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    return ok({ ok: true, users });
  } catch (e) {
    return serverError(e.message);
  }
};
