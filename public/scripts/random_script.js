let history = JSON.parse(localStorage.getItem('unsplashHistory')) || [];

if (history.length > 5) {
    history = history.slice(-5);
    localStorage.setItem('unsplashHistory', JSON.stringify(history));
}

function renderHistory() {
    const container = document.getElementById('history-list');
    if (!container) return;

    if (history.length === 0) {
        container.innerHTML = '<p>Brak historii</p>';
        return;
    }

    container.innerHTML = history.map((photo, index) => `
    <figure class="thumbnail" data-index="${index}">
      <img src="${photo.urls.small || photo.urls.thumb}" alt="${photo.alt_description || 'miniatura'}" />
      <figcaption>@${photo.user.username}</figcaption>
    </figure>
  `).join('');
}

async function loadRandom() {
    try {
        const res = await fetch('/api/random');
        if (!res.ok) throw new Error("Błąd serwera");
        const photo = await res.json();

        const isDuplicate = history.some(p => p.id === photo.id);
        if (!isDuplicate) {
            history.unshift(photo);
            if (history.length > 5) history.pop();
            localStorage.setItem('unsplashHistory', JSON.stringify(history));
        }

        showPhoto(photo);

        renderHistory();

    } catch (err) {
        document.getElementById('main-photo').innerHTML = `<p style="color:red;">Błąd: ${err.message}</p>`;
    }
}

function showPhoto(photo) {
    const mainPhoto = document.getElementById('main-photo');
    if (!mainPhoto) return;

    mainPhoto.innerHTML = `
    <div class="photo">
      <img src="${photo.urls.regular}" alt="${photo.alt_description || 'zdjęcie'}" />
      <p>Autor: <a href="${photo.user.links.html}" target="_blank">@${photo.user.username}</a></p>
    </div>
  `;
}

function showFromHistory(index) {
    const photo = history[index];
    if (photo) {
        showPhoto(photo);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loadBtn = document.getElementById('load-random-btn');
    if (loadBtn) {
        loadBtn.addEventListener('click', loadRandom);
    }
    const historyList = document.getElementById('history-list');
    if (historyList) {
        historyList.addEventListener('click', (e) => {
            const figure = e.target.closest('.thumbnail');
            if (figure) {
                const index = parseInt(figure.dataset.index);
                showFromHistory(index);
            }
        });
    }

    renderHistory();
    if (history.length === 0) {
        loadRandom();
    } else {
        showPhoto(history[0]);
    }
});