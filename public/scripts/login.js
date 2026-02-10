document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('error');

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok && data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            alert('Zalogowano!');
            window.location.href = 'account.html';
        }else {
            errorEl.textContent = data.error || 'Błąd logowania';
        }
    } catch (err) {
        errorEl.textContent = 'Błąd połączenia';
    }
});