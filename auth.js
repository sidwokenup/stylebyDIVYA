// auth.js

// Initialize Supabase client
const SUPABASE_URL = 'https://zchthrtamrdfkhojtapc.supabase.co'; // Replace with your Supabase Project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjaHRocnRhbXJkZmtob2p0YXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzQ2MjksImV4cCI6MjA3MDU1MDYyOX0.BlHSagKhf4uAeRVGXxCgw0804I--Rvdgkez_qBqodvg'; // Replace with your Supabase Public (anon) Key

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.loginEmail.value;
            const password = loginForm.loginPassword.value;
            const errorMessageDiv = document.getElementById('loginError');

            errorMessageDiv.style.display = 'none';
            errorMessageDiv.textContent = '';

            // Basic client-side validation
            if (!email || !password) {
                errorMessageDiv.textContent = 'Please enter both email and password.';
                errorMessageDiv.style.display = 'block';
                return;
            }

            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (error) {
                    errorMessageDiv.textContent = error.message;
                    errorMessageDiv.style.display = 'block';
                } else if (data.user) {
                    alert('Login successful!');
                    // Redirect to home or dashboard
                    window.location.href = 'index.html';
                } else {
                    errorMessageDiv.textContent = 'An unexpected error occurred during login.';
                    errorMessageDiv.style.display = 'block';
                }

            } catch (error) {
                console.error('Login error:', error);
                errorMessageDiv.textContent = 'An unexpected error occurred. Please try again.';
                errorMessageDiv.style.display = 'block';
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = signupForm.signupName.value;
            const email = signupForm.signupEmail.value;
            const phone = signupForm.signupPhone.value; // Phone collected
            const password = signupForm.signupPassword.value;
            const confirmPassword = signupForm.signupConfirmPassword.value;
            const errorMessageDiv = document.getElementById('signupError');

            errorMessageDiv.style.display = 'none';
            errorMessageDiv.textContent = '';

            // Basic client-side validation
            if (!name || !email || !phone || !password || !confirmPassword) {
                errorMessageDiv.textContent = 'All fields are required.';
                errorMessageDiv.style.display = 'block';
                return;
            }

            if (password !== confirmPassword) {
                errorMessageDiv.textContent = 'Passwords do not match.';
                errorMessageDiv.style.display = 'block';
                return;
            }

            if (password.length < 6) {
                errorMessageDiv.textContent = 'Password must be at least 6 characters long.';
                errorMessageDiv.style.display = 'block';
                return;
            }

            try {
                const { data, error } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: { // Store additional user data like name and phone
                            full_name: name,
                            phone_number: phone,
                        }
                    }
                });

                if (error) {
                    errorMessageDiv.textContent = error.message;
                    errorMessageDiv.style.display = 'block';
                } else if (data.user) {
                    alert('Sign up successful! Please check your email to confirm your account.');
                    window.location.href = 'login.html'; // Redirect to login page
                } else {
                    errorMessageDiv.textContent = 'An unexpected error occurred during signup.';
                    errorMessageDiv.style.display = 'block';
                }

            } catch (error) {
                console.error('Signup error:', error);
                errorMessageDiv.textContent = 'An unexpected error occurred. Please try again.';
                errorMessageDiv.style.display = 'block';
            }
        });
    }
});