import { config } from 'dotenv';
config({ path: '.env.local' });
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export default async function handler(req, res) {
    if (!UNSPLASH_ACCESS_KEY) {
        return res.status(500).json({ error: "Brak klucza API" });
    }

    try {
        const response = await fetch(
            'https://api.unsplash.com/photos/random',
            {
                headers: {
                    'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
                }
            }
        );
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const photo = await response.json();
        res.status(200).json(photo);
    }
    catch (err) {
        console.error("Błąd:", err);
        res.status(500).json({ error: "Nie udało się pobrać zdjęcia" });
    }
}