# Security & Child Safety Policy (Design Baseline)

**Status:** Draft policy for platform design; not an assertion of compliance.

- Never commit credentials, tokens, production secrets, personal data of children, student chat histories or hidden competition testcases.
- Private-by-default accounts for minors. No stranger DMs or uncontrolled public community chat for children.
- Enforcement must be server-side, tenant-scoped, and auditable; RLS supplements domain authorization.
- Coding submissions require isolated execution with CPU/memory/time/network/filesystem restrictions.
- MCP/AI tools require scoped delegated credentials, approval for risky writes, audit and idempotency.
- Deploy requires threat modeling, restore tests, moderation escalation procedure, retention/deletion workflow and verified legal review.
- Security incidents should be privately reported to the repository owner; do not post exploits or learner details in public issues.