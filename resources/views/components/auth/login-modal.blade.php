<div id="loginModal" class="auth-modal" style="display: none;">
    <div class="auth-modal-content">
        <button class="auth-close-btn" onclick="closeAuthModal('loginModal')" aria-label="Close">
            <svg viewBox="0 0 24 24" width="24" height="24">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
            </svg>
        </button>

        <div class="auth-header">
            <div class="auth-icon">
                <svg viewBox="0 0 24 24" width="48" height="48">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="white" stroke-width="2" fill="none"/>
                    <polyline points="10 17 15 12 10 7" stroke="white" stroke-width="2" fill="none"/>
                    <line x1="15" y1="12" x2="3" y2="12" stroke="white" stroke-width="2"/>
                </svg>
            </div>
            <h2>Welcome Back!</h2>
            <p>Login to access your dashboard and manage commissions</p>
        </div>

        <form id="loginForm" class="auth-form" autocomplete="on">
            @csrf
            
            <!-- Email Field -->
            <div class="form-group">
                <label for="loginEmail">
                    Email Address <span style="color: #f44336;">*</span>
                </label>
                <div class="input-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" fill="none"/>
                        <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                    <input 
                        type="email" 
                        id="loginEmail" 
                        name="email" 
                        placeholder="your@email.com" 
                        required
                        autocomplete="email"
                        autofocus
                    >
                </div>
            </div>

            <!-- Password Field -->
            <div class="form-group">
                <label for="loginPassword">
                    Password <span style="color: #f44336;">*</span>
                </label>
                <div class="password-input">
                    <div class="input-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                        <input 
                            type="password" 
                            id="loginPassword" 
                            name="password" 
                            placeholder="Enter your password" 
                            required
                            autocomplete="current-password"
                            minlength="6"
                        >
                    </div>
                    <button 
                        type="button" 
                        class="toggle-password" 
                        onclick="togglePasswordVisibility('loginPassword')"
                        aria-label="Toggle password visibility"
                        tabindex="-1"
                    >
                        <svg class="eye-open" viewBox="0 0 24 24" width="20" height="20">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" fill="none"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                        <svg class="eye-closed" viewBox="0 0 24 24" width="20" height="20" style="display: none;">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2" fill="none"/>
                            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Options Row -->
            <div class="form-options" style="margin-top: 15px; margin-bottom: 20px;">
                <label class="checkbox-label" style="cursor: pointer;">
                    <input type="checkbox" name="remember" id="rememberMe">
                    <span class="checkmark"></span>
                    <span style="user-select: none;">Remember me for 30 days</span>
                </label>
                <a 
                    href="#" 
                    class="forgot-password" 
                    onclick="switchAuthModal('forgotPassword'); return false;"
                    style="white-space: nowrap; color: #667eea; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.3s ease;"
                    onmouseover="this.style.color='#764ba2'" 
                    onmouseout="this.style.color='#667eea'"
                >
                    Forgot password?
                </a>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="auth-submit-btn" style="margin-top: 10px;">
                <span id="loginButtonText">Login</span>
                <svg viewBox="0 0 24 24" width="20" height="20" id="loginButtonIcon">
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/>
                    <polyline points="12 5 19 12 12 19" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
            </button>

            <!-- Loading State (Optional - untuk ditambahin di JS) -->
            <div id="loginLoading" style="display: none; text-align: center; margin-top: 15px;">
                <div style="display: inline-block; width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #667eea; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
                <p style="color: rgba(255,255,255,0.6); font-size: 13px; margin-top: 10px;">Logging you in...</p>
            </div>
        </form>

        <!-- Divider -->
        <div style="display: flex; align-items: center; gap: 15px; margin: 25px 0;">
            <div style="flex: 1; height: 1px; background: rgba(255,255,255,0.1);"></div>
            <span style="color: rgba(255,255,255,0.5); font-size: 12px; font-weight: 500;">OR</span>
            <div style="flex: 1; height: 1px; background: rgba(255,255,255,0.1);"></div>
        </div>

        <!-- Footer -->
        <div class="auth-footer" style="text-align: center;">
            <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 14px;">
                Don't have an account? 
                <a 
                    href="#" 
                    onclick="switchAuthModal('register'); return false;"
                    style="color: #667eea; font-weight: 600; text-decoration: none; transition: color 0.3s ease;"
                    onmouseover="this.style.color='#764ba2'" 
                    onmouseout="this.style.color='#667eea'"
                >
                    Register here →
                </a>
            </p>
            <small style="display: block; margin-top: 15px; color: rgba(255,255,255,0.5); font-size: 11px;">
                🔒 Your data is secure and encrypted
            </small>
        </div>
    </div>
</div>