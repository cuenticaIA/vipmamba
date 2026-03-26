# StudioPRO Netlify Plan B (entrega manual de keys)

Base compatible con Netlify para:
- login con key única
- panel admin
- membresías Basic / Medium / Plus
- límite de 2 dispositivos
- bloqueo del 3er dispositivo nuevo
- entrega manual de keys desde el panel admin

## Stack
- Frontend estático en `/public`
- Netlify Functions en `/netlify/functions`
- Netlify Blobs como almacenamiento simple de usuarios, keys y auditoría

## Requisitos
- Cuenta de Netlify
- Node 18+
- Netlify CLI (`npm install` ya lo incluye)

## Variables de entorno
Copia `.env.example` como `.env` para desarrollo local y configura las mismas variables en Netlify:
- `ADMIN_USER`
- `ADMIN_PASS`
- `SESSION_SECRET`
- `PUBLIC_APP_URL`

## Desarrollo local
```bash
npm install
npx netlify dev
```

## Deploy
1. Sube esta carpeta a un repositorio Git.
2. Conéctalo a Netlify.
3. En Site configuration → Environment variables, agrega las variables.
4. Deploy.

## Rutas
- `/login` o `/index.html` → acceso por key
- `/admin` → panel admin
- `/app` → portal del usuario

## Flujo de entrega manual
1. Entra al panel admin.
2. Crea el usuario.
3. Copia la key generada.
4. Entrégala manualmente al cliente.
5. Si hace falta, usa “Regenerar key” para emitir una nueva.

## Límites y honestidad
- El control de dispositivo usa fingerprint de navegador. Es práctico, pero no invulnerable.
- Para seguridad fuerte, conviene una base de datos dedicada y un sistema de autenticación más robusto.
- Esta base sí es compatible con Netlify; no depende de PHP.
