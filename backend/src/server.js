import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import lessonRoutes from './routes/lessons.js';
import progressRoutes from './routes/progress.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'KlinikLingo API is running' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/lessons', lessonRoutes);
app.use('/progress', progressRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export for Vercel serverless
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 API: http://localhost:${PORT}/api`);
    console.log(`💚 Health: http://localhost:${PORT}/api/health\n`);
  });
}
