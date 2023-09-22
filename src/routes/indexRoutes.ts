
import { FastifyInstance, FastifyServerOptions, FastifyRequest, FastifyReply } from 'fastify';

interface IQueryString {
    name: string;   
  }
  
  interface CustomRouteGenericQuery {
    Querystring: IQueryString;
  }
  
  interface IParams {
    name: string;    
  }
  
  interface CustomRouteGenericParam {
    Params: IParams;
  }
 
const indexRoutes = async (server: FastifyInstance, opts: FastifyServerOptions, done: any) => {
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
    }  
  );
}

  export default indexRoutes;
