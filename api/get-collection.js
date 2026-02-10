import { createClient } from '@supabase/supabase-js';
const {createClient} = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

module.exports = async function handler(req, res) {
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json([]);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
        .from('user_collection')
        .select('photo_data')
        .eq('user_id', user_id)
        .order('id', { ascending: false });

    if (error) {
        console.error(error);
        return res.status(500).json([]);
    }

    res.status(200).json(data.map(row => row.photo_data));
}