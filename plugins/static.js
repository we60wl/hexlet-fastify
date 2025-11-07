import fp from 'fastify-plugin'
import fastifyStatic from '@fastify/static'
import path from 'node:path'

/**
 * Plugin for serving static files as fast as possible.
 *
 * @see https://github.com/fastify/static
 */
export default fp(async (fastify) => {
  fastify.register(fastifyStatic, {
    root: path.join(path.resolve(), '/node_modules/bootstrap/dist/css'),
    // root: '/home/we60wl/hexlet/js-web/fastify-intro/myapp/node_modules/bootstrap/dist/css',
    prefix: '/assets/',
  })
})
