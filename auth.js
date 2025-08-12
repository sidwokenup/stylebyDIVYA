// auth.js

const SUPABASE_URL = 'https://zchthrtamrdfkhojtapc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjaHRocnRhbXJkZmtob2p0YXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzQ2MjksImV4cCI6MjA3MDU1MDYyOX0.BlHSagKhf4uAeRVGXxCgw0804I--Rvdgkez_qBqodvg';

// Works whether Supabase is imported as ESM or via CDN
const supabaseClient = (typeof window !== 'undefined' && window.supabase)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');

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
        const { data, error } = await supabaseClient.auth.signInWithPassword({
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

      const name = signupForm.signupName.value.trim();
      const email = signupForm.signupEmail.value.trim();
      const phone = signupForm.signupPhone.value.trim();
      const password = signupForm.signupPassword.value;
      const confirmPassword = signupForm.signupConfirmPassword.value;
      const errorMessageDiv = document.getElementById('signupError');

      errorMessageDiv.style.display = 'none';
      errorMessageDiv.textContent = '';

      // Basic client-side validation
      if (!name || !email || !phone || !password || !confirmPassword) {
        showError('All fields are required.');
        return;
      }

      if (password !== confirmPassword) {
        showError('Passwords do not match.');
        return;
      }

      if (password.length < 6) {
        showError('Password must be at least 6 characters long.');
        return;
      }

      try {
        // Step 1: Create user in Supabase Auth
        const { data: authData, error: signUpError } = await supabaseClient.auth.signUp({
          email: email,
          password: password,
          options: {
            data: { full_name: name, phone_number: phone }
          }
        });

        if (signUpError) {
          showError(signUpError.message);
          return;
        }

        // Step 2: If signup succeeded, store extra info in profiles table
        if (authData.user) {
          const { error: insertError } = await supabaseClient
            .from('profiles')
            .insert({
              id: authData.user.id,
              full_name: name,
              phone_number: phone
            });

          if (insertError) {
            console.error('Profile insert error:', insertError);
            showError('Account created, but profile data not saved. Please contact support.');
            return;
          }

          // Step 3: Success — delay redirect slightly to let network finish
          alert('Sign up successful! Please check your email to confirm your account.');
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 500);
        } else {
          showError('An unexpected error occurred during signup.');
        }
      } catch (error) {
        console.error('Signup error:', error);
        showError('An unexpected error occurred. Please try again.');
      }

      function showError(msg) {
        errorMessageDiv.textContent = msg;
        errorMessageDiv.style.display = 'block';
      }
    });
  }
});