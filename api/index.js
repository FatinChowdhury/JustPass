import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { createConnection, closeConnection } from '../backend/database-cloud.js';
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import gradesRouter from '../backend/routes/grades.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database connection
async function initializeDatabase() {
  try {
    await createConnection();
    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}

// Initialize database connection
initializeDatabase();

// Routes
app.use('/api/grades', gradesRouter);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
      message: 'Server is running', 
      database: 'Supabase Cloud',
      timestamp: new Date().toISOString()
    });
});

// Default handler for serverless
export default app; 