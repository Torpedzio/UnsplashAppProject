export function isLoggedIn() {
    return !!localStorage.getItem('user');
}

export async function addToCollection(photo) {
    const userStr = localStorage.getItem('user');
    let user = null;

    try {
        if (userStr) user = JSON.parse(userStr);
    } catch (e) {
    }

    if (!user || typeof user.id !== 'number') {
        alert('Musisz się zalogować, aby dodać zdjęcie do kolekcji.');
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
        alert('Błąd połączenia z serwerem.');
    }
}

function logout() {
    localStorage.removeItem('user');
    alert('Zostałeś wylogowany.');
    window.location.href = 'index.html';
}
window.logout = logout;

const accountContent = document.getElementById('account-content');
if (accountContent) {

    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        const createdAt = user.created_at
            ? new Date(user.created_at).toLocaleDateString('pl-PL')
            : 'nieznana';
        let photoCount = '...';
        try {
            const res = await fetch(`/api/get-collection?user_id=${user.id}`);
            const data = await res.json();
            photoCount = Array.isArray(data) ? data.length : 0;
        } catch (err) {
            photoCount = 'błąd';
        }

        accountContent.innerHTML = `
            <div class="account-boxes">
              <div class="account-box account-actions">
                <h3>${user.username}</h3>
                <div class="account-separator"></div>
                <button onclick="logout()" class="btn logout-btn">Wyloguj się</button>
              </div>
              <div class="account-box account-details">
                <h3>Szczegóły konta</h3>
                <p><strong>Login:</strong> ${user.username}</p>
                <p><strong>ID użytkownika:</strong> ${user.id}</p>
                <p><strong>Data utworzenia konta:</strong> ${createdAt}</p>
                <p><strong>Liczba zdjęć w kolekcji:</strong> ${photoCount}</p>
              </div>
            </div>`;
    }
    else {
        accountContent.innerHTML = `
        <div class="auth-boxes">
          <div class="auth-box">
            <h3>Zaloguj się</h3>
            <p>Jeśli masz już konto, zaloguj się, aby uzyskać dostęp do kolekcji i innych funkcji.</p>
            <a href="login.html" class="btn">Przejdź do logowania</a>
          </div>
          <div class="auth-separator"></div>
          <div class="auth-box">
            <h3>Zarejestruj się</h3>
            <p>Utwórz nowe konto, aby móc zapisywać ulubione zdjęcia.</p>
            <a href="register.html" class="btn">Przejdź do rejestracji</a>
          </div>
        </div>`;
    }
}