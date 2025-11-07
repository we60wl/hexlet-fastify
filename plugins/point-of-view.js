import fp from 'fastify-plugin'
import view from '@fastify/view'
import pug from 'pug'

/**
 * Templates rendering plugin support for Fastify.
 *
 * @see https://github.com/fastify/point-of-view
 */
export default fp(async (fastify) => {
  fastify.register(view, { engine: { pug }})
})
