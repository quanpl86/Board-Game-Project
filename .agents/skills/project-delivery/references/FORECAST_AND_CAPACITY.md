# Delivery Forecast, Capacity & Escalation
**PM role:** BGU-PD. Forecasts are estimates grounded in actual source state and capacity, not project facts until verified.

## Capacity and confidence
- Track engineering capacity by role (hours/week), context switching, skill gaps, blocked dependencies and QA buffer.
- Estimate task completion in ranges with assumptions: optimistic, most likely and pessimistic; update when CI or scope changes.
- Do not infer throughput from raw number of AI messages, prompts or PR creations.
- Suggested WIP: maximum 2 active substantial assignments per specialist to reduce parallel drift, adjusted by Product Owner.

## Critical path
Epic → story → ticket → linked source/contract → developer PR → CI → independent review → staging test → release. Show lead time and blocking edge. DB, KingDragonHub auth/brand source and child policies are high-leverage prerequisites.

## Risk formula (planning heuristic)
Probability 1–5 × Impact 1–5 = exposure 1–25. Use forecast trend and owner mitigation, not as scientifically precise absolute risk.
Escalation suggestions: >=16 high, 9–15 medium, <9 low; adjust for safety where any critical child data exposure is automatically blocking.

## Trigger examples
- Dependency unblocked? If not, task owner and concrete source issue link required.
- PR stuck >2 business days: remind with exact review request and impact.
- CI red twice: halt downstream affected work, create reproducible failure ticket.
- Game rule change breaks replay: reopen design/QA compatibility gate.
- DB schema spec divergent from implementation: technical owner approval needed before migration.
- GLB too slow on tablets: performance-budget review before publishing.
- AI publishing tool lacks revision-bound approval: disable write path.
- Postlaunch service SLO breach: prioritize stabilization over feature throughput.

## Report hygiene
State `unknown` when no CI/telemetry. Separate source-of-truth status from Agent self-report. Each forecast includes date/time zone, repo reference, last scan and confidence.
