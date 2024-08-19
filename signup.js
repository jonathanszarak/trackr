// Import Supabase client library
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient('https://ghkjfnbnvvyjnlxrakeu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdoa2pmbmJudnZ5am5seHJha2V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwOTMxNTcsImV4cCI6MjAzOTY2OTE1N30._756MkgAcju4eE_eCskXP7exbHGw17FPqxkzhYb79x8');

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
        console.error(error.message);
    } else {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'index.html'; // Redirect to homepage
    }
});
