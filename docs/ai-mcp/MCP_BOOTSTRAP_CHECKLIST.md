# MCP / AI Control Plane Bootstrap
**Status:** Planning checklist, not implemented.

1. Define canonical MCP tool naming, resource naming and schema version policy.
2. Create agent identities, delegated OAuth scopes and tenant-aware policy enforcement.
3. Provide read-only tools for game catalog, versioned docs, campaigns and staged tournament metadata.
4. Add write tools for draft creation only, with idempotency key, optimistic version and event audit.
5. Add human approval Inbox, diff preview and immutable approved revision binding.
6. Add durable workflow definitions, scheduler, retry, dead-letter and compensating actions.
7. Make MCP server remote HTTPS with audience validation and least privilege; test ChatGPT client compatibility.
8. Connect GitHub only through PR creation and review checks; never AI bypass protection.
9. Complete incident, secret leakage, prompt injection and unauthorized publish adversarial tests.
10. Add metrics for successful tool calls, denied calls, cost, policy violations and workflow recovery.
11. Pilot one workflow: prepare monthly seasonal campaign → QA/preview → approval → scheduled publication.
12. Record ownership, runbooks, last tested date and rollback method before production.
