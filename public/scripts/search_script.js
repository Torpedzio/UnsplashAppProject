import { isLoggedIn, addToCollection } from './auth.js';
let searchHistory = JSON.parse(localStorage.getItem('unsplashSearchHistory')) || [];

function saveToHistory(photo) {
    const exists = searchHistory.some(p => p.id === photo.id);
    if (!exists) {
        searchHistory.unshift(photo);
        if (searchHistory.length > 5) searchHistory.pop();
        localStorage.setItem('unsplashSearchHistory', JSON.stringify(searchHistory));
    }
}

function renderHistory() {
    const container = document.getElementById('history-list');
    if (!container) return;

    if (searchHistory.length === 0) {
        container.innerHTML = '<p>Brak historii</p>';
        return;
    }

    container.innerHTML = searchHistory.map((photo, index) => `
    <figure class="thumbnail" data-index="${index}">
      <img src="${photo.urls.small || photo.urls.thumb}" alt="${photo.alt_description || 'miniatura'}" />
      <figcaption>@${photo.user.username}</figcaption>
    </figure>
  `).join('');
}

async function searchPhotos(query) {
    try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(query)}&per_page=6`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const results = data.results || [];
        if (results.length === 0) {
            document.querySelector('.results-grid').innerHTML = '<div class="photo-card">Brak wyników</div>'.repeat(6);
            document.getElementById('main-photo').innerHTML = '';
            return;
        }

        const cards = document.querySelectorAll('.photo-card');
        results.forEach((photo, i) => {
            if (i < 6) {
                cards[i].innerHTML = `
          <img src="${photo.urls.small}" alt="${photo.alt_description || 'zdjęcie'}" />
        `;
                cards[i].dataset.photo = JSON.stringify(photo);
                cards[i].onclick = () => showPhoto(photo);
            }
        });

        for (let i = results.length; i < 6; i++) {
            cards[i].innerHTML = '<span>—</span>';
        }
        if (results.length > 0) {
            showPhoto(results[0]);
        }

    } catch (err) {
        console.error("Błąd wyszukiwania:", err);
        document.querySelector('.results-grid').innerHTML = `
      <div class="photo-card" colspan="6">Błąd: ${err.message}</div>
    `.repeat(6);
    }
}

function showPhoto(photo) {
    saveToHistory(photo);

    const mainPhoto = document.getElementById('main-photo');
    if (!mainPhoto) return;

    mainPhoto.innerHTML = `
    <div class="photo">
      <img src="${photo.urls.regular}" alt="${photo.alt_description || 'zdjęcie'}" />
      <p>Autor: <a href="${photo.user.links.html}" target="_blank">@${photo.user.username}</a></p>
    </div>
  `;
    const btnContainer = document.getElementById('collection-actions');
    if (btnContainer) {
        if (isLoggedIn()) {
            btnContainer.innerHTML = `
        <button id="add-to-collection-btn">Dodaj do kolekcji</button>
      `;
            document.getElementById('add-to-collection-btn').onclick = () => addToCollection(photo);
        } else {
            btnContainer.innerHTML = `
        <button disabled title="Musisz być zalogowany">Dodaj do kolekcji</button>
      `;
        }
    }

    renderHistory();
}

document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const queryInput = document.getElementById('query-input');

    searchBtn.addEventListener('click', () => {
        const q = queryInput.value.trim();
        if (q) searchPhotos(q);
        else alert('Wpisz frazę!');
    });

    queryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchPhotos(queryInput.value.trim());
    });

    renderHistory();

    document.getElementById('history-list').addEventListener('click', (e) => {
        const thumbnail = e.target.closest('.thumbnail');
        if (thumbnail) {
            const index = parseInt(thumbnail.dataset.index);
            const photo = searchHistory[index];
            if (photo) {
                showPhoto(photo);
            }
        }
    });

    const lastQuery = localStorage.getItem('lastSearchQuery');
    if (lastQuery) {
        queryInput.value = lastQuery;
        searchPhotos(lastQuery);
    }
});