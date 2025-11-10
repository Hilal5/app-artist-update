{{-- contact overlay --}}
<div id="contactOverlay" class="overlay" style="display: none;">
    <div class="overlay-window">
        <div class="overlay-header">
            <h2>Contact Me</h2>
            <button class="close-btn" onclick="closeOverlay('contactOverlay')">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                </svg>
            </button>
        </div>
        
        <div class="overlay-content">
            <!-- Contact Header with Sticker -->
            <div class="contact-header">
                <div class="contact-sticker">
                    <!-- Ganti src dengan path sticker/gambar PNG kamu -->
                    <img src="{{ asset('images/chibi-email.png') }}" alt="Contact Sticker">
                </div>
                <h3>Let's Work Together!</h3>
                <p class="contact-caption">
                    Send me an email for commission inquiries or collaborations.<br>
                    <span class="note">💡 Sometimes I don't really check chat in social media, so email is the best way to reach me!</span>
                </p>
            </div>

            <!-- Contact Form -->
            <form id="contactForm" class="contact-form">
                @csrf
                <div class="form-group">
                    <label for="contactName">Your Name</label>
                    <input type="text" id="contactName" name="name" placeholder="John Doe" required>
                </div>

                <div class="form-group">
                    <label for="contactEmail">Your Email</label>
                    <input type="email" id="contactEmail" name="email" placeholder="john@example.com" required>
                </div>

                <div class="form-group">
                    <label for="contactSubject">Subject</label>
                    <select id="contactSubject" name="subject" required>
                        <option value="">Select a subject</option>
                        <option value="commission">Commission Inquiry</option>
                        <option value="collaboration">Collaboration</option>
                        <option value="question">General Question</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="contactMessage">Message</label>
                    <textarea id="contactMessage" name="message" rows="6" placeholder="Tell me about your project or inquiry..." required></textarea>
                </div>

                <button type="submit" class="submit-btn">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" fill="none"/>
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                    Send Message
                </button>
            </form>

            <!-- Alternative Contact Methods -->
            <div class="alternative-contact">
                <div class="divider">
                    <span>Or reach me directly</span>
                </div>
                <div class="direct-contact-grid">
                    <a href="mailto:hilalprayogi24@gmail.com" class="direct-contact-btn">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        hilalprayogi24@gmail.com
                    </a>
                    {{-- <a href="https://discord.gg/seseorang20" target="_blank" class="direct-contact-btn">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                        </svg>
                        Discord Server
                    </a> --}}
                </div>
            </div>
        </div>
    </div>
</div>
{{-- end overlay --}}