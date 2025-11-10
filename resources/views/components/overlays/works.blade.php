<!-- Works/Portfolio Overlay -->
<div class="overlay" id="worksOverlay" style="display: none;">
    <div class="overlay-window works-window">
        <div class="overlay-header">
            <h2>
                <svg viewBox="0 0 24 24" width="28" height="28" style="display: inline-block; vertical-align: middle; margin-right: 10px;">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                    <polyline points="21 15 16 10 5 21" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
                Portfolio & Works
            </h2>
            <button class="close-btn" onclick="closeOverlay('worksOverlay')">
                <svg viewBox="0 0 24 24" width="20" height="20">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                </svg>
            </button>
        </div>

        <div class="overlay-content">
            <!-- Portfolio Header -->
            <div class="portfolio-header">
                <div class="portfolio-icon">
                    <svg viewBox="0 0 24 24" width="50" height="50">
                        <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" stroke="orange" stroke-width="2" fill="none"/>
                    </svg>
                </div>
                <h3>My Creative Works</h3>
                <p class="portfolio-subtitle">Showcasing my best projects and artworks</p>
            </div>

            <!-- Portfolio Stats -->
            <div class="portfolio-stats">
                <div class="stat-card">
                    <div class="stat-icon">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="yellow" stroke-width="2" fill="none"/>
                        </svg>
                    </div>
                    <div class="stat-info">
                        <strong id="totalWorksCount">0</strong>
                        <span>Total Works</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="white" stroke-width="2" fill="none"/>
                            <circle cx="9" cy="7" r="4" stroke="white" stroke-width="2" fill="none"/>
                        </svg>
                    </div>
                    <div class="stat-info">
                        <strong id="happyClientsCount">0</strong>
                        <span>Total Clients</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="orange" stroke-width="2" fill="none"/>
                        </svg>
                    </div>
                    <div class="stat-info">
                        <strong id="avgRatingCount">0</strong>
                        <span>Avg Rating</span>
                    </div>
                </div>
            </div>

            <!-- Category Filter -->
            <div class="portfolio-filter">
                <button class="filter-btn active" onclick="filterWorks('all', event)">All</button>
                <button class="filter-btn" onclick="filterWorks('illustration', event)">Illustration</button>
                <button class="filter-btn" onclick="filterWorks('character', event)">Character Design</button>
                <button class="filter-btn" onclick="filterWorks('commission', event)">Commissions</button>
                <button class="filter-btn" onclick="filterWorks('fanart', event)">Fan Art</button>
                <button class="filter-btn" onclick="filterWorks('concept', event)">Concept Art</button>
                <button class="filter-btn" onclick="filterWorks('logo', event)">Logo Design</button>
                <button class="filter-btn" onclick="filterWorks('other', event)">Other</button>
            </div>

            <!-- Admin Controls (only visible for admin) -->
            @auth
                @if(auth()->user()->role === 'admin')
                <div class="admin-work-controls">
                    <button class="add-work-btn" onclick="openWorkForm()">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2"/>
                            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        Add New Work
                    </button>
                </div>
                @endif
            @endauth

            <!-- Works Grid -->
            <div class="works-grid" id="worksGrid">
                <!-- Loading spinner -->
                <div class="loading-spinner">
                    <svg class="spinner" viewBox="0 0 24 24" width="40" height="40">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25"/>
                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" fill="none"/>
                    </svg>
                    <p>Loading portfolio...</p>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Work Form Modal (Admin) -->
<div class="auth-modal" id="workFormModal" style="display: none;">
    <div class="auth-modal-content" style="max-width: 600px;">
        <button class="auth-close-btn" onclick="closeWorkForm()">
            <svg viewBox="0 0 24 24" width="20" height="20">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
            </svg>
        </button>

        <div class="auth-header">
            <div class="auth-icon">
                <svg viewBox="0 0 24 24" width="50" height="50">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="white" stroke-width="2" fill="none"/>
                </svg>
            </div>
            <h2 id="workFormTitle">Add New Work</h2>
            <p>Share your amazing artwork with the world</p>
        </div>
