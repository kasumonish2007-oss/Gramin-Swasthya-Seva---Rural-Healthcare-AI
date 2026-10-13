import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import apiApp from './backend/apiApp.ts';
import { connectDB } from './backend/config/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const server = express();

// Initialize DB (MongoDB or in-memory fallback)
connectDB().catch((err) => {
  console.warn('[DB] MongoDB initialization status:', err.message);
});

// Mount API
server.use(apiApp);

// Static frontend serving
const distPath = path.join(__dirname, 'dist');
server.use(express.static(distPath));

server.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('Rural Healthcare Backend Running. Build frontend with "npm run build".');
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[RuralHealth Server] Running on http://0.0.0.0:${PORT}`);
});
