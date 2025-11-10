<div id="reviewFormModal" class="auth-modal" style="display: none;">
    <div class="auth-modal-content">
        <button class="auth-close-btn" onclick="closeReviewForm()">
            <svg viewBox="0 0 24 24" width="24" height="24">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
            </svg>
        </button>

        <div class="auth-header">
            <div class="auth-icon">
                <svg viewBox="0 0 24 24" width="48" height="48">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
            </div>
            <h2>Write a Review</h2>
            <p>Share your experience with us</p>
        </div>

        <form id="reviewForm" class="auth-form" enctype="multipart/form-data">
            @csrf
            
            <!-- Star Rating -->
            <div class="form-group">
                <label>Your Rating <span style="color: #f44336;">*</span></label>
                <div class="star-rating-input" id="starRatingInput">
                    <input type="hidden" name="rating" id="ratingValue" required>
                    <div class="stars-input">
                        <span class="star-input" data-rating="1">
                            <svg viewBox="0 0 24 24" width="32" height="32">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                        </span>
                        <span class="star-input" data-rating="2">
                            <svg viewBox="0 0 24 24" width="32" height="32">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                        </span>
                        <span class="star-input" data-rating="3">
                            <svg viewBox="0 0 24 24" width="32" height="32">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                        </span>
                        <span class="star-input" data-rating="4">
                            <svg viewBox="0 0 24 24" width="32" height="32">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                        </span>
                        <span class="star-input" data-rating="5">
                            <svg viewBox="0 0 24 24" width="32" height="32">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                        </span>
                    </div>
                    <span class="rating-label" id="ratingLabel">Select rating</span>
                </div>
            </div>

            <!-- ✅ NEW: Badge Selection -->
            <div class="form-group">
                <label>
                    <svg viewBox="0 0 24 24" width="18" height="18" style="vertical-align: middle; margin-right: 5px;">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2" fill="none"/>
                        <path d="M12 12 L12 20 M8 16 L12 20 L16 16" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                    Highlight Your Experience (Select up to 5)
                </label>
                <div id="badgeSelector" class="badge-selector">
                    <!-- Badges will be populated by JavaScript based on rating -->
                    <p class="badge-hint">⬆️ Please select a star rating first</p>
                </div>
                <input type="hidden" name="badges" id="selectedBadges" value="[]">
            </div>

            <!-- Commission Type -->
            <div class="form-group">
                <label for="commissionType">Commission Type</label>
                <select id="commissionType" name="commission_type">
                    <option value="">Select type (optional)</option>
                    <option value="Character Design">Character Design</option>
                    <option value="Illustration">Illustration</option>
                    <option value="Animation">Animation</option>
                    <option value="Concept Art">Concept Art</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <!-- Review Comment -->
            <div class="form-group">
                <label for="reviewComment">Your Review <span style="color: #f44336;">*</span></label>
                <textarea 
                    id="reviewComment" 
                    name="comment" 
                    rows="5" 
                    placeholder="Share your experience... (minimum 10 characters)"
                    required
                    minlength="10"
                    maxlength="1000"
                ></textarea>
                <div class="char-count">
                    <span id="charCount">0</span>/1000 characters
                </div>
            </div>

            <!-- Image Upload -->
            <div class="form-group">
                <label for="reviewImages">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
                        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                        <path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                    Add Images/Videos (Max 3, 20MB each)
                </label>
                <input 
                    type="file" 
                    id="reviewImages" 
                    name="images[]" 
                    accept="image/*,video/mp4,video/webm,video/mov"
                    multiple
                    style="display: none;"
                >
                <div id="imagePreview" class="image-preview-container"></div>
            </div>

            <button type="submit" class="auth-submit-btn">
                <span>Submit Review</span>
                <svg viewBox="0 0 24 24" width="20" height="20">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>
                </svg>
            </button>
        </form>
    </div>
</div>