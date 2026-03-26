import { ok, unauthorized, serverError } from './_lib/http.js';
import { requireUser } from './_lib/auth.js';
import { usersStore } from './_lib/store.js';

export default async (req) => {
  const session = requireUser(req);
  if (!session) return unauthorized();
  try {
    const user = await usersStore.get(`user:${session.userId}`, { type: 'json' });
    if (!user || !user.active) return unauthorized();
    return ok({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        membership: user.membership,
        devices: user.devices || []
      }
    });
  } catch (e) {
    return serverError(e.message);
  }
};
