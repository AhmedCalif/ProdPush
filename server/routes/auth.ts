import { Hono, type Context } from "hono";
import { kindeClient, sessionManager, getUser } from "../kinde";
import { type User } from "@frontend/types/UserTypes";
import { db } from "../db/index";
import { users } from "../db/schema";
import { sql } from "drizzle-orm";


export const authRoute = new Hono()
  .get("login", async (c: Context) => {
    const loginUrl = await kindeClient.login(sessionManager(c));
    return c.redirect(loginUrl.toString());
  })
  .get("/register", async (c) => {
    const registerUrl = await kindeClient.register(sessionManager(c));
    return c.redirect(registerUrl.toString());
  })
  .get("/callback",  getUser, async (c: Context) => {
    const url = new URL(`${c.req.raw.url}`);
    await kindeClient.handleRedirectToApp(sessionManager(c), url);


    const user = c.get("user") as User;

    if (user) {
      try {
       const insertUserToDb = await db.insert(users).values({
      id: user.id,
      sub: user.sub,
      name: user.name,
      email: user.email,
      picture: user.picture ?? null,
      given_name: user.given_name,
      family_name: user.family_name,
      updated_at: sql`CAST(strftime('%s', 'now') AS INTEGER)`,
      email_verified: sql`0`,
      preferred_username: user.preferred_username ?? null
    }).onConflictDoUpdate({
      target: users.id,
      set: {
        name: user.name,
        email: user.email,
        picture: user.picture ?? null,
        given_name: user.given_name,
        family_name: user.family_name,
        updated_at: sql`CAST(strftime('%s', 'now') AS INTEGER)`,
        preferred_username: user.preferred_username ?? null
      }
    });
        console.log("User:", insertUserToDb)
      } catch (error) {
        console.error("Error saving user to db:", error);
      }
    }

    return c.redirect("/");
  })
  .get("/logout", async (c) => {
    const logoutUrl = await kindeClient.logout(sessionManager(c));
    return c.redirect(logoutUrl.toString());
  })
  .get("/me", getUser, async (c) => {
    const user = c.get("user");
    return c.json({
      user: user || null,
      isAuthenticated: !!user
    }, user ? 200 : 401);
  });
