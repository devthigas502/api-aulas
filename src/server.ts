import 'dotenv/config'
import { server } from './app.js'

const port = Number(process.env.PORT) || 8080
const host = process.env.HOST || '0.0.0.0'

server.listen({ port, host }, (err: unknown, address: string) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})