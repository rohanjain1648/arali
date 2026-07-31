import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.router';
import { initSocketServer } from './sockets/socketManager';
import { BackgroundWorker } from './workers/backgroundWorker';
import { prisma } from './db/prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static frontend assets in production if client/dist exists
import path from 'path';
import fs from 'fs';

const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO
initSocketServer(server);

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 [Server] Arali CRM Backend running on http://localhost:${PORT}`);
  console.log(`⚡ [Server] WebSockets listening on port ${PORT}`);

  // Start background worker
  BackgroundWorker.startScheduler();
});

// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('🛑 [Server] Shutting down gracefully...');
  BackgroundWorker.stopScheduler();
  await prisma.$disconnect();
  process.exit(0);
});
