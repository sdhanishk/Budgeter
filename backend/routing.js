const fastify = require('fastify')({ logger: true });

const routes = require('./routes');
const { forEach } = require('./routes');

routes.forEach((route) => {
  fastify.route(route);
});

const start = async () => {
  try {
    await fastify.listen(8080);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();