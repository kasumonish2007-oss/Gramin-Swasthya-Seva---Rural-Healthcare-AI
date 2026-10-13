import express from 'express';
import authRoutes from './routes/authRoutes.ts';
import healthRoutes from './routes/healthRoutes.ts';
import hospitalRoutes from './routes/hospitalRoutes.ts';
import doctorRoutes from './routes/doctorRoutes.ts';
import appointmentRoutes from './routes/appointmentRoutes.ts';
import awarenessRoutes from './routes/awarenessRoutes.ts';
import statsRoutes from './routes/statsRoutes.ts';
import ttsRoutes from './routes/ttsRoutes.ts';

const apiApp = express();

// Middleware
apiApp.use(express.json());
apiApp.use(express.urlencoded({ extended: true }));

// Security & CORS headers
apiApp.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Health check
apiApp.get('/api/ping', (_req, res) => {
  res.json({
    status: 'ok',
    system: 'Gramin Swasthya Seva Rural Health Engine',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
apiApp.use('/api/auth', authRoutes);
apiApp.use('/api/health', healthRoutes);
apiApp.use('/api/hospitals', hospitalRoutes);
apiApp.use('/api/doctors', doctorRoutes);
apiApp.use('/api/appointments', appointmentRoutes);
apiApp.use('/api/health-awareness', awarenessRoutes);
apiApp.use('/api/stats', statsRoutes);
apiApp.use('/api/tts', ttsRoutes);

export default apiApp;
