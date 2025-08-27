import fastify from 'fastify'
import { db } from './db/index.js'
import { users } from './db/schema.js'

export const server = fastify()


server.get('/users', async (request, reply) => {
  const allUsers = await db.select().from(users)
  return allUsers
})

server.post('/users', async (request, reply) => {
  const { name, email } = request.body as { name: string; email: string }
  
  const newUser = await db.insert(users).values({
    name,
    email,
  }).returning()
  
  return newUser[0]
})

