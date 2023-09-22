import { FastifyInstance, FastifyServerOptions, FastifyRequest, FastifyReply } from 'fastify';
import { getAllUsers } from '../Users'; // Импортируем функцию для получения списка пользователей

 
  
  interface IParams {  
    userId: string;
  }
  
  interface CustomRouteGenericParam {
    Params: IParams;
  }

const userRoutes = async (server: FastifyInstance, opts: FastifyServerOptions, done: any) => {
  server.get(
    '/:userId',
    async (
      req: FastifyRequest<CustomRouteGenericParam>,
      res: FastifyReply
    ) => {
      const { userId = '' } = req.params;
      res.status(200).send(`Hi User ID: ${userId}`);
    }
  );

  server.get(
    '/',
    async (
      req: FastifyRequest<CustomRouteGenericParam>,
      res: FastifyReply
    ) => {
      try {
        const userList = await getAllUsers(); // Получаем список пользователей из базы данных
        res.status(200).send(userList);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    }
  );
  done();
};

export default userRoutes;
