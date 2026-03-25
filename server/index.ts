import "dotenv/config";
import { validateEnv } from "./lib/env-validation";
validateEnv();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compress from "compression";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
const app = express();
app.use(compress());

// Rate limiting — general API: 100 req/min per IP
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

// Strict rate limiting for auth endpoints: 10 req/min per IP
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts, please try again later." },
});

// Apply rate limiting
app.use("/api/v1/auth", authLimiter);
app.use("/api/", apiLimiter);
// Triggering server restart for technical asset fixes...

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://apis.google.com", "https://www.gstatic.com", "https://www.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://*.firebaseio.com", "https://*.googleapis.com", "https://*.firebase.google.com", "wss://*.firebaseio.com", "https://firestore.googleapis.com", "https://identitytoolkit.googleapis.com"],
      frameSrc: ["'self'", "https://accounts.google.com", "https://*.firebaseapp.com"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

const allowedOrigins = [
  'https://myeca.in',
  'https://www.myeca.in',
  ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:5000', 'http://localhost:3000'] : []),
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Serve uploads with long-lived cache for hashed filenames
app.use('/uploads', express.static('public/uploads', {
  maxAge: '7d',
  etag: true,
}));

// API cache headers: public endpoints can be cached briefly, private ones must not
app.use('/api', (req, res, next) => {
  // Public read endpoints get short cache
  if (req.method === 'GET' && (req.path.startsWith('/public') || req.path.startsWith('/cms'))) {
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600'); // 5min cache
  } else if (req.method === 'GET') {
    res.set('Cache-Control', 'private, no-cache');
  } else {
    res.set('Cache-Control', 'no-store');
  }
  next();
});

// Simple CSRF protection: reject state-changing requests without proper origin
app.use('/api', (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.get('origin');
  const referer = req.get('referer');
  // In production, require matching origin
  if (process.env.NODE_ENV === 'production' && origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'CSRF validation failed' });
  }
  next();
});

// Request logging — only log errors and slow requests in production
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      // Only log errors (4xx/5xx) or slow requests (>1s)
      if (res.statusCode >= 400 || duration > 1000) {
        console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
      }
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = (err as { status?: number }).status || (err as { statusCode?: number }).statusCode || 500;
    const message = (err as { message?: string }).message || "Internal Server Error";

    res.status(status).json({ message });
    console.error(err);
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = 5000;
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
