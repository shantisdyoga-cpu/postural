import { createApp } from "../server/_core/app";
import type { Request, Response } from "express";

/**
 * Vercel invokes this Express application as a serverless function.
 * No TCP listener is started here; Vercel owns the request lifecycle.
 */
const app = createApp();

/**
 * Explicit Vercel handler. Keeping the adapter as a function avoids relying
 * on framework detection while preserving the same Express app locally.
 */
export default function handler(req: Request, res: Response) {
  return app(req, res);
}
