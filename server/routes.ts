import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import imageToolsRouter from "./routes/image-tools";
import pdfToolsRouter from "./routes/pdf-tools";
import textToolsRouter from "./routes/text-tools";
import comprehensiveRouter from "./routes/comprehensive-routes";
import toolsRoutes from "./routes/toolsRoutes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register comprehensive tool routes with proper backend integration
  app.use("/api", comprehensiveRouter);
  app.use("/api/pdf", pdfToolsRouter);
  app.use("/api/image", imageToolsRouter);
  app.use("/api/text", textToolsRouter);
  
  // Add new comprehensive tools routes
  app.use("/api/tools", toolsRoutes);
  
  // Download endpoint for processed files
  app.get("/downloads/:filename", async (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = `temp/downloads/${filename}`;
      
      // Check if file exists
      const fs = await import('fs/promises');
      await fs.access(filePath);
      
      res.download(filePath, (err) => {
        if (err) {
          console.error('Download error:', err);
          res.status(404).json({ error: 'File not found or expired' });
        }
      });
    } catch (error) {
      res.status(404).json({ error: 'File not found or expired' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}