# W-GATES — gate evidence vs product finished

**Pack date:** 2026-07-10  
**Rule:** **GATE** = historical folder evidence exists for CP criteria. **PRODUCT** = buyer-ready. Do not conflate.

| Gate | GATE status | Primary path | PRODUCT residual |
|------|-------------|--------------|------------------|
| **W0** unlock | **GATE PASS** | `00-start/NOTES.md` + `Plans/trustdata/00-START.md` | N/A (process) |
| **P01** truth | **GATE PASS** (folder pack) | `00-product-truth/` | Inventory can drift — re-read if claims change |
| **P02** engine | **GATE PASS** | `01-engine-lock/` | Fabric full stage **not** done (destination) |
| **W1** draw browser | **GATE PASS** (artifact) | `02-browser-open3d-journey/` | Not re-run on HEAD `500ac6e` this session |
| **W2** place | **GATE PASS** (artifact) | same journey folder | Same |
| **W2** symbols | **GATE PASS** (artifact) | `05-symbols-svg/` | Block2D quality still improvable |
| **W3** select/delete | **GATE PASS** (artifact) | `03-select-delete/` | Openings e2e optional residual |
| **W4** orbit | **GATE PASS** (artifact) | `04-orbit-continuity/` | Continuity proven in old pack only |
| **W5** save reload | **GATE PASS** (artifact) | `06-save-honesty/save-reload/` | Local IDB only |
| **W6** save honesty | **GATE PASS** (artifact) | `06-save-honesty/` | **No cloud** — by design for this gate |
| **W7** mesh | **GATE PASS** (bar) | `08-mesh-quality/` | **Still boxy** — not photoreal |
| **W8** shortcuts | **GATE PASS** (artifact) | `09-shortcuts-chrome/` | Chrome polish residuals |
| **Pack CP-10** | **OPEN → in progress** | `10-handover/` | This pack |
| **Callable e2e** | **GATE PASS** (old) | `gate-e2e/run.json` | Not re-run today |
| **Product ship** | **NOT PASS** | — | Explicit |

## Live checks this rebaseline session (not full W suite)

| Check | Result | Path / note |
|-------|--------|-------------|
| `tsc --noEmit` (site) | **exit 0** | 2026-07-10 rebaseline |
| `check:layout` | **OK** after deleting `site/test-results` | AGENTS layout |
| Dual git remotes | **OK** | origin + mayoite with account switch |
| Full Playwright W pack on HEAD | **NOT RUN** | Do not invent PASS |

## Bottom line for owner

- **Finished gates (paper + folders):** mostly yes for CP-00…09 artifacts.  
- **Finished product:** **no**.  
- **Open program pack:** CP-10 (this folder).  
- **Open product half:** mesh raise, cloud, Fabric, BOQ, a11y LH, etc.  
