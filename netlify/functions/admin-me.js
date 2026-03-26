import { ok, unauthorized } from './_lib/http.js';
import { requireAdmin } from './_lib/auth.js';

export default async (req) => {
  const admin = requireAdmin(req);
  if (!admin) return unauthorized();
  return ok({ ok: true, admin: { username: admin.username } });
};
