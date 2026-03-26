export function json(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...headers,
    },
    body: JSON.stringify(body),
  };
}

export function ok(body, headers = {}) { return json(200, body, headers); }
export function badRequest(message) { return json(400, { ok: false, error: message }); }
export function unauthorized(message = 'No autorizado') { return json(401, { ok: false, error: message }); }
export function forbidden(message = 'Prohibido') { return json(403, { ok: false, error: message }); }
export function methodNotAllowed() { return json(405, { ok: false, error: 'Método no permitido' }); }
export function serverError(message = 'Error interno') { return json(500, { ok: false, error: message }); }
