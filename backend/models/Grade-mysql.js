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
        const pool = await createConnection();
        const query = `
            INSERT INTO grades (userId, course, evalName, grade, weight)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        try {
            const [result] = await pool.execute(query, [
                this.userId,
                this.course,
                this.evalName,
                this.grade,
                this.weight
            ]);
            
            this.id = result.insertId;
            return this;
        } catch (error) {
            throw new Error(`Error saving grade: ${error.message}`);
        }
    }

    // Find grades with optional filter
    static async find(filter = {}) {
        const pool = await createConnection();
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
            const [rows] = await pool.execute(query, params);
            return rows.map(row => new Grade(row));
        } catch (error) {
            throw new Error(`Error finding grades: ${error.message}`);
        }
    }

    // Find grade by ID
    static async findById(id) {
        const pool = await createConnection();
        const query = 'SELECT * FROM grades WHERE id = ?';
        
        try {
            const [rows] = await pool.execute(query, [id]);
            return rows.length > 0 ? new Grade(rows[0]) : null;
        } catch (error) {
            throw new Error(`Error finding grade by ID: ${error.message}`);
        }
    }

    // Update grade by ID
    static async findByIdAndUpdate(id, updateData, options = {}) {
        const pool = await createConnection();
        const query = `
            UPDATE grades 
            SET course = ?, evalName = ?, grade = ?, weight = ?
            WHERE id = ?
        `;
        
        try {
            const [result] = await pool.execute(query, [
                updateData.course,
                updateData.evalName,
                updateData.grade,
                updateData.weight,
                id
            ]);

            if (result.affectedRows === 0) {
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
        const pool = await createConnection();
        
        try {
            // First get the grade to return it
            const grade = await Grade.findById(id);
            if (!grade) return null;

            const query = 'DELETE FROM grades WHERE id = ?';
            const [result] = await pool.execute(query, [id]);
            
            return result.affectedRows > 0 ? grade : null;
        } catch (error) {
            throw new Error(`Error deleting grade: ${error.message}`);
        }
    }
}

export default Grade;