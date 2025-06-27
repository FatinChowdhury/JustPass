import { createClient } from '@supabase/supabase-js';

let supabase = null;

const createConnection = async () => {
    if (supabase) return supabase;

    // Check for environment variables at runtime, not import time
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase URL and Key must be provided');
    }

    try {
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log("Connected to Supabase successfully");
        return supabase;
    } catch (err) {
        console.error("Unable to connect to Supabase", err);
        throw err;
    }
};

const closeConnection = async () => {
    // Supabase doesn't require explicit connection closing
    console.log("Supabase connection closed");
};

export { createConnection, closeConnection }; 