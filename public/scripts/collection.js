import { saveImage } from './utils.js';
import {addToCollection, isLoggedIn} from "./auth.js";

let currentCollection = [];

function showMainPhoto(photo) {
    const mainPhotoEl = document.getElementById('main-photo');
    const actionContainer = document.getElementById('action-buttons');
    const container = document.getElementById('collection-container');

    if (photo) {
        mainPhotoEl.innerHTML = `
      <div class="photo">
        <img src="${photo.urls.regular}" alt="${photo.alt_description || 'zdjęcie'}" />
        <p>Autor: <a href="${photo.user.links.html}" target="_blank">@${photo.user.username}</a></p>
      </div>
    `;
        mainPhotoEl.classList.add('active');
        container.classList.add('has-main-photo');

        if (actionContainer) {
            if (isLoggedIn()) {
                actionContainer.innerHTML = `
          <button id="add-to-collection-btn">Dodaj do kolekcji</button>
          <button id="save-image-btn">Zapisz zdjęcie</button>
        `;
                document.getElementById('add-to-collection-btn').onclick = () => addToCollection(photo);
                document.getElementById('save-image-btn').onclick = () => saveImage(photo);
            } else {
                actionContainer.innerHTML = '';
            }
        }
    } else {
        mainPhotoEl.classList.remove('active');
        container.classList.remove('has-main-photo');
        if (actionContainer) actionContainer.innerHTML = '';
    }
}

function renderCollection() {
    const grid = document.getElementById('collection-grid');
    if (!grid) return;

    if (currentCollection.length === 0) {
        grid.innerHTML = '<p>Twoja kolekcja jest pusta.</p>';
        showMainPhoto(null);
        return;
    }

    grid.innerHTML = currentCollection.map((photo, index) => `
    <div class="collection-item" data-index="${index}">
      <img src="${photo.urls.small}" alt="${photo.alt_description || ''}" />
      <p>@${photo.user.username}</p>
    </div>
  `).join('');

    grid.querySelectorAll('.collection-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            showMainPhoto(currentCollection[index]);
        });
    });
}

async function loadCollection() {
    let user = null;
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) user = JSON.parse(userStr);
    } catch (e) {
        console.error('Błąd parsowania:', e);
    }

    const grid = document.getElementById('collection-grid');
    if (!user || typeof user.id !== 'number') {
        const grid = document.getElementById('collection-grid');
        const mainPhoto = document.getElementById('main-photo');
        const container = document.getElementById('collection-container');

        if (mainPhoto) mainPhoto.classList.remove('active');
        if (container) {
            container.classList.remove('has-main-photo');
            container.classList.add('centered-message');
        }

        if (grid) {
            grid.innerHTML = `
      <div class="auth-boxes single-box">
        <div class="auth-box">
          <h3>Wymagane logowanie</h3>
          <p>Aby zobaczyć swoją kolekcję, musisz się zalogować.</p>
          <a href="account.html" class="btn">Przejdź do konta</a>
        </div>
      </div>`;
        }
        return;
    }

    try {
        const res = await fetch(`/api/get-collection?user_id=${encodeURIComponent(user.id)}`);
        const data = await res.json();

        if (!Array.isArray(data)) {
            throw new Error('Nieprawidłowa odpowiedź');
        }

        currentCollection = data;
        renderCollection();
    } catch (err) {
        console.error('Błąd:', err);
        grid.innerHTML = '<p>Błąd ładowania kolekcji.</p>';
        showMainPhoto(null);
    }
}

document.addEventListener('DOMContentLoaded', loadCollection);