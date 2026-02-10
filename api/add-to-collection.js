import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { user_id, photo } = req.body;

    if (!user_id || !photo || !photo.id) {
        return res.status(400).json({ error: 'Brak danych' });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: existing } = await supabase
        .from('user_collection')
        .select('id')
        .eq('user_id', user_id)
        .eq('photo_id', photo.id)
        .single();

    if (existing) {
        return res.status(409).json({ error: 'Zdjęcie już jest w kolekcji' });
    }

    const { error } = await supabase
        .from('user_collection')
        .insert({
            user_id: user_id,
            photo_id: photo.id,
            photo_data: photo
        });

    if (error) {
        console.error('Błąd zapisu:', error);
        return res.status(500).json({ error: 'Nie udało się dodać' });
    }

    res.status(200).json({ success: true, message: 'Dodano do kolekcji' });
}