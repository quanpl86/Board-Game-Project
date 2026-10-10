import http from "node:http";
// Fail closed: OAuth, tenant scope, approval and MCP protocol not yet enabled.
const port=Number(process.env.MCP_PORT??4002),host=process.env.MCP_HOST??"127.0.0.1";
const server=http.createServer((req,res)=>{res.setHeader("content-type","application/json; charset=utf-8");if(req.url==="/health"&&req.method==="GET"){res.writeHead(200).end(JSON.stringify({service:"bgu-mcp-gateway",status:"ok",toolsEnabled:false}));return;}res.writeHead(503).end(JSON.stringify({code:"MCP_NOT_ENABLED"}));});
server.listen(port,host,()=>console.log(`MCP foundation: http://${host}:${port}`));
for(const signal of ["SIGINT","SIGTERM"] as const)process.on(signal,()=>server.close(()=>process.exit(0)));
