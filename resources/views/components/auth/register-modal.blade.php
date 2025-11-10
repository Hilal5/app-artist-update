<div id="registerModal" class="auth-modal" style="display: none;">
    <div class="auth-modal-content">
        <button class="auth-close-btn" onclick="closeAuthModal('registerModal')" aria-label="Close">
            <svg viewBox="0 0 24 24" width="24" height="24">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
            </svg>
        </button>

        <div class="auth-header">
            <div class="auth-icon">
                <svg viewBox="0 0 24 24" width="48" height="48">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="yellow" stroke-width="2" fill="none"/>
                    <circle cx="8.5" cy="7" r="4" stroke="yellow" stroke-width="2" fill="none"/>
                    <line x1="20" y1="8" x2="20" y2="14" stroke="yellow" stroke-width="2"/>
                    <line x1="23" y1="11" x2="17" y2="11" stroke="yellow" stroke-width="2"/>
                </svg>
            </div>
            <h2>Create Your Account</h2>
            <p>Join our creative community and start your journey</p>
        </div>

        <form id="registerForm" class="auth-form" autocomplete="on">
            @csrf
            
            <!-- Full Name -->
            <div class="form-group">
                <label for="registerName">
                    Full Name <span style="color: #f44336;">*</span>
                </label>
                <div class="input-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="orange" stroke-width="2" fill="none"/>
                        <circle cx="12" cy="7" r="4" stroke="orange" stroke-width="2" fill="none"/>
                    </svg>
                    <input 
                        type="text" 
                        id="registerName" 
                        name="name" 
                        placeholder="e.g., John Doe" 
                        required
                        autocomplete="name"
                        autofocus
                        minlength="3"
                        maxlength="50"
                        pattern="[A-Za-z\s]+"
                        title="Only letters and spaces allowed"
                    >
                </div>
                <small style="color: rgba(255,255,255,0.5); font-size: 11px; margin-top: 4px; display: block;">
                    Use your real name for authenticity
                </small>
            </div>

            <!-- Email Address -->
            <div class="form-group">
                <label for="registerEmail">
                    Email Address <span style="color: #f44336;">*</span>
                </label>
                <div class="input-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="orange" stroke-width="2" fill="none"/>
                        <polyline points="22,6 12,13 2,6" stroke="orange" stroke-width="2" fill="none"/>
                    </svg>
                    <input 
                        type="email" 
                        id="registerEmail" 
                        name="email" 
                        placeholder="your@email.com" 
                        required
                        autocomplete="email"
                    >
                </div>
                <small style="color: rgba(255,255,255,0.5); font-size: 11px; margin-top: 4px; display: block;">
                    We'll send a verification link to this email
                </small>
            </div>

            <!-- Password -->
            <div class="form-group">
                <label for="registerPassword">
                    Password <span style="color: #f44336;">*</span>
                </label>
                <div class="password-input">
                    <div class="input-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="red" stroke-width="2" fill="none"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="red" stroke-width="2" fill="none"/>
                        </svg>
                        <input 
                            type="password" 
                            id="registerPassword" 
                            name="password" 
                            placeholder="Create a strong password" 
                            required 
                            minlength="8"
                            autocomplete="new-password"
                            oninput="checkPasswordStrength(this.value)"
                        >
                    </div>
                    <button 
                        type="button" 
                        class="toggle-password" 
                        onclick="togglePasswordVisibility('registerPassword')"
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
                
                <!-- Password Strength Indicator -->
                <div class="password-strength" style="margin-top: 8px;">
                    <div class="strength-bar" style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;">
                        <div class="strength-fill" id="strengthFill" style="height: 100%; width: 0%; transition: all 0.3s ease; background: #f44336;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
                        <span class="strength-text" id="strengthText" style="color: rgba(255,255,255,0.5); font-size: 11px;">
                            Password strength
                        </span>
                        <div id="passwordRequirements" style="display: none;">
                            <small style="color: rgba(255,255,255,0.5); font-size: 10px;">
                                <span id="req8chars" style="opacity: 0.5;">✓ 8+ chars</span>
                                <span id="reqNumber" style="opacity: 0.5; margin-left: 8px;">✓ Number</span>
                                <span id="reqSpecial" style="opacity: 0.5; margin-left: 8px;">✓ Special</span>
                            </small>
                        </div>
                    </div>
                </div>
                
                <small style="color: rgba(255,255,255,0.5); font-size: 11px; margin-top: 6px; display: block;">
                    💡 Use 8+ characters with numbers & symbols
                </small>
            </div>

            <!-- Confirm Password -->
            <div class="form-group">
                <label for="registerPasswordConfirm">
                    Confirm Password <span style="color: #f44336;">*</span>
                </label>
                <div class="password-input">
                    <div class="input-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="red" stroke-width="2" fill="none"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="red" stroke-width="2" fill="none"/>
                        </svg>
                        <input 
                            type="password" 
                            id="registerPasswordConfirm" 
                            name="password_confirmation" 
                            placeholder="Re-enter your password" 
                            required
                            autocomplete="new-password"
                            oninput="checkPasswordMatch()"
                        >
                    </div>
                    <button 
                        type="button" 
                        class="toggle-password" 
                        onclick="togglePasswordVisibility('registerPasswordConfirm')"
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
                <small id="passwordMatchText" style="color: rgba(255,255,255,0.5); font-size: 11px; margin-top: 4px; display: block;">
                    Make sure passwords match
                </small>
            </div>

            <!-- Terms & Conditions -->
            <div class="form-group" style="margin-top: 20px;">
                <label class="checkbox-label" style="cursor: pointer; padding-left: 0;">
                    <input type="checkbox" name="terms" id="termsCheckbox" required>
                    <span class="checkmark"></span>
                    <span style="margin-left: 28px; user-select: none; color: rgba(255,255,255,0.8); font-size: 13px;">
                        I agree to the 
                        <a 
                            href="#" 
                            onclick="alert('📄 Terms & Conditions:\n\n1. You must be 13+ years old\n2. Provide accurate information\n3. Keep your account secure\n4. Respect our community guidelines\n\nFull terms coming soon!'); return false;"
                            style="color: #667eea; text-decoration: underline;"
                        >
                            Terms & Conditions
                        </a>
                        and 
                        <a 
                            href="#" 
                            onclick="alert('🔒 Privacy Policy:\n\nWe protect your data and never share it without permission.\n\nFull policy coming soon!'); return false;"
                            style="color: #667eea; text-decoration: underline;"
                        >
                            Privacy Policy
                        </a>
                    </span>
                </label>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="auth-submit-btn" style="margin-top: 20px;" id="registerSubmitBtn">
                <span id="registerButtonText">Create My Account</span>
                <svg viewBox="0 0 24 24" width="20" height="20" id="registerButtonIcon">
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/>
                    <polyline points="12 5 19 12 12 19" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
            </button>
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
                Already have an account? 
                <a 
                    href="#" 
                    onclick="switchAuthModal('login'); return false;"
                    style="color: #667eea; font-weight: 600; text-decoration: none; transition: color 0.3s ease;"
                    onmouseover="this.style.color='#764ba2'" 
                    onmouseout="this.style.color='#667eea'"
                >
                    Login here →
                </a>
            </p>
            <small style="display: block; margin-top: 15px; color: rgba(255,255,255,0.5); font-size: 11px;">
                🔒 Your information is safe and will never be shared
            </small>
        </div>
    </div>
</div>