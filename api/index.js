import express from "express";
import cors from "cors";
import { createConnection } from '../backend/database-cloud.js';
import gradesRouter from '../backend/routes/grades.js';

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Initialize database connection once
let dbInitialized = false;

async function ensureDatabase() {
  if (!dbInitialized) {
    try {
      await createConnection();
      console.log("✅ Database connected");
      dbInitialized = true;
    } catch (error) {
      console.error("❌ Database connection failed:", error.message);
      throw error;
    }
  }
}

// Routes
app.use('/api/grades', async (req, res, next) => {
  try {
    await ensureDatabase();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
}, gradesRouter);

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    await ensureDatabase();
    res.status(200).json({ 
      message: 'Server is running', 
      database: 'Supabase Cloud',
      environment: 'production',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Export for Vercel serverless
export default app; 