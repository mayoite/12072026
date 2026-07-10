# How to proceed (local)

**Repo:** `.` only — no git worktrees.  
**Commands:** run from repo root unless noted.

---

## 1. First-time install

```powershell
cd .
pnpm install
copy .env.example .env.local   # if you don't already have keys
```

Keys already live in repo-root **`.env.local`** (not committed). Loaded by `site/scripts/loadEnvLocal.cjs` for Next, Playwright, and scripts.

Validate minimum keys:

```powershell
pnpm --filter oando-site exec node scripts/validate-launch-env.mjs
```

Restart dev after any `.env.local` change.

---

## 2. Dev server

```powershell
pnpm run dev
```

- Site: http://localhost:3000  
- Open3d: http://localhost:3000/planner/open3d  
- Guest planner: http://localhost:3000/planner/guest/

Production-style local preview:

```powershell
pnpm run build
pnpm run start
```

---

## 3. Quick smokes

### SVG batch (CLI — no browser)

From `site/` (or `pnpm --filter oando-site run …`):

```powershell
cd site
pnpm run scripts:smoke:svg          # one fixture (chaise)
pnpm run scripts:smoke:svg:batch    # all generate-svg fixtures
```

Evidence pattern: `results/planner/svg-cli-smoke/`, `results/planner/verify-wave/`.

### Open3d + cabinet-v0 (browser)

1. `pnpm run dev`
2. Open `/planner/open3d`
3. Place **cabinet-v0**
4. Confirm 2D footprint + 3D modular mesh (stacked boxes is current honesty bar until mesh polish)

Unit path for place→mesh (optional):

```powershell
cd site
npx vitest run tests/unit/features/planner/open3d/modularPlaceMesh.test.ts
```

---

## 4. Fabric flag (optional)

Default: **OFF** — live 2D is FeasibilityCanvas only.

To try Fabric furniture overlay:

1. In repo-root `.env.local` set:

   ```
   NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1
   ```

2. Restart `pnpm run dev`
3. Open `/planner/open3d` — furniture Rects + pan/zoom overlay; **not** full walls/rooms cutover

Unset / `0` to return to default. Browser smoke with flag ON is still open (see `00-PENDING.md` P1.1).

---

## 5. What to do next

Start from **[00-PENDING.md](./00-PENDING.md)** — pick one P0 kill-path.  
Do **not** stand up SSR until you need a shared URL → **[03-SSR-CLOUD.md](./03-SSR-CLOUD.md)**.

Full command list: root **`START.md`**. Repo facts: **`Readme.md`**.
