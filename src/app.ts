import fastify from 'fastify'

export const server = fastify()

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

