import { createConnection } from '../database-cloud.js';

class Grade {
    constructor(data) {
        this.id = data.id;
        this.userId = data.userId || data.user_id;
        this.course = data.course;
        this.evalName = data.evalName || data.eval_name;
        this.grade = data.grade;
        this.weight = data.weight;
        this.date = data.date || data.created_at;
    }

    // Create a new grade
    async save() {
        const supabase = await createConnection();
        
        try {
            const { data, error } = await supabase
                .from('grades')
                .insert([
                    {
                        user_id: this.userId,
                        course: this.course,
                        eval_name: this.evalName,
                        grade: this.grade,
                        weight: this.weight
                    }
                ])
                .select()
                .single();

            if (error) throw error;
            
            this.id = data.id;
            this.date = data.created_at;
            return this;
        } catch (error) {
            throw new Error(`Error saving grade: ${error.message}`);
        }
    }

    // Find grades with optional filter
    static async find(filter = {}) {
        const supabase = await createConnection();
        
        try {
            let query = supabase.from('grades').select('*');

            if (filter.userId) {
                query = query.eq('user_id', filter.userId);
            }

            if (filter.course) {
                if (filter.course.$regex) {
                    query = query.ilike('course', `%${filter.course.$regex}%`);
                } else {
                    query = query.eq('course', filter.course);
                }
            }

            query = query.order('created_at', { ascending: false });

            const { data, error } = await query;
            if (error) throw error;

            return data.map(row => new Grade(row));
        } catch (error) {
            throw new Error(`Error finding grades: ${error.message}`);
        }
    }

    // Find grade by ID
    static async findById(id) {
        const supabase = await createConnection();
        
        try {
            const { data, error } = await supabase
                .from('grades')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') return null; // No rows found
                throw error;
            }

            return new Grade(data);
        } catch (error) {
            throw new Error(`Error finding grade by ID: ${error.message}`);
        }
    }

    // Update grade by ID
    static async findByIdAndUpdate(id, updateData, options = {}) {
        const supabase = await createConnection();
        
        try {
            const { data, error } = await supabase
                .from('grades')
                .update({
                    course: updateData.course,
                    eval_name: updateData.evalName,
                    grade: updateData.grade,
                    weight: updateData.weight
                })
                .eq('id', id)
                .select()
                .single();

            if (error) {
                if (error.code === 'PGRST116') return null; // No rows found
                throw error;
            }

            return options.new ? new Grade(data) : data;
        } catch (error) {
            throw new Error(`Error updating grade: ${error.message}`);
        }
    }

    // Delete grade by ID
    static async findByIdAndDelete(id) {
        const supabase = await createConnection();
        
        try {
            // First get the grade to return it
            const grade = await Grade.findById(id);
            if (!grade) return null;

            const { error } = await supabase
                .from('grades')
                .delete()
                .eq('id', id);

            if (error) throw error;
            
            return grade;
        } catch (error) {
            throw new Error(`Error deleting grade: ${error.message}`);
        }
    }
}

export default Grade; 