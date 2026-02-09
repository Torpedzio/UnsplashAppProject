import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({error: 'Method not allowed'});
    }

    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({error: 'Brak danych logowania'});
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const {data, error} = await supabase
        .from('users')
        .select('id, username')
        .eq('username', username)
        .eq('password', password)
        .single();

    if (error || !data) {
        return res.status(401).json({error: 'Nieprawidłowy login lub hasło'});
    }

    res.status(200).json({
        success: true,
        user: {id: data.id, username: data.username}
    });
}