<form id="workForm" class="auth-form" enctype="multipart/form-data">
    @csrf
    <input type="hidden" id="workId" name="id">

    <!-- Title -->
    <div class="form-group">
        <label for="workTitle">
            Project Title <span style="color: #f44336;">*</span>
        </label>
        <div class="input-icon">
            <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="white" fill="none" stroke-width="2"/>
            </svg>
            <input 
                type="text" 
                id="workTitle" 
                name="title" 
                required 
                placeholder="e.g., Fantasy Character Illustration"
                maxlength="100"
                autocomplete="off"
                autofocus
            >
        </div>
        <small style="color: rgba(255,255,255,0.5); font-size: 11px; margin-top: 4px; display: block;">
            Give your work a clear, descriptive title
        </small>
    </div>

    <!-- Category & Client (Side by Side) -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <!-- Category -->
        <div class="form-group">
            <label for="workCategory">
                Category <span style="color: #f44336;">*</span>
            </label>
            <div class="input-icon">
                <select id="workCategory" name="category" required>
                    <option value="">Choose category</option>
                    <option value="illustration">🎨 Illustration</option>
                    <option value="character">👤 Character Design</option>
                    <option value="commission">💼 Commission Work</option>
                    <option value="fanart">⭐ Fan Art</option>
                    <option value="concept">🖌️ Concept Art</option>
                    <option value="logo">📐 Logo Design</option>
                    <option value="other">📦 Other</option>
                </select>
            </div>
        </div>

        <!-- Client Name -->
        <div class="form-group">
            <label for="workClient">
                Client Name
                <span style="color: rgba(255,255,255,0.5); font-weight: normal; font-size: 12px;">(Optional)</span>
            </label>
            <div class="input-icon">
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="white" stroke-width="2" fill="none"/>
                    <circle cx="9" cy="7" r="4" stroke="white" stroke-width="2" fill="none"/>
                </svg>
                <input 
                    type="text" 
                    id="workClient" 
                    name="client_name" 
                    placeholder="Client or project name"
                    maxlength="50"
                    autocomplete="off"
                >
            </div>
        </div>
    </div>

    <!-- Description -->
    <div class="form-group">
        <label for="workDescription">
            Description
            <span style="color: rgba(255,255,255,0.5); font-weight: normal; font-size: 12px;">(Optional)</span>
        </label>
        <textarea 
            id="workDescription" 
            name="description" 
            rows="5" 
            placeholder="✨ Tell the story behind this work...&#10;💡 What inspired you?&#10;🎯 What techniques did you use?"
            maxlength="500"
            style="resize: vertical;"
        ></textarea>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 5px;">
            <small style="color: rgba(255,255,255,0.5); font-size: 11px;">
                Share details about your creative process
            </small>
            <div class="char-count" style="color: rgba(255,255,255,0.6); font-size: 12px;">
                <span id="workDescCharCount">0</span>/500
            </div>
        </div>
    </div>

    <!-- ✅ UPDATED: Work Images/Videos (Mixed Files) -->
    <div class="form-group">
        <label>
            Work Media <span style="color: #f44336;">*</span>
            <span style="color: rgba(255,255,255,0.6); font-weight: normal; font-size: 13px;">(1-5 files)</span>
        </label>
        <small style="color: rgba(255,255,255,0.6); font-size: 12px; margin-bottom: 10px; display: block;">
            💡 <strong>Tip:</strong> Upload high-quality images and videos to showcase your work best
        </small>
        
        <div class="image-upload-area">
            <input 
                type="file" 
                id="workMediaFiles" 
                name="media_files[]" 
                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp,video/mp4,video/webm,video/mov,video/avi"
                multiple 
                required
                style="display: none;" 
                onchange="handleWorkMediaUpload(event)"
            >
            <label for="workMediaFiles" class="upload-label" style="cursor: pointer;">
                <svg viewBox="0 0 24 24" width="40" height="40">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="white" stroke-width="2" fill="none"/>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="white"/>
                    <polyline points="21 15 16 10 5 21" stroke="white" stroke-width="2" fill="none"/>
                </svg>
                <span style="font-weight: 600;">Click to upload images & videos</span>
                <small style="margin-top: 5px;">
                    📸 JPG, PNG, GIF, WebP • 🎥 MP4, WebM, MOV, AVI • Max 50MB each
                </small>
            </label>
        </div>
        
        <div id="workMediaPreview" class="media-preview" style="margin-top: 15px;"></div>
        
        <div class="upload-counter" style="margin-top: 8px;">
            <small style="color: rgba(255,255,255,0.5); font-size: 11px;">
                📁 <span id="mediaCount">0</span>/5 files selected • 
                <span id="imageCount">0</span> images • 
                <span id="videoCount">0</span> videos
            </small>
        </div>
        
        <small style="color: rgba(255,255,255,0.5); font-size: 11px; margin-top: 8px; display: block;">
            ℹ️ Suggestion when uploading a video, also upload 1 image as a thumbnail.
        </small>
    </div>

    <!-- Visibility Toggle -->
    <div class="form-group" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 10px;">
        <label class="checkbox-label" style="padding-left: 0; display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" id="workPublic" name="is_public" checked>
            <span class="checkmark"></span>
            <div style="margin-left: 28px;">
                <span style="font-weight: 600; color: white;">Public Portfolio</span>
                <small style="display: block; color: rgba(255,255,255,0.5); font-size: 11px; margin-top: 2px;">
                    Make this work visible in your public portfolio
                </small>
            </div>
        </label>
    </div>

    <!-- Submit Button -->
    <button type="submit" class="auth-submit-btn" style="margin-top: 25px;" id="workSubmitBtn">
        <span id="workSubmitText">Add to Portfolio</span>
        <svg viewBox="0 0 24 24" width="20" height="20" id="workSubmitIcon">
            <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
    </button>
</form>
    </div>
</div>