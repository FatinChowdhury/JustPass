# Database Migration: MongoDB to SQLite

This project has been refactored to use **SQLite** (file-based database) instead of MongoDB.

## What Changed:
- Replaced `mongoose` with `sqlite3` and `sqlite`
- Updated database connection logic in `database.js`
- Refactored `Grade` model to use raw SQL queries with SQLite
- Removed all Docker-related files for direct terminal usage
- Modified all routes to work with the new SQLite database system

## Setup (Terminal Only):

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Run the application:**
   ```bash
   npm start
   ```

3. **The application will automatically:**
   - Create a SQLite database file (`grades.db`) in the backend directory
   - Create the `grades` table
   - Start the backend server on port 3001

## Database Schema

SQLite uses this table structure:

```sql
CREATE TABLE grades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    course TEXT NOT NULL,
    evalName TEXT NOT NULL,
    grade REAL NOT NULL,
    weight REAL NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

The API endpoints remain the same:

- `GET /` - Get all grades (with optional course filter)
- `POST /` - Create a new grade
- `PUT /:id` - Update a grade
- `DELETE /:id` - Delete a grade

## Environment Variables

### SQLite:
- `DB_PATH` - Path to SQLite file (default: ./grades.db)

You can optionally set the database file location:
```bash
export DB_PATH=./my_custom_grades.db
```

## Migration from MongoDB

Your existing MongoDB data will need to be exported and imported:

1. **Export from MongoDB:**
   ```bash
   mongoexport --db grades --collection grades --out grades.json
   ```

2. **Import to SQLite:**
   - Parse the JSON and insert records using the new API
   - Or create a migration script using the new Grade model

## Benefits of SQLite

- **File-based**: No server required, database is just a file
- **Zero configuration**: Works out of the box
- **Perfect for development**: Easy to backup, move, and version control
- **Built-in to most systems**: No additional database server installation needed
- **Portable**: Database files can be easily shared or moved
- **ACID compliant**: Reliable transactions and data integrity
- **Lightweight**: Minimal resource usage

## File Structure

After migration, your database will be stored as:
```
backend/
├── grades.db          # SQLite database file (created automatically)
├── database.js        # SQLite connection handler
├── models/Grade.js    # SQLite-compatible Grade model
├── App.js            # Updated server with SQLite
└── ...
```

## Troubleshooting

1. **Permission issues:**
   - Check write permissions in the backend directory
   - Ensure the file path is accessible

2. **Database locked errors:**
   - Make sure only one instance of the app is running
   - Check if any other process is accessing the database file

3. **Module import errors:**
   - Ensure all dependencies are installed: `npm install`
   - Check that you're using Node.js version 14+ for ES module support

## Quick Start Commands

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start the server (creates database automatically)
npm start

# Your server will be running on http://localhost:3001
# Database file will be created at backend/grades.db
```

That's it! Your grade tracking app is now running with SQLite. The database file will be created automatically when you first start the server. 