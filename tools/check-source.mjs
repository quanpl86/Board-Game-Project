#!/usr/bin/env node
// Bootstrap source checks only, not yet full ESLint or a security scanner.
import {existsSync,readFileSync} from "node:fs";
const required=["package.json","pnpm-workspace.yaml","apps/web/app/page.tsx","apps/api/src/server.ts","apps/realtime/src/index.ts","apps/mcp-gateway/src/index.ts","tools/agent-task.mjs"];
for(const p of required)if(!existsSync(p))throw Error(`Missing source: ${p}`);
const css=readFileSync("apps/web/app/globals.css","utf8");
if(!css.includes("--brand:#ff5722")||!css.includes("--action:#c63d14"))throw Error("KingDragonHub tokens missing");
const mcp=readFileSync("apps/mcp-gateway/src/index.ts","utf8");
if(!mcp.includes("MCP_NOT_ENABLED")||!mcp.includes("toolsEnabled:false"))throw Error("MCP cannot be enabled before scoped auth is reviewed");
console.log("Bootstrap source checks passed (not full ESLint).");
