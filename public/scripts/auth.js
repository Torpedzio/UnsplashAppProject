export function isLoggedIn() {
    return !!localStorage.getItem('user');
}

export async function addToCollection(photo) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
        alert('Musisz być zalogowany, aby dodać zdjęcie do kolekcji.');
        return;
    }

    try {
        const res = await fetch('/api/add-to-collection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: user.id,
                photo
            })
        });

        const data = await res.json();
        if (res.ok) {
            alert('✅ Zdjęcie dodane do kolekcji!');
        } else {
            alert('⚠️ ' + (data.error || 'Nie udało się dodać'));
        }
    } catch (err) {
        alert('Błąd połączenia');
    }
}

const accountContent = document.getElementById('account-content');
if (accountContent) {
    function logout() {
        localStorage.removeItem('user');
        alert('Zostałeś wylogowany.');
        window.location.href = 'index.html';
    }

    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        accountContent.innerHTML = `
      <h2>Witaj, ${user.username}!</h2>
      <ul>
        <li><strong>Szczegóły konta</strong></li>
        <li><a href="collection.html">Moja kolekcja</a></li>
        <li><a href="#" onclick="logout(); return false;">Wyloguj się</a></li>
      </ul>
    `;
        window.logout = logout;
    } else {
        accountContent.innerHTML = `
      <p>Nie jesteś zalogowany.</p>
      <a href="login.html" style="display:inline-block; margin-top:10px;">Zaloguj się</a>
    `;
    }
}