{{-- overlay faq --}}
<div id="faqOverlay" class="overlay" style="display: none;">
    <div class="overlay-window">
        <div class="overlay-header">
            <h2>Frequently Asked Questions</h2>
            <button class="close-btn" onclick="closeOverlay('faqOverlay')">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                </svg>
            </button>
        </div>
        
        <div class="overlay-content">
            <div class="faq-header">
                {{-- <div class="faq-icon">
                    <svg viewBox="0 0 24 24" width="60" height="60">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" stroke-width="2" fill="none"/>
                        <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </div> --}}
                <div class="contact-sticker">
                    <!-- Ganti src dengan path sticker/gambar PNG kamu -->
                    <img src="{{ asset('images/chibi-faq.png') }}" alt="Contact Sticker">
                </div>
                <h3>Got Questions?</h3>
                <p class="faq-subtitle">Here are the most common questions about my commission services</p>
            </div>

            <!-- Search FAQ -->
            <div class="faq-search">
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
                <input type="text" id="faqSearchInput" placeholder="Search questions..." oninput="searchFAQ(this.value)">
            </div>

            <!-- FAQ Categories -->
            <div class="faq-categories">
                <button class="category-btn active" onclick="filterFAQ('all')">All</button>
                <button class="category-btn" onclick="filterFAQ('general')">General</button>
                <button class="category-btn" onclick="filterFAQ('pricing')">Pricing</button>
                <button class="category-btn" onclick="filterFAQ('process')">Process</button>
                <button class="category-btn" onclick="filterFAQ('payment')">Payment</button>
            </div>

            <!-- FAQ Accordion -->
            <div class="faq-list" id="faqList">
                <!-- General Questions -->
                <div class="faq-item" data-category="general">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        <h4>What type of commissions do you accept?</h4>
                        <svg class="faq-arrow" viewBox="0 0 24 24" width="20" height="20">
                            <polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </div>
                    <div class="faq-answer">
                        <p>I accept various types of commissions including character illustrations, character design, concept art, animations, and more. However, I have some restrictions - please check the "What I Don't Draw" section below.</p>
                    </div>
                </div>

                <div class="faq-item" data-category="general">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        <h4>What don't you draw?</h4>
                        <svg class="faq-arrow" viewBox="0 0 24 24" width="20" height="20">
                            <polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </div>
                    <div class="faq-answer">
                        <p>I don't accept commissions involving:</p>
                        <ul>
                            <li>NSFW/Adult content</li>
                            <li>Mecha or highly detailed mechanical designs</li>
                            <li>Realistic portraits (my style is more stylized)</li>
                        </ul>
                    </div>
                </div>

                <!-- Pricing Questions -->
                <div class="faq-item" data-category="pricing">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        <h4>How much do you charge?</h4>
                        <svg class="faq-arrow" viewBox="0 0 24 24" width="20" height="20">
                            <polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </div>
                    <div class="faq-answer">
                        <p>Pricing varies depending on complexity, style, and usage rights. Please check my Commission page for detailed pricing tiers. Basic illustration starts from $7, while full character design with multiple views can go up to $20.</p>
                    </div>
                </div>

                <div class="faq-item" data-category="pricing">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        <h4>Do you offer discounts for multiple characters?</h4>
                        <svg class="faq-arrow" viewBox="0 0 24 24" width="20" height="20">
                            <polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </div>
                    <div class="faq-answer">
                        <p>Yes! For multiple characters in the same commission, I offer a 10% discount on each additional character. For bulk orders (5+ illustrations), we can discuss custom pricing.</p>
                    </div>
                </div>

                <!-- Process Questions -->
                <div class="faq-item" data-category="process">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        <h4>How long does a commission take?</h4>
                        <svg class="faq-arrow" viewBox="0 0 24 24" width="20" height="20">
                            <polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </div>
                    <div class="faq-answer">
                        <p>Typical turnaround time is 2-4 weeks depending on complexity and my current queue. Rush orders (1 week) are available for an additional 50% fee. I'll provide an estimated completion date when accepting your commission.</p>
                    </div>
                </div>

                <div class="faq-item" data-category="process">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        <h4>How many revisions do I get?</h4>
                        <svg class="faq-arrow" viewBox="0 0 24 24" width="20" height="20">
                            <polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </div>
                    <div class="faq-answer">
                        <p>Each commission includes:</p>
                        <ul>
                            <li>2 rounds of minor revisions during sketch phase</li>
                            <li>3 round of minor revisions during color phase</li>
                            <li>Additional major revisions can be purchased at $0.3 per round</li>
                        </ul>
                    </div>
                </div>

                <div class="faq-item" data-category="process">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        <h4>Do you provide WIP (Work in Progress) updates?</h4>
                        <svg class="faq-arrow" viewBox="0 0 24 24" width="20" height="20">
                            <polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </div>
                    <div class="faq-answer">
                        <p>Yes! I provide WIP updates at key stages: sketch, lineart, and coloring.</p>
                    </div>
                </div>

                <!-- Payment Questions -->
                <div class="faq-item" data-category="payment">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        <h4>What payment methods do you accept?</h4>
                        <svg class="faq-arrow" viewBox="0 0 24 24" width="20" height="20">
                            <polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </div>
                    <div class="faq-answer">
                        <p>I accept:</p>
                        <ul>
                            <li>PayPal (preferred)</li>
                            <li>Ko-fi</li>
                            <li>Bank transfer (BRI, Seabank, Bank Jago)</li>
                            <li>Digital wallet (DANA, Gopay, shopepay)</li>
                            {{-- <li>Cryptocurrency (Bitcoin, Ethereum)</li> --}}
                        </ul>
                    </div>
                </div>

                <div class="faq-item" data-category="payment">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        <h4>When do I need to pay?</h4>
                        <svg class="faq-arrow" viewBox="0 0 24 24" width="20" height="20">
                            <polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </div>
                    <div class="faq-answer">
                        <p>Payment structure:</p>
                        <ul>
                            <li>30% upfront deposit to start the commission</li>
                            <li>70% final payment before delivery of final files</li>
                        </ul>
                    </div>
                </div>

                <div class="faq-item" data-category="payment">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        <h4>What's your refund policy?</h4>
                        <svg class="faq-arrow" viewBox="0 0 24 24" width="20" height="20">
                            <polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </div>
                    <div class="faq-answer">
                        <p>Refunds are available based on project stage:</p>
                        <ul>
                            <li>Before sketch starts: 100% refund</li>
                            <li>During sketch phase: 50% refund</li>
                            <li>After lineart approval: No refund (final payment required)</li>
                        </ul>
                        <p class="note">Refunds exclude PayPal transaction fees.</p>
                    </div>
                </div>

                <!-- General Info -->
                <div class="faq-item" data-category="general">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        <h4>Can I use the artwork commercially?</h4>
                        <svg class="faq-arrow" viewBox="0 0 24 24" width="20" height="20">
                            <polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </div>
                    <div class="faq-answer">
                        <p>Personal use is included by default. Commercial use requires an additional fee (typically 50-100% of the base price depending on usage scope). Please specify your intended use when commissioning.</p>
                    </div>
                </div>
            </div>

            <!-- Still Have Questions -->
            <div class="faq-cta">
                <h4>Still have questions?</h4>
                <p>Feel free to reach out via email</p>
                <button onclick="closeOverlay('faqOverlay'); navigate('contact')" class="contact-cta-btn">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" fill="none"/>
                        <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                    Contact Me
                </button>
            </div>
        </div>
    </div>
</div>
{{-- end overlay faq --}}