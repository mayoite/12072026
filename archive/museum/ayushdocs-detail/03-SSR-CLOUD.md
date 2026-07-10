# SSR cloud (later)

**Status:** **Do not start yet.** Hard path works locally. SSR is only for a **shared public URL**.

---

## When

| Trigger | Action |
|---------|--------|
| Solo / local product feel | Stay on laptop — `pnpm run dev` |
| Need link for demos / multi-device | Provision SSR |
| Multi-user Supabase authority incomplete | Still fine to wait |

---

## Size

| Spec | Call |
|------|------|
| **Start** | **2 CPU / 32 GB RAM** |
| Not yet | 4c / 64G |
| Upsize when | Real concurrent load, OOM, or build/runtime CPU saturation |

Open3d is browser-heavy; server mainly serves Next + APIs + optional SVG/GLB compile.

---

## Env (copy names, not this file into git)

Keys already in repo-root **`.env.local`**. On the server, set the **same variable names**.

Minimum (see `.env.example` + `validate-launch-env.mjs`):

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `PRODUCTS_DATABASE_URL`, `SUPABASE_AUTH_DATABASE_URL`
- AI / admin / R2 keys you actually use in prod

Do **not** commit `.env.local`. Paste values into host secrets / env panel only.

Validate after copy (on machine with Node):

```powershell
pnpm --filter oando-site exec node scripts/validate-launch-env.mjs
```

---

## Build & start (when ready)

```bash
# on server, repo checkout
pnpm install
# set env names (host secrets or .env.local)
pnpm run build
pnpm run start
```

- App listens as configured by standalone start (`site` package `start` → standalone server).
- Put **HTTPS reverse proxy** (Caddy/Nginx) in front; point DNS at the box.
- Vercel remains an option for marketing deploy; this doc is for a **long-lived Node SSR** box (2c/32G).

---

## Checklist before going live

1. Shared URL actually needed  
2. 2c / 32G provisioned  
3. Env names copied from local `.env.local`  
4. `pnpm install` → `pnpm run build` → `pnpm run start`  
5. Proxy + HTTPS  
6. Smoke: `/`, `/planner/open3d`, `/api/planner/catalog/`  
7. Upsize only with evidence of load/memory pressure  

Pending tracking: `00-PENDING.md` OPS.1–OPS.3.
