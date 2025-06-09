import dotenv from "dotenv";
dotenv.config();

import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

const DB_PATH = process.env.DB_PATH || './grades.db';

let db = null;

const createConnection = async () => {
    if (db) return db;

    try {
        // Create SQLite database connection
        db = await open({
            filename: DB_PATH,
            driver: sqlite3.Database
        });

        console.log("Connected to SQLite database successfully");

        // Create grades table if it doesn't exist
        await createTables();
        
        return db;
    } catch(err) {
        console.error("Unable to connect to SQLite database", err);
        process.exit(1);
    }
}

const createTables = async () => {
    try {
        const createGradesTable = `
            CREATE TABLE IF NOT EXISTS grades (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT NOT NULL,
                course TEXT NOT NULL,
                evalName TEXT NOT NULL,
                grade REAL NOT NULL,
                weight REAL NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        await db.exec(createGradesTable);
        
        // Create indexes
        await db.exec('CREATE INDEX IF NOT EXISTS idx_userId ON grades(userId)');
        await db.exec('CREATE INDEX IF NOT EXISTS idx_course ON grades(course)');
        
        console.log("Grades table created or verified");
    } catch(err) {
        console.error("Error creating tables:", err);
    }
}

const closeConnection = async () => {
    if (!db) return;
    await db.close();
    db = null;
    console.log("SQLite connection closed");
}

export { createConnection, closeConnection }; 