function logout() {
    localStorage.removeItem('user');
    alert('Zostałeś wylogowany.');
    window.location.href = 'index.html';
}

const user = JSON.parse(localStorage.getItem('user'));

const content = document.getElementById('account-content');

if (user) {
    content.innerHTML = `
    <h2>Witaj, ${user.username}!</h2>
    <ul>
      <li><strong>Szczegóły konta</strong></li>
      <li><a href="collection.html">Moja kolekcja</a></li>
      <li><a href="#" onclick="logout(); return false;">Wyloguj się</a></li>
    </ul>`;
} else {
    content.innerHTML = `
    <p>Nie jesteś zalogowany.</p>
    <a href="login.html" style="display:inline-block; margin-top:10px;">Zaloguj się</a>`;
}
window.logout = logout;