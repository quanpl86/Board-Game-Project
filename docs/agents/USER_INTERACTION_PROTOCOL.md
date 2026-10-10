# Product Owner Interaction & Reminder Protocol
**Owner:** BGU-PD · **Status:** Proposed; no recurring schedule activated by this file.

## Single accountable relationship
The Human Product Owner is final authority over scope, brand, roadmap, data/child safety, production permissions and significant commercial choices. BGU-PD is the main communication/delegation role. Specialists report evidence to BGU-PD; do not bombard Product Owner with individual ticket questions.

## Channels
1. GitHub issues/PRs/CI are the persistent work ledger and authoritative technical evidence.
2. Steering update through approved ChatGPT interaction, email, calendar or another connected channel, **only if operational tool/authorization exists**.
3. Product Owner approvals via GitHub review or exact workflow approval, with audit; conversational preference is not blanket technical authorization.

## Cadence to confirm with Product Owner
- **Daily**: short status, 1–3 blockers, who owns each next action (e.g. morning local time). 
- **Weekly**: Friday or Monday steering with milestones, risk forecast, design/DB decisions, release health.
- **Sprint demo**: every 1–2 weeks based on capacity.
- **Monthly**: stakeholder review for game releases, seasonal campaigns and cost/performance.
- **Release/postrelease**: before production go/no-go, then D+1/D+7.

Do not create automations or promise reminders without explicit schedule, timezone, connected source and notification destination. Once approved, configure a scheduled agent/task with an imperative single-run prompt, not a fake perpetual-running agent.

## Product Owner check-in format
1. **What changed (facts):** merged PRs, screens signed, tested game, staging/prod metrics, with URLs.
2. **What is in progress:** task, assigned role, next checkpoint.
3. **Risk forecast:** upcoming dependency and likelihood/impact; suggested mitigation.
4. **Decisions needed:** material 1–3 questions only, alternatives and recommendation.
5. **Next plan:** sprint goal, due, QA and acceptance; where UI/DB/MCP constraints remain.

## Escalation timing guidance
S0 child/data/wallet/security incident: immediate human alert via configured channel; block writes and preserve evidence.
S1 service/game scoring regression: notify release owner and Product Owner in next available real alert/check-in, with impact.
S2 scope/dependency drift: raise at scheduled check-in before sprint slips.

## Daily scan source rules
No proof → state 'not checked'; no github permission → request connection; no CI available → say 'not configured'; no code → 'design only'; no telemetry → never claim uptime or active users.
