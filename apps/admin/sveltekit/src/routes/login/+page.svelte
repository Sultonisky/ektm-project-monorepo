<script lang="ts">
  import { goto } from '$app/navigation';
  import { PUBLIC_API_BASE_URL } from '$env/static/public';
  import { setSession } from '$lib/auth';
  import { page } from '$app/stores';
  import logoEktm from "$lib/assets/images/logo/logo_ektm.png";

  let email = '';
  let password = '';
  let loading = false;
  let error = '';
  let showPassword = false;

  async function handleLogin() {
  if (!email || !password) {
    error = 'Email dan Password harus diisi';
    return;
  }

  loading = true;
  error = '';

  try {
    console.log('🔄 Attempting login with:', { email, password: '***' });
    
    const res = await fetch(`${PUBLIC_API_BASE_URL}/auth/login/admin`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      mode: 'cors' // Explicitly set CORS mode
    });

    // Handle network errors (including CORS)
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Server error:', res.status, errorText);
      
      // Try to parse as JSON, fallback to text
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || 'Network error' };
      }
      
      throw new Error(errorData.message || `Login failed (${res.status})`);
    }

    const data = await res.json();
    console.log('✅ Login successful:', data);
    
    setSession(data.access_token, data.user);
    
    const redirectTo = $page.url.searchParams.get('redirectTo') ?? '/dashboard';
    goto(redirectTo);
    
  } catch (e) {
    console.error('❌ Login error:', e);
    
    // Type-safe error handling
    const errorMessage = e instanceof Error ? e.message : String(e);
    
    // Specific CORS error handling
    if (errorMessage.includes('CORS') || errorMessage.includes('NetworkError') || errorMessage === 'Failed to fetch') {
      error = 'CORS Error: Backend tidak mengizinkan request dari frontend. Periksa CORS configuration.';
    } else {
      error = errorMessage || 'Login gagal. Cek koneksi dan coba lagi.';
    }
  } finally {
    loading = false;
  }
}

  function togglePassword() {
    showPassword = !showPassword;
  }
</script>

<div class="login-container">
  <!-- Background decoration -->
  <div class="bg-decoration">
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
    <div class="shape shape-3"></div>
  </div>

  <div class="login-card">
    <!-- Header -->
    <div class="header">
      <div class="logo">
        <div class="logo-icon">
          <img src={logoEktm} alt="E-KTM Logo" class="logo-image" />
        </div>
      </div>
      <h1>Selamat Datang</h1>
      <p class="subtitle">Masuk untuk mengakses dashboard admin</p>
    </div>

    <!-- Form -->
    <form on:submit|preventDefault={handleLogin} class="login-form">
      <div class="input-group">
        <div class="input-wrapper">
          <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
          </svg>
          <input 
            type="email" 
            bind:value={email} 
            placeholder="Email address"
            class="form-input"
            required 
          />
        </div>
      </div>

      <div class="input-group">
        <div class="input-wrapper">
          <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="16" r="1" stroke="currentColor" stroke-width="2"/>
            <path d="m7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2"/>
          </svg>
          <input 
            type={showPassword ? 'text' : 'password'}
            bind:value={password} 
            placeholder="Password"
            class="form-input"
            required 
          />
          <button 
            type="button" 
            class="password-toggle"
            on:click={togglePassword}
            tabindex="-1"
          >
            {#if showPassword}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2"/>
                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"/>
              </svg>
            {:else}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              </svg>
            {/if}
          </button>
        </div>
      </div>

      <button type="submit" class="login-button" disabled={loading}>
        {#if loading}
          <div class="spinner"></div>
          <span>Memproses...</span>
        {:else}
          <span>Masuk ke Dashboard</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="2"/>
          </svg>
        {/if}
      </button>

      {#if error}
        <div class="error-message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>{error}</span>
        </div>
      {/if}
    </form>

    <!-- Footer -->
    <div class="footer">
      <p>Butuh bantuan? <a href="#support">Hubungi Support</a></p>
    </div>
  </div>
</div>

<style>
  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: linear-gradient(135deg, #1E69DD 0%, #57D4D4 100%);
    min-height: 100vh;
    overflow: hidden;
  }

  .login-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
  }

  .bg-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }

  .shape-1 {
    width: 300px;
    height: 300px;
    top: -150px;
    right: -150px;
    animation: float 6s ease-in-out infinite;
  }

  .shape-2 {
    width: 200px;
    height: 200px;
    bottom: -100px;
    left: -100px;
    animation: float 8s ease-in-out infinite reverse;
  }

  .shape-3 {
    width: 150px;
    height: 150px;
    top: 50%;
    left: -75px;
    animation: float 10s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }

  .login-card {
    background: #ffffff;
    border-radius: 24px;
    border: 1px solid rgba(30, 105, 221, 0.1);
    padding: 48px;
    width: 100%;
    max-width: 480px;
    box-shadow: 
      0 25px 50px -12px rgba(30, 105, 221, 0.15),
      0 0 0 1px rgba(30, 105, 221, 0.05);
    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    z-index: 1;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .header {
    text-align: center;
    margin-bottom: 40px;
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 32px;
  }

  .logo-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #1E69DD, #57D4D4);
    border-radius: 23px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 8px 32px rgba(30, 105, 221, 0.3);
  }

  .logo-text {
    font-size: 24px;
    font-weight: 700;
    color: #1E69DD;
  }

  .header h1 {
    margin: 0 0 8px;
    font-size: 32px;
    font-weight: 700;
    color: #1E69DD;
    letter-spacing: -0.025em;
  }

  .subtitle {
    margin: 0;
    color: #64748b;
    font-size: 16px;
    line-height: 1.5;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .input-group {
    position: relative;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: 16px;
    color: #64748b;
    z-index: 2;
    pointer-events: none;
  }

  .form-input {
    width: 100%;
    padding: 16px 16px 16px 52px;
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    font-size: 16px;
    background: #ffffff;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    outline: none;
  }

  .form-input:focus {
    border-color: #1E69DD;
    background: #ffffff;
    box-shadow: 
      0 0 0 4px rgba(30, 105, 221, 0.1),
      0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .form-input::placeholder {
    color: #94a3b8;
  }

  .password-toggle {
    position: absolute;
    right: 16px;
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 4px;
    border-radius: 8px;
    transition: all 0.2s;
    z-index: 2;
  }

  .password-toggle:hover {
    color: #1E69DD;
    background: rgba(30, 105, 221, 0.1);
  }

  .login-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    padding: 16px 24px;
    background: linear-gradient(135deg, #1E69DD, #57D4D4);
    color: white;
    border: none;
    border-radius: 16px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 
      0 4px 14px 0 rgba(30, 105, 221, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
  }

  .login-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 
      0 8px 25px rgba(30, 105, 221, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  .login-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .login-button:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 12px;
    color: #dc2626;
    font-size: 14px;
    animation: shake 0.5s ease-in-out;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }

  .footer {
    margin-top: 32px;
    text-align: center;
  }

  .footer p {
    margin: 0;
    font-size: 14px;
    color: #64748b;
  }

  .footer a {
    color: #1E69DD;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }

  .footer a:hover {
    color: #57D4D4;
  }

  .logo-image {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }


  @media (max-width: 640px) {
    .login-card {
      padding: 32px 24px;
      margin: 16px;
    }

    .header h1 {
      font-size: 28px;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
    }

    .logo-text {
      font-size: 20px;
    }
  }
</style>