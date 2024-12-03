import { serve } from "bun";
import app from "./app";

const server = serve({
  port: 3000,
  fetch: app.fetch
})

console.log(`Server is Running at http://localhost:${server.port}`)
