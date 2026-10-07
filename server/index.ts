import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FoodBridge AI API',
    timestamp: new Date().toISOString(),
    env: {
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
      supabaseConfigured: Boolean(process.env.SUPABASE_URL),
    }
  });
});

// Mount main REST API
app.use('/api', apiRouter);

const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(Number(PORT), HOST, () => {
  console.log(`🚀 FoodBridge AI Backend Server running on http://${HOST}:${PORT}`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`⚠️ Port ${PORT} is already in use by another process.`);
  } else {
    console.error('Server error:', err);
  }
});
