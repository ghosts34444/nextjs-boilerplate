async function checkSession() {
    const loading = document.getElementById('loading');
    const form = document.getElementById('loginForm');
    const errorDiv = document.getElementById('error');

    try {
        const response = await fetch('/api/auth/check', {
            credentials: 'include',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (data.authenticated === true) {
            window.location.href = '/console';
            return;
        }

        loading.style.display = 'none';
        form.style.display = 'block';

    } catch (error) {
        loading.style.display = 'none';
        form.style.display = 'block';
        errorDiv.textContent = 'Ошибка подключения к серверу';
        errorDiv.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    checkSession();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(checkSession, 100);
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const errorDiv = document.getElementById('error');
    const submitBtn = document.getElementById('submitBtn');
    const loading = document.getElementById('loading');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Вход...';
    loading.style.display = 'block';
    loading.textContent = 'Выполняется вход...';
    errorDiv.style.display = 'none';

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, rememberMe }),
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok && data.success) {
            window.location.href = '/console';
        } else {
            errorDiv.textContent = data.error || 'Ошибка входа';
            errorDiv.style.display = 'block';
            loading.style.display = 'none';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Войти';
        }
    } catch (error) {
        errorDiv.textContent = 'Ошибка подключения к серверу';
        errorDiv.style.display = 'block';
        loading.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Войти';
    }
});
