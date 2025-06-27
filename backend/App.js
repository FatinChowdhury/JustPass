import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
// Using cloud database for production deployment
import Grade from './models/Grade-cloud.js';
import { createConnection, closeConnection } from './database-cloud.js';
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import gradesRouter from './routes/grades.js';

const app = express();

// What it does: Allows cross-origin requests 
// (e.g., from a frontend at http://localhost:3000 to a backend at http://localhost:3001)
// like in our case
app.use(cors());

// What it does: Parses incoming JSON data from 
// HTTP requests (e.g., POST, PUT) and makes it available in req.body.
app.use(express.json());
// Order: cors() first (to allow requests), then express.json() (to parse them).

// Initialize SQLite database connection
async function initializeDatabase() {
  try {
    await createConnection();
    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
}

// Initialize database connection
initializeDatabase();

// ROUTES
// Use the grades router for API routes
app.use('/api/grades', gradesRouter);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is running', database: 'SQLite' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Received SIGINT. Graceful shutdown...');
    await closeConnection();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Graceful shutdown...');
    await closeConnection();
    process.exit(0);
});

app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
});