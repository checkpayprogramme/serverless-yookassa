import { FastifyPluginAsync } from "fastify";

import userRoutes from "./userRoutes";
import indexRoutes from "./indexRoutes";
  
  
  const routes: FastifyPluginAsync = async (server) => {
// api/v1/
  server.register(indexRoutes, { prefix: "/hello" });
  server.register(userRoutes, { prefix: "/users" }); 
  // end router
  };
  
  export default routes;