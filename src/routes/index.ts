import {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyReply,
    FastifyRequest,
    FastifyServerOptions,
  } from "fastify";
  
  interface IQueryString {
    name: string;
    userId: string;
  }
  
  interface CustomRouteGenericQuery {
    Querystring: IQueryString;
  }
  
  interface IParams {
    name: string;
    userId: string;
  }
  
  interface CustomRouteGenericParam {
    Params: IParams;
  }
  
  const routes: FastifyPluginAsync = async (server) => {

    server.register(
      async (instance: FastifyInstance, opts: FastifyServerOptions, done) => {
        instance.get(
          "/:name",
          async (
            req: FastifyRequest<CustomRouteGenericParam>,
            res: FastifyReply
          ) => {
            const { name = "" } = req.params;
            res.status(200).send(`Hello ${name}`);
          }
        );
  
        instance.get(
          "/",
          async (
            req: FastifyRequest<CustomRouteGenericQuery>,
            res: FastifyReply
          ) => {
            const { name = "" } = req.query;
            res.status(200).send(`Hello ${name}`);
          }
        );
        done();
      },
      {
        prefix: "/hello",
      }
    
    );

    // Регистрируем маршруты с другим префиксом, например, /users
  server.register(
    async (instance: FastifyInstance, opts: FastifyServerOptions, done) => {
      instance.get(
        "/:userId", 
        async (
          req: FastifyRequest<CustomRouteGenericParam>,
          res: FastifyReply
        ) => {
          const { userId = "" } = req.params; 
          res.status(200).send(`Hi User ID: ${userId}`);
        }
      );

      instance.get(
        "/",
        async (
          req: FastifyRequest<CustomRouteGenericQuery>,
          res: FastifyReply
        ) => {
          const { userId = "" } = req.query; 
          res.status(200).send(`Hi User ID: ${userId}`); 
        }
      );
      done();
    },
    {
      prefix: "/users", 
    }
  );
  
  // end router
  };
  
  export default routes;