document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('error');

    if (username.length < 3) {
        errorEl.textContent = 'Login musi mieć co najmniej 3 znaki';
        return;
    }

    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok && data.success) {
            alert('Konto zostało utworzone! Możesz się zalogować.');
            window.location.href = 'login.html';
        } else {
            errorEl.textContent = data.error || 'Błąd rejestracji';
        }
    } catch (err) {
        errorEl.textContent = 'Błąd połączenia';
    }
});