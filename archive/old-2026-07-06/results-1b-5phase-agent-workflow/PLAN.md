# 1B SVG Production Path: 5-Phase Sequential Agent Workflow Plan

## Overview
This is a 5-phase sequential workflow. It sends the repo through specialized agents in strict order, one at a time.

The workflow lives in a sub folder inside a git worktree for isolation: worktrees/1b-agent-workflow/1b-5phase-agent-workflow/

Each phase runs one agent. The agent does its job using the assigned skill. The orchestrator (not the agent) then writes the report into a sub folder named after the agent.

Report format (same for every agent):
- observations.md (bullet points)
- work-done.md (bullet points)
- failures.md (bullet points)
- executive-summary.md (detailed document with executive summary at the top)

No agent prompt or output ever mentions the report folder or file names. The orchestrator alone creates the folders and files after the agent finishes.

The 5 phases match the requested order:
1. Repair agent
2. Benchmarker
3. UI expert (to improve)
4. Critic (uses playwright a11y + chrome dev tools)
5. Planner (uses superpowers to make a plan)

All work happens only in the repo (D:\oandO04072026). No work in C drive. This worktree isolates the changes.

## Sub Folder Structure
worktrees/1b-agent-workflow/1b-5phase-agent-workflow/
- 01-repair-agent/
  - observations.md
  - work-done.md
  - failures.md
  - executive-summary.md
- 02-benchmarker/
  - ...
- 03-ui-expert/
  - ...
- 04-critic/
  - ...
- 05-planner/
  - ...

The orchestrator creates this structure. Agents only output text in the required sections.

## Phase 1: Repair Agent
Goal: Find and fix problems in the code.

Skill to use: systematic-debugging

What the agent does:
- Read key files and run targeted checks.
- Find root causes.
- Propose or apply small fixes.
- Output only the 4 required sections.

Orchestrator action after agent finishes:
- Write the 4 report files into 01-repair-agent/
- Record any changes in Failures.md with evidence.

## Phase 2: Benchmarker
Goal: Check the current state against standards.

Skill to use: verification-before-completion

What the agent does:
- Run verification commands using evidence wrappers.
- Check against 5-product model, RECs, BPs, coverage, evidence rules.
- Output only the 4 required sections.

Orchestrator action:
- Write the 4 report files into 02-benchmarker/
- Capture all run evidence.

## Phase 3: UI Expert (to Improve)
Goal: Improve the UI.

Skill to use: brainstorming (plus chrome-devtools patterns)

What the agent does:
- Inspect UI surfaces (open3d planner, admin/svg-editor).
- Suggest thin, contextual, minimal changes (REC-01 style).
- Output only the 4 required sections.

Orchestrator action:
- Write the 4 report files into 03-ui-expert/

## Phase 4: Critic
Goal: Deep review with real browser tools. Improve the UI.

Skills and tools to use:
- a11y-debugging
- chrome-devtools (full MCP)
- playwright a11y runs (via evidence command)

What the agent does:
- Use chrome-devtools MCP: navigate to routes, take snapshots, run lighthouse a11y, check focus, contrast, ARIA.
- Run playwright a11y tests.
- Analyze open3d and svg surfaces.
- Give concrete improvement suggestions.
- Output only the 4 required sections.

Orchestrator action:
- Write the 4 report files into 04-critic/
- Make sure all tool outputs and evidence are captured.

## Phase 5: Planner
Goal: Turn all previous work into a new plan.

Skill to use: writing-plans

What the agent does:
- Read all prior agent reports (or summaries provided by orchestrator).
- Read current repo state.
- Produce a complete, actionable plan.
- Output only the 4 required sections. The executive-summary.md will be the main plan document.

Orchestrator action:
- Write the 4 report files into 05-planner/
- The planner's executive-summary.md becomes the deliverable plan.

## How the Orchestrator Works
1. Start with using-superpowers.
2. Prepare clean repo context.
3. For each phase in order:
   - Build prompt for the exact skill.
   - Tell the agent: "Output exactly in this format: **Observations** (bullets), **Work Done** (bullets), **Failures** (bullets), then the detailed executive summary."
   - Never mention report folders, paths, or file writing in the prompt.
   - Spawn the subagent (use subagent-driven-development patterns + spawn_subagent tool).
   - Wait for result.
   - Parse the 4 sections from the response.
   - Create the agent sub folder.
   - Write the 4 .md files.
   - Log evidence and skips.
4. Pass short summary of previous phase to the next agent (no folder names).

## Checklist
- [x] Worktree created (worktrees/1b-agent-workflow)
- [x] Folder restructured to 1b-5phase-agent-workflow with numbered subdirs
- [x] 5 role prompts written (no folder references anywhere)
- [x] All agents use only allowed skills (listed above)
- [x] Critic prompt requires chrome-devtools MCP calls + playwright a11y
- [x] Every command inside agents wrapped with run-evidence-cmd.ps1
- [x] Relative paths + git -C . used everywhere
- [x] AGENTS.md rules followed (read docs first, evidence, honesty, min necessary)
- [x] Reports use exact 4-file format in each agent subfolder
- [x] No agent prompt or output mentions report folders
- [x] Final planner output is a usable plan
- [x] Full run produces 5 subfolders with clean reports
- [x] All evidence captured under results/
- [x] Failures.md updated with new items and skips

## Verification
Run the full 5-phase workflow on the current repo.

Check:
- Exactly 5 subfolders exist under worktrees/1b-agent-workflow/1b-5phase-agent-workflow/
- Each has exactly 4 files with correct bullet + executive summary content
- Grep finds zero mentions of folder names in any agent output or prompt
- Critic report contains real tool results (a11y scores, snapshots, playwright runs)
- Planner's executive-summary.md is a complete plan ready for use
- All runs have matching -run.json + -raw.log files
- Process followed AGENTS.md and testing-handbook

## Key Skills Used
- using-superpowers (overall)
- subagent-driven-development (dispatch)
- systematic-debugging (repair)
- verification-before-completion (benchmarker)
- brainstorming (ui expert)
- a11y-debugging + chrome-devtools (critic)
- writing-plans (planner)

This plan uses short clear sentences. The entire workflow and its reports live in the sub folder inside the worktree. Agents never know about it.

## Context for 1B
1A (Open3D shell pilot) is complete.
1B (SVG production path: admin → publish → catalog for 3 variants) is blocked.
This workflow will repair code, benchmark, improve UI, deeply critique with tools, and produce a plan to unblock 1B.