document.addEventListener('DOMContentLoaded', function() {
    const loggedIn = localStorage.getItem('loggedIn');

    if (!loggedIn) {
        // Redirect to the login page if not logged in
        window.location.href = 'login.html';
    } else {
        // Display account options for logged-in users
        document.getElementById('welcome-message').innerText = `Welcome, ${JSON.parse(localStorage.getItem('user')).username}!`;
    }
});
