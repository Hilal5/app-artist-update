<div class="user-menu-wrapper">
    @guest
    <!-- Belum Login - Icon User -->
    <div class="user-menu-btn" onclick="toggleUserDropdown()">
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" fill="none"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
        <span class="tooltip">Login / Register</span>
    </div>
    @else
    <!-- Sudah Login - Avatar + Nama -->
    <div class="user-menu-btn logged-in" onclick="toggleUserDropdown()">
        <div class="user-avatar">
            <img src="{{ Auth::user()->getAvatarUrl() }}" alt="{{ Auth::user()->name }}">
            <span class="user-status"></span>
        </div>
        <span class="user-name ">{{ Auth::user()->name }}</span>
        <svg class="dropdown-arrow" viewBox="0 0 24 24" width="16" height="16">
            <polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
        <span class="tooltip">{{ Auth::user()->name }}</span>
    </div>
    @endguest

    <!-- Dropdown Menu -->
    <div class="user-dropdown" id="userDropdown">
        @guest
        <!-- Menu Belum Login -->
        <div class="dropdown-item" onclick="openAuthModal('login')">
            <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="currentColor" stroke-width="2" fill="none"/>
                <polyline points="10 17 15 12 10 7" stroke="currentColor" stroke-width="2" fill="none"/>
                <line x1="15" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Login</span>
        </div>
        <div class="dropdown-item" onclick="openAuthModal('register')">
            <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" fill="none"/>
                <circle cx="8.5" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/>
                <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" stroke-width="2"/>
                <line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Register</span>
        </div>
        @else
        <!-- Menu Sudah Login -->
        <div class="dropdown-header">
            <div class="dropdown-avatar">
                <img src="{{ Auth::user()->getAvatarUrl() }}" alt="{{ Auth::user()->name }}">
            </div>
            <div class="dropdown-info">
                <strong>{{ Auth::user()->name }}</strong>
                <span>{{ Auth::user()->email }}</span>
                @if(Auth::user()->isAdmin())
                <span class="role-badge admin">Admin</span>
                @else
                <span class="role-badge client">Client</span>
                @endif
            </div>
        </div>
        <div class="dropdown-divider"></div>
        
        {{-- <div class="dropdown-item" onclick="navigate('profile')">
            <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" fill="none"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            <span>My Profile</span>
        </div> --}}
        
        {{-- <div class="dropdown-item" onclick="navigate('orders')">
            <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" fill="currentColor"/>
            </svg>
            <span>My Orders</span>
        </div> --}}
        
        <div class="dropdown-item" onclick="navigate('chat')"">
            <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" fill="currentColor"/>
            </svg>
            <span>Messages</span>
                    @auth
            <div class="notification-badge" id="chatNotificationBadge" style="display: none;">
                <span id="chatNotificationCount">0</span>
            </div>
        @endauth
        </div>
        
        <div class="dropdown-divider"></div>
        
        {{-- <div class="dropdown-item" onclick="navigate('settings')">
            <svg viewBox="0 0 24 24" width="18" height="18">
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M12 1v6m0 6v6M1 12h6m6 0h6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Settings</span>
        </div> --}}
        
        <div class="dropdown-item danger" onclick="handleLogout()">
            <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2" fill="none"/>
                <polyline points="16 17 21 12 16 7" stroke="currentColor" stroke-width="2" fill="none"/>
                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Logout</span>
        </div>
        @endguest
    </div>
</div>