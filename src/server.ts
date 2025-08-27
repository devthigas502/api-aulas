import 'dotenv/config'
import { server } from './app.js'


server.listen({ port: 8080 }, (err: unknown, address: string) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})