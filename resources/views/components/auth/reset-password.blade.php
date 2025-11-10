<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        /* Base */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: #0f1419;
            font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .reset-page {
            width: 100%;
            max-width: 480px;
            position: relative;
        }

        .reset-card {
            background: rgba(31, 41, 55, 0.8);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(75, 85, 99, 0.3);
            border-radius: 24px;
            padding: 48px 40px;
            width: 100%;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            position: relative;
            overflow: hidden;
        }

        .reset-card::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(234, 179, 8, 0.1) 0%, transparent 70%);
            animation: float 20s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(30px, -30px) rotate(120deg); }
            66% { transform: translate(-20px, 20px) rotate(240deg); }
        }

        /* Header */
        .reset-header {
            text-align: center;
            margin-bottom: 36px;
            position: relative;
            z-index: 1;
        }

        .reset-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #eab308 0%, #f59e0b 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            box-shadow: 0 0 30px rgba(234, 179, 8, 0.3);
            position: relative;
        }

        .reset-icon::before {
            content: '';
            position: absolute;
            top: -3px;
            left: -3px;
            right: -3px;
            bottom: -3px;
            border-radius: 50%;
            z-index: -1;
            opacity: 0.3;
            filter: blur(10px);
        }

        .reset-icon svg {
            width: 32px;
            height: 32px;
            stroke: #0f1419;
            fill: none;
            stroke-width: 2.5;
        }

        .reset-header h1 {
            color: #f9fafb;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }

        .reset-header p {
            color: #9ca3af;
            font-size: 15px;
            line-height: 1.5;
        }

        /* Alert */
        .alert {
            padding: 14px 18px;
            border-radius: 12px;
            margin-bottom: 24px;
            display: none;
            align-items: center;
            gap: 12px;
            font-size: 14px;
            animation: slideDown 0.3s ease;
            position: relative;
            z-index: 1;
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

        .alert.success {
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #4ade80;
        }

        .alert.error {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #f87171;
        }

        .alert svg {
            width: 20px;
            height: 20px;
            stroke: currentColor;
            fill: none;
            stroke-width: 2;
            flex-shrink: 0;
        }

        /* Form */
        .form-group {
            margin-bottom: 24px;
            position: relative;
            z-index: 1;
        }

        .form-group label {
            display: block;
            color: #e5e7eb;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .input-icon {
            position: relative;
            display: flex;
            align-items: center;
            transition: all 0.3s ease;
        }

        .input-icon svg {
            position: absolute;
            left: 16px;
            width: 20px;
            height: 20px;
            stroke: #6b7280;
            fill: none;
            stroke-width: 2;
            transition: stroke 0.3s ease;
            z-index: 1;
        }

        .input-icon input {
            width: 100%;
            padding: 14px 48px 14px 48px;
            background: rgba(17, 24, 39, 0.6);
            border: 1px solid rgba(75, 85, 99, 0.5);
            border-radius: 12px;
            color: #f9fafb;
            font-size: 15px;
            transition: all 0.3s ease;
        }

        .input-icon input::placeholder {
            color: #6b7280;
        }

        /* Perbaikan efek hover dan focus pada input */
        .input-icon:hover input {
            border-color: rgba(234, 179, 8, 0.5);
            box-shadow: 0 0 0 1px rgba(234, 179, 8, 0.1);
        }

        .input-icon input:focus {
            outline: none;
            border-color: #eab308;
            box-shadow: 0 0 0 3px rgba(234, 179, 8, 0.1);
        }

        .input-icon:hover svg,
        .input-icon input:focus + svg {
            stroke: #eab308;
        }

        .input-icon input:read-only {
            background: rgba(17, 24, 39, 0.4);
            color: #9ca3af;
            cursor: not-allowed;
            border-color: rgba(75, 85, 99, 0.3);
        }

        .input-icon input:read-only:hover {
            border-color: rgba(75, 85, 99, 0.3);
            box-shadow: none;
        }

        .input-icon input:read-only + svg {
            stroke: #6b7280;
        }

        .password-input {
            position: relative;
            display: flex;
            align-items: center;
        }

        .toggle-password {
            position: absolute;
            right: 14px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 6px;
            border-radius: 6px;
            transition: background 0.3s ease;
            z-index: 2;
        }

        .toggle-password:hover {
            background: rgba(75, 85, 99, 0.3);
        }

        .toggle-password svg {
            width: 20px;
            height: 20px;
            stroke: #6b7280;
            fill: none;
            stroke-width: 2;
            transition: stroke 0.3s ease;
        }

        .toggle-password:hover svg {
            stroke: #eab308;
        }

        .eye-closed {
            display: none;
        }

        /* Helper Text */
        small {
            color: rgba(255, 255, 255, 0.5);
            font-size: 11px;
            margin-top: 4px;
            display: block;
        }

        /* Password Strength */
        .password-strength {
            margin-top: 8px;
        }

        .strength-bar {
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
        }

        .strength-fill {
            height: 100%;
            width: 0%;
            transition: all 0.3s ease;
            background: #f44336;
        }

        .strength-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 6px;
        }

        .strength-text {
            color: rgba(255, 255, 255, 0.5);
            font-size: 11px;
        }

        .password-requirements {
            display: none;
        }

        .password-requirements small {
            color: rgba(255, 255, 255, 0.5);
            font-size: 10px;
        }

        .password-requirements span {
            opacity: 0.5;
            margin-left: 8px;
        }

        .password-requirements span:first-child {
            margin-left: 0;
        }

        /* Error */
        .error {
            color: #f87171;
            font-size: 13px;
            margin-top: 6px;
            display: none;
            align-items: center;
            gap: 6px;
        }

        .error::before {
            content: '⚠';
            font-size: 14px;
        }

        /* Button */
        .auth-submit-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #eab308 0%, #f59e0b 100%);
            color: #0f1419;
            border: none;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-top: 32px;
            box-shadow: 0 4px 14px rgba(234, 179, 8, 0.3);
            position: relative;
            z-index: 1;
        }

        .auth-submit-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(234, 179, 8, 0.4);
        }

        .auth-submit-btn:active:not(:disabled) {
            transform: translateY(0);
        }

        .auth-submit-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }

        .auth-submit-btn svg {
            width: 20px;
            height: 20px;
            stroke: currentColor;
            stroke-width: 2;
        }

        /* Footer */
        .auth-footer {
            text-align: center;
            margin-top: 28px;
            padding-top: 24px;
            border-top: 1px solid rgba(75, 85, 99, 0.3);
            position: relative;
            z-index: 1;
        }

        .auth-footer p {
            margin: 0;
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
        }

        .auth-footer a {
            color: #667eea;
            font-weight: 600;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .auth-footer a:hover {
            color: #764ba2;
        }

        .auth-footer small {
            display: block;
            margin-top: 15px;
            color: rgba(255, 255, 255, 0.5);
            font-size: 11px;
        }

        /* Responsive */
        @media (max-width: 480px) {
            .reset-card {
                padding: 36px 24px;
                border-radius: 20px;
            }
            
            .reset-header h1 {
                font-size: 24px;
            }

            .reset-icon {
                width: 70px;
                height: 70px;
            }

            .reset-icon svg {
                width: 28px;
                height: 28px;
            }

            .input-icon input {
                padding: 12px 44px 12px 44px;
                font-size: 14px;
            }
            
            .input-icon svg {
                width: 18px;
                height: 18px;
                left: 14px;
            }
            
            .toggle-password svg {
                width: 18px;
                height: 18px;
            }
        }
        
        /* Breakpoint tambahan untuk perangkat yang lebih kecil */
        @media (max-width: 360px) {
            .reset-card {
                padding: 28px 20px;
            }
            
            .reset-header h1 {
                font-size: 22px;
            }
            
            .reset-icon {
                width: 60px;
                height: 60px;
            }
            
            .reset-icon svg {
                width: 24px;
                height: 24px;
            }
            
            .input-icon input {
                padding: 10px 40px 10px 40px;
                font-size: 13px;
            }
            
            .input-icon svg {
                width: 16px;
                height: 16px;
                left: 12px;
            }
            
            .toggle-password {
                right: 12px;
            }
            
            .toggle-password svg {
                width: 16px;
                height: 16px;
            }
        }
    </style>
</head>
<body>
    <!-- Tambahkan elemen audio di dalam body, sebelum script -->
    <audio id="successSound" preload="auto">
        <source src="{{ asset('sounds/toast-notif.mp3') }}" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>
    
    <div class="reset-page">
        <div class="reset-card">
            <!-- Header -->
            <div class="reset-header">
                <div class="reset-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v2h8z"/>
                    </svg>
                </div>
                <h1>Reset Your Password</h1>
                <p>Create a new secure password for your account</p>
            </div>

            <!-- Success Message -->
            <div class="alert success" id="successMessage">
                <svg viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span id="successText"></span>
            </div>

            <!-- Error Message -->
            <div class="alert error" id="errorMessage">
                <svg viewBox="0 0 24 24">
                    <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span id="errorText"></span>
            </div>

            <!-- Form -->
            <form id="resetPasswordForm" class="auth-form" autocomplete="on">
                <input type="hidden" name="token" value="{{ $token }}">
                <input type="hidden" name="email" value="{{ $email }}">

                <!-- Email -->
                <div class="form-group">
                    <label>
                        Email Address <span style="color: #f44336;">*</span>
                    </label>
                    <div class="input-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        <input 
                            type="email" 
                            value="{{ $email }}" 
                            readonly 
                            placeholder="your@email.com"
                        >
                    </div>
                    <small>This email is verified for password reset</small>
                </div>

                <!-- New Password -->
                <div class="form-group">
                    <label>
                        New Password <span style="color: #f44336;">*</span>
                    </label>
                    <div class="password-input">
                        <div class="input-icon">
                            <svg viewBox="0 0 24 24">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2" fill="none"/>
                            </svg>
                            <input 
                                type="password" 
                                id="password" 
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
                            onclick="togglePasswordVisibility('password')"
                            aria-label="Toggle password visibility"
                            tabindex="-1"
                        >
                            <svg class="eye-open" viewBox="0 0 24 24">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" fill="none"/>
                                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                            </svg>
                            <svg class="eye-closed" viewBox="0 0 24 24" style="display: none;">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2" fill="none"/>
                                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"/>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Password Strength Indicator -->
                    <div class="password-strength">
                        <div class="strength-bar">
                            <div class="strength-fill" id="strengthFill"></div>
                        </div>
                        <div class="strength-info">
                            <span class="strength-text" id="strengthText">Password strength</span>
                            <div id="passwordRequirements" class="password-requirements">
                                <small>
                                    <span id="req8chars">✓ 8+ chars</span>
                                    <span id="reqNumber">✓ Number</span>
                                    <span id="reqSpecial">✓ Special</span>
                                </small>
                            </div>
                        </div>
                    </div>
                    
                    <small>💡 Use 8+ characters with numbers & symbols</small>
                    <div class="error" id="passwordError"></div>
                </div>

                <!-- Confirm Password -->
                <div class="form-group">
                    <label>
                        Confirm Password <span style="color: #f44336;">*</span>
                    </label>
                    <div class="password-input">
                        <div class="input-icon">
                            <svg viewBox="0 0 24 24">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2" fill="none"/>
                            </svg>
                            <input 
                                type="password" 
                                id="password_confirmation" 
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
                            onclick="togglePasswordVisibility('password_confirmation')"
                            aria-label="Toggle password visibility"
                            tabindex="-1"
                        >
                            <svg class="eye-open" viewBox="0 0 24 24">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" fill="none"/>
                                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                            </svg>
                            <svg class="eye-closed" viewBox="0 0 24 24" style="display: none;">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2" fill="none"/>
                                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"/>
                            </svg>
                        </button>
                    </div>
                    <small id="passwordMatchText">Make sure passwords match</small>
                    <div class="error" id="passwordConfirmationError"></div>
                </div>

                <!-- Submit Button -->
                <button type="submit" class="auth-submit-btn" id="submitBtn">
                    <span id="btnText">Reset Password</span>
                    <svg viewBox="0 0 24 24" id="buttonIcon">
                        <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/>
                        <polyline points="12 5 19 12 12 19" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                </button>
            </form>

            <!-- Footer -->
            <div class="auth-footer">
                <p>
                    Remember your password? 
                    <a href="/login" style="color: #667eea; font-weight: 600; text-decoration: none;">
                        Login here →
                    </a>
                </p>
                <small>
                    🔒 Your information is safe and will never be shared
                </small>
            </div>
        </div>
    </div>

    <script>
        // Password visibility toggle
        function togglePasswordVisibility(fieldId) {
            const field = document.getElementById(fieldId);
            const eyeOpen = field.parentElement.parentElement.querySelector('.eye-open');
            const eyeClosed = field.parentElement.parentElement.querySelector('.eye-closed');
            
            if (field.type === 'password') {
                field.type = 'text';
                eyeOpen.style.display = 'none';
                eyeClosed.style.display = 'block';
            } else {
                field.type = 'password';
                eyeOpen.style.display = 'block';
                eyeClosed.style.display = 'none';
            }
        }
        

        // Password strength checker
        function checkPasswordStrength(password) {
            const strengthFill = document.getElementById('strengthFill');
            const strengthText = document.getElementById('strengthText');
            const requirements = document.getElementById('passwordRequirements');
            
            let strength = 0;
            let color = '#f44336';
            let text = 'Weak';
            
            // Check requirements
            const hasMinLength = password.length >= 8;
            const hasNumber = /\d/.test(password);
            const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
            
            // Update requirement indicators
            document.getElementById('req8chars').style.opacity = hasMinLength ? '1' : '0.5';
            document.getElementById('reqNumber').style.opacity = hasNumber ? '1' : '0.5';
            document.getElementById('reqSpecial').style.opacity = hasSpecial ? '1' : '0.5';
            
            // Calculate strength
            if (hasMinLength) strength += 33;
            if (hasNumber) strength += 33;
            if (hasSpecial) strength += 34;
            
            // Update UI
            strengthFill.style.width = `${strength}%`;
            
            if (strength < 33) {
                color = '#f44336';
                text = 'Weak';
            } else if (strength < 66) {
                color = '#ff9800';
                text = 'Medium';
            } else {
                color = '#4caf50';
                text = 'Strong';
            }
            
            strengthFill.style.background = color;
            strengthText.textContent = text;
            strengthText.style.color = color;
            
            // Show requirements when typing
            if (password.length > 0) {
                requirements.style.display = 'block';
            } else {
                requirements.style.display = 'none';
            }
        }

        // Password match checker
        function checkPasswordMatch() {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('password_confirmation').value;
            const matchText = document.getElementById('passwordMatchText');
            
            if (confirmPassword.length === 0) {
                matchText.textContent = 'Make sure passwords match';
                matchText.style.color = 'rgba(255, 255, 255, 0.5)';
            } else if (password === confirmPassword) {
                matchText.textContent = 'Passwords match';
                matchText.style.color = '#4caf50';
            } else {
                matchText.textContent = 'Passwords do not match';
                matchText.style.color = '#f44336';
            }
        }

        // Form submission handler
document.getElementById('resetPasswordForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const buttonIcon = document.getElementById('buttonIcon');
    
    // Clear previous errors
    document.querySelectorAll('.error').forEach(el => el.style.display = 'none');
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
    
    // Validate form
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password_confirmation').value;
    
    let isValid = true;
    
    // Check password strength
    if (password.length < 8) {
        document.getElementById('passwordError').textContent = 'Password must be at least 8 characters long';
        document.getElementById('passwordError').style.display = 'flex';
        isValid = false;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
        document.getElementById('passwordConfirmationError').textContent = 'Passwords do not match';
        document.getElementById('passwordConfirmationError').style.display = 'flex';
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Loading state
    submitBtn.disabled = true;
    btnText.textContent = 'Resetting...';
    buttonIcon.style.display = 'none';
    
    try {
        // Prepare form data
        const formData = new FormData(this);
        
        // Send actual POST request to reset endpoint
        const response = await fetch('/reset-password', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': '{{ csrf_token() }}',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: formData.get('token'),
                email: formData.get('email'),
                password: formData.get('password'),
                password_confirmation: formData.get('password_confirmation')
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Success case
            document.getElementById('successText').textContent = data.message;
            document.getElementById('successMessage').style.display = 'flex';
            
            // Play success sound
            const successSound = document.getElementById('successSound');
            successSound.play().catch(e => console.log('Audio play failed:', e));
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = data.redirect || '/login';
            }, 2000);
        } else {
            // Error case from server
            throw new Error(data.message || 'Failed to reset password');
        }
    } catch (error) {
        console.error('Reset password error:', error);
        
        // Show error
        document.getElementById('errorText').textContent = error.message || 'An error occurred. Please try again.';
        document.getElementById('errorMessage').style.display = 'flex';
        
        // Reset button
        submitBtn.disabled = false;
        btnText.textContent = 'Reset Password';
        buttonIcon.style.display = 'block';
    }
});
    </script>
</body>
</html>