# Salvage map — all sources we could find

**Purpose:** You rebuilt by salvaging whatever survived. This lists those sources so nothing is “cleaned” by accident.  
**Scanned:** 2026-07-09  
**Rule:** Do not delete any of these. Do not force-push. Do not squash history. Archive only with copies.

---

## Truth in one line

Work after the wipe is a **constellation of snapshots and short-lived repos**, not one continuous 8–15 month git line from April 2025. Salvage = pick best pieces from each, carefully.

**No remote commit dated 2025** was found on the three GitHub accounts we can access. Your start (April 2025) is still missing from proven git.

---

## A. Local git (6)

| Priority | Path | Why salvage |
|----------|------|-------------|
| **P0 live** | `D:\OandO07072026` | Current product line (97 commits, Jul 4–9 2026) |
| **P1 parent** | `D:\oandO04072026` | Same root as live; extra `restore-*` branches |
| **P1 backup** | `D:\codex07072026.backup-20260707-132108` | Freeze of early Codex line |
| **P1 tree** | `D:\0106-ayush.backupverstversion -delete.backupbestversion` | Huge file tree (4353 files); git only 2 commits (Jun 1 snapshot) — **files matter more than git** |
| **P1 planner** | `D:\OOFPLWeb` | Separate Open3D / inventory line (94 commits) |
| **P2 site** | `D:\OandOWebsite\OandoOwebsite` | Thin website import |

**Non-git local:** `D:\websites\` (research only)

---

## B. Remote GitHub (20 across 3 accounts)

### Active / current
| Repo | Account | Role |
|------|---------|------|
| **Codex07072026** | pglcarpets | **Live origin** for OandO07072026 |

### Explicit recovery
| Repo | Account | Role |
|------|---------|------|
| **oando06072026forrecovery** | ayushonmicrosoft | Named disaster recovery; 1 commit from **C: drive backup** |
| oandO04072026 | ayushonmicrosoft | Parent snapshot line (public) |

### Mid salvage chain (Mar–Jul 2026) — harvest candidates
| Repo | Oldest commit (proven) | Notes |
|------|------------------------|--------|
| Renameit | 2026-02-26 | Earliest commit we found on remotes |
| workingoando / oandov3 | 2026-03-06 | Early rebuild |
| claude1703 | 2026-03-06 | Planner toolbar era |
| Final0704 / Final_oando_0504 | 2026-04-05 | “SmartDraw CAD Architecture” era |
| Replit | 2026-04-10 | R3F / blueprint / BOQ (~231 commits) |
| OandOcraft | 2026-04-15 | Specs + copilot (~358 commits) |
| 3105-worktree / claude0206 | 2026-05-31 | “import from exp3005” |
| Oando06052026 / oando-consolidated | 2026-06-05 | Consolidation attempts |
| OandOweb / OandoOwebsite | late Jun | Site |
| OOFPLWeb | 2026-06-26 | Matches local OOFPLWeb |
| OOFPL05072026 | 2026-07-04 | Same snapshot family as Codex |

### Other
| Repo | Notes |
|------|--------|
| cursor | Tiny public |
| claude0206 / 3105-worktree | May/Jun imports |
| Replit | Short intense April burst |

### Gone from remote (but may exist only local)
| Name | Status |
|------|--------|
| **0106** | Local origin URL → **Repository not found** on GitHub |

---

## C. How salvage typically happened (pattern)

```
April 2025 … ???  →  (missing from remotes we can see)
        ↓
Feb–May 2026: many short repos (Renameit → Final → craft → Replit)
        ↓
Jun 2026: 0106 personal backup snapshot, consolidations
        ↓
Jul 4 2026: oandO04072026 snapshot root (D:\new) — NEW git life
        ↓
Jul 6: “forrecovery” from C: drive
        ↓
Jul 7–9: Codex07072026 = current single main
```

That is **salvage archaeology**, not one product timeline.

---

## D. What to protect forever

1. All 6 local git folders above  
2. Especially **0106 … bestversion** (file salvage)  
3. **oando06072026forrecovery** on GitHub  
4. **OandOcraft**, **Replit**, **Final_***, **claude1703**, **workingoando** (feature salvage)  
5. Any **C:** path still mentioned in recovery commit messages  

**Do not** let agents run: `git clean -fdx`, delete “old” folders, force-push, or “squash everything into one history” without a written plan and your OK.

---

## E. Sensible salvage process (when you have energy)

| Step | Action | Risk |
|------|--------|------|
| 1 | Freeze: no deletes | None |
| 2 | Tag this map as authority for “where stuff lives” | None |
| 3 | Read-only catalog: modules per repo (planner, site, admin, catalog) | None |
| 4 | Diff candidates → current Codex (file lists only) | None |
| 5 | Cherry-pick **ideas/files** into current main by hand | Low if PR-sized |
| 6 | Never merge entire ancient repos blindly | High if done |

**Live product stays:** `D:\OandO07072026` + `Codex07072026`.  
**Salvage is inbound only** — old repos are museums + parts bins.

---

## F. Emotional truth (accurate, not soft)

You didn’t fail to keep one clean monorepo. You **kept the project alive** by cloning, renaming, snapshotting, and recovering after history died. That’s why there are so many repos. It’s messy because **survival is messy**.

The job now is not “make 20 repos feel like one past.”  
It’s: **stop the bleeding, protect the bins, pull only what the current product needs.**

---

## G. Next step options (you choose)

1. **Catalog modules** — for each top salvage repo, list top-level folders (read-only)  
2. **Clone recovery** — pull `oando06072026forrecovery` to a **new** folder under `D:\salvage\` (not inside live repo)  
3. **Compare** — file-name overlap 0106 vs OandO07072026  
4. **Pause** — map is enough for today  

No action taken beyond writing this file.
