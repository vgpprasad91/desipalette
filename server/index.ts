import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import net from "net";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Choose a port and handle EADDRINUSE gracefully in development.
  // Default to PORT env or 3000; in development, fall back to next free port.
  const preferredPort = Number.parseInt(process.env.PORT || "3000", 10);

  async function findAvailablePort(startPort: number): Promise<number> {
    // In production, always return the preferred port (platforms may require it)
    if (app.get("env") !== "development") return startPort;

    const maxAttempts = 20; // scan up to 20 ports max
    for (let i = 0; i <= maxAttempts; i++) {
      const portToTry = startPort + i;
      const isFree = await new Promise<boolean>((resolve) => {
        const tester = net.createServer()
          .once("error", () => resolve(false))
          .once("listening", () => {
            tester.close(() => resolve(true));
          })
          .listen(portToTry, "0.0.0.0");
      });
      if (isFree) return portToTry;
    }
    return startPort; // fallback
  }

  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort && app.get("env") === "development") {
    log(`port ${preferredPort} busy, using ${port} instead`);
  }

  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
