import {config} from 'dotenv';
config({path: `.env.local`});
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
//console.log('🔑 Klucz API:', UNSPLASH_ACCESS_KEY);
export default async function handler(req, res) {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ error: "Brak zapytania" });
    }
    if (!UNSPLASH_ACCESS_KEY) {
        return res.status(500).json({ error: "Brak klucza API" });
    }

    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10`,
            {
                headers: {
                    'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
                }
            }
        );
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        res.status(200).json(data);
    }
    catch (err) {
        console.error("Błąd:", err);
        res.status(500).json({ error: "Błąd wyszukiwania" });
    }
}