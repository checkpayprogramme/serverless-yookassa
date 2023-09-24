import * as dotenv from "dotenv";
dotenv.config();

// Require the framework
import Fastify, {FastifyReply,
  FastifyRequest,} from "fastify";
  

// Instantiate Fastify with some config
const app = Fastify({
  logger: true,
});

// Register your application as a normal plugin.
app.register(import('../src/app'), {
    prefix: '/'
});


// Only Server Start the server on port 3030
const { HOST = 'localhost', PORT = '3030' } = process.env;
const start = async () => {
  try {
    await app.listen({ port: parseInt(PORT, 10), host: HOST }); // Add 'host' option

    const address = app.server.address();
    const port = typeof address === 'string' ? address : address?.port;
    app.log.info(`Server start http://localhost:${port}`); // Update the address
    console.log(`Server start http://localhost:${port}`); // Update the address

  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start()
// END Only Server Start the server on port 3030


// // Only function Vercel

// export default async (req:FastifyRequest, res:FastifyReply) => {
//     await app.ready();
//     app.server.emit('request', req, res);
// }