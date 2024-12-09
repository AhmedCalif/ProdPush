import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors"
import { tasksRoute } from "../server/routes/tasks";
import { projectsRoute } from "../server/routes/projects";
import { authRoute } from "../server/routes/auth";




const app = new Hono();

app.use("*", logger());

app.use('*', cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  credentials: true,
  exposeHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 3600,
}))

const apiRoutes = app.basePath('/api').route('/tasks', tasksRoute)
.route("/projects", projectsRoute)
.route("/auth", authRoute)




export default app;
export type ApiRoutes = typeof apiRoutes
