import { isLoggedIn } from './auth.js';

async function loadCollection() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
        document.getElementById('collection-grid').innerHTML =
            '<p>Musisz być zalogowany, aby zobaczyć kolekcję.</p>';
        return;
    }

    try {
        const res = await fetch(`/api/get-collection?user_id=${encodeURIComponent(user.id)}`);
        const data = await res.json();

        const grid = document.getElementById('collection-grid');
        if (data.length === 0) {
            grid.innerHTML = '<p>Twoja kolekcja jest pusta.</p>';
            return;
        }

        grid.innerHTML = data
            .filter(item => item && item.urls)
            .map(item => `
    <div class="collection-item">
      <img src="${item.urls.small}" alt="${item.alt_description || ''}" />
      <p>@${item.user?.username || 'nieznany'}</p>
    </div>
  `).join('');
    } catch (err) {
        console.error(err);
        document.getElementById('collection-grid').innerHTML = '<p>Błąd ładowania.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadCollection);