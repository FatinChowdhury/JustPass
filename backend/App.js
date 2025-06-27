import dotenv from "dotenv";
dotenv.config({ path: '../.env' });
import express from "express";
import cors from "cors";
import { createConnection, closeConnection } from './database-cloud.js';
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import gradesRouter from './routes/grades.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase database connection
async function initializeDatabase() {
  try {
    await createConnection();
    console.log("✅ Connected to Supabase successfully!");
  } catch (error) {
    console.error("❌ Failed to connect to Supabase:", error.message);
    console.log("💡 Make sure your SUPABASE_URL and SUPABASE_ANON_KEY are set correctly");
    
    // Don't exit in production (Vercel)
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
}

// Initialize database
await initializeDatabase();

// Routes
app.use('/api/grades', gradesRouter);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
      message: 'Server is running', 
      database: 'Supabase Cloud',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
});

// Local development server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT. Graceful shutdown...');
    await closeConnection();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM. Graceful shutdown...');
    await closeConnection();
    process.exit(0);
  });
}

// Export for Vercel serverless
export default app;