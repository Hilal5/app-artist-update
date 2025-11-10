<!-- resources/views/components/auth/forgot-password-modal.blade.php -->
<div id="forgotPasswordModal" class="auth-modal" style="display: none;">
    <div class="auth-modal-content">
        <button class="auth-close-btn" onclick="closeAuthModal('forgotPasswordModal')" aria-label="Close">
            <svg viewBox="0 0 24 24" width="24" height="24">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
            </svg>
        </button>

        <div class="auth-header">
            <div class="auth-icon">
                <svg viewBox="0 0 24 24" width="48" height="48">
                    <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="none"/>
                    <path d="M12 8v4M12 16h.01" stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
            <h2>Forgot Password?</h2>
            <p>No worries, we'll send you reset instructions</p>
        </div>

        <form id="forgotPasswordForm" class="auth-form">
            @csrf
            
            <!-- Email Field -->
            <div class="form-group">
                <label for="forgotEmail">
                    Email Address <span style="color: #f44336;">*</span>
                </label>
                <div class="input-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" fill="none"/>
                        <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                    <input 
                        type="email" 
                        id="forgotEmail" 
                        name="email" 
                        placeholder="your@email.com" 
                        required
                        autocomplete="email"
                        autofocus
                    >
                </div>
                <div class="error-message" id="forgotEmailError" style="display: none; color: #f44336; font-size: 12px; margin-top: 5px;"></div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="auth-submit-btn">
                <span id="forgotButtonText">Send Reset Link</span>
                <svg viewBox="0 0 24 24" width="20" height="20" id="forgotButtonIcon">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
            </button>

            <!-- Success Message -->
            <div id="forgotSuccessMessage" style="display: none; margin-top: 15px; padding: 12px; background: rgba(76, 175, 80, 0.1); border: 1px solid rgba(76, 175, 80, 0.3); border-radius: 8px;">
                <p style="margin: 0; color: #4caf50; font-size: 14px; text-align: center;">
                    ✅ <span id="forgotSuccessText"></span>
                </p>
            </div>
        </form>

        <!-- Divider -->
        <div style="display: flex; align-items: center; gap: 15px; margin: 25px 0;">
            <div style="flex: 1; height: 1px; background: rgba(255,255,255,0.1);"></div>
        </div>

        <!-- Footer -->
        <div class="auth-footer" style="text-align: center;">
            <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 14px;">
                Remember your password? 
                <a 
                    href="#" 
                    onclick="switchAuthModal('login'); return false;"
                    style="color: #667eea; font-weight: 600; text-decoration: none; transition: color 0.3s ease;"
                    onmouseover="this.style.color='#764ba2'" 
                    onmouseout="this.style.color='#667eea'"
                >
                    Back to Login →
                </a>
            </p>
            <small style="display: block; margin-top: 15px; color: rgba(255,255,255,0.5); font-size: 11px;">
                🔒 Reset link will expire in 60 minutes
            </small>
        </div>
    </div>
</div>

<style>
    /* Modal sama seperti login/register modal */
    #forgotPasswordModal .auth-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }

    #forgotPasswordModal .error-message {
        display: none;
        color: #f44336;
        font-size: 12px;
        margin-top: 5px;
        animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>