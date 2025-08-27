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
    console.error('Health check failed:', error)
    reply.code(503)
    return { 
      status: 'unhealthy',
      database: 'disconnected',
      error: 'Database connection failed',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }
  }
})

// Rota de debug para verificar variáveis de ambiente (apenas em dev)
server.get('/debug', async (request, reply) => {
  if (process.env.NODE_ENV === 'production') {
    reply.code(404)
    return { error: 'Not found' }
  }
  
  return {
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      HOST: process.env.HOST,
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET'
    },
    timestamp: new Date().toISOString()
  }
})

server.get('/users', async (request, reply) => {
  try {
    const allUsers = await db.select().from(users)
    return allUsers
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    reply.code(500)
    return { 
      error: 'Erro interno do servidor',
      message: 'Falha ao conectar com o banco de dados'
    }
  }
})

server.post('/users', async (request, reply) => {
  try {
    const { name, email } = request.body as { name: string; email: string }
    
    if (!name || !email) {
      reply.code(400)
      return { error: 'Nome e email são obrigatórios' }
    }
    
    const newUser = await db.insert(users).values({
      name,
      email,
    }).returning()
    
    return newUser[0]
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    reply.code(500)
    return { 
      error: 'Erro interno do servidor',
      message: 'Falha ao criar usuário'
    }
  }
})

