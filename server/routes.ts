import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import imageToolsRouter from "./routes/image-tools";
import pdfToolsRouter from "./routes/pdf-tools";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Register comprehensive tool routes
  app.use("/api/pdf", pdfToolsRouter);
  app.use("/api/image", imageToolsRouter);

  const httpServer = createServer(app);

  return httpServer;
}
