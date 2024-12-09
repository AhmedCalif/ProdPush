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
  allowHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Added headers needed for auth
  credentials: true,
  exposeHeaders: ['Content-Length', 'X-Request-Id', 'Set-Cookie'], // Added Set-Cookie
  maxAge: 3600,
}));


const api = new Hono()
  .route("/tasks", tasksRoute)
  .route("/projects", projectsRoute)
  .route("/auth", authRoute);


app.route("/api", api);

export default app;
export type ApiRoutes = typeof api;
