import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import Grade from './models/Grade.js';
import { createConnection, closeConnection } from './database.js';
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

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
app.get("/", ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const courseFilter = req.query.course;
        const userId = req.auth.user.id;
        let filter = { userId };
        
        if (courseFilter) {
            filter.course = { $regex: courseFilter, $options: 'i' }; // This will be handled in the Grade.find method
        }
        
        const grades = await Grade.find(filter);
        
        if (!grades || grades.length === 0) {
            return res.status(200).json([]);
        }
        
        return res.status(200).json(grades);
    } catch (error) {
        console.error("Error in GET /:", error);
        res.status(500).json({ 
            message: "Error fetching grades", 
            error: error.message 
        });
    }
});

app.post("/", ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const { course, evalName, grade, weight } = req.body;
        
        if (!course || !evalName || grade == null || weight == null) {
            return res.status(400).json({ message: "Error: Missing required fields" });
        }
        
        const newGrade = new Grade({
            userId: req.auth.user.id,
            course,
            evalName,
            grade,
            weight
        });
        
        await newGrade.save();
        res.status(201).json(newGrade);
    } catch (error) {
        console.error("Error in POST /:", error);
        res.status(500).json({ 
            message: "Error saving grade", 
            error: error.message 
        });
    }
});

app.put("/:id", ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const { course, evalName, grade, weight } = req.body;
        
        if (!course || !evalName || grade == null || weight == null) {
            return res.status(400).json({ message: "Error: Missing required fields" });
        }
        
        const updatedGrade = await Grade.findByIdAndUpdate(
            req.params.id,
            { course, evalName, grade, weight },
            { new: true }
        );
        
        if (!updatedGrade) {
            return res.status(404).json({ message: "Grade not found" });
        }
        
        res.status(200).json(updatedGrade);
    } catch (error) {
        console.error("Error in PUT /:id:", error);
        res.status(500).json({ 
            message: "Error updating grade", 
            error: error.message 
        });
    }
});

app.delete("/:id", ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const deletedGrade = await Grade.findByIdAndDelete(req.params.id);
        
        if (!deletedGrade) {
            return res.status(404).json({ message: "Grade not found" });
        }
        
        res.status(200).json({ message: "Grade deleted successfully" });
    } catch (error) {
        console.error("Error in DELETE /:id:", error);
        res.status(500).json({ 
            message: "Error deleting grade", 
            error: error.message 
        });
    }
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