<!-- Rating & Reviews Overlay -->
<div id="ratingOverlay" class="overlay" style="display: none;">
    <div class="overlay-window">
        <div class="overlay-header">
            <h2>Client Reviews</h2>
            <button class="close-btn" onclick="closeOverlay('ratingOverlay')">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                </svg>
            </button>
        </div>
        
        <div class="overlay-content">
            <!-- ✅ NEW: Give Review CTA for Clients -->
            @auth
                @if(auth()->user()->role === 'client')
                <div class="give-review-cta" id="giveReviewCTA">
                    <div class="cta-content">
                        <div class="cta-icon">
                            <svg viewBox="0 0 24 24" width="48" height="48">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" stroke-width="2" fill="none"/>
                            </svg>
                        </div>
                        <div>
                            <h3>Share Your Experience!</h3>
                            <p>Worked with us? Leave a review to help others</p>
                        </div>
                    </div>
                    <button class="give-review-btn" onclick="openReviewForm()">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>
                        </svg>
                        Give Review
                    </button>
                </div>
                @endif
            @endauth

            <!-- Overall Rating Summary (Dynamic) -->
            <div class="rating-summary" id="ratingSummary">
                <div class="rating-score">
                    <div class="score-number" id="averageRating">0</div>
                    <div class="score-stars" id="averageStars"></div>
                    <p class="score-text" id="totalReviews">Based on 0 reviews</p>
                </div>

                <div class="rating-bars" id="ratingBars">
                    <!-- Will be populated by JavaScript -->
                </div>
            </div>

            <!-- Trust Badges -->
            <div class="trust-badges">
                <div class="trust-badge">
                    <svg viewBox="0 0 24 24" width="28" height="28">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="blue" stroke-width="2" fill="none"/>
                        <polyline points="9 12 11 14 15 10" stroke="blue" stroke-width="2" fill="none"/>
                    </svg>
                    <div>
                        <strong>Verified Artist</strong>
                        <p>Identity confirmed</p>
                    </div>
                </div>
                <div class="trust-badge">
                    <svg viewBox="0 0 24 24" width="28" height="28">
                        <circle cx="12" cy="12" r="10" stroke="green" stroke-width="2" fill="none"/>
                        <polyline points="12 6 12 12 16 14" stroke="green" stroke-width="2" fill="none"/>
                    </svg>
                    <div>
                        <strong>Fast Response</strong>
                        <p>Usually replies within 2 hours</p>
                    </div>
                </div>
                <div class="trust-badge">
                    <svg viewBox="0 0 24 24" width="28" height="28">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" stroke-width="2" fill="none"/>
                        <circle cx="12" cy="7" r="4" stroke="white" stroke-width="2" fill="none"/>
                    </svg>
                    <div>
                        <strong><span id="happyClientsCount1">0</span>+ Clients</strong>
                        <p>Successfully completed</p>
                    </div>
                </div>
            </div>

            <!-- Filter Reviews -->
            <div class="review-filter" id="reviewFilter">
                <button class="filter-btn active" onclick="filterReviewsBy('all', event)">All</button>
                <button class="filter-btn" onclick="filterReviewsBy('5', event)">5 Stars</button>
                <button class="filter-btn" onclick="filterReviewsBy('4', event)">4 Stars</button>
                <button class="filter-btn" onclick="filterReviewsBy('3', event)">3 Stars</button>
                <button class="filter-btn" onclick="filterReviewsBy('2', event)">2 Stars</button>
                <button class="filter-btn" onclick="filterReviewsBy('1', event)">1 Stars</button>
                <button class="filter-btn" onclick="filterReviewsBy('images', event)">With Images</button>
            </div>

            <!-- Reviews List (Dynamic) -->
            <div class="reviews-list" id="reviewsList">
                <div class="loading-spinner">
                    <svg class="spinner" viewBox="0 0 24 24" width="40" height="40">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25"/>
                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" fill="none"/>
                    </svg>
                    <p>Loading reviews...</p>
                </div>
            </div>

            <!-- Load More -->
            <button class="load-more-btn" id="loadMoreBtn" style="display: none;" onclick="loadMoreReviews()">
                Load More Reviews
            </button>
        </div>
    </div>
</div>