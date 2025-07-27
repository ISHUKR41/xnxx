import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import imageToolsRouter from "./routes/image-tools";
import pdfToolsRouter from "./routes/pdf-tools";
import textToolsRouter from "./routes/text-tools";
import aiToolsRouter from "./routes/ai-tools";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Register tool routes
  app.use("/api/image-tools", imageToolsRouter);
  app.use("/api/pdf-tools", pdfToolsRouter);
  app.use("/api/text-tools", textToolsRouter);
  app.use("/api/ai-tools", aiToolsRouter);

  const httpServer = createServer(app);

  return httpServer;
}
