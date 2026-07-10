# P07 — AI assistance with human control

## Buyer problem

AI is useful only if it removes a measured bottleneck. A generic chat drawer does not improve recon, configuration, or quote work by itself.

## Outcome

One approved AI workflow helps O&O staff do a real task faster while leaving all commercial, design, and publish decisions with a human.

## Scope

1. Compare existing planner AI advisor and site-assistant behavior with the P06 workflow.
2. Pick one use case only. Default candidate: turn a structured client brief into a proposed workstation configuration for review.
3. Define the input schema, allowed source data, output schema, refusal cases, and human approval action.
4. Prevent model output from publishing catalog data, changing a plan, or pricing a quote without explicit human confirmation.
5. Build a small evaluation set of realistic prompts, bad inputs, and refusal cases.

## Evidence

`results/10072026/P07-ai-assist/` contains:

- use-case decision and measured baseline task time;
- evaluation prompts and expected constraints;
- raw model outputs with secret-safe redaction;
- browser proof of review and explicit human approval;
- cost and failure notes.

## Acceptance

- The assistant has one clear job and one clear human handoff.
- It never invents a live catalog item, price, or published plan state.
- Its output is structured enough for a human to check against the system rules.
- It provides a measurable benefit over the manual baseline.

## Non-goals

- Autonomous sales, design approval, publishing, or quoting.
- Training a custom model.
- A broad AI platform.

## Handoff

P08 treats this workflow as a core path and tests its failure behavior.
