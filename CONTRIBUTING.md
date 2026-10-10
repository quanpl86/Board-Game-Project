# Contribution Guide

1. Start with an Issue (feature, bug, game design, architecture, documentation).
2. For architecture changes, write/update an ADR before significant coding.
3. Create a feature branch: `feat/<issue>-description`, `docs/<topic>`, or `fix/<issue>-description`.
4. Keep separate code/domain changes in focused PRs. Use `CODEOWNERS`, run checks and include a rollback note for stateful changes.
5. Update PRD/GDD/schema/contracts and test plan in the same PR as implemented behavior.
6. Clearly mark planning docs `Draft`, `Proposed`, `Accepted` or `Implemented`.
7. Never commit secrets, learner PII or copyrighted proprietary game media without permission.

## PR checklist
- [ ] Source and owner identified
- [ ] Acceptance criteria / tests added
- [ ] Security and tenant impact reviewed
- [ ] Game version / asset manifest / scoring compatibility reviewed
- [ ] DB migration and rollback documented when needed
- [ ] MCP tools permission & audit impact reviewed when needed
- [ ] Documentation updated