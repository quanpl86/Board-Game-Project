import test from "node:test";
import assert from "node:assert/strict";
import {validateTask} from "../agent-task.mjs";
const base=()=>({task_id:"BGU-001",executor_role:"BGU-UI",reviewer_role:"BGU-UX",risk:"R1",skills:["react-frontend","design-tokens"],scope:"UI preview",acceptance:["Responsive"]});
test("known role and skill passes",()=>assert.deepEqual(validateTask(base()),[]));
test("unknown skill denied",()=>{const t=base();t.skills=["bypass-policy"];assert.match(validateTask(t).join(" "),/unknown skill/);});
test("cannot self-review",()=>{const t=base();t.reviewer_role=t.executor_role;assert.match(validateTask(t).join(" "),/sole reviewer/);});
test("R4 approved action requires human and proof",()=>{const t=base();t.risk="R4";t.status="approved";assert.ok(validateTask(t).some(x=>x.includes("human approver")));assert.ok(validateTask(t).some(x=>x.includes("approval evidence")));});
test("fake production release denied",()=>{const t=base();t.status="released";assert.match(validateTask(t).join(" "),/production evidence/);});
