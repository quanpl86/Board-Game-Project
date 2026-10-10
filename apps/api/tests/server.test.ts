import assert from "node:assert/strict";
import test from "node:test";
import {buildServer} from "../src/server.js";
test("health without DB",async()=>{const app=buildServer();try{const r=await app.inject({method:"GET",url:"/health"});assert.equal(r.statusCode,200);assert.equal(r.json().status,"ok");}finally{await app.close();}});
test("catalog seed status not playable",async()=>{const app=buildServer();try{const r=await app.inject({method:"GET",url:"/v1/games"});assert.equal(r.statusCode,200);assert.equal(r.json().source,"development_seed");assert.ok(r.json().items.every((g:{status:string})=>g.status==="planned"));}finally{await app.close();}});
test("other URLs 404",async()=>{const app=buildServer();try{const r=await app.inject({method:"GET",url:"/secrets"});assert.equal(r.statusCode,404);}finally{await app.close();}});
