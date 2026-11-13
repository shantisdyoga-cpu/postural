import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerGoogleCalendarRoutes } from "../googleCalendar";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";

/**
 * Creates the request-handling part of Sdyoga without opening a TCP port.
 * This is shared by the local Node server and the Vercel serverless entrypoint.
 */
export function createApp() {
  const app = express();

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  registerGoogleCalendarRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  return app;
}
