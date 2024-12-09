import { Hono, type Context } from "hono";
import { kindeClient, sessionManager, getUser } from "../kinde";
import { db } from "../db/index";
import { users } from "../db/schema";
import { sql} from "drizzle-orm";

const BASE_URL = "http://localhost:5173";

const authRoute = new Hono()
  .get("/login", async (c: Context) => {
    try {
      const loginUrl = await kindeClient.login(sessionManager(c));
      console.log("Login URL:", loginUrl.toString());
      return c.redirect(loginUrl.toString());
    } catch (error) {
      console.error("Login error:", error);
      return c.redirect(`${BASE_URL}/?error=login_failed`);
    }
  })
  .get("/register", async (c) => {
    try {
      const registerUrl = await kindeClient.register(sessionManager(c));
      return c.redirect(registerUrl.toString());
    } catch (error) {
      console.error("Register error:", error);
      return c.redirect(`${BASE_URL}/?error=register_failed`);
    }
  })
  .get("/callback", async (c: Context) => {
    try {
      const originalUrl = new URL(c.req.url);
      const callbackUrl = new URL(originalUrl.pathname + originalUrl.search, BASE_URL);

      console.log("Processing callback URL:", callbackUrl.toString());

      const session = sessionManager(c);

      try {
        await kindeClient.handleRedirectToApp(session, callbackUrl);

        const userProfile = await kindeClient.getUserProfile(session);
        console.log("User profile received:", userProfile);

        if (!userProfile || !userProfile.id) {
          throw new Error("Invalid user profile");
        }

        const userForDb = {
          id: userProfile.id,
          sub: userProfile.id,
          name: [userProfile.given_name, userProfile.family_name]
            .filter(Boolean)
            .join(" ") || userProfile.email,
          email: userProfile.email,
          picture: userProfile.picture || undefined,
          given_name: userProfile.given_name || undefined,
          family_name: userProfile.family_name || undefined,
          updated_at: sql`CAST(strftime('%s', 'now') AS INTEGER)`,
          email_verified: sql`0`
        };

        await db
          .insert(users)
          .values(userForDb)
          .onConflictDoUpdate({
            target: users.id,
            set: {
              name: userForDb.name,
              email: userForDb.email,
              picture: userForDb.picture,
              given_name: userForDb.given_name,
              family_name: userForDb.family_name,
              updated_at: userForDb.updated_at,
              email_verified: userForDb.email_verified
            }
          });

        return c.redirect(BASE_URL);
      } catch (error) {
        console.error("Processing error:", error);
        return c.redirect(`${BASE_URL}/?error=processing_failed`);
      }
    } catch (error) {
      console.error("Callback error:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      });
      return c.redirect(`${BASE_URL}/?error=auth_failed`);
    }
  })
  .get("/logout", async (c) => {
    try {
      const logoutUrl = await kindeClient.logout(sessionManager(c));
      await sessionManager(c).destroySession();
      return c.redirect(logoutUrl.toString());
    } catch (error) {
      console.error("Logout error:", error);
      return c.redirect(`${BASE_URL}/?error=logout_failed`);
    }
  })
  .get("/me", getUser, async (c) => {
    const user = c.get("user");
    return c.json({
      user: user || null,
      isAuthenticated: !!user
    }, user ? 200 : 401);
  });

export { authRoute };
