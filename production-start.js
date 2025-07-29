#!/usr/bin/env node

// Production server for OnyxHooks & More™
// This bypasses the development workflow and serves built static files

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Domain redirect middleware
app.use((req, res, next) => {
  const host = req.get('host');
  const isReplit = host && (host.includes('.replit.') || host.includes('.replit-'));
  const isCustomDomain = host === 'www.onyxnpearls.com' || host === 'onyxnpearls.com';
  
  console.log(`[Domain] Host: ${host}, IsReplit: ${isReplit}, IsCustom: ${isCustomDomain}`);
  
  // Redirect apex domain to www
  if (host === 'onyxnpearls.com') {
    return res.redirect(301, `https://www.onyxnpearls.com${req.url}`);
  }
  
  // Accept both custom domain and replit domain
  if (isCustomDomain || isReplit || host === 'localhost:5000') {
    return next();
  }
  
  // Default to custom domain for unknown hosts in production
  return res.redirect(301, `https://www.onyxnpearls.com${req.url}`);
});

// Health check endpoints
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    host: req.get('host'),
    environment: 'production'
  });
});

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Serve static files from the build folder
const buildPath = path.join(__dirname, 'dist', 'public');
app.use(express.static(buildPath));

// Catch-all route to serve index.html for React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Production] OnyxHooks & More™ server running on port ${PORT}`);
  console.log(`[Production] Serving static files from: ${buildPath}`);
  console.log(`[Production] Domain binding middleware active`);
});