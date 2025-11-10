<!-- Admin Panel Overlay -->
<div id="adminOverlay" class="overlay" style="display: none;">
    <div class="overlay-window" style="max-width: 1000px;">
        <div class="overlay-header">
            <h2>Admin Panel - Review Management</h2>
            <button class="close-btn" onclick="closeOverlay('adminOverlay')">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                </svg>
            </button>
        </div>
        
        <div class="overlay-content">
            <!-- Pending Reviews Section -->
            <div class="admin-section">
                <div class="section-header">
                    <h3>
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                            <polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                        Pending Reviews
                    </h3>
                    <span class="pending-count" id="pendingCount">0</span>
                </div>

                <div class="pending-reviews-list" id="pendingReviewsList">
                    <div class="loading-spinner">
                        <svg class="spinner" viewBox="0 0 24 24" width="40" height="40">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25"/>
                            <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" fill="none"/>
                        </svg>
                        <p>Loading pending reviews...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>