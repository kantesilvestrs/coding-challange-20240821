import http from 'node:http';
import jsonServer from 'json-server';
import assert from 'node:assert';
import routes from './routes';

const { PORT } = process.env;

assert(PORT, `Environment variable 'PORT' is not defined.`);

const app = jsonServer.create();
const middlewares = jsonServer.defaults();
const router = jsonServer.router(routes);

app.use(middlewares);
app.use(router);

const server = http.createServer({}, app);

/**
 * 😂 I read the (i.e. no erver is required for this assessment) only at the very end 😂
 */

server.listen(PORT, () => {
  console.log(`JSON Mock Server is running on http://localhost:${PORT}`);
});

process.once('SIGINT', () => server.close());
process.once('SIGTERM', () => server.close());
