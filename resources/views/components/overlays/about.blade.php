{{-- overlay about --}}
<div id="aboutOverlay" class="overlay" style="display: none;">
    <div class="overlay-window">
        <div class="overlay-header">
            <h2>About</h2>
            <button class="close-btn" onclick="closeOverlay('aboutOverlay')">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                </svg>
            </button>
        </div>
        
        <div class="overlay-content">
            {{-- Profile Photo Section --}}
            <div class="profile-section">
                <div class="profile-photo-container">
                    <img id="profilePhoto" 
                        src="{{ App\Http\Controllers\ProfileController::getProfilePhotoUrl() }}" 
                        alt="Photo profile"
                        onerror="this.src='{{ asset('images/profile/default-avatar.png') }}'">
                    
                    @auth
                        @if(Auth::user()->isAdmin())
                            <label for="profilePhotoInput" class="photo-upload-btn" title="Change Profile Photo">
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                    <circle cx="12" cy="13" r="4"/>
                                </svg>
                            </label>
                            <input type="file" id="profilePhotoInput" accept="image/*" style="display: none;" onchange="uploadProfilePhoto(event)">
                        @endif
                    @endauth
                </div>
                
                <div class="profile-info">
                    <h2>Hilal prayogi</h2>
                    <p class="tagline">Digital Illustrator • 2D Animator • Developer</p>
                </div>
            </div>

            {{-- Image Modal --}}
            <div id="imageModal" class="modal">
                <img class="modal-content" id="modalImage">
            </div>
            
            {{-- Bio Section --}}
            <div class="bio-section">
                <h3>Hi!, let me introduce myself! 👋</h3>
                <p>
                    im Hilal, an artist somtimes development web. im from indonesian can speak little bit english🙂.
                </p>
                <h3 style="margin-top: 12px; color: white;">
                    What I do:
                </h3>
                <ul style="color: white; margin-top: 8px; padding-left: 20px;">
                    <li>Illustration</li>
                    <li>2D Animation</li>
                    <li>Web Development (<a href="https://github.com/Hilal5" style="color: #3B82F6; ">This my GitHub!</a>)</li>
                </ul>
                <br>
                <h3>Other interest</h3>
                <ul style="color: white; margin-top: 8px; padding-left: 20px;">
                    <li>Animation Movie</li>
                    <li>Delta Force</li>
                    <li>Puzzle games</li>
                    <li>Game Development</li>
                    <li>Comic like Webtoon</li> 
                </ul>
            </div>

            {{-- 💻 Web Dev - <a href="https://github.com/Hilal5" style="color: #3B82F6;">GitHub Projects</a> --}}

            {{-- Skills Section --}}
            <div class="skills-section">
                <h3>What I Do</h3>
                <div class="skill-grid">
                    <div class="skill-card">
                        <div class="skill-icon">
                            <svg viewBox="0 0 24 24" width="28" height="28">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>
                                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                                <polyline points="21 15 16 10 5 21" stroke="currentColor" stroke-width="2" fill="none"/>
                            </svg>
                        </div>
                        <h4>Digital Illustration</h4>
                        <p>Character design, concept art, fan art, comic.</p>
                    </div>
                    
                    <div class="skill-card">
                        <div class="skill-icon">
                            <svg viewBox="0 0 24 24" width="28" height="28">
                                <polygon points="5 3 19 12 5 21 5 3" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                            </svg>
                        </div>
                        <h4>2D Animation</h4>
                        <p>Character animation, motion graphics</p>
                    </div>
                    
                    <div class="skill-card" >
                        <div class="skill-icon">
                            <svg viewBox="0 0 24 24" width="28" height="28">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2" fill="none"/>
                                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none"/>
                            </svg>
                        </div>
                        <h4>Devloper</h4>
                        <p>Fullstack</p>
                    </div>
                </div>
            </div>

            {{-- Tools & Software Section --}}
            <div class="tools-section">
                <h3>Tools & Software</h3>
                <div class="tools-grid">
                    <div class="tool-badge" data-tool="ibisPaint X">
                        <img class="tool-icon" src="{{ asset('images/icons/ibispaintx.jpeg')}}" alt="ibisPaint X">
                        <span class="tool-name">ibisPaint X</span>
                    </div>
                    
                    <div class="tool-badge" data-tool="Adobe Photoshop">
                        <img class="tool-icon" src="{{ asset('images/icons/photoshop.png')}}" alt="Photoshop">
                        <span class="tool-name">Photoshop</span>
                    </div>
                    
                    <div class="tool-badge" data-tool="After Effects">
                        <img class="tool-icon" src="{{ asset('images/icons/aftereffect.png')}}" alt="After Effects">
                        <span class="tool-name">After Effects</span>
                    </div>
                    
                    <div class="tool-badge" data-tool="Blender">
                        <img class="tool-icon" src="{{ asset('images/icons/blender.png')}}" alt="Blender">
                        <span class="tool-name">Blender</span>
                    </div>
                    
                    <div class="tool-badge" data-tool="Clip Studio Paint">
                        <img class="tool-icon" src="{{ asset('images/icons/csp.jpeg')}}" alt="Clip Studio Paint">
                        <span class="tool-name">Clip Studio</span>
                    </div>
                    
                    <div class="tool-badge" data-tool="Procreate">
                        <img class="tool-icon" src="{{ asset('images/icons/procreate.jpg')}}" alt="Procreate">
                        <span class="tool-name">Procreate</span>
                    </div>
                    
                    <div class="tool-badge" data-tool="Krita">
                        <img class="tool-icon" src="{{ asset('images/icons/krita.png')}}" alt="Krita">
                        <span class="tool-name">Krita</span>
                    </div>
                    
                    <div class="tool-badge" data-tool="Adobe Animate">
                        <img class="tool-icon" src="{{ asset('images/icons/adobeanimate.png')}}" alt="Adobe Animate">
                        <span class="tool-name">Adobe Animate</span>
                    </div>
                </div>
            </div>
            <br>
            {{-- Contact Section --}}
            <div class="contact-section">
                <h3>Let's Work Together</h3>
                <div class="contact-links">
                    <a href="#" class="contact-link" onclick="navigate('contact'); closeOverlay('aboutOverlay'); return false;">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                        Contact Form
                    </a>
                    <a href="#" class="contact-link" onclick="navigate('commisions'); closeOverlay('aboutOverlay'); return false;">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>
                            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                            <polyline points="21 15 16 10 5 21" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                        View Commissions
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
{{-- end overlay about --}}