import { createConnection } from '../database.js';

class Grade {
    constructor(data) {
        this.id = data.id;
        this.userId = data.userId;
        this.course = data.course;
        this.evalName = data.evalName;
        this.grade = data.grade;
        this.weight = data.weight;
        this.date = data.date;
    }

    // Create a new grade
    async save() {
        const db = await createConnection();
        const query = `
            INSERT INTO grades (userId, course, evalName, grade, weight)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        try {
            const result = await db.run(query, [
                this.userId,
                this.course,
                this.evalName,
                this.grade,
                this.weight
            ]);
            
            this.id = result.lastID;
            return this;
        } catch (error) {
            throw new Error(`Error saving grade: ${error.message}`);
        }
    }

    // Find grades with optional filter
    static async find(filter = {}) {
        const db = await createConnection();
        let query = 'SELECT * FROM grades WHERE 1=1';
        const params = [];

        if (filter.userId) {
            query += ' AND userId = ?';
            params.push(filter.userId);
        }

        if (filter.course) {
            if (filter.course.$regex) {
                query += ' AND course LIKE ?';
                params.push(`%${filter.course.$regex}%`);
            } else {
                query += ' AND course = ?';
                params.push(filter.course);
            }
        }

        query += ' ORDER BY date DESC';

        try {
            const rows = await db.all(query, params);
            return rows.map(row => new Grade(row));
        } catch (error) {
            throw new Error(`Error finding grades: ${error.message}`);
        }
    }

    // Find grade by ID
    static async findById(id) {
        const db = await createConnection();
        const query = 'SELECT * FROM grades WHERE id = ?';
        
        try {
            const row = await db.get(query, [id]);
            return row ? new Grade(row) : null;
        } catch (error) {
            throw new Error(`Error finding grade by ID: ${error.message}`);
        }
    }

    // Update grade by ID
    static async findByIdAndUpdate(id, updateData, options = {}) {
        const db = await createConnection();
        const query = `
            UPDATE grades 
            SET course = ?, evalName = ?, grade = ?, weight = ?
            WHERE id = ?
        `;
        
        try {
            const result = await db.run(query, [
                updateData.course,
                updateData.evalName,
                updateData.grade,
                updateData.weight,
                id
            ]);

            if (result.changes === 0) {
                return null;
            }

            if (options.new) {
                return await Grade.findById(id);
            }
            
            return result;
        } catch (error) {
            throw new Error(`Error updating grade: ${error.message}`);
        }
    }

    // Delete grade by ID
    static async findByIdAndDelete(id) {
        const db = await createConnection();
        
        try {
            // First get the grade to return it
            const grade = await Grade.findById(id);
            if (!grade) return null;

            const query = 'DELETE FROM grades WHERE id = ?';
            const result = await db.run(query, [id]);
            
            return result.changes > 0 ? grade : null;
        } catch (error) {
            throw new Error(`Error deleting grade: ${error.message}`);
        }
    }
}

export default Grade; 