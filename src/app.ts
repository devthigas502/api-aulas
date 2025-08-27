import fastify from 'fastify'
import { db } from './db/index.js'
import { users } from './db/schema.js'

export const server = fastify()

// Health check route - essencial para deploy
server.get('/', async (request, reply) => {
  return { 
    status: 'ok', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  }
})

// Ping route - alternativa para health check
server.get('/ping', async (request, reply) => {
  return { message: 'pong' }
})

// Health check específico para plataformas de deploy
server.get('/health', async (request, reply) => {
  try {
    // Testa a conexão com o banco
    await db.select().from(users).limit(1)
    return { 
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    reply.code(503)
    return { 
      status: 'unhealthy',
      database: 'disconnected',
      error: 'Database connection failed'
    }
  }
})

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

