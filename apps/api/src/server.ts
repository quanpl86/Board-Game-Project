import Fastify from "fastify";
import { sampleGames } from "@bgu/contracts";
export function buildServer() {
  const app = Fastify({logger: true});
  app.get("/health", async () => ({service:"bgu-api",status:"ok",phase:"foundation"}));
  app.get("/v1/games", async () => ({source:"development_seed",items:sampleGames}));
  app.setNotFoundHandler((_request,reply) => reply.code(404).send({code:"NOT_FOUND",message:"Đường dẫn không tồn tại."}));
  return app;
}
