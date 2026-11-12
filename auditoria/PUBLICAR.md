# Publicar y volver atrás

Publicado el 2026-11-12: la rama entró a `main` con el merge `20ec379` y está en hivrido.com. Lo que sigue queda como guía para la próxima publicación y para volver atrás.

## Antes de publicar

1. Leé [PENDIENTES.md](PENDIENTES.md), sobre todo las decisiones 1 a 5.
2. Mirá el resultado en local:
   ```bash
   git checkout optimizacion-integral
   npm run build && npx next start -p 3311
   ```
   Abrí `http://localhost:3311/`, `/web/`, `/diseno-web/` y `/colmena-agentes/`.
3. Opcional, los tests: `python -I tests/e2e/flujos.py` (con el servidor de arriba corriendo).

Si el build local muestra estilos viejos después de cambiar de rama, borrá `.next` y compilá de nuevo: la caché de webpack a veces no toma los cambios de CSS. En Vercel no pasa, compila siempre en limpio.

## Publicar

```bash
git checkout main
git merge --no-ff optimizacion-integral
npm run build
git push origin main
```

El proyecto de Vercel no está conectado a GitHub, así que el push no publica. Deploy desde una copia limpia de `HEAD` (Git Bash):

```bash
D=$(mktemp -d) && git archive HEAD | tar -x -C "$D" && cp -r .vercel "$D/" \
  && (cd "$D" && npx vercel deploy --prod --yes); rm -rf "$D"
```

Variables de entorno: no hace falta ninguna nueva. `NEXT_PUBLIC_GA4_ID` es opcional.

## Verificar después de publicar

```bash
curl -sI https://hivrido.com/ | grep -iE "x-content-type|referrer-policy|permissions-policy|content-security|strict-transport"
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" https://hivrido.com/colmenas-agentes/   # 308 → /colmena-agentes/
curl -s https://hivrido.com/web/ | grep -c "eco-item"                                           # 7
BASE=https://hivrido.com python -I tests/e2e/flujos.py
```

Las cabeceras y las redirecciones nuevas viven en `vercel.json`: es la primera vez que se van a ver funcionando. Revisá que el reproductor de YouTube siga andando en una ficha: la CSP nueva es mínima y no debería afectarlo, pero es lo único que no se pudo probar en local.

## Volver atrás

Lo más rápido, sin tocar git: en el panel de Vercel, **Deployments → el deploy anterior → Promote to Production** (o `npx vercel rollback`). Es instantáneo.

Después, para que el repo coincida:

```bash
git revert -m 1 <hash del merge>
git push origin main
```

No hay migraciones ni cambios de datos: la rama solo toca código, imágenes derivadas y `vercel.json`, así que volver atrás no deja nada a medias.
