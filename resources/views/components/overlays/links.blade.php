{{-- overlay links --}}
<div id="linksOverlay" class="overlay" style="display: none;">
    <div class="overlay-window">
        <div class="overlay-header">
            <h2>Social Links</h2>
            <button class="close-btn" onclick="closeOverlay('linksOverlay')">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                </svg>
            </button>
        </div>
        
        <div class="overlay-content">
            <div class="links-header">
                <div class="links-avatar">
                    <img id="profilePhoto" 
                        src="{{ App\Http\Controllers\ProfileController::getProfilePhotoUrl() }}" 
                        alt="Hilal Prayogi"
                        onerror="this.src='{{ asset('images/profile/default-avatar.png') }}'">
                </div>
                <h3>Hilal</h3>
                <p class="links-subtitle">Follow me on social media</p>
            </div>

            <div class="social-links-grid">
                <!-- Facebook -->
                <a href="/" class="social-link-card facebook">
                    <div class="social-link-icon">
                        <svg viewBox="0 0 24 24" width="32" height="32">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </div>
                    <div class="social-link-info">
                        <h4>Facebook</h4>
                        {{-- <p>/</p> --}}
                    </div>
                    <div class="social-link-arrow">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </div>
                </a>

                <!-- X (Twitter) -->
                <a href="#" class="social-link-card twitter">
                    <div class="social-link-icon">
                        <svg viewBox="0 0 24 24" width="32" height="32">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                    </div>
                    <div class="social-link-info">
                        <h4>X</h4>
                        {{-- <p>#</p> --}}
                    </div>
                    <div class="social-link-arrow">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </div>
                </a>

                <!-- Instagram -->
                <a href="/" class="social-link-card instagram">
                    <div class="social-link-icon">
                        <svg viewBox="0 0 24 24" width="32" height="32">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                        </svg>
                    </div>
                    <div class="social-link-info">
                        <h4>Instagram</h4>
                        {{-- <p>/</p> --}}
                    </div>
                    <div class="social-link-arrow">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </div>
                </a>

                <!-- Discord -->
                <a href="/" class="social-link-card discord">
                    <div class="social-link-icon">
                        <svg viewBox="0 0 24 24" width="32" height="32">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                    </div>
                    <div class="social-link-info">
                        <h4>Discord</h4>
                        <p>Join my server</p>
                    </div>
                    <div class="social-link-arrow">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </div>
                </a>

                <!-- Ko-fi -->
                <a href="\" class="social-link-card kofi">
                    <div class="social-link-icon">
                        <svg viewBox="0 0 24 24" width="32" height="32">
                            <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/>
                        </svg>
                    </div>
                    <div class="social-link-info">
                        <h4>Ko-fi</h4>
                        <p>Support my work</p>
                    </div>
                    <div class="social-link-arrow">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </div>
                </a>
            </div>
        </div>
    </div>
</div>
{{-- end overlay links  --}}