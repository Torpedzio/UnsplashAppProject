import { createClient } from '@supabase/supabase-js';
const {createClient} = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, password } = req.body;

    if (!username || !password || username.length < 3) {
        return res.status(400).json({ error: 'Nieprawidłowe dane' });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: existing, error: checkError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();
    if (existing) {
        return res.status(409).json({ error: 'Użytkownik o tej nazwie już istnieje' });
    }

    const { error: insertError } = await supabase
        .from('users')
        .insert({ username, password });
    if (insertError) {
        console.error('Błąd rejestracji:', insertError);
        return res.status(500).json({ error: 'Nie udało się utworzyć konta' });
    }

    res.status(201).json({ success: true, message: 'Konto utworzone' });
}