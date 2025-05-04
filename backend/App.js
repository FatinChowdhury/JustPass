import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import GradesRouter from "./routes/grades.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { createClient } from "redis";



const APP = express();
APP.use(express.json());



// mongoose.connect("mongodb://localhost:27017/gradeTracker");
// mongoose.connection.on("connected", () => {
//     console.log("MongoDB connected successfully!");
// });

// mongoose.connection.on("error", (err) => {
//     console.error("MongoDB connection error:", err);
// });

// ROUTES
APP.use("/api/grades", ClerkExpressRequireAuth(), GradesRouter)

APP.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
});