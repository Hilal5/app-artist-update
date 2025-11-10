<div class="nav-grid">
    <div class="nav-item" onclick="navigate('about')">
        <div class="icon">
            <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <circle cx="12" cy="8" r="0.5" stroke-width="3"/>
            </svg>
        </div>
        <div class="nav-label">about</div>
    </div>

    <div class="nav-item" onclick="navigate('links')">
        <div class="icon">
            <svg viewBox="0 0 24 24">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
        </div>
        <div class="nav-label">links</div>
    </div>

    <div class="nav-item" onclick="navigate('work')">
        <div class="icon">
            <svg viewBox="0 0 24 24">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
        </div>
        <div class="nav-label">work</div>
    </div>

    <div class="nav-item" onclick="navigate('commisions')">
        <div class="icon">
            <svg viewBox="0 0 24 24">
                <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
            </svg>
        </div>
        <div class="nav-label">Commisions</div>
    </div>

    <div class="nav-item" onclick="navigate('rating')">
        <div class="icon">
            <svg viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
        </div>
        <div class="nav-label">Reviews</div>
    </div>

        <!-- ✅ NEW: Admin Panel (Only for Admin) -->
    @auth
        @if(auth()->user()->role === 'admin')
        <div class="nav-item" onclick="navigate('admin')" style="position: relative;">
            <div class="icon">
                <svg viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"  stroke-width="2" />
                </svg>
            </div>
            <div class="nav-label">Admin</div>
            <!-- Badge for pending reviews -->
            <div class="admin-badge" id="adminBadge" style="display: none;">
                <span id="adminBadgeCount">0</span>
            </div>
        </div>
        @endif
    @endauth

    <div class="nav-item" onclick="navigate('chat')">
        <div class="icon">
            <svg viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
        </div>
        <div class="nav-label">Chat</div>

        @auth
            <div class="notification-badge" id="chatNotificationBadge" style="display: none;">
                <span id="chatNotificationCount">0</span>
            </div>
        @endauth
    </div>

    <div class="nav-item" onclick="navigate('faq')">
        <div class="icon">
            <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 9h.01M9 15h6M15 9h.01"/>
            </svg>
        </div>
        <div class="nav-label">faq</div>
    </div>

    <div class="nav-item" onclick="navigate('contact')">
        <div class="icon">
            <svg viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
            </svg>
        </div>
        <div class="nav-label">contact</div>
    </div>
</div>