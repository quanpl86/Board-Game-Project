#!/usr/bin/env node
// Read-only task validation. Does not execute Agents, issue tools, MCP or DB.
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve,dirname} from "node:path";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const load=p=>JSON.parse(readFileSync(resolve(root,p),"utf8"));
const roleMap=new Map(load("docs/agents/AGENT_REGISTRY.json").roles.map(r=>[r.id,r]));
const skillMap=new Map(load("docs/agents/SKILL_REGISTRY.json").skills.map(s=>[s.id,s]));
export function validateTask(t){
  const errors=[];
  if(!t||typeof t!=="object"||Array.isArray(t))return ["task must be an object"];
  if(!/^BGU-[A-Z0-9-]{3,}$/.test(t.task_id??""))errors.push("invalid task_id");
  if(!roleMap.has(t.executor_role))errors.push("unknown executor role");
  if(!["R0","R1","R2","R3","R4"].includes(t.risk))errors.push("risk must be R0-R4");
  if(!Array.isArray(t.skills)||!t.skills.length)errors.push("skills required");
  else for(const id of t.skills)if(!skillMap.has(id))errors.push(`unknown skill: ${id}`);
  if(!Array.isArray(t.acceptance)||!t.acceptance.length)errors.push("acceptance criteria required");
  if(typeof t.scope!=="string"||!t.scope.trim())errors.push("scope required");
  if(!roleMap.has(t.reviewer_role))errors.push("independent reviewer role required");
  if(t.reviewer_role===t.executor_role)errors.push("author cannot be sole reviewer");
  if(["R3","R4"].includes(t.risk)&&!t.human_approver)errors.push("R3/R4 requires named human approver");
  if(["R3","R4"].includes(t.risk)&&t.status==="approved"&&!t.human_approval_reference)errors.push("approval evidence required");
  if(t.status==="released"&&!t.production_evidence)errors.push("production evidence required");
  return errors;
}
const invoked=process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1]);
if(invoked){
 const [,,command,file]=process.argv;
 if(command!=="validate"||!file){console.error("Usage: node tools/agent-task.mjs validate <task.json>");process.exitCode=2;}
 else try{const task=JSON.parse(readFileSync(resolve(file),"utf8")),errors=validateTask(task);if(errors.length){console.error(errors.join("\n"));process.exitCode=1;}else console.log(`Task ${task.task_id}: static role/skill policy OK; nothing was executed.`);}
 catch(error){console.error(String(error));process.exitCode=1;}
}
