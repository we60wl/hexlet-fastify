import fp from 'fastify-plugin'
import formbody from '@fastify/formbody'
/**
 * A simple plugin for Fastify that adds a content type parser for the content type application/x-www-form-urlencoded.
 *
 * @see https://github.com/fastify/fastify-formbody
 */
export default fp(async (fastify) => {
  fastify.register(formbody)
})