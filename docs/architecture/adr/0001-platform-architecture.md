# ADR-0001 — Modular monolith with specialized runtimes
**Status:** Proposed · **Date:** 2026-10-09

## Context
The platform must support diverse classic/STEM/3D/coding game mechanics plus education, chat, events, ranking, campaign and AI/MCP operations. Early independent microservices multiply deployment, distributed transaction, tracing and auth complexity.

## Decision
Start with TypeScript monorepo (pnpm + Nx/Turbo), domain-isolated modular monolith for core APIs, separated authoritative realtime Game Server, separated isolated coding judge worker and durable background job runtime. PostgreSQL is source of truth; Redis is cache/presence only; R2 stores immutable asset variants. Game plugins depend on Game SDK/contracts, not platform database.

## Consequences
Strong module boundaries, SDK compatibility tests and schema/event versioning required. Domains may split into services when independent scaling or security warrants. CMS, feature flags and campaign resolution remain separate concepts. AI Agents operate via same application services as human actors behind OAuth/scopes, approval and audit.

## Reconsideration triggers
Measured high load isolated to specific domain; autonomous teams need independent release cycles; data residency/security isolation requirement; unacceptable coupling despite enforced boundaries.
