<div id="chatOverlay" class="overlay" style="display: none;">
    <div class="overlay-window chat-window">
        <div class="overlay-header">
            <h2 id="chatHeaderTitle">Chat</h2>
            <button class="close-btn" onclick="closeOverlay('chatOverlay')">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                </svg>
            </button>
        </div>
        
        <div class="chat-container">
            <!-- Admin View: Conversations List + Chat -->
            @auth
                @if(Auth::user()->role === 'admin')
                <div class="chat-layout">
                    <!-- Conversations Sidebar -->
                    <div class="conversations-sidebar" id="conversationsSidebar">
                        <div class="conversations-header">
                            <h3>Conversations</h3>
                            <div class="search-conversations">
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <circle cx="11" cy="11" r="8" stroke="white" fill="none" stroke-width="2"/>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="white" stroke-width="2"/>
                                </svg>
                                <input type="text" placeholder="Search users..." onkeyup="searchConversations(this.value)">
                            </div>
                        </div>
                        <div class="conversations-list" id="conversationsList">
                            <div class="loading-spinner">
                                <svg class="spinner" viewBox="0 0 24 24" width="30" height="30">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25"/>
                                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" fill="none"/>
                                </svg>
                                <p>Loading conversations...</p>
                            </div>
                        </div>
                    </div>

                    <!-- Chat Area -->
                    <div class="chat-main" id="chatMain">
                        <div class="empty-chat">
                            <svg viewBox="0 0 24 24" width="60" height="60">
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" stroke="green" stroke-width="2" fill="none"/>
                            </svg>
                            <h3>Select a conversation</h3>
                            <p>Choose from your conversations to start chatting</p>
                        </div>
                    </div>
                </div>
                @else
                <!-- User View: Direct Chat with Admin -->
                <div class="chat-layout">
                    <div class="chat-main user-chat" id="chatMain">
                        <div class="loading-spinner">
                            <svg class="spinner" viewBox="0 0 24 24" width="30" height="30">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25"/>
                                <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" fill="none"/>
                            </svg>
                            <p>Loading chat...</p>
                        </div>
                    </div>
                </div>
                @endif
            @else
            <!-- Not Logged In -->
            <div class="chat-login-required">
                <svg viewBox="0 0 24 24" width="60" height="60">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="red" stroke-width="2" fill="none"/>
                </svg>
                <h3>Login Required</h3>
                <p>Please login to start chatting with us</p>
                <button class="auth-submit-btn" onclick="openAuthModal('login')">
                    Login Now
                </button>
            </div>
            @endauth
        </div>
    </div>
</div>