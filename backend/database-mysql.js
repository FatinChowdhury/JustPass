import dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2/promise";

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'grades';

let pool = null;

const createConnection = async () => {
    if (pool) return pool;

    try {
        // Create connection pool
        pool = mysql.createPool({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // Test the connection
        const connection = await pool.getConnection();
        console.log("Connected to MySQL successfully");
        connection.release();

        // Create grades table if it doesn't exist
        await createTables();
        
        return pool;
    } catch(err) {
        console.error("Unable to connect to MySQL", err);
        process.exit(1);
    }
}

const createTables = async () => {
    try {
        const connection = await pool.getConnection();
        
        const createGradesTable = `
            CREATE TABLE IF NOT EXISTS grades (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId VARCHAR(255) NOT NULL,
                course VARCHAR(255) NOT NULL,
                evalName VARCHAR(255) NOT NULL,
                grade DECIMAL(5,2) NOT NULL,
                weight DECIMAL(5,2) NOT NULL,
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_userId (userId),
                INDEX idx_course (course)
            )
        `;
        
        await connection.execute(createGradesTable);
        console.log("Grades table created or verified");
        connection.release();
    } catch(err) {
        console.error("Error creating tables:", err);
    }
}

const closeConnection = async () => {
    if (!pool) return;
    await pool.end();
    pool = null;
    console.log("MySQL connection closed");
}

export { createConnection, closeConnection };