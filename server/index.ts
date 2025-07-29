import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";

const app = express();

// Domain redirect middleware - ensure proper domain binding
app.use((req, res, next) => {
  const host = req.get('host');
  const isReplit = host && (host.includes('.replit.') || host.includes('.replit-'));
  const isCustomDomain = host === 'onyxnpearls.com';
  
  // Log domain binding for debugging
  console.log(`[Domain] Host: ${host}, IsReplit: ${isReplit}, IsCustom: ${isCustomDomain}`);
  
  // Accept apex domain as primary (www removed)
  // No redirect needed - serve directly from onyxnpearls.com
  
  // Accept both custom domain and replit domain
  if (isCustomDomain || isReplit || host === 'localhost:5000') {
    return next();
  }
  
  // Default to custom domain for unknown hosts in production
  if (process.env.NODE_ENV === 'production') {
    return res.redirect(301, `https://onyxnpearls.com${req.url}`);
  }
  
  next();
});

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
  // Health check endpoints for load balancer verification
  app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      host: req.get('host'),
      environment: process.env.NODE_ENV || 'development'
    });
  });
  
  app.get('/ping', (req, res) => {
    res.status(200).send('pong');
  });
  
  app.get('/.well-known/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Serve static HTML files before registering routes to avoid React router interference
  app.get('/update-stripe.html', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'update-stripe.html'));
  });
  
  app.get('/update-key.html', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'update-key.html'));
  });
  
  app.get('/update-recaptcha.html', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'update-recaptcha.html'));
  });
  
  app.get('/test-recaptcha', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'test-recaptcha.html'));
  });

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // PRODUCTION MODE - Serve from dist/public (built by Vite)
  const staticPath = path.join(process.cwd(), 'dist/public');
  console.log(`[Production] Serving static files from: ${staticPath}`);
  console.log(`[Production] Current working directory: ${process.cwd()}`);
  
  // Serve static assets
  app.use(express.static(staticPath));

  // SPA fallback for React routing
  app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = process.env.PORT || 5000;
  server.listen({
    port: parseInt(String(port)),
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    log(`Domain binding middleware active`);
  });
})();
