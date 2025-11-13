// ================================================
// DEBUG HELPER - Only log in development
// ================================================
const DEBUG_MODE =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.includes(".test");

function debugLog(...args) {
    if (DEBUG_MODE) {
        console.log(...args);
    }
}

function debugInfo(title, data) {
    if (DEBUG_MODE) {
        console.log(`🔍 ${title}:`, data);
    }
}

function debugError(title, error) {
    if (DEBUG_MODE) {
        console.error(`❌ ${title}:`, error);
    } else {
        // In production, maybe send to error tracking service
        Example: Sentry.captureException(error);
    }
}
// end debug



// Create animated stars
function createStars() {
    const starsContainer = document.getElementById("stars");
    if (!starsContainer) return;

    const numStars = 100;

    for (let i = 0; i < numStars; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.width = Math.random() * 3 + "px";
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.animationDelay = Math.random() * 3 + "s";
        starsContainer.appendChild(star);
    }
}

// Initialize stars on page load
createStars();

// Theme Toggle Function
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById("themeToggle");

    if (body.classList.contains("dark-mode")) {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
        themeToggle.textContent = "☀️";
        
        // Set light background pattern
        body.style.backgroundImage = "url('/images/doodle-bg.png')";
    } else {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
        themeToggle.textContent = "🌙";
        
        // Set dark background pattern
        body.style.backgroundImage = "url('/images/doodle-bg.png')";
    }
}

// Set initial background on page load
document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    if (body.classList.contains("dark-mode")) {
        body.style.backgroundImage = "url('/images/doodle-bg.png')";
        body.style.backgroundRepeat = "repeat";
        body.style.backgroundSize = "412.5px 749.25px";
        body.style.backgroundAttachment = "fixed";
    }
});

// Social Media Function
function openSocial(platform) {
    const socialLinks = {
        twitter: "https://twitter.com",
        youtube: "https://youtube.com",
        instagram: "https://instagram.com",
    };

    if (socialLinks[platform]) {
        window.open(socialLinks[platform], "_blank");
    }
}

// ============================================
// DRAGGABLE OVERLAY FUNCTIONALITY
// ============================================
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;
let activeOverlay = null;

function initDraggable(overlayId) {
    const overlay = document.getElementById(overlayId);
    const overlayWindow = overlay?.querySelector(".overlay-window");
    const overlayHeader = overlay?.querySelector(".overlay-header");

    if (!overlayHeader || !overlayWindow) return;

    activeOverlay = overlayWindow;

    // overlayHeader.replaceWith(overlayHeader.cloneNode(true));
    // const freshHeader = overlay.querySelector(".overlay-header");

    // newHeader.addEventListener("mousedown", dragStart);
    // newHeader.addEventListener("touchstart", dragStart);

    // ✅ Reset position saja
    overlayWindow.style.transform = "translate(0px, 0px)";
    xOffset = 0;
    yOffset = 0;

    // ✅ Gunakan element asli
    activeOverlay = overlayWindow;

    // ✅ Re-attach events dengan safety check
    if (!overlayHeader.hasAttribute("data-drag-initialized")) {
        overlayHeader.addEventListener("mousedown", dragStart);
        overlayHeader.addEventListener("touchstart", dragStart);
        overlayHeader.setAttribute("data-drag-initialized", "true");
    }

    // Use overlay-specific listeners
    document.addEventListener("mousemove", drag);
    document.addEventListener("touchmove", drag);

    document.addEventListener("mouseup", dragEnd);
    document.addEventListener("touchend", dragEnd);

    function dragStart(e) {
        // Don't drag if clicking on close button
        if (e.target.closest(".close-btn")) return;

        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        isDragging = true;
        overlayWindow.classList.add("dragging");
    }

    function drag(e) {
        if (isDragging && activeOverlay) {
            e.preventDefault();

            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, activeOverlay);
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
        if (activeOverlay) {
            activeOverlay.classList.remove("dragging");
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }
}

function closeOverlay(overlayId) {
    // ✅ Play close sound
    const closeAudio = document.getElementById("closeSound");
    if (closeAudio) {
        closeAudio.currentTime = 0;
        closeAudio.play().catch((error) => {
            console.log("⚠️ Close sound failed:", error);
        });
    }

    // Close overlay
    const overlay = document.getElementById(overlayId);
    if (overlay) {
        overlay.style.display = "none";
    }
}


// ============================================
// UPLOAD PROFILE PHOTO (ADMIN ONLY) - GLOBAL
// ============================================
function uploadProfilePhoto(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validasi file type
    const validTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, GIF, WebP)");
        return;
    }

    // Validasi file size (2MB)
    if (file.size > 20 * 20096 * 20096) {
        alert("File size must be less than 20MB");
        return;
    }

    const formData = new FormData();
    formData.append("profile_photo", file);

    // Show loading state
    const profilePhoto = document.getElementById("profilePhoto");
    const originalSrc = profilePhoto.src;
    profilePhoto.style.opacity = "0.7";

    // Preview image immediately
    const reader = new FileReader();
    reader.onload = function (e) {
        // ✅ REAL-TIME PREVIEW: Update semua yang visible
        profilePhoto.src = e.target.result;

        // ✅ Juga update avatar admin yang sedang login
        updateAllVisibleAvatars(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    if (csrfToken) {
        formData.append("_token", csrfToken.content);

        fetch("/profile/upload-photo", {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRF-TOKEN": csrfToken.content,
            },
        })
            .then((response) => {
                if (response.status === 403) {
                    throw new Error("Only admin can upload photos");
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    console.log("Profile photo updated successfully");

                    // ✅ REAL-TIME UPDATE dengan URL dari server
                    if (data.photo_url) {
                        const newPhotoUrl =
                            data.photo_url + "?t=" + new Date().getTime();

                        // Update semua yang visible
                        profilePhoto.src = newPhotoUrl;
                        updateAllVisibleAvatars(newPhotoUrl);

                        // Force refresh semua profile photo di halaman
                        refreshAllProfilePhotos(newPhotoUrl);
                    }

                    showNotification(
                        "Profile photo updated successfully!",
                        "success"
                    );
                } else {
                    throw new Error(data.message || "Failed to upload photo");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                // Revert to original image
                profilePhoto.src = originalSrc;
                revertAvatarsToOriginal();
                alert("Error: " + error.message);
            })
            .finally(() => {
                profilePhoto.style.opacity = "1";
                // Reset input
                event.target.value = "";
            });
    }
}
// lightbox modal profil
// Fungsi untuk membuka modal dengan gambar
function openImageModal(imgElement) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    modal.style.display = 'block';
    modalImg.src = imgElement.src;
    
    // Tambahkan event listener untuk close
    document.addEventListener('keydown', handleKeyPress);
}

// Fungsi untuk menutup modal
function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    
    // Hapus event listener
    document.removeEventListener('keydown', handleKeyPress);
}

// Fungsi untuk handle tombol keyboard
function openImageModal(imgElement) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");

    modal.style.display = "block";
    modalImg.src = imgElement.src;

    // Tambahkan event listener untuk close
    document.addEventListener("keydown", handleKeyPress);
}

// Fungsi untuk menutup modal
function closeImageModal() {
    const modal = document.getElementById("imageModal");
    modal.style.display = "none";

    // Hapus event listener
    document.removeEventListener("keydown", handleKeyPress);
}

// Fungsi untuk handle tombol keyboard
function handleKeyPress(e) {
    if (e.key === "Escape") {
        closeImageModal();
    }
}

// Event listener saat DOM siap
document.addEventListener("DOMContentLoaded", function () {
    const profilePhoto = document.getElementById("profilePhoto");
    const modal = document.getElementById("imageModal");

    // Tambahkan event listener untuk foto profil
    profilePhoto.addEventListener("click", function () {
        openImageModal(this);
    });

    // Tutup modal saat klik di mana saja
    modal.addEventListener("click", function () {
        closeImageModal();
    });
});
// end

// ✅ NEW: Update semua avatar yang visible
function updateAllVisibleAvatars(newPhotoUrl) {
    // Update profile photo utama
    const mainProfile = document.getElementById("profilePhoto");
    if (mainProfile) mainProfile.src = newPhotoUrl;

    // Update avatar di user menu (jika admin)
    const userMenuAvatar = document.querySelector(
        ".user-menu-btn.logged-in .user-avatar img"
    );
    const dropdownAvatar = document.querySelector(
        ".dropdown-header .dropdown-avatar img"
    );

    // Logic: Jika sedang login sebagai admin, update avatar-nya
    if (userMenuAvatar && window.currentUser && window.currentUser.is_admin) {
        userMenuAvatar.src = newPhotoUrl;
    }
    if (dropdownAvatar && window.currentUser && window.currentUser.is_admin) {
        dropdownAvatar.src = newPhotoUrl;
    }
}

// ✅ NEW: Set current user data on page load
document.addEventListener("DOMContentLoaded", function () {
    // Ambil data user current (bisa dari hidden field atau API)
    const userDataElement = document.getElementById("userData");
    if (userDataElement) {
        window.currentUser = JSON.parse(userDataElement.dataset.user);
    }
});

// Function untuk refresh semua profile photo di halaman
// Function untuk refresh semua profile photo di halaman (HANYA profile, BUKAN avatar user)
function refreshAllProfilePhotos(newPhotoUrl) {
    const timestamp = '?t=' + new Date().getTime();
    
    // ✅ HANYA update profile photo di About section (ID: profilePhoto)
    const profilePhoto = document.getElementById('profilePhoto');
    if (profilePhoto) {
        profilePhoto.src = newPhotoUrl + timestamp;
    }
    
    // ❌ JANGAN update avatar user di menu (biarkan default avatar)
    // const userAvatars = document.querySelectorAll('.user-avatar img, .dropdown-avatar img');
    // userAvatars.forEach(avatar => {
    //     avatar.src = newPhotoUrl + timestamp; // ❌ HAPUS BARIS INI
    // });
    
    // Update favicon (optional)
    const favicon = document.querySelector('link[rel*="icon"]');
    if (favicon) {
        favicon.href = newPhotoUrl + timestamp;
    }
    
    console.log('✅ Profile photo updated, user avatars remain default');
}

// Function untuk load profile photo dari server
function loadProfilePhoto() {
    fetch('/profile/photo')
        .then(response => response.json())
        .then(data => {
            if (data.photo_url) {
                const profilePhoto = document.getElementById('profilePhoto');
                if (profilePhoto) {
                    profilePhoto.src = data.photo_url + '?t=' + new Date().getTime();
                }
            }
        })
        .catch(error => console.error('Error loading profile photo:', error));
}

// Load profile photo ketika halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    loadProfilePhoto();
});

// Helper function untuk show notification
function showNotification(message, type = 'info') {
    // Buat element notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
    `;
    
    if (type === 'success') {
        notification.style.background = '#10b981';
    } else if (type === 'error') {
        notification.style.background = '#ef4444';
    } else {
        notification.style.background = '#3b82f6';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove setelah 3 detik
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// //////


// Toggle FAQ accordion
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains("active");

    // Close all other FAQs
    document.querySelectorAll(".faq-item").forEach((item) => {
        item.classList.remove("active");
    });

    // Toggle current FAQ
    if (!isActive) {
        faqItem.classList.add("active");
    }
}

// Filter FAQ by category
function filterFAQ(category, event) {
    const faqItems = document.querySelectorAll(".faq-item");
    const categoryBtns = document.querySelectorAll(".category-btn");

    // Update active button
    categoryBtns.forEach((btn) => btn.classList.remove("active"));
    if (event && event.target) {
        event.target.classList.add("active");
    }

    // Filter items
    faqItems.forEach((item) => {
        if (category === "all" || item.dataset.category === category) {
            item.classList.remove("hidden");
        } else {
            item.classList.add("hidden");
            item.classList.remove("active");
        }
    });
}

// Search FAQ
function searchFAQ(query) {
    const faqItems = document.querySelectorAll(".faq-item");
    const searchQuery = query.toLowerCase().trim();

    faqItems.forEach((item) => {
        const questionElement = item.querySelector(".faq-question h4");
        const answerElement = item.querySelector(".faq-answer");

        if (!questionElement || !answerElement) return;

        const question = questionElement.textContent.toLowerCase();
        const answer = answerElement.textContent.toLowerCase();

        if (question.includes(searchQuery) || answer.includes(searchQuery)) {
            item.classList.remove("hidden");
        } else {
            item.classList.add("hidden");
        }
    });

    // If searching, show all categories
    if (searchQuery) {
        document.querySelectorAll(".category-btn").forEach((btn) => {
            if (btn.textContent === "All") {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }
}

// Filter reviews by rating or images
function filterReviews(filter, event) {
    const reviews = document.querySelectorAll(".review-item");
    const filterBtns = document.querySelectorAll(".filter-btn");

    // Update active button
    filterBtns.forEach((btn) => btn.classList.remove("active"));
    if (event && event.target) {
        event.target.classList.add("active");
    }

    // Filter reviews
    reviews.forEach((review) => {
        const rating = review.dataset.rating;
        const hasImages = review.dataset.images === "true";

        if (filter === "all") {
            review.classList.remove("hidden");
        } else if (filter === "images") {
            review.classList.toggle("hidden", !hasImages);
        } else {
            review.classList.toggle("hidden", rating !== filter);
        }
    });
}

// ================================================
// USER MENU & AUTH
// ================================================
function toggleUserDropdown() {
    const dropdown = document.getElementById("userDropdown");
    dropdown?.classList.toggle("show");
}

// Open Auth Modal
function openAuthModal(type) {
    const dropdown = document.getElementById("userDropdown");
    dropdown?.classList.remove("show");

    if (type === "login") {
        const loginModal = document.getElementById("loginModal");
        if (loginModal) loginModal.style.display = "flex";
    } else if (type === "register") {
        const registerModal = document.getElementById("registerModal");
        if (registerModal) registerModal.style.display = "flex";
    }
}

// Handle Logout
function handleLogout() {
    if (confirm("Yakin mau logout?")) {
        const csrfToken = document.querySelector('meta[name="csrf-token"]');
        if (!csrfToken) return;

        fetch("/logout", {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": csrfToken.content,
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Gagal logout. Coba lagi.");
            });
    }
}

// ================================================
// AUTH MODAL FUNCTIONS
// ================================================
function closeAuthModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.style.animation = "fadeOut 0.3s forwards";
    setTimeout(() => {
        modal.style.display = "none";
        modal.style.animation = "fadeIn 0.3s forwards";
    }, 300);
}

function switchAuthModal(type) {
    closeAuthModal("loginModal");
    closeAuthModal("registerModal");
    setTimeout(() => {
        openAuthModal(type);
    }, 300);
}

// Toggle password visibility
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const button =
        input.parentElement.parentElement.querySelector(".toggle-password");
    if (!button) return;

    const eyeOpen = button.querySelector(".eye-open");
    const eyeClosed = button.querySelector(".eye-closed");

    if (input.type === "password") {
        input.type = "text";
        if (eyeOpen) eyeOpen.style.display = "none";
        if (eyeClosed) eyeClosed.style.display = "block";
    } else {
        input.type = "password";
        if (eyeOpen) eyeOpen.style.display = "block";
        if (eyeClosed) eyeClosed.style.display = "none";
    }
}

// Password strength checker
function checkPasswordStrength(password) {
    const strengthFill = document.getElementById("strengthFill");
    const strengthText = document.getElementById("strengthText");
    const requirements = document.getElementById("passwordRequirements");
    const req8chars = document.getElementById("req8chars");
    const reqNumber = document.getElementById("reqNumber");
    const reqSpecial = document.getElementById("reqSpecial");

    if (password.length === 0) {
        strengthFill.style.width = "0%";
        strengthText.textContent = "Password strength";
        strengthText.style.color = "rgba(255,255,255,0.5)";
        requirements.style.display = "none";
        return;
    }

    requirements.style.display = "block";

    let strength = 0;
    const checks = {
        length: password.length >= 8,
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
    };

    // Update requirement indicators
    req8chars.style.opacity = checks.length ? "1" : "0.5";
    req8chars.style.color = checks.length ? "#4caf50" : "rgba(255,255,255,0.5)";

    reqNumber.style.opacity = checks.number ? "1" : "0.5";
    reqNumber.style.color = checks.number ? "#4caf50" : "rgba(255,255,255,0.5)";

    reqSpecial.style.opacity = checks.special ? "1" : "0.5";
    reqSpecial.style.color = checks.special
        ? "#4caf50"
        : "rgba(255,255,255,0.5)";

    // Calculate strength
    if (checks.length) strength += 20;
    if (checks.number) strength += 20;
    if (checks.special) strength += 20;
    if (checks.uppercase) strength += 20;
    if (checks.lowercase) strength += 20;

    // Update bar
    strengthFill.style.width = strength + "%";

    if (strength <= 40) {
        strengthFill.style.background = "#f44336";
        strengthText.textContent = "😟 Weak password";
        strengthText.style.color = "#f44336";
    } else if (strength <= 60) {
        strengthFill.style.background = "#ff9800";
        strengthText.textContent = "😐 Fair password";
        strengthText.style.color = "#ff9800";
    } else if (strength <= 80) {
        strengthFill.style.background = "#2196f3";
        strengthText.textContent = "😊 Good password";
        strengthText.style.color = "#2196f3";
    } else {
        strengthFill.style.background = "#4caf50";
        strengthText.textContent = "🔒 Strong password";
        strengthText.style.color = "#4caf50";
    }
}

function checkPasswordMatch() {
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById(
        "registerPasswordConfirm"
    ).value;
    const matchText = document.getElementById("passwordMatchText");

    if (confirmPassword.length === 0) {
        matchText.textContent = "Make sure passwords match";
        matchText.style.color = "rgba(255,255,255,0.5)";
        return;
    }

    if (password === confirmPassword) {
        matchText.textContent = "✓ Passwords match!";
        matchText.style.color = "#4caf50";
    } else {
        matchText.textContent = "✗ Passwords do not match";
        matchText.style.color = "#f44336";
    }
}

// Handle Login Form Submit
function initLoginForm() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const csrfToken = document.querySelector('meta[name="csrf-token"]');
        if (!csrfToken) return;

        const formData = new FormData(this);
        const submitBtn = this.querySelector(".auth-submit-btn");
        if (!submitBtn) return;

        const originalHTML = submitBtn.innerHTML;

        // Show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML =
            '<svg class="spinner" viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" fill="none"/></svg> Logging in...';

        // Send to server
        fetch("/login", {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRF-TOKEN": csrfToken.content,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    submitBtn.innerHTML = "✓ Success!";
                    submitBtn.style.background =
                        "linear-gradient(135deg, #4CAF50, #45a049)";

                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    throw new Error(data.message || "Login failed");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(
                    error.message ||
                        "Login failed. Please check your credentials."
                );

                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
            });
    });
}

// Handle Register Form Submit
function initRegisterForm() {
    const registerForm = document.getElementById("registerForm");
    if (!registerForm) return;

    // Password strength checker
    const passwordInput = document.getElementById("registerPassword");
    if (passwordInput) {
        passwordInput.addEventListener("input", function () {
            checkPasswordStrength(this.value);
        });
    }

    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const csrfToken = document.querySelector('meta[name="csrf-token"]');
        if (!csrfToken) return;

        const formData = new FormData(this);
        const submitBtn = this.querySelector(".auth-submit-btn");
        if (!submitBtn) return;

        const originalHTML = submitBtn.innerHTML;

        // Validate password match
        const password = document.getElementById("registerPassword");
        const passwordConfirm = document.getElementById(
            "registerPasswordConfirm"
        );

        if (!password || !passwordConfirm) return;

        if (password.value !== passwordConfirm.value) {
            alert("Passwords do not match!");
            return;
        }

        // Check password strength
        if (password.value.length < 8) {
            alert("Password must be at least 8 characters!");
            return;
        }

        // Show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML =
            '<svg class="spinner" viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" fill="none"/></svg> Creating account...';

        // Send to server
        fetch("/register", {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRF-TOKEN": csrfToken.content,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    submitBtn.innerHTML = "✓ Account created!";
                    submitBtn.style.background =
                        "linear-gradient(135deg, #4CAF50, #45a049)";

                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    throw new Error(data.message || "Registration failed");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(
                    error.message || "Registration failed. Please try again."
                );

                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
            });
    });
}

// ================================================
// REVIEWS SYSTEM
// ================================================
let currentReviewsPage = 1;
let currentReviewsFilter = "all";
let reviewsData = [];

// Load review statistics
async function loadReviewStatistics() {
    try {
        const response = await fetch("/reviews/statistics");
        const data = await response.json();

        if (data.success) {
            // Update average rating
            const avgRating = document.getElementById("averageRating");
            const totalReviews = document.getElementById("totalReviews");
            const happyClients = document.getElementById("happyClientsCount1");

            if (avgRating) avgRating.textContent = data.average_rating || "0";
            if (totalReviews)
                totalReviews.textContent = `Based on ${data.total_reviews} reviews`;
            if (happyClients) happyClients.textContent = data.total_reviews;

            // Generate star display
            generateStarDisplay(data.average_rating);

            // Generate rating bars
            generateRatingBars(data.rating_counts, data.total_reviews);
        }
    } catch (error) {
        console.error("Error loading statistics:", error);
    }
}

// Generate star display
function generateStarDisplay(rating) {
    const starsContainer = document.getElementById("averageStars");
    if (!starsContainer) return;

    starsContainer.innerHTML = "";
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
        const star = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        star.setAttribute("viewBox", "0 0 24 24");
        star.setAttribute("width", "24");
        star.setAttribute("height", "24");
        star.classList.add("star");

        if (i < fullStars) {
            star.classList.add("filled");
        } else if (i === fullStars && hasHalfStar) {
            star.classList.add("half");
        }

        const polygon = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "polygon"
        );
        polygon.setAttribute(
            "points",
            "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        );
        star.appendChild(polygon);

        starsContainer.appendChild(star);
    }
}

// Generate rating bars
function generateRatingBars(ratingCounts, totalReviews) {
    const barsContainer = document.getElementById("ratingBars");
    if (!barsContainer) return;

    barsContainer.innerHTML = "";

    for (let i = 5; i >= 1; i--) {
        const count = ratingCounts[i] || 0;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

        const barItem = document.createElement("div");
        barItem.className = "rating-bar-item";
        barItem.innerHTML = `
            <span class="rating-label">${i} stars</span>
            <div class="rating-bar">
                <div class="rating-bar-fill" style="width: ${percentage}%"></div>
            </div>
            <span class="rating-count">${count}</span>
        `;

        barsContainer.appendChild(barItem);
    }
}

// Load reviews data
async function loadReviewsData(page = 1, filter = "all") {
    const reviewsList = document.getElementById("reviewsList");
    if (!reviewsList) return;

    try {
        reviewsList.innerHTML = `
            <div class="loading-spinner">
                <svg class="spinner" viewBox="0 0 24 24" width="40" height="40">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25"/>
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" fill="none"/>
                </svg>
                <p>Loading reviews...</p>
            </div>
        `;

        const url = `/reviews?page=${page}&rating=${filter}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            reviewsData = data.reviews.data;
            displayReviews(reviewsData);

            // Show/hide load more button
            const loadMoreBtn = document.getElementById("loadMoreBtn");
            if (loadMoreBtn) {
                loadMoreBtn.style.display = data.reviews.next_page_url
                    ? "block"
                    : "none";
            }

            currentReviewsPage = page;
            currentReviewsFilter = filter;
        }
    } catch (error) {
        console.error("Error loading reviews:", error);
        reviewsList.innerHTML = `
            <div class="empty-reviews">
                <svg viewBox="0 0 24 24" width="60" height="60">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="2"/>
                </svg>
                <h3>Failed to load reviews</h3>
                <p>Please try again later</p>
            </div>
        `;
    }
}

// Display reviews
function displayReviews(reviews) {
    const reviewsList = document.getElementById("reviewsList");
    if (!reviewsList) return;

    if (reviews.length === 0) {
        reviewsList.innerHTML = `
            <div class="empty-reviews">
                <svg viewBox="0 0 24 24" width="60" height="60">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="red" stroke-width="2" fill="none"/>
                </svg>
                <h3>No reviews yet</h3>
                <p>Be the first to leave a review!</p>
            </div>
        `;
        return;
    }

    reviewsList.innerHTML = reviews
        .map((review) => generateReviewHTML(review))
        .join("");
}

// Generate review HTML
function generateReviewHTML(review) {
    const stars = generateStarsHTML(review.rating);
    const images = review.images ? generateReviewImagesHTML(review.images) : "";
    const verifiedBadge = review.verified
        ? `
        <div class="verified-badge">
            <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" fill="#4A9EFF"/>
            </svg>
            <span>Verified Purchase</span>
        </div>
    `
        : "";

    return `
        <div class="review-item" data-rating="${review.rating}" data-images="${
        review.images ? "true" : "false"
    }">
            <div class="review-header">
                <div class="reviewer-avatar">
                    <img src="${
                        review.user.avatar || "/images/profile/default-avatar.png"
                    }" alt="${review.user.name}">
                </div>
                <div class="reviewer-info">
                    <h4>${review.user.name}</h4>
                    <div class="review-stars">${stars}</div>
                    <span class="review-date">${review.time_ago}</span>
                </div>
                ${verifiedBadge}
            </div>
            <div class="review-content">
                <p>${escapeHtml(review.comment)}</p>
                ${images}
            </div>
            ${
                review.commission_type
                    ? `
                <div class="review-footer">
                    <span class="review-type">${review.commission_type}</span>
                </div>
            `
                    : ""
            }
        </div>
    `;
}

// Generate stars HTML
function generateStarsHTML(rating) {
    let stars = "";
    for (let i = 0; i < 5; i++) {
        const filled = i < rating ? "filled" : "empty";
        stars += `
            <svg viewBox="0 0 24 24" width="14" height="14" class="star ${filled}">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
        `;
    }
    return stars;
}

// Generate review images HTML
// Generate review images HTML - Support video
function generateReviewImagesHTML(images) {
    if (!images || images.length === 0) return "";

    return `
        <div class="review-images">
            ${images.map(img => {
                const filepath = `/storage/reviews/${img}`;
                const isVideo = /\.(mp4|webm|mov)$/i.test(img);
                
                return isVideo ? `
                    <div class="review-media-item" style="position:relative;display:inline-block;">
                        <video 
                            src="${filepath}" 
                            style="width:150px;height:150px;object-fit:cover;border-radius:8px;cursor:pointer;"
                            onclick="viewImage('${filepath}')">
                        </video>
                        <div style="position:absolute;top:5px;left:5px;background:rgba(0,0,0,0.8);color:white;padding:3px 8px;border-radius:4px;font-size:10px;font-weight:bold;pointer-events:none;">
                            VIDEO
                        </div>
                    </div>
                ` : `
                    <img src="${filepath}" alt="Review image" onclick="viewImage('${filepath}')">
                `;
            }).join("")}
        </div>
    `;
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Filter reviews
function filterReviewsBy(filter, event) {
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach((btn) => btn.classList.remove("active"));
    if (event && event.target) {
        event.target.classList.add("active");
    }

    loadReviewsData(1, filter);
}

// Load more reviews
function loadMoreReviews() {
    loadReviewsData(currentReviewsPage + 1, currentReviewsFilter);
}

// Update viewImage function untuk support video
function viewImage(url) {
    const isVideo = /\.(mp4|webm|mov)$/i.test(url);
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:10000;display:flex;align-items:center;justify-content:center;';
    
    modal.innerHTML = `
        <div style="position:relative;max-width:90vw;max-height:90vh;">
            ${isVideo ? `
                <video src="${url}" controls autoplay style="max-width:90vw;max-height:90vh;border-radius:8px;">
                    <source src="${url}" type="video/mp4">
                </video>
            ` : `
                <img src="${url}" style="max-width:90vw;max-height:90vh;border-radius:8px;">
            `}
        </div>
    `;
    
    modal.onclick = (e) => { if(e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
}

// ================================================
// REVIEW FORM
// ================================================
let selectedRating = 0;
let selectedImages = [];

// Open review form
function openReviewForm() {
    const modal = document.getElementById("reviewFormModal");
    if (modal) modal.style.display = "flex";
    initStarRatingInput();
    initCharCounter();
}

// Close review form
function closeReviewForm() {
    const modal = document.getElementById("reviewFormModal");
    if (!modal) return;

    modal.style.animation = "fadeOut 0.3s forwards";
    setTimeout(() => {
        modal.style.display = "none";
        modal.style.animation = "fadeIn 0.3s forwards";

        const form = document.getElementById("reviewForm");
        if (form) form.reset();

        selectedRating = 0;
        selectedImages = [];

        const imagePreview = document.getElementById("imagePreviewContainer");
        if (imagePreview) imagePreview.innerHTML = "";
    }, 300);
}

// Init star rating input
function initStarRatingInput() {
    const stars = document.querySelectorAll(".star-input");
    const ratingLabel = document.getElementById("ratingLabel");
    const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

    stars.forEach((star) => {
        star.addEventListener("click", function () {
            selectedRating = parseInt(this.dataset.rating);
            const ratingValue = document.getElementById("ratingValue");
            if (ratingValue) ratingValue.value = selectedRating;

            // Update visual
            stars.forEach((s) => {
                if (parseInt(s.dataset.rating) <= selectedRating) {
                    s.classList.add("active");
                } else {
                    s.classList.remove("active");
                }
            });

            // Update label
            if (ratingLabel) {
                ratingLabel.textContent = ratingLabels[selectedRating];
                ratingLabel.classList.add("selected");
            }
        });

        // Hover effect
        star.addEventListener("mouseenter", function () {
            const rating = parseInt(this.dataset.rating);
            stars.forEach((s) => {
                if (parseInt(s.dataset.rating) <= rating) {
                    s.classList.add("active");
                } else {
                    s.classList.remove("active");
                }
            });
        });
    });

    // Reset on mouse leave
    const starRatingInput = document.getElementById("starRatingInput");
    if (starRatingInput) {
        starRatingInput.addEventListener("mouseleave", function () {
            stars.forEach((s) => {
                if (parseInt(s.dataset.rating) <= selectedRating) {
                    s.classList.add("active");
                } else {
                    s.classList.remove("active");
                }
            });
        });
    }
}

// Init character counter
function initCharCounter() {
    const textarea = document.getElementById("reviewComment");
    const charCount = document.getElementById("charCount");

    if (textarea && charCount) {
        textarea.addEventListener("input", function () {
            charCount.textContent = this.value.length;

            if (this.value.length > 900) {
                charCount.style.color = "#f44336";
            } else if (this.value.length > 800) {
                charCount.style.color = "#FF9800";
            } else {
                charCount.style.color = "rgba(255, 255, 255, 0.5)";
            }
        });
    }
}

function removePreviewImage(index) {
    selectedImages.splice(index, 1);

    // Refresh preview container
    const container = document.getElementById("imagePreviewContainer");
    if (!container) return;

    container.innerHTML = "";

    selectedImages.forEach((file, i) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.createElement("div");
            preview.className = "image-preview-item";
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button type="button" class="image-preview-remove" onclick="removePreviewImage(${i})">
                    <svg viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </button>
                
            `;
            container.appendChild(preview);
        };
        reader.readAsDataURL(file);
    });

    // Reset file input
    const fileInput = document.getElementById("reviewImages");
    if (fileInput) fileInput.value = "";
}

// ================================================
// INITIALIZATION
// ================================================
document.addEventListener("DOMContentLoaded", function () {
    // Close overlay when clicking outside
    const aboutOverlay = document.getElementById("aboutOverlay");
    if (aboutOverlay) {
        aboutOverlay.addEventListener("click", function (e) {
            if (e.target === this) {
                closeOverlay("aboutOverlay");
            }
        });
    }

    const linksOverlay = document.getElementById("linksOverlay");
    if (linksOverlay) {
        linksOverlay.addEventListener("click", function (e) {
            if (e.target === this) {
                closeOverlay("linksOverlay");
            }
        });
    }

    const contactOverlay = document.getElementById("contactOverlay");
    if (contactOverlay) {
        contactOverlay.addEventListener("click", function (e) {
            if (e.target === this) {
                closeOverlay("contactOverlay");
            }
        });
    }

    const faqOverlay = document.getElementById("faqOverlay");
    if (faqOverlay) {
        faqOverlay.addEventListener("click", function (e) {
            if (e.target === this) {
                closeOverlay("faqOverlay");
            }
        });
    }

    const ratingOverlay = document.getElementById("ratingOverlay");
    if (ratingOverlay) {
        ratingOverlay.addEventListener("click", function (e) {
            if (e.target === this) {
                closeOverlay("ratingOverlay");
            }
        });
    }

    // Contact form
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const csrfToken = document.querySelector('meta[name="csrf-token"]');
            if (!csrfToken) return;

            const formData = new FormData(this);
            const submitBtn = this.querySelector(".submit-btn");
            if (!submitBtn) return;

            const originalText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML =
                '<svg class="spinner" viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" fill="none"/></svg> Sending...';

            // Send to server
            fetch("/contact/send", {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRF-TOKEN": csrfToken.content,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        // Success
                        submitBtn.innerHTML = "✓ Message Sent!";
                        submitBtn.style.background =
                            "linear-gradient(135deg, #4CAF50, #45a049)";

                        // Reset form
                        contactForm.reset();

                        // Reset button after 3 seconds
                        setTimeout(() => {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalText;
                            submitBtn.style.background = "";
                        }, 3000);
                    } else {
                        throw new Error("Failed to send message");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    submitBtn.innerHTML = "✗ Failed to send";
                    submitBtn.style.background =
                        "linear-gradient(135deg, #f44336, #d32f2f)";

                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = "";
                    }, 3000);
                });
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
        const userMenuWrapper = document.querySelector(".user-menu-wrapper");
        const dropdown = document.getElementById("userDropdown");

        if (userMenuWrapper && !userMenuWrapper.contains(e.target)) {
            dropdown?.classList.remove("show");
        }
    });

    // Close auth modal when clicking outside
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("auth-modal")) {
            const modalId = e.target.id;
            closeAuthModal(modalId);
        }
    });

    // Close review form modal on click outside
    const reviewFormModal = document.getElementById("reviewFormModal");
    if (reviewFormModal) {
        reviewFormModal.addEventListener("click", function (e) {
            if (e.target === this) {
                closeReviewForm();
            }
        });
    }

    // Init auth forms
    initLoginForm();
    initRegisterForm();

    // Init review form
    initReviewForm();
});

// ================================================
// COMMISSIONS SYSTEM - MULTIPLE IMAGES
// ================================================
let currentCommissionId = null;
let selectedCommissionImages = [];
// ================================================
// FIXED GALLERY SYSTEM - SEPARATE VARIABLES
// ================================================

// ✅ COMMISSION GALLERY VARIABLES
let commissionGalleryImages = [];
let commissionGalleryIndex = 0;

// ✅ WORKS GALLERY VARIABLES  
let worksGalleryImages = [];
let worksGalleryIndex = 0;

// ✅ ACTIVE GALLERY TYPE
let activeGalleryType = null; // 'commission' or 'works'

// payment
let selectedPaymentMethod = null;

// status commission
let commissionGlobalStatus = "open";

// Function untuk handle payment selection
function initPaymentSelection() {
    const paymentCheckboxes = document.querySelectorAll('input[name="payment_method"]');
    
    paymentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Uncheck lainnya (single selection)
            if (this.checked) {
                paymentCheckboxes.forEach(cb => {
                    if (cb !== this) cb.checked = false;
                });
                
                // Show selected payment info
                selectedPaymentMethod = {
                    method: this.value,
                    info: this.dataset.info
                };
                
                document.getElementById('paymentMethodText').textContent = this.value;
                document.getElementById('paymentDetailText').textContent = this.dataset.info;
                document.getElementById('selectedPaymentInfo').style.display = 'block';
            } else {
                // Hide info jika unchecked
                selectedPaymentMethod = null;
                document.getElementById('selectedPaymentInfo').style.display = 'none';
            }
        });
    });
}

// Load commission status dari server
async function loadCommissionStatus() {
    try {
        const response = await fetch('/commissions/status');
        const data = await response.json();
        
        if (data.success) {
            commissionGlobalStatus = data.status;
            updateCommissionStatusUI();
        }
    } catch (error) {
        console.error('Error loading commission status:', error);
        // Default ke open kalau error
        commissionGlobalStatus = 'open';
        updateCommissionStatusUI();
    }
}

// Update UI berdasarkan status
function updateCommissionStatusUI() {
    const statusIndicator = document.getElementById('commissionStatus');
    const statusText = document.getElementById('statusText');
    const statusDescription = document.getElementById('statusDescription');
    const toggleBtn = document.getElementById('statusToggleBtn');
    const toggleBtnText = document.getElementById('toggleBtnText');
        const statusBanner = document.querySelector(
            ".commission-status-banner"
        );

    
    
    if (commissionGlobalStatus === 'closed') {
        // Status: CLOSED
        statusBanner.classList.add("closed");
        statusIndicator.classList.add('closed');
        statusText.textContent = 'Commissions Closed';
        statusDescription.textContent = 'Not accepting new projects at the moment';
        
        // Update icon untuk closed
        statusIndicator.querySelector('svg').innerHTML = `
            <circle cx="12" cy="12" r="10" stroke="#f44336" stroke-width="2" fill="none"/>
            <line x1="15" y1="9" x2="9" y2="15" stroke="#f44336" stroke-width="2"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke="#f44336" stroke-width="2"/>
        `;
        
        // Update toggle button
        if (toggleBtn) {
            toggleBtn.classList.add('closed');
            toggleBtnText.textContent = 'Open Commissions';
            toggleBtn.querySelector('svg').innerHTML = `
                <path d="M12 9l4.243 4.243m-8.486 0L12 9" stroke="currentColor" stroke-width="2" fill="none"/>
            `;
        }
        
        // Disable semua order buttons untuk user
        disableAllOrderButtons();
        
    } else {
        // Status: OPEN
        statusBanner.classList.remove("closed");
        statusIndicator.classList.remove('closed');
        statusText.textContent = 'Commissions Open';
        statusDescription.textContent = 'Accepting new projects';
        
        // Update icon untuk open
        statusIndicator.querySelector('svg').innerHTML = `
            <circle cx="12" cy="12" r="10" stroke="green" stroke-width="2" fill="none"/>
            <polyline points="9 12 11 14 15 10" stroke="green" stroke-width="2" fill="none"/>
        `;
        
        // Update toggle button
        if (toggleBtn) {
            toggleBtn.classList.remove('closed');
            toggleBtnText.textContent = 'Close Commissions';
            toggleBtn.querySelector('svg').innerHTML = `
                <path d="M12 15l-4.243-4.243m8.486 0L12 15" stroke="currentColor" stroke-width="2" fill="none"/>
            `;
        }
        
        // Enable semua order buttons
        enableAllOrderButtons();
    }
}

// Toggle status (Admin only)
// Toggle status (Admin only)
async function toggleCommissionStatus() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    if (!csrfToken) {
        alert('CSRF token not found. Please refresh the page.');
        return;
    }
    
    const newStatus = commissionGlobalStatus === 'open' ? 'closed' : 'open';
    const confirmMessage = newStatus === 'closed' 
        ? 'Are you sure you want to CLOSE commissions? Users will not be able to place new orders.'
        : 'Are you sure you want to OPEN commissions? Users will be able to place new orders.';
    
    if (!confirm(confirmMessage)) return;
    
    try {
        console.log('Sending status update:', newStatus);
        
        const response = await fetch('/commissions/status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken.content,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                status: newStatus
            })
        });

        // ✅ CHECK: Response type
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const textResponse = await response.text();
            console.error('Non-JSON response:', textResponse.substring(0, 200));
            throw new Error('Server returned non-JSON response. Please check authentication.');
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        if (data.success) {
            commissionGlobalStatus = newStatus;
            updateCommissionStatusUI();
            
            // Show success message
            showToast(
                `Commissions ${newStatus === 'closed' ? 'Closed' : 'Open'}!`,
                data.message,
                null
            );
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error toggling commission status:', error);
        
        if (error.message.includes('non-JSON') || error.message.includes('<!DOCTYPE')) {
            alert('❌ Authentication required. Please refresh the page and make sure you are logged in as admin.');
        } else {
            alert('Failed to update commission status: ' + error.message);
        }
    }
}
// Disable semua order buttons ketika commissions closed
function disableAllOrderButtons() {
    const orderButtons = document.querySelectorAll('.commission-order-btn:not(.disabled)');
    orderButtons.forEach(btn => {
        btn.disabled = true;
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
            </svg>
            Commissions Closed
        `;
        btn.style.opacity = '0.6';
        btn.style.cursor = 'not-allowed';
    });
}

// Enable semua order buttons ketika commissions open
function enableAllOrderButtons() {
    const orderButtons = document.querySelectorAll('.commission-order-btn:not(.disabled)');
    orderButtons.forEach(btn => {
        const commissionId = btn.closest('.commission-card').dataset.id;
        btn.disabled = false;
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            Order Now
        `;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        
        // Re-attach click event
        btn.onclick = () => orderCommission(commissionId);
    });
}


// Load commissions data
// Load commissions data dengan status global
// Load commissions data dengan status global
async function loadCommissionsData() {
    const commissionsList = document.getElementById("commissionsList");
    if (!commissionsList) return;

    try {
        commissionsList.innerHTML = `
            <div class="loading-spinner">
                <svg class="spinner" viewBox="0 0 24 24" width="40" height="40">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25"/>
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" fill="none"/>
                </svg>
                <p>Loading commissions...</p>
            </div>
        `;

        const response = await fetch("/commissions");
        const data = await response.json();

        if (data.success) {
            // Update global status
            if (data.global_status) {
                commissionGlobalStatus = data.global_status;
                updateCommissionStatusUI();
            }

            displayCommissions(data.commissions);

            // ✅ RE-ATTACH EVENT LISTENERS SETELAH RENDER
            setTimeout(() => {
                reattachCommissionEvents();
            }, 100);
        }
    } catch (error) {
        console.error("Error loading commissions:", error);
        commissionsList.innerHTML = `
            <div class="empty-reviews">
                <svg viewBox="0 0 24 24" width="60" height="60">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="2"/>
                </svg>
                <h3>Failed to load commissions</h3>
                <p>Please try again later</p>
            </div>
        `;
    }
}

// ✅ NEW: Re-attach events setelah render
function reattachCommissionEvents() {
    // Re-attach order buttons
    const orderButtons = document.querySelectorAll(
        ".commission-order-btn:not(.disabled)"
    );
    orderButtons.forEach((btn) => {
        const commissionId = btn.closest(".commission-card").dataset.id;
        btn.onclick = () => orderCommission(commissionId);
    });

    // Re-attach edit buttons
    const editButtons = document.querySelectorAll(".commission-edit-btn");
    editButtons.forEach((btn) => {
        const commissionId = btn.closest(".commission-card").dataset.id;
        btn.onclick = (e) => {
            e.stopPropagation();
            editCommission(commissionId);
        };
    });

    // Re-attach delete buttons
    const deleteButtons = document.querySelectorAll(".commission-delete-btn");
    deleteButtons.forEach((btn) => {
        const commissionId = btn.closest(".commission-card").dataset.id;
        btn.onclick = (e) => {
            e.stopPropagation();
            deleteCommission(commissionId);
        };
    });

    console.log("✅ Commission events re-attached");
}

// Update orderCommission function dengan double validation


// Display commissions
// Display commissions dengan status sync
function displayCommissions(commissions) {
    const commissionsList = document.getElementById("commissionsList");
    if (!commissionsList) return;

    if (commissions.length === 0) {
        commissionsList.innerHTML = `
            <div class="empty-reviews">
                <svg viewBox="0 0 24 24" width="60" height="60">
                    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" stroke="white" stroke-width="2" fill="none"/>
                </svg>
                <h3>No commissions available</h3>
                <p>Check back later for new services</p>
            </div>
        `;
        return;
    }

    window.commissionsData = commissions;

    commissionsList.innerHTML = commissions
        .map((commission) => generateCommissionHTML(commission))
        .join("");

    // ✅ CRITICAL: Apply status global SETELAH render commissions
    setTimeout(() => {
        if (commissionGlobalStatus === 'closed') {
            disableAllOrderButtons();
        } else {
            enableAllOrderButtons();
        }
    }, 100);
}

// Generate commission HTML with video support
function generateCommissionHTML(commission) {
    const isAdmin =
        document.querySelector(".admin-commission-controls") !== null;
    const availabilityClass =
        commission.slots_available > 0 ? "available" : "unavailable";
    const statusBadge = commission.is_active
        ? '<span class="commission-status-badge active">Active</span>'
        : '<span class="commission-status-badge inactive">Inactive</span>';

    const globalStatusBadge =
        commissionGlobalStatus === "closed"
            ? '<div class="global-closed-badge">🚫 Commissions Closed</div>'
            : "";

    let mediaHTML = "";
    if (commission.images && commission.images.length > 0) {
        const firstFile = commission.images[0];
        const hasMoreFiles = commission.images.length > 1;
        const isVideo = firstFile.match(/\.(mp4|webm)$/i);

        mediaHTML = `
            <div class="commission-images-gallery" onclick="viewCommissionGallery(${
                commission.id
            })">
                ${
                    isVideo
                        ? `
                    <video src="/storage/commissions/${firstFile}" 
                           muted loop autoplay playsinline
                           onerror="this.style.display='none'"></video>
                `
                        : `
                    <img src="/storage/commissions/${firstFile}" 
                         alt="${escapeHtml(commission.name)}"
                         onerror="this.src='/images/default-commission.jpg'">
                `
                }
                ${
                    hasMoreFiles
                        ? `
                    <div class="image-counter">
                        <svg viewBox="0 0 24 24" width="16" height="16">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>
                            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                            <polyline points="21 15 16 10 5 21" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                        +${commission.images.length - 1}
                    </div>
                `
                        : ""
                }
                ${
                    commission.slots_available === 0
                        ? '<div class="sold-out-overlay">CLOSED</div>'
                        : ""
                }
            </div>
        `;
    }

    const descId = `commissionDesc-${commission.id}`;
    const toggleId = `toggleDescBtn-${commission.id}`;

    // Hasil HTML dengan onclick yang benar
    const html = `
        <div class="commission-card ${availabilityClass}" data-id="${
        commission.id
    }">
            ${mediaHTML}
            ${globalStatusBadge}
            
            <div class="commission-content">
                <div class="commission-header">
                    <h3>${escapeHtml(commission.name)}</h3>
                    ${isAdmin ? statusBadge : ""}
                </div>

                <div class="commission-description-container">
                    <p class="commission-description" id="${descId}">
                        ${escapeHtml(commission.description)}
                    </p>
                    <button class="toggle-btn" id="${toggleId}" onclick="toggleCommissionDescription(${
        commission.id
    })">Show more..</button>
                </div>
                
                <div class="commission-details">
<div class="detail-item">
    <svg viewBox="0 0 24 24" width="18" height="18">
        <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" stroke-width="2"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="2" fill="none"/>
    </svg>
    <span>${generatePriceHTML(commission)}</span>
</div>
                    <div class="detail-item">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                            <polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                        <span>${escapeHtml(commission.delivery_time)}</span>
                    </div>
                    <div class="detail-item">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" fill="none"/>
                            <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                        <span><strong>${
                            commission.slots_available
                        }</strong> slot${
        commission.slots_available !== 1 ? "s" : ""
    } available</span>
                    </div>
                </div>

                <div class="commission-actions">
                    ${
                        commission.slots_available > 0 && commission.is_active
                            ? `
                        <button class="commission-order-btn" onclick="orderCommission(${commission.id})">
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" fill="none"/>
                            </svg>
                            Order Now
                        </button>
                    `
                            : `
                        <button class="commission-order-btn disabled" disabled>
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
                                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
                            </svg>
                            Closed
                        </button>
                    `
                    }
                    
                    ${
                        isAdmin
                            ? `
                        <button class="commission-edit-btn" onclick="editCommission(${commission.id})">
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" fill="none"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" fill="none"/>
                            </svg>
                            Edit
                        </button>
                        <button class="commission-delete-btn" onclick="deleteCommission(${commission.id})">
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" fill="none"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" fill="none"/>
                            </svg>
                        </button>
                    `
                            : ""
                    }
                </div>
            </div>
        </div>
    `;

    return html;
}

// ✅ NEW: Generate price HTML with discount
function generatePriceHTML(commission) {
    if (commission.discount_percentage > 0) {
        const originalPrice = commission.price;
        const discountedPrice = originalPrice - (originalPrice * commission.discount_percentage / 100);
        
        return `
            <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="text-decoration: line-through; color: rgba(255,255,255,0.4); font-size: 13px;">
                        IDR ${formatPrice(originalPrice)}
                    </span>
                    <span style="background: #f44336; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">
                        -${commission.discount_percentage}%
                    </span>
                </div>
                <strong style="color: #4caf50; font-size: 16px;">IDR ${formatPrice(discountedPrice)}</strong>
            </div>
        `;
    } else {
        return `Starting from <strong>IDR ${formatPrice(commission.price)}</strong>`;
    }
}


function toggleCommissionDescription(commissionId) {
    const descId = `commissionDesc-${commissionId}`;
    const toggleId = `toggleDescBtn-${commissionId}`;

    const descEl = document.getElementById(descId);
    const toggleBtn = document.getElementById(toggleId);

    if (descEl && toggleBtn) {
        const expanded = descEl.classList.toggle("expanded");
        toggleBtn.textContent = expanded ? "Show less" : "Show more..";
    }
}

// eeeenndd


// Format price
function formatPrice(price) {
    return new Intl.NumberFormat("id-ID").format(price);
}

// Open commission form
function openCommissionForm(commissionId = null) {
    const modal = document.getElementById("commissionFormModal");
    const form = document.getElementById("commissionForm");

    if (!modal || !form) {
        console.error("❌ Commission form elements not found!");
        return;
    }

    // ✅ RE-INIT FORM
    initCommissionForm();

    // Reset state
    currentCommissionId = commissionId;
    selectedCommissionImages = [];

    // Reset form
    form.reset();

    const preview = document.getElementById("commissionImagesPreview");
    if (preview) preview.innerHTML = "";

    // ✅ FIX: Handle title and button text lebih robust
    const title = document.getElementById("commissionFormTitle");
    const submitBtn = form.querySelector(".auth-submit-btn, [type='submit']");

    if (title && submitBtn) {
        if (commissionId) {
            title.textContent = "Edit Commission Type";
            submitBtn.innerHTML = "Update Commission";
            loadCommissionData(commissionId);
        } else {
            title.textContent = "Add Commission Type";
            submitBtn.innerHTML = "Create Commission";

            const commissionIdField = document.getElementById("commissionId");
            if (commissionIdField) commissionIdField.value = "";
        }

        // ✅ FIX: Pastikan button enabled
        submitBtn.disabled = false;
        submitBtn.style.background = "";
    } else {
        console.warn("⚠️ Title or submit button not found, but continuing...");
    }

    modal.style.display = "flex";
    initDescriptionCharCounter();

    console.log("🎯 Commission form opened:", {
        mode: commissionId ? "edit" : "add",
        currentId: currentCommissionId,
        title: title?.textContent,
        button: submitBtn?.textContent,
    });
}

// ✅ NEW: Function untuk create missing elements
function ensureCommissionFormElements() {
    const modal = document.getElementById("commissionFormModal");
    if (!modal) return;

    // Check and create commissionFormTitle
    let title = document.getElementById("commissionFormTitle");
    if (!title) {
        console.log("🛠️ Creating missing commissionFormTitle...");
        title = document.createElement("h2");
        title.id = "commissionFormTitle";
        title.className = "modal-title";

        // Insert at the beginning of modal content
        const modalContent = modal.querySelector(
            ".modal-content, .auth-modal-content, .overlay-window"
        );
        if (modalContent) {
            modalContent.insertBefore(title, modalContent.firstChild);
        }
    }

    // Check and create commissionSubmitText
    let submitText = document.getElementById("commissionSubmitText");
    if (!submitText) {
        console.log("🛠️ Creating missing commissionSubmitText...");
        submitText = document.createElement("span");
        submitText.id = "commissionSubmitText";

        // Find submit button and append this span
        const submitBtn = modal.querySelector(
            '.auth-submit-btn, [type="submit"]'
        );
        if (submitBtn) {
            submitBtn.innerHTML = ""; // Clear existing content
            submitBtn.appendChild(submitText);
        }
    }
}

// Test jika modal form ada di DOM
function checkCommissionFormElements() {
    console.group('🔍 Checking Commission Form Elements');
    
    const requiredElements = [
        'commissionFormModal',
        'commissionForm', 
        'commissionFormTitle',
        'commissionSubmitText',
        'commissionImagesPreview',
        'commissionId'
    ];
    
    requiredElements.forEach(id => {
        const element = document.getElementById(id);
        console.log(`${id}:`, element ? '✅ Found' : '❌ MISSING');
        
        if (!element) {
            console.error(`   ❌ ELEMENT DENGAN ID "${id}" TIDAK DITEMUKAN DI HTML!`);
        }
    });
    
    console.groupEnd();
}

// Jalankan ini untuk check
checkCommissionFormElements();

// Close commission form
function closeCommissionForm() {
    const modal = document.getElementById("commissionFormModal");
    if (!modal) return;

    modal.style.animation = "fadeOut 0.3s forwards";

    setTimeout(() => {
        modal.style.display = "none";
        modal.style.animation = "fadeIn 0.3s forwards";

        // ✅ RESET LENGKAP
        currentCommissionId = null;
        selectedCommissionImages = [];

        // Reset form
        const form = document.getElementById("commissionForm");
        if (form) {
            form.reset();
            form.classList.remove("was-validated");
        }

        // Reset preview
        const preview = document.getElementById("commissionImagesPreview");
        if (preview) preview.innerHTML = "";

        // Reset file input
        const fileInput = document.getElementById("commissionImages");
        if (fileInput) {
            fileInput.value = "";
            fileInput.disabled = false;
        }

        // Reset validation UI
        const charCount = document.getElementById("descCharCount");
        if (charCount) {
            charCount.textContent = "0";
            charCount.style.color = "rgba(255, 255, 255, 0.5)";
        }

        console.log("✅ Commission form fully reset");
    }, 300);
}

// ✅ UPDATE: Load commission data for editing (fix "Current" label position)
async function loadCommissionData(id) {
    try {
        const response = await fetch(`/commissions/${id}`);
        const data = await response.json();

        if (data.success) {
            const commission = data.commission;
            document.getElementById("commissionId").value = commission.id;
            document.getElementById("commissionName").value = commission.name;
            document.getElementById("commissionDescription").value =
                commission.description;
            document.getElementById("commissionPrice").value = commission.price;
            document.getElementById("commissionDiscount").value =
                            commission.discount_percentage || 0;
            document.getElementById("deliveryTime").value =
                commission.delivery_time;
            document.getElementById("slotsAvailable").value =
                commission.slots_available;
            document.getElementById("commissionActive").checked =
                commission.is_active;

            const charCount = document.getElementById("descCharCount");
            if (charCount)
                charCount.textContent = commission.description.length;

            // ✅ FIX: Better "Current" label for existing files
            if (commission.images && commission.images.length > 0) {
                const preview = document.getElementById(
                    "commissionImagesPreview"
                );
                preview.innerHTML = commission.images
                    .map((file, index) => {
                        const isVideo = file.match(/\.(mp4|webm)$/i);

                        return `
                        <div class="image-preview-item existing-file">
                            ${
                                isVideo
                                    ? `
                                <video src="/storage/commissions/${file}" muted loop autoplay playsinline></video>
                                <div class="video-badge">
                                    <svg viewBox="0 0 24 24" width="14" height="14">
                                        <polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>
                                    </svg>
                                </div>
                            `
                                    : `
                                <img src="/storage/commissions/${file}" alt="Current ${
                                          index + 1
                                      }">
                            `
                            }
                            <div class="current-file-badge">
                                <svg viewBox="0 0 24 24" width="12" height="12">
                                    <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" fill="none"/>
                                </svg>
                                Current
                            </div>
                            <span class="image-number">${index + 1}</span>
                        </div>
                    `;
                    })
                    .join("");
            }
        }
    } catch (error) {
        console.error("Error loading commission:", error);
        alert("Failed to load commission data");
    }
}

// Handle commission images/videos upload (max 5, 20MB each)
function handleCommissionImagesUpload(event) {
    const files = Array.from(event.target.files);

    if (selectedCommissionImages.length + files.length > 5) {
        alert("Maximum 5 files allowed");
        event.target.value = "";
        return;
    }

    files.forEach((file) => {
        // ✅ UPDATE: Max 20MB
        if (file.size > 20 * 1024 * 1024) {
            alert(`${file.name} is too large. Maximum 20MB per file.`);
            return;
        }

        selectedCommissionImages.push(file);
    });

    refreshCommissionImagesPreview();
}

// Refresh commission images preview
// ✅ IMPROVED VERSION - With better preview
function refreshCommissionImagesPreview() {
    const container = document.getElementById('commissionImagesPreview');
    if (!container) return;

    container.innerHTML = '';

    selectedCommissionImages.forEach((file, index) => {
        const isVideo = file.type.startsWith('video/');
        const fileUrl = URL.createObjectURL(file);
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

        const previewItem = document.createElement('div');
        previewItem.className = 'image-preview-item';
        previewItem.innerHTML = `
            ${isVideo ? `
                <video src="${fileUrl}" muted style="width:100%;height:100%;object-fit:cover;"></video>
                <div class="video-badge">
                    <svg viewBox="0 0 24 24" width="12" height="12">
                        <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/>
                    </svg>
                    VIDEO
                </div>
                <div class="video-play-indicator">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <polygon points="10 8 16 12 10 16 10 8" fill="white"/>
                    </svg>
                </div>
            ` : `
                <img src="${fileUrl}" alt="Preview ${index + 1}" style="width:100%;height:100%;object-fit:cover;">
            `}
            
            <span class="image-number">${index + 1}</span>
            
            <button type="button" class="image-preview-remove" onclick="removeCommissionImage(${index})" title="Remove file">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                </svg>
            </button>
            
            <div class="file-info-overlay">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${fileSizeMB} MB ${isVideo ? '• Video' : '• Image'}</div>
            </div>
        `;
        container.appendChild(previewItem);
    });

    console.log('✅ Commission preview refreshed:', selectedCommissionImages.length);
}

// Remove commission image
function removeCommissionImage(index) {
    selectedCommissionImages.splice(index, 1);
    refreshCommissionImagesPreview();

    const fileInput = document.getElementById("commissionImages");
    if (fileInput) fileInput.value = "";
}

// Init description char counter
function initDescriptionCharCounter() {
    const textarea = document.getElementById("commissionDescription");
    const charCount = document.getElementById("descCharCount");

    if (textarea && charCount) {
        textarea.addEventListener("input", function () {
            charCount.textContent = this.value.length;

            if (this.value.length > 5000) {
                charCount.style.color = "#f44336";
            } else if (this.value.length > 4999) {
                charCount.style.color = "#FF9800";
            } else {
                charCount.style.color = "rgba(255, 255, 255, 0.5)";
            }
        });
    }
}

// Submit commission form

function initCommissionForm() {
    const form = document.getElementById("commissionForm");
    if (!form) return;

    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    const freshForm = document.getElementById("commissionForm");

    freshForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const csrfToken = document.querySelector('meta[name="csrf-token"]');
        if (!csrfToken) return;

        const formData = new FormData(this);
        const submitBtn = this.querySelector(".auth-submit-btn");

        if (!submitBtn) return;

        const originalHTML = submitBtn.innerHTML;

        // Hapus dan tambah images[]
        formData.delete("images[]");
        selectedCommissionImages.forEach((file) => {
            formData.append("images[]", file);
        });

        // Fix is_active
        const isActiveCheckbox = document.getElementById("commissionActive");
        if (isActiveCheckbox) {
            formData.delete("is_active");
            formData.set("is_active", isActiveCheckbox.checked ? "1" : "0");
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="spinner" viewBox="0 0 24 24" width="20" height="20">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25"/>
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" fill="none"/>
            </svg>
            ${currentCommissionId ? "Updating..." : "Creating..."}
        `;

        try {
            const url = currentCommissionId
                ? `/commissions/${currentCommissionId}`
                : "/commissions";
            const method = "POST";

            if (currentCommissionId) {
                formData.append("_method", "PUT");
            }

            const response = await fetch(url, {
                method: method,
                body: formData,
                headers: {
                    "X-CSRF-TOKEN": csrfToken.content,
                },
            });

            const data = await response.json();

            if (data.success) {
                submitBtn.innerHTML = "✓ Success!";
                submitBtn.style.background =
                    "linear-gradient(135deg, #4CAF50, #45a049)";

                setTimeout(() => {
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.style.background = "";

                    closeCommissionForm();
                    loadCommissionsData();

                    // ✅ TAMBAH NOTIF SUKSES DI SINI!
                    showToast(
                        currentCommissionId
                            ? "🎉 Commission Updated!"
                            : "🎉 Commission Created!",
                        currentCommissionId
                            ? "Your commission has been updated successfully!"
                            : "New commission type has been added successfully!",
                        null
                    );
                }, 1500);
            } else {
                throw new Error(data.message || "Failed to save commission");
            }
        } catch (error) {
            console.error("Error:", error);

            // Reset button on error
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
            submitBtn.style.background = "";

            // ✅ TAMBAH NOTIF ERROR JUGA
            showToast(
                "❌ Failed to Save",
                error.message || "Please check your data and try again.",
                null
            );
        }
    });
}


// ✅ NEW: Helper function untuk reset button state
function resetButtonState(button, originalState) {
    button.disabled = false;
    button.innerHTML = originalState.html;
    button.style.background = originalState.background;
    console.log("✅ Button state reset to normal");
}

// Edit commission
function editCommission(id) {
    openCommissionForm(id);
}

// Delete commission
async function deleteCommission(id) {
    if (!confirm("Are you sure you want to delete this commission type?")) {
        return;
    }

    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    if (!csrfToken) return;

    try {
        const response = await fetch(`/commissions/${id}`, {
            method: "DELETE",
            headers: {
                "X-CSRF-TOKEN": csrfToken.content,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            loadCommissionsData();
        } else {
            throw new Error(data.message || "Failed to delete commission");
        }
    } catch (error) {
        console.error("Error:", error);
        alert(
            error.message || "Failed to delete commission. Please try again."
        );
    }
}

// Order commission


// View commission gallery
// View commission gallery
function viewCommissionGallery(commissionId) {
    const commissions = window.commissionsData || [];
    const commission = commissions.find(c => c.id === commissionId);

    if (!commission || !commission.images || commission.images.length === 0) {
        return;
    }

    // ✅ SET COMMISSION GALLERY
    commissionGalleryImages = commission.images;
    commissionGalleryIndex = 0;
    activeGalleryType = 'commission';

    console.log('🖼️ Commission Gallery:', {
        commissionId: commissionId,
        images: commissionGalleryImages,
        type: activeGalleryType
    });

    showGalleryLightbox();
}

// ✅ UPDATE: Gallery lightbox with video support & better navigation placement
// ================================================
// UNIVERSAL GALLERY LIGHTBOX
// ================================================

// ✅ UPDATE: Gallery lightbox dengan support works video
// ✅ UPDATE: Gallery lightbox dengan navigasi yang tidak menutupi konten
function showGalleryLightbox() {
    const existingLightbox = document.getElementById("galleryLightbox");
    if (existingLightbox) {
        existingLightbox.remove();
    }

    // ✅ GET ACTIVE GALLERY DATA - FIX UNTUK WORKS
    let currentImages, currentIndex, storagePath;
    
    if (activeGalleryType === 'commission') {
        currentImages = commissionGalleryImages;
        currentIndex = commissionGalleryIndex;
        storagePath = 'commissions';
    } else if (activeGalleryType === 'works') {
        currentImages = worksGalleryImages;
        currentIndex = worksGalleryIndex;
        storagePath = 'works';
    } else {
        console.error('No active gallery type');
        return;
    }

    // ✅ VALIDATION
    if (!currentImages || currentImages.length === 0) {
        console.error('No gallery images available');
        return;
    }

    if (currentIndex < 0 || currentIndex >= currentImages.length) {
        console.error('Invalid gallery index:', currentIndex);
        currentIndex = 0;
    }

    const currentFile = currentImages[currentIndex];
    const currentImagePath = `/storage/${storagePath}/${currentFile}`;
    
    // ✅ FIX CRITICAL: DETEKSI VIDEO UNTUK WORKS
    let isVideo = false;
    
    if (activeGalleryType === 'works') {
        const works = window.worksData || [];
        const currentWork = works.find(w => 
            (w.images && w.images.includes(currentFile)) || 
            (w.videos && w.videos.includes(currentFile))
        );
        
        if (currentWork) {
            if (currentWork.videos && currentWork.videos.includes(currentFile)) {
                isVideo = true;
            } else {
                isVideo = currentFile.match(/\.(mp4|webm)$/i);
            }
        } else {
            isVideo = currentFile.match(/\.(mp4|webm)$/i);
        }
    } else {
        isVideo = currentFile.match(/\.(mp4|webm)$/i);
    }

    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < currentImages.length - 1;

    const lightbox = document.createElement("div");
    lightbox.className = "gallery-lightbox";
    lightbox.id = "galleryLightbox";

    lightbox.innerHTML = `
        <div class="gallery-content">
            ${
                isVideo
                    ? `
                <video src="${currentImagePath}" 
                       controls loop autoplay playsinline 
                       alt="Gallery video ${currentIndex + 1}"></video>
            `
                    : `
                <img src="${currentImagePath}" alt="Gallery image ${currentIndex + 1}"
                     onerror="this.onerror=null; this.src='/images/default-commission.jpg';">
            `
            }
        </div>
        
        <button class="gallery-close" onclick="closeGalleryLightbox()">
            <svg viewBox="0 0 24 24" width="24" height="24">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
            </svg>
        </button>
        
        <div class="gallery-counter">${currentIndex + 1} / ${currentImages.length}</div>
        
        ${
            hasPrev
                ? `
            <button class="gallery-nav prev" onclick="prevGalleryImage()">
                <svg viewBox="0 0 24 24" width="32" height="32">
                    <polyline points="15 18 9 12 15 6" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
            </button>
        `
                : ""
        }
        
        ${
            hasNext
                ? `
            <button class="gallery-nav next" onclick="nextGalleryImage()">
                <svg viewBox="0 0 24 24" width="32" height="32">
                    <polyline points="9 18 15 12 9 6" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
            </button>
        `
                : ""
        }
        
        ${
            currentImages.length > 1
                ? `
            <div class="gallery-thumbnails">
                ${currentImages
                    .map((file, index) => {
                        const thumbPath = `/storage/${storagePath}/${file}`;
                        let thumbIsVideo = false;
                        
                        if (activeGalleryType === 'works') {
                            const works = window.worksData || [];
                            const thumbWork = works.find(w => 
                                (w.images && w.images.includes(file)) || 
                                (w.videos && w.videos.includes(file))
                            );
                            if (thumbWork && thumbWork.videos && thumbWork.videos.includes(file)) {
                                thumbIsVideo = true;
                            } else {
                                thumbIsVideo = file.match(/\.(mp4|webm)$/i);
                            }
                        } else {
                            thumbIsVideo = file.match(/\.(mp4|webm)$/i);
                        }

                        return thumbIsVideo
                            ? `
                        <div class="gallery-thumb ${index === currentIndex ? "active" : ""}" onclick="goToGalleryImage(${index})">
                            <video src="${thumbPath}" muted ></video>
                            <div class="thumb-video-icon">
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <polygon points="8 5 16 12 8 19 8 5" fill="currentColor"/>
                                </svg>
                            </div>
                        </div>
                    `
                            : `
                        <img src="${thumbPath}" 
                             alt="Thumbnail ${index + 1}"
                             class="gallery-thumb ${index === currentIndex ? "active" : ""}"
                             onclick="goToGalleryImage(${index})"
                             onerror="this.onerror=null; this.src='/images/default-commission.jpg';">
                    `;
                    })
                    .join("")}
            </div>
        `
                : ""
        }
    `;

    document.body.appendChild(lightbox);
    document.addEventListener("keydown", galleryKeyboardHandler);
}

// Close gallery lightbox
function closeGalleryLightbox() {
    const lightbox = document.getElementById("galleryLightbox");
    if (lightbox) {
        lightbox.remove();
    }
    document.removeEventListener("keydown", galleryKeyboardHandler);
    
    // ✅ Reset active gallery
    activeGalleryType = null;
}

// Gallery keyboard handler
function galleryKeyboardHandler(e) {
    if (e.key === "Escape") {
        closeGalleryLightbox();
    } else if (e.key === "ArrowLeft") {
        prevGalleryImage();
    } else if (e.key === "ArrowRight") {
        nextGalleryImage();
    }
}

// Previous gallery image
function prevGalleryImage() {
    if (activeGalleryType === 'commission') {
        if (commissionGalleryIndex > 0) {
            commissionGalleryIndex--;
            updateGalleryLightbox();
        }
    } else if (activeGalleryType === 'works') {
        if (worksGalleryIndex > 0) {
            worksGalleryIndex--;
            updateGalleryLightbox();
        }
    }
}

// Next gallery image
function nextGalleryImage() {
    if (activeGalleryType === 'commission') {
        if (commissionGalleryIndex < commissionGalleryImages.length - 1) {
            commissionGalleryIndex++;
            updateGalleryLightbox();
        }
    } else if (activeGalleryType === 'works') {
        if (worksGalleryIndex < worksGalleryImages.length - 1) {
            worksGalleryIndex++;
            updateGalleryLightbox();
        }
    }
}

// Go to specific gallery image
function goToGalleryImage(index) {
    if (activeGalleryType === 'commission') {
        if (index >= 0 && index < commissionGalleryImages.length) {
            commissionGalleryIndex = index;
            updateGalleryLightbox();
        }
    } else if (activeGalleryType === 'works') {
        if (index >= 0 && index < worksGalleryImages.length) {
            worksGalleryIndex = index;
            updateGalleryLightbox();
        }
    }
}

// Update gallery lightbox
function updateGalleryLightbox() {
    showGalleryLightbox();
}

function playNavSound() {
    const audio = document.getElementById("navSound");
    if (audio) {
        // Reset ke awal (kalau di-klik berkali-kali)
        audio.currentTime = 0;
        // Play sound
        audio.play().catch((error) => {
            console.log("⚠️ Audio play failed:", error);
        });
    }
}

// ✅ TAMBAH INI - Hover listener
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        // Sound saat hover
        item.addEventListener('mouseenter', function() {
            playNavSound();
        });
    });
});

// Update navigate function
function navigate(section) {
    playNavSound();
    if (section === "about") {
        const overlay = document.getElementById("aboutOverlay");
        overlay.style.display = "flex";
        const overlayWindow = overlay.querySelector(".overlay-window");
        if (overlayWindow) {
            overlayWindow.style.transform = "translate(0px, 0px)";
            xOffset = 0;
            yOffset = 0;
        }
        setTimeout(() => initDraggable("aboutOverlay"), 100);
    } else if (section === "links") {
        const overlay = document.getElementById("linksOverlay");
        overlay.style.display = "flex";
        const overlayWindow = overlay.querySelector(".overlay-window");
        if (overlayWindow) {
            overlayWindow.style.transform = "translate(0px, 0px)";
            xOffset = 0;
            yOffset = 0;
        }
        setTimeout(() => initDraggable("linksOverlay"), 100);
    } else if (section === "contact") {
        const overlay = document.getElementById("contactOverlay");
        overlay.style.display = "flex";
        const overlayWindow = overlay.querySelector(".overlay-window");
        if (overlayWindow) {
            overlayWindow.style.transform = "translate(0px, 0px)";
            xOffset = 0;
            yOffset = 0;
        }
        setTimeout(() => initDraggable("contactOverlay"), 100);
    } else if (section === "faq") {
        const overlay = document.getElementById("faqOverlay");
        overlay.style.display = "flex";
        const overlayWindow = overlay.querySelector(".overlay-window");
        if (overlayWindow) {
            overlayWindow.style.transform = "translate(0px, 0px)";
            xOffset = 0;
            yOffset = 0;
        }
        setTimeout(() => initDraggable("faqOverlay"), 100);
    } else if (section === "rating") {
        const overlay = document.getElementById("ratingOverlay");
        overlay.style.display = "flex";
        const overlayWindow = overlay.querySelector(".overlay-window");
        if (overlayWindow) {
            overlayWindow.style.transform = "translate(0px, 0px)";
            xOffset = 0;
            yOffset = 0;
        }
        setTimeout(() => initDraggable("ratingOverlay"), 100);
        loadReviewsData();
        loadReviewStatistics();
    } else if (section === "commisions") {
        const overlay = document.getElementById("commissionsOverlay");
        overlay.style.display = "flex";
        const overlayWindow = overlay.querySelector(".overlay-window");
        if (overlayWindow) {
            overlayWindow.style.transform = "translate(0px, 0px)";
            xOffset = 0;
            yOffset = 0;
        }
        setTimeout(() => initDraggable("commissionsOverlay"), 100);
        loadCommissionsData();
    } else if (section === 'work' || section === 'works') {
        const overlay = document.getElementById('worksOverlay');
        overlay.style.display = 'flex';
        const overlayWindow = overlay.querySelector('.overlay-window');
        if (overlayWindow) {
            overlayWindow.style.transform = 'translate(0px, 0px)';
            xOffset = 0;
            yOffset = 0;
        }
        setTimeout(() => {
            initDraggable('worksOverlay');
            loadWorksData();
        }, 100);
    } else if (section === "chat") {
        const overlay = document.getElementById("chatOverlay");
        overlay.style.display = "flex";
        const overlayWindow = overlay.querySelector(".overlay-window");
        if (overlayWindow) {
            overlayWindow.style.transform = "translate(0px, 0px)";
            xOffset = 0;
            yOffset = 0;
        }
        setTimeout(() => initDraggable("chatOverlay"), 100);
        initializeChat();

        // ✅ Clear badge when opened
        updateNotificationBadge(0);
        localStorage.setItem("lastUnreadCount", "0");
    }    if (section === "rating") {
        const overlay = document.getElementById("ratingOverlay");
        overlay.style.display = "flex";
        const overlayWindow = overlay.querySelector(".overlay-window");
        if (overlayWindow) {
            overlayWindow.style.transform = "translate(0px, 0px)";
            xOffset = 0;
            yOffset = 0;
        }
        setTimeout(() => initDraggable("ratingOverlay"), 100);

        loadReviewsData();
        loadReviewStatistics();
        checkUserReviewStatus(); // ✅ Check status
    } else if (section === "admin") {
        // ✅ NEW: Admin Panel
        const overlay = document.getElementById("adminOverlay");
        if (!overlay) {
            alert("Admin panel not available");
            return;
        }

        overlay.style.display = "flex";
        const overlayWindow = overlay.querySelector(".overlay-window");
        if (overlayWindow) {
            overlayWindow.style.transform = "translate(0px, 0px)";
            xOffset = 0;
            yOffset = 0;
        }
        setTimeout(() => initDraggable("adminOverlay"), 100);

        // Load pending reviews
        loadPendingReviews();
    } else {
    }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
    const commissionsOverlay = document.getElementById("commissionsOverlay");
    if (commissionsOverlay) {
        commissionsOverlay.addEventListener("click", function (e) {
            if (e.target === this) {
                closeOverlay("commissionsOverlay");
            }
        });
    }

    const commissionFormModal = document.getElementById("commissionFormModal");
    if (commissionFormModal) {
        commissionFormModal.addEventListener("click", function (e) {
            if (e.target === this) {
                closeCommissionForm();
            }
        });
    }

    // ✅ TAMBAHKAN INI:
    const chatOverlay = document.getElementById("chatOverlay");
    if (chatOverlay) {
        chatOverlay.addEventListener("click", function (e) {
            if (e.target === this) {
                closeChatOverlay();
            }
        });
    }

    initCommissionForm();
});

// Make functions global
window.loadCommissionsData = loadCommissionsData;
window.openCommissionForm = openCommissionForm;
window.closeCommissionForm = closeCommissionForm;
window.editCommission = editCommission;
window.deleteCommission = deleteCommission;
window.orderCommission = orderCommission;
window.handleCommissionImagesUpload = handleCommissionImagesUpload;
window.removeCommissionImage = removeCommissionImage;
window.viewCommissionGallery = viewCommissionGallery;
window.closeGalleryLightbox = closeGalleryLightbox;
window.prevGalleryImage = prevGalleryImage;
window.nextGalleryImage = nextGalleryImage;
window.goToGalleryImage = goToGalleryImage;

// Make functions global
window.toggleTheme = toggleTheme;
window.openSocial = openSocial;
window.navigate = navigate;
window.closeOverlay = closeOverlay;
window.uploadProfilePhoto = uploadProfilePhoto;
window.toggleFAQ = toggleFAQ;
window.filterFAQ = filterFAQ;
window.searchFAQ = searchFAQ;
window.filterReviews = filterReviews;
window.toggleUserDropdown = toggleUserDropdown;
window.openAuthModal = openAuthModal;
window.handleLogout = handleLogout;
window.closeAuthModal = closeAuthModal;
window.switchAuthModal = switchAuthModal;
window.togglePasswordVisibility = togglePasswordVisibility;
window.checkPasswordStrength = checkPasswordStrength;
window.loadReviewsData = loadReviewsData;
window.loadReviewStatistics = loadReviewStatistics;
window.filterReviewsBy = filterReviewsBy;
window.loadMoreReviews = loadMoreReviews;
window.viewImage = viewImage;
window.openReviewForm = openReviewForm;
window.closeReviewForm = closeReviewForm;
// window.handleImageUpload = handleImageUpload;
window.removePreviewImage = removePreviewImage;

// ================================================
// CHAT SYSTEM - FIXED VERSION
// ================================================
let currentChatUserId = null;
let currentAdminId = null;
let chatRefreshInterval = null;
let isAdmin = false;

// Initialize Chat
// ✅ UPDATE: Initialize Chat for regular users
// ✅ FIX: Initialize Chat dengan role dari Blade
// ✅ UPDATE: Initialize Chat dengan debug conditional
async function initializeChat() {
    debugLog('🚀 Initializing chat...');
    debugLog('👤 User Role:', window.chatUserRole);
    debugLog('🔑 User ID:', window.chatUserId);
    
    if (!window.chatUserId || window.chatUserRole === 'guest') {
        debugLog('❌ User not authenticated');
        return;
    }

    const isAdmin = window.chatUserRole === 'admin';

    if (isAdmin) {
        debugLog('👑 Loading admin conversations...');
        await loadConversations();
    } else {
        debugLog('💬 Loading user chat with admin...');
        await loadAdminChat();
        
        if (window.innerWidth <= 968) {
            const sidebar = document.getElementById('conversationsSidebar');
            const chatMain = document.getElementById('chatMain');
            
            if (sidebar) sidebar.classList.add('hidden');
            if (chatMain) chatMain.classList.add('active');
        }
    }
}

// Load Admin Info for User Chat
async function loadAdminChat() {
    try {
        const response = await fetch("/chat/admin");
        const data = await response.json();

        if (data.success) {
            currentAdminId = data.admin.id;
            await loadChatMessages(currentAdminId, data.admin.name);
        }
    } catch (error) {
        console.error("Error loading admin:", error);
    }
}

// Load Conversations (Admin Only)
// Load Conversations (Admin Only)
async function loadConversations() {
    const conversationsList = document.getElementById("conversationsList");
    if (!conversationsList) return;

    try {
        conversationsList.innerHTML = `
            <div class="loading-spinner">
                <svg class="spinner" viewBox="0 0 24 24" width="30" height="30">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25"/>
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" fill="none"/>
                </svg>
                <p>Loading conversations...</p>
            </div>
        `;

        const response = await fetch("/chat/conversations");
        const data = await response.json();

        if (data.success && data.conversations.length > 0) {
            conversationsList.innerHTML = data.conversations
                .map(
                    (conv) => `
                <div class="conversation-item" onclick="selectConversation(${
                    conv.user_id
                }, '${escapeHtml(conv.user_name)}', ${conv.is_online})">
                    <div class="conversation-avatar">
                        <img src="${
                            conv.user_avatar ||
                            "/images/profile/default-avatar.png"
                        }" alt="${escapeHtml(conv.user_name)}">
                        ${
                            conv.is_online
                                ? '<span class="online-indicator-small"></span>'
                                : ""
                        }
                    </div>
                    <div class="conversation-info">
<strong style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
    <span style="flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis;">
        ${escapeHtml(conv.user_name)}
    </span>
    ${
        conv.is_blocked
            ? '<span class="blocked-badge">🚫 BLOCKED</span>'
            : ""
    }
</strong>
                        <p>${escapeHtml(conv.last_message || "No messages yet")}</p>
                    </div>
                    <div class="conversation-meta">
                        <span class="conversation-time">${
                            conv.last_message_at
                        }</span>
                        ${
                            conv.unread_count > 0
                                ? `<span class="unread-badge">${conv.unread_count}</span>`
                                : ""
                        }
                    </div>
                        <div class="conversation-actions" onclick="event.stopPropagation()">
                        <button class="conv-menu-btn" onclick="toggleConvMenu(${
                            conv.user_id
                        }, event)">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <circle cx="12" cy="5" r="2" fill="currentColor"/>
                                <circle cx="12" cy="12" r="2" fill="currentColor"/>
                                <circle cx="12" cy="19" r="2" fill="currentColor"/>
                            </svg>
                        </button>
                        
                        <div class="conv-dropdown" id="convMenu-${
                            conv.user_id
                        }" style="display:none;">
                            <button onclick="event.stopPropagation(); blockUser(${
                                conv.user_id
                            }, '${escapeHtml(conv.user_name)}')">
                                ${
                                    conv.is_blocked
                                        ? "✅ Unblock User"
                                        : "🚫 Block User"
                                }
                            </button>
                            <button onclick="event.stopPropagation(); deleteConversation(${
                                conv.user_id
                            }, '${escapeHtml(conv.user_name)}')">
                                🗑️ Delete Chat
                            </button>
                        </div>
                    </div>
                </div>
            `
                )
                .join("");
        } else {
            conversationsList.innerHTML = `
                <div class="empty-chat">
                    <svg viewBox="0 0 24 24" width="50" height="50">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" stroke="green" stroke-width="2" fill="none"/>
                    </svg>
                    <h4 style="color: white">No conversations yet</h4>
                    <p>Start chatting with users</p>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error loading conversations:", error);
        conversationsList.innerHTML = `
            <div class="empty-chat">
                <svg viewBox="0 0 24 24" width="50" height="50">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="2"/>
                </svg>
                <h4>Failed to load conversations</h4>
                <p>Please try again</p>
            </div>
        `;
    }
}

function toggleConvMenu(userId, event) {
    event.stopPropagation(); // ✅ Prevent trigger conversation click

    const menu = document.getElementById(`convMenu-${userId}`);
    const allMenus = document.querySelectorAll(".conv-dropdown");

    // ✅ Close all other menus first
    allMenus.forEach((m) => {
        if (m !== menu) m.style.display = "none";
    });

    // ✅ Toggle current menu
    if (menu) {
        menu.style.display =
            menu.style.display === "none" || menu.style.display === ""
                ? "block"
                : "none";
    }
}
window.toggleConvMenu = toggleConvMenu;

// ✅ Close menu when click outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.conversation-actions')) {
        document.querySelectorAll('.conv-dropdown').forEach(menu => {
            menu.style.display = 'none';
        });
    }
});

window.toggleConvMenu = toggleConvMenu;

// Select Conversation (Admin)
// Select Conversation (Admin)
function selectConversation(userId, userName, isOnline = false) {
    // Mark conversation as active
    document.querySelectorAll(".conversation-item").forEach((item) => {
        item.classList.remove("active");
    });
    event.currentTarget.classList.add("active");

    // ✅ Kirim isOnline ke loadChatMessages (tapi tidak dipakai, ambil dari API response lebih akurat)
    loadChatMessages(userId, userName);
}


// ================================================
// SMART MESSAGE REFRESH - NO ANNOYING AUTO-SCROLL
// ================================================
// ini yang mneyebebkan chat bisa realtime saat kirim message tanpa bantuan reload web
let lastMessageId = null;
let isUserScrolling = false;
let scrollTimeout = null;

// Load Chat Messages - UPDATED
async function loadChatMessages(userId, userName) {
    currentChatUserId = userId;
    const chatMain = document.getElementById("chatMain");
    if (!chatMain) return;

    // Clear refresh interval
    if (chatRefreshInterval) {
        clearInterval(chatRefreshInterval);
    }

    try {
        chatMain.innerHTML = `
            <div class="loading-spinner">
                <svg class="spinner" viewBox="0 0 24 24" width="30" height="30">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25"/>
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" fill="none"/>
                </svg>
                <p>Loading messages...</p>
            </div>
        `;

        const response = await fetch(`/chat/messages?user_id=${userId}`);
        const data = await response.json();

        // ✅ CHECK: Jika user blocked
        if (!data.success && response.status === 403) {
            chatMain.innerHTML = `
                <div class="blocked-notice" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;padding:20px;">
                    <svg viewBox="0 0 24 24" width="80" height="80" style="margin-bottom:20px;">
                        <circle cx="12" cy="12" r="10" stroke="red" stroke-width="2" fill="none"/>
                        <line x1="15" y1="9" x2="9" y2="15" stroke="red" stroke-width="2"/>
                        <line x1="9" y1="9" x2="15" y2="15" stroke="red" stroke-width="2"/>
                    </svg>
                    <h3 style="color:red;margin-bottom:10px;">Account Blocked</h3>
                    <p style="color:rgba(255,255,255,0.7);">${data.message}</p>
                </div>
            `;
            return;
        }

        if (data.success) {
            // ✅ AMBIL STATUS ONLINE dari response
            const isOnline = data.other_user
                ? data.other_user.is_online
                : false;

            // ✅ KIRIM ke renderChatInterface
            renderChatInterface(userName, data.messages, isOnline);

            // ✅ Store last message ID
            if (data.messages.length > 0) {
                lastMessageId = data.messages[data.messages.length - 1].id;
            }

            // Update header title
            const chatHeaderTitle = document.getElementById("chatHeaderTitle");
            if (chatHeaderTitle) {
                chatHeaderTitle.textContent = `Chat with ${userName}`;
            }

            // ✅ SMART Auto refresh every 3 seconds (faster but smarter)
            chatRefreshInterval = setInterval(() => {
                smartRefreshMessages();
            }, 3000);

            // ✅ Track user scrolling
            const messagesContainer =
                document.getElementById("messagesContainer");
            if (messagesContainer) {
                messagesContainer.addEventListener("scroll", handleUserScroll);
            }
        }
    } catch (error) {
        console.error("Error loading messages:", error);
        chatMain.innerHTML = `
            <div class="empty-chat">
                <svg viewBox="0 0 24 24" width="50" height="50">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="2"/>
                </svg>
                <h4>Failed to load messages</h4>
                <p>Please try again</p>
            </div>
        `;
    }
}

// ✅ Handle user scroll - detect if user is reading old messages
function handleUserScroll() {
    isUserScrolling = true;
    
    // Reset flag after 2 seconds of no scrolling
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        isUserScrolling = false;
    }, 2000);
}

// ✅ SMART Refresh - Only update if NEW messages exist
// dan ini juga 
async function smartRefreshMessages() {
    if (!currentChatUserId) return;

    try {
        const response = await fetch(`/chat/messages?user_id=${currentChatUserId}`);
        const data = await response.json();

        if (data.success && data.messages.length > 0) {
            const latestMessageId = data.messages[data.messages.length - 1].id;
            
            // ✅ ONLY update if there's NEW message
            if (latestMessageId !== lastMessageId) {
                console.log('📨 New message detected!');
                
                const messagesContainer = document.getElementById("messagesContainer");
                if (messagesContainer) {
                    // ✅ Check if user was at bottom OR actively scrolling
                    const wasAtBottom = isScrolledToBottom();
                    const shouldAutoScroll = wasAtBottom && !isUserScrolling;
                    
                    // Update messages
                    messagesContainer.innerHTML = renderMessages(data.messages);
                    
                    // Initialize toggle
                    initCommissionDescriptionToggle();
                    
                    // ✅ ONLY auto-scroll if user was at bottom
                    if (shouldAutoScroll) {
                        scrollToBottom();
                    } else {
                        // ✅ Show "New message" indicator instead
                        showNewMessageIndicator();
                    }
                    
                    // Update last message ID
                    lastMessageId = latestMessageId;
                    
                    // ✅ Play notification sound (optional)
                    playNotificationSound();
                }
            }
        }
    } catch (error) {
        console.error("Error refreshing messages:", error);
    }
}

// ✅ Show "New Message" indicator when user is reading old messages
function showNewMessageIndicator() {
    const chatMain = document.getElementById("chatMain");
    if (!chatMain) return;

    // Remove existing indicator
    const existing = document.getElementById("newMessageIndicator");
    if (existing) existing.remove();

    // Create indicator
    const indicator = document.createElement("div");
    indicator.id = "newMessageIndicator";
    indicator.className = "new-message-indicator";
    indicator.innerHTML = `
        <span>📨 New message</span>
        <button onclick="scrollToBottomAndHideIndicator()">
            <svg viewBox="0 0 24 24" width="16" height="16">
                <polyline points="7 13 12 18 17 13" stroke="currentColor" stroke-width="2" fill="none"/>
                <polyline points="7 7 12 12 17 7" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
        </button>
    `;

    const messagesContainer = document.getElementById("messagesContainer");
    if (messagesContainer) {
        messagesContainer.parentElement.appendChild(indicator);
    }

    // ✅ AUTO HIDE SETELAH 1 DETIK
    setTimeout(() => {
        if (indicator && indicator.parentElement) {
            indicator.classList.add("fade-out");

            // Remove dari DOM setelah animation selesai
            setTimeout(() => {
                if (indicator.parentElement) {
                    indicator.remove();
                }
            }, 500); // Match dengan CSS animation duration
        }
    }, 1000); // 1 detik
}

// ✅ Scroll to bottom and hide indicator
function scrollToBottomAndHideIndicator() {
    scrollToBottom();
    const indicator = document.getElementById("newMessageIndicator");
    if (indicator) indicator.remove();
}

// ✅ Check if scrolled to bottom (with bigger threshold)
function isScrolledToBottom() {
    const messagesContainer = document.getElementById("messagesContainer");
    if (!messagesContainer) return false;

    const threshold = 150; // 150px dari bottom
    return (
        messagesContainer.scrollHeight -
        messagesContainer.scrollTop -
        messagesContainer.clientHeight < threshold
    );
}

// Render Chat Interface
// ✅ UPDATE: Render Chat Interface with back button di KANAN
// ✅ UPDATE: Render Chat Interface - back button hanya untuk admin
// ✅ UPDATE: Render Chat Interface - force hide back button untuk user
// ✅ ALTERNATIVE: Conditional render (lebih bersih)
// ✅ UPDATE: Render Chat Interface - back button hanya untuk admin
function renderChatInterface(userName, messages, isOnline = false) {
    const chatMain = document.getElementById("chatMain");
    if (!chatMain) return;

    const roleElement = document.querySelector(".role-badge");
    const isAdminUser = roleElement && roleElement.classList.contains("admin");

    // ✅ Tentukan status text & class
    const statusText = isOnline ? "Online" : "Offline";
    const statusClass = isOnline ? "status-online" : "status-offline";

    chatMain.innerHTML = `
        <div class="chat-header">
            <div class="chat-user-avatar">
                <img src="/images/profile/default-avatar.png" alt="${escapeHtml(
                    userName
                )}">
                ${isOnline ? '<span class="online-indicator"></span>' : ""}
            </div>
            <div class="chat-user-info">
                <h4>${escapeHtml(userName)}</h4>
                <p class="${statusClass}">${statusText}</p>
            </div>
            
            <button class="mobile-back-btn" onclick="backToConversations()">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <polyline points="15 18 9 12 15 6" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
            </button>
        </div>
        
        <div class="messages-container" id="messagesContainer">
            ${
                messages.length > 0
                    ? renderMessages(messages)
                    : '<div class="empty-chat"><p>No messages yet. Start the conversation!</p></div>'
            }
        </div>
        
        <div class="chat-input-area">
            <form class="chat-input-form" id="chatInputForm" onsubmit="sendMessage(event)">
                <div class="chat-input-wrapper">
                    <div id="attachmentPreview" class="attachment-preview" style="display: none;"></div>
                    <textarea 
                        class="chat-input" 
                        id="chatMessageInput" 
                        placeholder="Type a message..." 
                        rows="1"
                        onkeydown="handleChatInputKeydown(event)"
                    ></textarea>
                    <input type="file" id="chatAttachment" accept="image/*,video/*" style="display: none;" onchange="handleAttachmentSelect(event)">
                    <button type="button" class="attachment-btn" onclick="document.getElementById('chatAttachment').click()">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </button>
                </div>
                <button type="submit" class="send-btn" id="sendBtn">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" stroke-width="2"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                </button>
            </form>
        </div>
    `;

    setTimeout(() => {
        initCommissionDescriptionToggle();
        const backBtn = chatMain.querySelector(".mobile-back-btn");
        if (backBtn && !isAdminUser) {
            backBtn.parentNode.removeChild(backBtn);
        }
        scrollToBottom();
    }, 100);
}



// ✅ UPDATE: Render Messages dengan commission card yang lebih jelas
// ✅ UPDATE: Render Messages dengan video support
// ✅ UPDATE: Render Messages dengan video autoplay + loop
// ✅ UPDATE: Render Messages dengan download + preview support
function renderMessages(messages) {
    return messages
        .map((msg) => {
            const messageClass = msg.is_own ? "own" : "";
            const avatar =
                msg.sender_avatar || "/images/profile/default-avatar.png";
            const isAdmin = window.chatUserRole === "admin";
            const canDelete = isAdmin && !msg.is_own; // Admin bisa delete message user

            // Commission card
            // Commission card
            let commissionCard = "";
            if (msg.commission) {
                const desc = msg.commission.description || "";
                const descId = `commDesc-${msg.id}`;
                const isLongDesc = desc.length > 150;

                // ✅ Generate price HTML dengan diskon
                let priceHTML = "";
                if (
                    msg.commission.discount_percentage &&
                    msg.commission.discount_percentage > 0
                ) {
                    priceHTML = `
            <div style="margin-top: 8px;">
                <span style="text-decoration: line-through; color: rgba(255,255,255,0.4); font-size: 13px;">
                    IDR ${formatPrice(msg.commission.price)}
                </span>
                <span style="background: #f44336; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; margin-left: 6px; font-weight: 600;">
                    -${msg.commission.discount_percentage}%
                </span>
                <p style="margin-top: 5px;"><strong style="color: #4caf50; font-size: 16px;">💰 IDR ${formatPrice(
                    msg.commission.discounted_price
                )}</strong></p>
            </div>
        `;
                } else {
                    priceHTML = `<p style="margin-top: 8px;"><strong>💰 IDR ${formatPrice(
                        msg.commission.price
                    )}</strong></p>`;
                }

                commissionCard = `
        <div class="message-commission-card">
            <div class="commission-icon-badge">
                <svg viewBox="0 0 24 24" width="22" height="22">
                    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" fill="white"/>
                </svg>
            </div>
            <div class="commission-card-info">
                <h5>📦 ${escapeHtml(msg.commission.name)}</h5>
                ${priceHTML}
                <p style="font-size: 12px; opacity: 0.7; margin-top: 5px;">⏱️ ${
                    msg.commission.delivery_time
                }</p>
            </div>
        </div>
    `;
            }

            // Attachment
            let attachmentHtml = "";
            if (msg.attachment) {
                const filePath = `/storage/chat_attachments/${msg.attachment}`;
                const fileType = detectFileType(msg.attachment);

                if (fileType === "image") {
                    attachmentHtml = `
                    <div class="message-attachment">
                        <img 
                            src="${filePath}" 
                            alt="Attachment" 
                            onclick="viewAttachment('${filePath}', 'image')"
                            loading="lazy"
                            style="max-width: 300px; max-height: 300px; border-radius: 8px; cursor: pointer;">
                    </div>
                `;
                } else if (fileType === "video") {
                    attachmentHtml = `
                    <div class="message-attachment">
                        <div class="video-wrapper" onclick="viewAttachment('${filePath}', 'video')">
                            <video 
                                src="${filePath}" 
                                playsinline
                                preload="metadata"
                                style="max-width: 300px; max-height: 300px; border-radius: 8px; cursor: pointer;">
                            </video>
                            <div class="video-play-overlay">
                                <svg viewBox="0 0 24 24" width="50" height="50">
                                    <circle cx="12" cy="12" r="10" fill="rgba(0,0,0,0.6)"/>
                                    <polygon points="10 8 16 12 10 16 10 8" fill="white"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                `;
                } else if (fileType === "psd") {
                    attachmentHtml = `
                    <div class="message-attachment file-attachment">
                        <div class="file-info">
                            <svg viewBox="0 0 24 24" width="40" height="40">
                                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z" fill="#31C5F0"/>
                                <path d="M14 2v6h6" fill="#001E36" opacity="0.3"/>
                                <text x="12" y="16" text-anchor="middle" fill="white" font-size="6" font-weight="bold">PSD</text>
                            </svg>
                            <div>
                                <strong>${msg.attachment}</strong>
                                <small>Photoshop Document</small>
                            </div>
                        </div>
                        <button class="download-attachment-btn" onclick="downloadAttachment('${filePath}', '${msg.attachment}')">
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" fill="none"/>
                            </svg>
                            Download
                        </button>
                    </div>
                `;
                }
            }

            return `
            <div class="message-bubble ${messageClass}">
                ${
                    canDelete
                        ? `
                    <button class="delete-message-btn" onclick="deleteMessage(${msg.id})" title="Delete message">
                        <svg viewBox="0 0 24 24" width="14" height="14">
                            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>
                `
                        : ""
                }
                
                <div class="message-avatar">
                    <img src="${avatar}" alt="${escapeHtml(msg.sender_name)}">
                </div>
                <div class="message-content">
                    ${
                        msg.message
                            ? `<div class="message-text">${escapeHtml(
                                  msg.message
                              ).replace(/\n/g, "<br>")}</div>`
                            : ""
                    }
                    ${commissionCard}
                    ${attachmentHtml}
                    <div class="message-time">
                        <span>${msg.created_at}</span>
                        ${
                            msg.is_own
                                ? `
                            <span class="read-indicator ${
                                msg.is_read ? "read" : ""
                            }">
                                <svg viewBox="0 0 24 24" width="14" height="14">
                                    <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" fill="none"/>
                                </svg>
                            </span>
                        `
                                : ""
                        }
                    </div>
                </div>
            </div>
        `;
        })
        .join("");
}

// Detect file type from filename
function detectFileType(filename) {
    if (filename.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return 'image';
    } else if (filename.match(/\.(mp4|webm|mov)$/i)) {
        return 'video';
    } else if (filename.match(/\.psd$/i)) {
        return 'psd';
    }
    return 'unknown';
}

// ✅ NEW: View attachment in modal
function viewAttachment(src, type) {
    const modal = document.createElement('div');
    modal.className = 'attachment-modal';
    modal.id = 'attachmentModal';
    
    let content = '';
    
    if (type === 'image') {
        content = `
            <img src="${src}" alt="Full view" style="max-width: 90vw; max-height: 90vh; object-fit: contain;">
        `;
    } else if (type === 'video') {
        content = `
            <video 
                src="${src}" 
                controls 
                autoplay 
                style="max-width: 90vw; max-height: 90vh;">
                Your browser does not support video playback.
            </video>
        `;
    }
    
    modal.innerHTML = `
        <div class="attachment-modal-content">
            ${content}
            <button class="attachment-modal-close" onclick="closeAttachmentModal()">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                </svg>
            </button>
            <a href="${src}" download class="attachment-modal-download">
                <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
            
            </a>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeAttachmentModal();
        }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', handleEscKey);
}

// Close attachment modal
function closeAttachmentModal() {
    const modal = document.getElementById('attachmentModal');
    if (modal) {
        modal.remove();
    }
    document.removeEventListener('keydown', handleEscKey);
}

// Handle ESC key
function handleEscKey(e) {
    if (e.key === 'Escape') {
        closeAttachmentModal();
    }
}

// ✅ NEW: Download attachment
function downloadAttachment(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Make functions global
window.viewAttachment = viewAttachment;
window.closeAttachmentModal = closeAttachmentModal;
window.downloadAttachment = downloadAttachment;
window.formatFileSize = formatFileSize;
window.getFileType = getFileType;
window.detectFileType = detectFileType;

// ✅ Handle show more/less untuk commission description di chat
function initCommissionDescriptionToggle() {
    // Use event delegation for dynamically added elements
    const messagesContainer = document.getElementById('messagesContainer');
    if (!messagesContainer) return;

    messagesContainer.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('show-more-desc-btn')) {
            const btn = e.target;
            const descId = btn.id.replace('Btn', '');
            const descEl = document.getElementById(descId);
            
            if (descEl) {
                const isExpanded = descEl.classList.toggle('expanded');
                const isCollapsed = descEl.classList.toggle('collapsed');
                
                btn.textContent = isExpanded ? '📕 Show less' : '📖 Show more';
            }
        }
    });
}

// Call this after rendering messages
window.initCommissionDescriptionToggle = initCommissionDescriptionToggle;

async function refreshMessages() {
    if (!currentChatUserId) return;

    try {
        const response = await fetch(
            `/chat/messages?user_id=${currentChatUserId}`
        );
        const data = await response.json();

        if (data.success) {
            const messagesContainer = document.getElementById("messagesContainer");
            if (messagesContainer) {
                const wasAtBottom = isScrolledToBottom();
                messagesContainer.innerHTML =
                    data.messages.length > 0
                        ? renderMessages(data.messages)
                        : '<div class="empty-chat"><p>No messages yet. Start the conversation!</p></div>';

                // ✅ Initialize toggle after render
                initCommissionDescriptionToggle();

                if (wasAtBottom) {
                    scrollToBottom();
                }
            }
        }
    } catch (error) {
        console.error("Error refreshing messages:", error);
    }
}

// ✅ UPDATE: Send Message - auto scroll after send
async function sendMessage(event) {
    event.preventDefault();

    const messageInput = document.getElementById("chatMessageInput");
    const attachmentInput = document.getElementById("chatAttachment");
    const sendBtn = document.getElementById("sendBtn");

    if (!messageInput || !currentChatUserId) return;

    const message = messageInput.value.trim();
    const attachment = attachmentInput ? attachmentInput.files[0] : null;

    if (!message && !attachment) return;

    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    if (!csrfToken) return;

    const formData = new FormData();
    formData.append("receiver_id", currentChatUserId);
    if (message) formData.append("message", message);
    if (attachment) formData.append("attachment", attachment);

    if (sendBtn) sendBtn.disabled = true;

    try {
        const response = await fetch("/chat/send", {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRF-TOKEN": csrfToken.content,
            },
        });

        const data = await response.json();

        // ✅ CHECK: Jika blocked
        if (!data.success && response.status === 403) {
            alert("❌ " + data.message);
            return;
        }

        if (data.success) {
            messageInput.value = "";
            messageInput.style.height = "auto";
            if (attachmentInput) attachmentInput.value = "";

            const preview = document.getElementById("attachmentPreview");
            if (preview) preview.style.display = "none";

            await smartRefreshMessages();

            setTimeout(() => {
                scrollToBottom();
            }, 100);
        } else {
            alert(data.message || "Failed to send message");
        }
    } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send message. Please try again.");
    } finally {
        if (sendBtn) sendBtn.disabled = false;
    }
}


// Handle Chat Input Keydown (Send with Enter)
function handleChatInputKeydown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        const form = document.getElementById("chatInputForm");
        if (form) {
            sendMessage(event);
        }
    }
}

// ================================================
// CHAT ATTACHMENT HANDLING - UPDATED
// ================================================

// Handle Attachment Select with proper preview
function handleAttachmentSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // ✅ Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
        alert("File size must be less than 50MB");
        event.target.value = "";
        return;
    }

    // ✅ Validate file type
    const allowedTypes = [
        'image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/quicktime',
        'image/vnd.adobe.photoshop', 'application/x-photoshop'
    ];
    
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.psd')) {
        alert("Only images, videos, and PSD files are allowed");
        event.target.value = "";
        return;
    }

    // Show preview
    const preview = document.getElementById("attachmentPreview");
    if (!preview) return;

    const fileType = getFileType(file);
    
    console.log('📎 Attachment selected:', {
        name: file.name,
        type: file.type,
        size: file.size,
        detectedType: fileType
    });

    const reader = new FileReader();
    reader.onload = function (e) {
        let previewContent = '';
        
        if (fileType === 'image') {
            previewContent = `
                <img src="${e.target.result}" alt="Preview" class="preview-image">
            `;
        } else if (fileType === 'video') {
            // ✅ FIX: Video preview with poster
            previewContent = `
                <video class="preview-video" playsinline preload="metadata">
                    <source src="${e.target.result}" type="${file.type}">
                </video>
                <div class="video-preview-badge">
                    <svg viewBox="0 0 24 24" width="40" height="40">
                        <circle cx="12" cy="12" r="10" fill="rgba(0,0,0,0.6)"/>
                        <polygon points="10 8 16 12 10 16 10 8" fill="white"/>
                    </svg>
                </div>
            `;
        } else if (fileType === 'psd') {
            previewContent = `
                <div class="file-preview">
                    <svg viewBox="0 0 24 24" width="60" height="60">
                        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z" fill="#31C5F0"/>
                        <path d="M14 2v6h6" fill="#001E36" opacity="0.3"/>
                        <text x="12" y="16" text-anchor="middle" fill="white" font-size="6" font-weight="bold">PSD</text>
                    </svg>
                    <p>${file.name}</p>
                    <small>${formatFileSize(file.size)}</small>
                </div>
            `;
        }
        
        preview.innerHTML = `
            <div class="preview-attachment-wrapper">
                ${previewContent}
                <button type="button" class="remove-preview" onclick="removeAttachmentPreview()">
                    <svg viewBox="0 0 24 24" width="14" height="14">
                        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </button>
            </div>
        `;
        preview.style.display = "block";
    };
    reader.readAsDataURL(file);
}

// Get file type
function getFileType(file) {
    if (file.type.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return 'image';
    } else if (file.type.startsWith('video/') || file.name.match(/\.(mp4|webm|mov)$/i)) {
        return 'video';
    } else if (file.type.includes('photoshop') || file.name.endsWith('.psd')) {
        return 'psd';
    }
    return 'unknown';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}


// Remove Attachment Preview
function removeAttachmentPreview() {
    const attachmentInput = document.getElementById("chatAttachment");
    const preview = document.getElementById("attachmentPreview");

    if (attachmentInput) attachmentInput.value = "";
    if (preview) {
        preview.innerHTML = "";
        preview.style.display = "none";
    }
}

// Search Conversations
function searchConversations(query) {
    const conversations = document.querySelectorAll(".conversation-item");
    const searchTerm = query.toLowerCase().trim();

    conversations.forEach((conv) => {
        const userName = conv
            .querySelector(".conversation-info strong")
            .textContent.toLowerCase();
        const lastMessage = conv
            .querySelector(".conversation-info p")
            .textContent.toLowerCase();

        if (userName.includes(searchTerm) || lastMessage.includes(searchTerm)) {
            conv.style.display = "flex";
        } else {
            conv.style.display = "none";
        }
    });
}

// Scroll to Bottom
function scrollToBottom() {
    const messagesContainer = document.getElementById("messagesContainer");
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Check if scrolled to bottom
function isScrolledToBottom() {
    const messagesContainer = document.getElementById("messagesContainer");
    if (!messagesContainer) return false;

    const threshold = 100; // 100px dari bottom dianggap "at bottom"
    return (
        messagesContainer.scrollHeight -
            messagesContainer.scrollTop -
            messagesContainer.clientHeight <
        threshold
    );
}

// ✅ FIX: Order commission - admin tidak bisa order
// ✅ Order commission with slot validation
// ✅ UPDATE: Order commission dengan payment method
// Update orderCommission function dengan double validation
async function orderCommission(id) {
    // ✅ CHECK 1: Commission status global
    if (commissionGlobalStatus === 'closed') {
        alert('❌ Commissions are currently closed. Please check back later!');
        return;
    }

    const userMenuBtn = document.querySelector(".user-menu-btn");
    const isLoggedIn = userMenuBtn && userMenuBtn.classList.contains("logged-in");

    if (!isLoggedIn) {
        alert("Please login first to place an order");
        openAuthModal("login");
        return;
    }

    // Check if admin
    const roleElement = document.querySelector(".role-badge");
    const isAdmin = roleElement && roleElement.classList.contains("admin");

    if (isAdmin) {
        alert("Admin cannot place orders. Please use a client account.");
        return;
    }

    // ✅ VALIDATE: Payment method harus dipilih
    if (!selectedPaymentMethod) {
        alert("❌ Please select a payment method first!");
        return;
    }

    try {
        // Get commission details
        const response = await fetch(`/commissions/${id}`);
        const data = await response.json();

        if (!data.success) {
            alert("Failed to load commission details");
            return;
        }

        const commission = data.commission;

        // ✅ CHECK 2: Slot available (individual commission)
        if (commission.slots_available <= 0) {
            alert("❌ Sorry, this commission is fully booked!");
            loadCommissionsData(); // Refresh list
            return;
        }

        // ✅ CHECK 3: Commission active status
        if (!commission.is_active) {
            alert("❌ This commission is currently not available!");
            return;
        }

        // Close commissions overlay
        closeOverlay("commissionsOverlay");

        // Open chat overlay
        setTimeout(async () => {
            navigate("chat");

            // Wait for chat to initialize
            setTimeout(async () => {
                // Get admin ID if not yet set
                if (!currentAdminId) {
                    try {
                        const adminResponse = await fetch("/chat/admin");
                        const adminData = await adminResponse.json();
                        if (adminData.success) {
                            currentAdminId = adminData.admin.id;
                        }
                    } catch (error) {
                        console.error("Error getting admin:", error);
                    }
                }

                // Set current chat user to admin
                if (currentAdminId) {
                    currentChatUserId = currentAdminId;

                    // Send commission order dengan payment method
                    await sendCommissionOrder(commission, selectedPaymentMethod);

                    // ✅ Reset payment selection
                    resetPaymentSelection();
                    
                    // ✅ REFRESH commission list setelah order
                    setTimeout(() => {
                        loadCommissionsData();
                    }, 1000);
                }
            }, 1000);
        }, 300);
    } catch (error) {
        console.error("Error ordering commission:", error);
        alert("Failed to process order. Please try again.");
    }
}

// ✅ NEW: Send commission order with commission card
// ✅ UPDATE: Send commission order dengan media (image/video)
// ✅ UPDATE: Send commission order dengan SEMUA media (5 files)
// ✅ UPDATE: Send commission order with success feedback
async function sendCommissionOrder(commission, paymentMethod) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    if (!csrfToken || !currentChatUserId) return;

    debugLog("📦 Sending commission order with payment:", {
        commission,
        paymentMethod,
    });

    // ✅ CALCULATE PRICES
    const originalPrice = commission.price;
    const discountPercentage = commission.discount_percentage || 0;
    let finalPrice = originalPrice;
    let priceText = `💰 *Price: IDR ${formatPrice(originalPrice)}`;

    if (discountPercentage > 0) {
        finalPrice = originalPrice - (originalPrice * discountPercentage) / 100;
        priceText = `💰 *Original Price: IDR ${formatPrice(originalPrice)}
    💸 *Discount: -${discountPercentage}%
    ✨ *Final Price: IDR ${formatPrice(finalPrice)}`;
    }

    // ✅ Format message dengan payment method + discount
    const message = `🎨 **NEW COMMISSION ORDER**

    📦 *Service: ${commission.name}

    ${priceText}
    ⏱️ *Delivery Time: ${commission.delivery_time}
    💳 *Payment Method: ${paymentMethod.method}
    📋 *Payment Details: ${paymentMethod.info}

    📝 **Description:**
    ${commission.description}

    ---
    I have selected ${paymentMethod.method} for payment. Please confirm this order and I'll send the payment proof after transfer. Thank you! 🙏`;

    try {
        // ✅ 1. Kirim text message dengan commission card & payment info
        const textFormData = new FormData();
        textFormData.append("receiver_id", currentChatUserId);
        textFormData.append("message", message);
        textFormData.append("commission_id", commission.id);

        const textResponse = await fetch("/chat/send", {
            method: "POST",
            body: textFormData,
            headers: {
                "X-CSRF-TOKEN": csrfToken.content,
            },
        });

        const textData = await textResponse.json();

        if (!textData.success) {
            debugError("Failed to send order", textData.message);
            alert("❌ " + (textData.message || "Failed to place order"));
            return;
        }

        debugLog("✅ Order with payment sent successfully");

        // ✅ SHOW SUCCESS NOTIFICATION
        showToast(
            "🎉 Order Placed Successfully!",
            `Your commission slot has been reserved. Please use ${paymentMethod.method} for payment.`,
            null
        );

        // ✅ 2. Kirim SEMUA media sebagai attachment terpisah
        if (commission.images && commission.images.length > 0) {
            debugLog(`📸 Sending ${commission.images.length} media files...`);

            for (let i = 0; i < commission.images.length; i++) {
                const mediaFile = commission.images[i];
                const mediaUrl = `/storage/commissions/${mediaFile}`;

                try {
                    // Fetch media
                    const mediaResponse = await fetch(mediaUrl);
                    const mediaBlob = await mediaResponse.blob();

                    // Determine type
                    const isVideo = mediaFile.match(/\.(mp4|webm)$/i);
                    const mimeType = isVideo
                        ? mediaFile.endsWith(".webm")
                            ? "video/webm"
                            : "video/mp4"
                        : "image/jpeg";

                    // Create File
                    const file = new File([mediaBlob], mediaFile, {
                        type: mimeType,
                    });

                    // Send as attachment
                    const mediaFormData = new FormData();
                    mediaFormData.append("receiver_id", currentChatUserId);
                    mediaFormData.append("attachment", file);

                    const mediaApiResponse = await fetch("/chat/send", {
                        method: "POST",
                        body: mediaFormData,
                        headers: {
                            "X-CSRF-TOKEN": csrfToken.content,
                        },
                    });

                    const mediaData = await mediaApiResponse.json();

                    if (mediaData.success) {
                        debugLog(
                            `✅ Media ${i + 1}/${commission.images.length} sent`
                        );
                    }

                    // Small delay antar upload
                    await new Promise((resolve) => setTimeout(resolve, 300));
                } catch (error) {
                    debugError(`Failed to send media ${i + 1}`, error);
                }
            }
        }

        // Reload messages
        await loadChatMessages(currentChatUserId, "Administrator");
    } catch (error) {
        debugError("Error sending order", error);
        alert("❌ Failed to send order. Please try again.");
    }
}

// Reset payment selection
function resetPaymentSelection() {
    const paymentCheckboxes = document.querySelectorAll('input[name="payment_method"]');
    paymentCheckboxes.forEach(cb => cb.checked = false);
    selectedPaymentMethod = null;
    document.getElementById('selectedPaymentInfo').style.display = 'none';
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
    // Chat overlay click outside
    const chatOverlay = document.getElementById("chatOverlay");
    if (chatOverlay) {
        chatOverlay.addEventListener("click", function (e) {
            if (e.target === this) {
                closeChatOverlay();
            }
        });
    }

    initPaymentSelection();
});

// Make functions global
window.initializeChat = initializeChat;
window.loadConversations = loadConversations;
window.selectConversation = selectConversation;
window.sendMessage = sendMessage;
window.handleChatInputKeydown = handleChatInputKeydown;
window.handleAttachmentSelect = handleAttachmentSelect;
window.removeAttachmentPreview = removeAttachmentPreview;
window.searchConversations = searchConversations;
window.closeChatOverlay = closeChatOverlay;
window.sendCommissionOrder = sendCommissionOrder;

// ✅ UPDATE: Select Conversation with mobile support
function selectConversation(userId, userName) {
    // Mark conversation as active
    document.querySelectorAll(".conversation-item").forEach((item) => {
        item.classList.remove("active");
    });
    event.currentTarget.classList.add("active");

    // ✅ Mobile: Hide sidebar, show chat
    if (window.innerWidth <= 968) {
        const sidebar = document.getElementById("conversationsSidebar");
        const chatMain = document.getElementById("chatMain");

        if (sidebar) sidebar.classList.add("hidden");
        if (chatMain) chatMain.classList.add("active");
    }

    loadChatMessages(userId, userName);
}

// ✅ ADD: Back to conversations (mobile)
function backToConversations() {
    const sidebar = document.getElementById("conversationsSidebar");
    const chatMain = document.getElementById("chatMain");

    if (sidebar) sidebar.classList.remove("hidden");
    if (chatMain) chatMain.classList.remove("active");
}


// ✅ UPDATE: Close chat overlay - reset mobile state
function closeChatOverlay() {
    if (chatRefreshInterval) {
        clearInterval(chatRefreshInterval);
        chatRefreshInterval = null;
    }
    currentChatUserId = null;

    // ✅ Reset mobile state
    const sidebar = document.getElementById("conversationsSidebar");
    const chatMain = document.getElementById("chatMain");

    if (sidebar) sidebar.classList.remove("hidden");
    if (chatMain) chatMain.classList.remove("active");

    closeOverlay("chatOverlay");
}

// Make functions global
window.backToConversations = backToConversations;

// ================================================
// NOTIFICATION SYSTEM
// ================================================
let notificationSound = null;
let lastNotificationTime = 0;

// Initialize notification sound
function initNotificationSound() {
    notificationSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKXh8LRkGwU2jNXx0IAtBSp+zPLaizsKFGS56+mmVRIJQpzd8sNuIQUuhM/z2Ik4CBtptfDjm08MDk+j4PG2ZBwENoTE8diIOwkaaLfx5J1ODA5Rq+LyuGccBDaNzvHYijsJGWi08eSdTgwOT6Xh8bdpHQU0iM3w1YtBCw5dpubs7qdiGwcwg8jw2YtBCw5cq+bs8KlkGwc0hs3x2Is9ChJjt+vqpmUcBzSGzvHYiz0KEmS56+qmZRsHM4TO8diKPAoUZ7fr6qZmHAYygs7x2Ik6CRZJ6+PssV4bBjJ/zfHZijoJF2m98OWcTwwNTqPg8LRjHAU2jNTxz4EsBSh8y/HaizsKFGO26+mnZRsGMoTP8dqLPAoTZLjr6aZlHAY0h87x2Ik6CRdmu+zppmYcBTGAzfHaijwKFGW36+mnZRsFM4XP8dmJOgkXaLjw5Z1PDBBO');
}

// Show toast notification
function showToast(title, message, onClick = null) {
    // Check if toast already exists
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-icon">
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
        </div>
        <div class="toast-content">
            <h4>${escapeHtml(title)}</h4>
            <p>${escapeHtml(message)}</p>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <svg viewBox="0 0 24 24" width="14" height="14">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
            </svg>
        </button>
    `;

    // Add click handler
    if (onClick) {
        toast.style.cursor = 'pointer';
        toast.addEventListener('click', (e) => {
            if (!e.target.closest('.toast-close')) {
                onClick();
                toast.remove();
            }
        });
    }

    // Append to body
    document.body.appendChild(toast);

    // Play sound
    playNotificationSound();

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('slide-out');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Play notification sound
function playNotificationSound() {
    const now = Date.now();
    // Throttle: only play sound once every 2 seconds
    if (now - lastNotificationTime < 2000) return;

    lastNotificationTime = now;

    // ✅ Pakai audio element dari HTML
    const audio = document.getElementById("toastSound");
    if (audio) {
        audio.currentTime = 0;
        audio.volume = 0.3;
        audio.play().catch((err) => {
            console.log("⚠️ Sound play failed:", err);
        });
    }
}

// Update notification badge
function updateNotificationBadge(count) {
    const badge = document.getElementById('chatNotificationBadge');
    const countElement = document.getElementById('chatNotificationCount');
    
    if (!badge || !countElement) return;
    
    if (count > 0) {
        badge.style.display = 'flex';
        countElement.textContent = count > 99 ? '99+' : count;
    } else {
        badge.style.display = 'none';
    }
}

// Get unread count
async function fetchUnreadCount() {
    if (!window.chatUserId) return;
    
    try {
        const response = await fetch('/chat/unread-count');
        const data = await response.json();
        
        if (data.success) {
            updateNotificationBadge(data.unread_count);
            return data.unread_count;
        }
    } catch (error) {
        debugError('Failed to fetch unread count', error);
    }
    
    return 0;
}

// Start polling for new messages (only when chat is closed)
let notificationInterval = null;

function startNotificationPolling() {
    if (notificationInterval) return;
    
    // Check every 5 seconds
    notificationInterval = setInterval(async () => {
        const chatOverlay = document.getElementById('chatOverlay');
        const isChatOpen = chatOverlay && chatOverlay.style.display !== 'none';
        
        // Only check if chat is closed
        if (!isChatOpen) {
            const unreadCount = await fetchUnreadCount();
            
            // Show toast for new messages
            if (unreadCount > 0) {
                const lastCount = parseInt(localStorage.getItem('lastUnreadCount') || '0');
                
                if (unreadCount > lastCount) {
                    showToast(
                        'New Message',
                        `You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`,
                        () => navigate('chat')
                    );
                }
                
                localStorage.setItem('lastUnreadCount', unreadCount);
            }
        }
    }, 5000);
}

function stopNotificationPolling() {
    if (notificationInterval) {
        clearInterval(notificationInterval);
        notificationInterval = null;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // ... existing code ...

    // ✅ Initialize notifications
    if (window.chatUserId) {
        fetchUnreadCount(); // Initial count
        startNotificationPolling(); // Start polling
    }

    // ... rest of code ...
});

// ================================================
// REVIEW SYSTEM - CHECK USER STATUS
// ================================================
// ================================================
// REVIEW SYSTEM - CHECK USER STATUS
// ================================================
let userHasReviewed = false;

// ✅ Check if user has already reviewed
async function checkUserReviewStatus() {
    if (!window.chatUserId || window.chatUserRole !== 'client') {
        console.log('ℹ️ User not client or not logged in');
        return;
    }

    try {
        const response = await fetch('/reviews');
        const data = await response.json();
        
        if (data.success) {
            // Check if current user has approved review
            const userReview = data.reviews.data.find(r => r.user_id === window.chatUserId);
            userHasReviewed = !!userReview;
            
            console.log('✅ Review status checked:', {
                userId: window.chatUserId,
                hasReviewed: userHasReviewed
            });
            
            // Update CTA visibility
            if (typeof updateReviewCTA === 'function') {
                updateReviewCTA();
            }
        }
    } catch (error) {
        debugError('Failed to check review status', error);
    }
}

// Make function global
window.checkUserReviewStatus = checkUserReviewStatus;


// ✅ UPDATE: openReviewForm - Check before opening
function openReviewForm() {
    // Check auth
    const userMenuBtn = document.querySelector('.user-menu-btn');
    const isLoggedIn = userMenuBtn && userMenuBtn.classList.contains('logged-in');
    
    if (!isLoggedIn) {
        alert('Please login first to leave a review');
        openAuthModal('login');
        return;
    }

    const modal = document.getElementById('reviewFormModal');
    if (modal) modal.style.display = 'flex';
    initStarRatingInput();
    initCharCounter();
}

// Approve review
async function approveReview(reviewId) {
    if (!confirm('Approve this review?')) return;

    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    if (!csrfToken) return;

    try {
        const response = await fetch(`/reviews/${reviewId}/approve`, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrfToken.content,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (data.success) {
            showToast('Review Approved! ✓', 'The review is now published', null);
            loadPendingReviews(); // Reload list
        } else {
            alert(data.message || 'Failed to approve review');
        }
    } catch (error) {
        debugError('Failed to approve review', error);
        alert('Failed to approve review. Please try again.');
    }
}

// Toggle verified badge
async function toggleVerified(reviewId) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    if (!csrfToken) return;

    try {
        const response = await fetch(`/reviews/${reviewId}/toggle-verified`, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrfToken.content,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (data.success) {
            showToast('Verified Status Updated', 'Badge toggled successfully', null);
        } else {
            alert(data.message || 'Failed to update verified status');
        }
    } catch (error) {
        debugError('Failed to toggle verified', error);
        alert('Failed to update verified status. Please try again.');
    }
}

// Delete review
async function deleteReview(reviewId) {
    if (!confirm('Are you sure you want to DELETE this review? This cannot be undone!')) return;

    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    if (!csrfToken) return;

    try {
        const response = await fetch(`/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': csrfToken.content,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (data.success) {
            showToast('Review Deleted', 'The review has been removed', null);
            loadPendingReviews(); // Reload list
        } else {
            alert(data.message || 'Failed to delete review');
        }
    } catch (error) {
        debugError('Failed to delete review', error);
        alert('Failed to delete review. Please try again.');
    }
}

// Check pending reviews count (for badge)
async function checkPendingReviewsCount() {
    if (window.chatUserRole !== 'admin') return;

    try {
        const response = await fetch('/reviews/pending');
        const data = await response.json();

        if (data.success) {
            const adminBadge = document.getElementById('adminBadge');
            const adminBadgeCount = document.getElementById('adminBadgeCount');
            
            if (data.reviews.length > 0) {
                if (adminBadge) adminBadge.style.display = 'flex';
                if (adminBadgeCount) adminBadgeCount.textContent = data.reviews.length;
            } else {
                if (adminBadge) adminBadge.style.display = 'none';
            }
        }
    } catch (error) {
        debugError('Failed to check pending reviews', error);
    }
}

// Make functions global
window.approveReview = approveReview;
window.toggleVerified = toggleVerified;
window.deleteReview = deleteReview;

// ✅ UPDATE: Image upload handler with 10MB limit
// ✅ CORRECT VERSION - Use 'imagePreview' as container
// ✅ CRITICAL: Only initialize ONCE
function initImageUpload() {
    const input = document.getElementById("reviewImages");
    const preview = document.getElementById("imagePreview");

    if (!input || !preview) {
        console.log("❌ Image upload elements not found");
        return;
    }

    const newInput = input.cloneNode(true);
    input.parentNode.replaceChild(newInput, input);

    console.log("✅ Image upload initialized");

    newInput.addEventListener("change", function (e) {
        const files = Array.from(e.target.files);
        console.log("📦 Files selected:", files.length);

        // ✅ Hitung total files (existing + new)
        const currentCount = selectedImages.length + files.length;

        if (currentCount > 3) {
            alert(
                `Maximum 3 files total. Current: ${selectedImages.length}, Adding: ${files.length}`
            );
            newInput.value = "";
            return;
        }

        // ✅ Validate size & type
        const maxSize = 20 * 1024 * 1024; // 20MB
        for (let file of files) {
            if (file.size > maxSize) {
                alert(`${file.name} is too large (max 20MB)`);
                newInput.value = "";
                return;
            }

            const isImage = file.type.startsWith("image/");
            const isVideo = file.type.startsWith("video/");

            if (!isImage && !isVideo) {
                alert(`${file.name} is not a valid image or video`);
                newInput.value = "";
                return;
            }
        }

        // ✅ APPEND (jangan ganti) - ini yang penting!
        selectedImages = [...selectedImages, ...files];
        console.log("✅ Total files:", selectedImages.length);

        // ✅ JANGAN clear preview! APPEND aja
        // preview.innerHTML = ''; // ❌ HAPUS BARIS INI!

        // ✅ CRITICAL: Render hanya file baru yang ditambahkan
        const startIndex = selectedImages.length - files.length;

        const previewPromises = files.map((file, fileIndex) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                const isVideo = file.type.startsWith("video/");
                const actualIndex = startIndex + fileIndex; // ✅ Index yang benar untuk remove

                reader.onload = function (e) {
                    const div = document.createElement("div");
                    div.className = "image-preview-item";
                    div.id = `preview-item-${actualIndex}`; // ✅ Unique ID
                    div.innerHTML = `
                        ${
                            isVideo
                                ? `
                            <video src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;">
                                Your browser does not support video preview.
                            </video>
                            <div class="video-badge" style="position: absolute; top: 5px; left: 5px; background: rgba(0,0,0,0.8); color: white; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; z-index: 2;">
                                VIDEO
                            </div>
                        `
                                : `
                            <img src="${e.target.result}" alt="Preview ${
                                      actualIndex + 1
                                  }" style="width: 100%; height: 100%; object-fit: cover;">
                        `
                        }
                        <button type="button" class="image-preview-remove" onclick="removeImage(${actualIndex})">
                            <svg viewBox="0 0 24 24" width="14" height="14">
                                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                            </svg>
                        </button>
                    `;
                    preview.appendChild(div); // ✅ APPEND, bukan replace
                    resolve();
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(previewPromises).then(() => {
            console.log("✅ Preview rendered. Total:", selectedImages.length);
            newInput.value = ""; // ✅ Reset input agar bisa upload file sama 2x
        });
    });
}


function removeImage(index) {
    console.log("🗑️ Removing file at index:", index);

    selectedImages.splice(index, 1);

    const input = document.getElementById("reviewImages");
    const preview = document.getElementById("imagePreview");

    if (selectedImages.length === 0) {
        if (input) input.value = "";
        if (preview) preview.innerHTML = "";
        console.log("✅ All files removed");
        return;
    }

    // ✅ PERBAIKAN: Clear preview dan re-render dengan index yang benar
    if (preview) {
        preview.innerHTML = "";

        // ✅ Gunakan Promise.all biar urutan preview benar
        const previewPromises = selectedImages.map((file, i) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                const isVideo = file.type.startsWith("video/");

                reader.onload = function (e) {
                    const div = document.createElement("div");
                    div.className = "image-preview-item";
                    div.id = `preview-item-${i}`; // ✅ Unique ID
                    div.innerHTML = `
                        ${
                            isVideo
                                ? `
                            <video src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;">
                                Your browser does not support video preview.
                            </video>
                            <div class="video-badge" style="position: absolute; top: 5px; left: 5px; background: rgba(0,0,0,0.8); color: white; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; z-index: 2;">
                                VIDEO
                            </div>
                        `
                                : `
                            <img src="${e.target.result}" alt="Preview ${
                                      i + 1
                                  }" style="width: 100%; height: 100%; object-fit: cover;">
                        `
                        }
                        <button type="button" class="image-preview-remove" onclick="removeImage(${i})">
                            <svg viewBox="0 0 24 24" width="14" height="14">
                                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                            </svg>
                        </button>
                    `;
                    preview.appendChild(div);
                    resolve();
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(previewPromises).then(() => {
            console.log(
                "✅ Preview updated, remaining files:",
                selectedImages.length
            );
        });
    }
}

// Make removeImage global
window.removeImage = removeImage;

// ✅ CRITICAL: Initialize only ONCE when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImageUpload);
} else {
    initImageUpload();
}

// /////

// ================================================
// WORKS/PORTFOLIO SYSTEM
// ================================================

let selectedWorkImages = [];
let currentWorkId = null;

// Load works data
// Load works data
async function loadWorksData() {
    const worksGrid = document.getElementById('worksGrid');
    if (!worksGrid) return;

    try {
        worksGrid.innerHTML = `
            <div class="loading-spinner">
                <svg class="spinner" viewBox="0 0 24 24" width="40" height="40">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25"/>
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" fill="none"/>
                </svg>
                <p>Loading portfolio...</p>
            </div>
        `;

        console.log('Fetching works from /works...'); // ✅ Debug log

        const response = await fetch('/works', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        console.log('Response status:', response.status); // ✅ Debug log
        console.log('Response ok:', response.ok); // ✅ Debug log

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Works data received:', data); // ✅ Debug log

        if (data.success) {
            displayWorks(data.works);
            updateWorksStats(data.stats);
        } else {
            throw new Error(data.message || 'Failed to load works');
        }
    } catch (error) {
        console.error('Error loading works:', error); // ✅ Better error log
        
        worksGrid.innerHTML = `
            <div class="empty-works">
                <svg viewBox="0 0 24 24" width="60" height="60">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="2"/>
                </svg>
                <h3>Failed to load portfolio</h3>
                <p>${error.message}</p>
                <button onclick="loadWorksData()" style="margin-top: 15px; padding: 10px 20px; background: rgba(102, 126, 234, 0.8); border: none; border-radius: 8px; color: white; cursor: pointer;">
                    Retry
                </button>
            </div>
        `;
    }
}

// Display works
function displayWorks(works) {
    const worksGrid = document.getElementById('worksGrid');
    if (!worksGrid) return;

    if (works.length === 0) {
        worksGrid.innerHTML = `
            <div class="empty-works">
                <img src="/images/empty-portfolio.png" alt="No works" style="width: 200px; height: 200px; opacity: 0.7;">
                <h3>No works yet</h3>
                <p>Start adding your amazing artwork!</p>
            </div>
        `;
        return;
    }

    window.worksData = works; // Store globally for gallery

    worksGrid.innerHTML = works.map(work => generateWorkHTML(work)).join('');
}

// Generate work HTML
function generateWorkHTML(work) {
    const isAdmin = document.querySelector(".admin-work-controls") !== null;

    // ✅ GET FIRST MEDIA (image or video)
    const firstImage =
        work.images && work.images.length > 0 ? work.images[0] : null;
    const firstVideo =
        work.videos && work.videos.length > 0 ? work.videos[0] : null;

    const hasMultipleImages = work.images ? work.images.length > 0 : false;
    const hasVideos = work.videos ? work.videos.length > 0 : false;
    const totalMedia =
        (work.images ? work.images.length : 0) +
        (work.videos ? work.videos.length : 0);

    // ✅ PRIORITIZE IMAGE FOR THUMBNAIL, FALLBACK TO VIDEO
    const thumbnailUrl = firstImage
        ? `/storage/works/${firstImage}`
        : firstVideo
        ? `/storage/works/${firstVideo}`
        : "/images/default-commission.jpg";

    const isVideoThumbnail = !firstImage && firstVideo;

    return `
        <div class="work-item" data-category="${work.category}" data-id="${
        work.id
    }" onclick="viewWorkGallery(${work.id})">
            <div class="work-image">
                ${
                    isVideoThumbnail
                        ? `
                    <video muted style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
                        <source src="${thumbnailUrl}" type="video/mp4">
                    </video>
                `
                        : `
                    <img src="${thumbnailUrl}" 
                         alt="${escapeHtml(work.title)}" 
                         onerror="this.onerror=null; this.src='/images/default-commission.jpg';">
                `
                }
                
                <div class="work-category-badge">${work.category}</div>
                
                ${
                    hasVideos
                        ? `
                    <div class="work-video-badge">
                        <svg viewBox="0 0 24 24" width="14" height="14">
                            <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/>
                        </svg>
                    </div>
                `
                        : ""
                }
                
                ${
                    totalMedia > 1
                        ? `
                    <div class="work-images-count">
                        <svg viewBox="0 0 24 24" width="14" height="14">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                        ${totalMedia}
                    </div>
                `
                        : ""
                }
            </div>
            <div class="work-info">
                <h4>${escapeHtml(work.title)}</h4>
                ${
                    work.description
                        ? `<p class="work-description">${escapeHtml(
                              work.description
                          )}</p>`
                        : ""
                }
                <div class="work-meta">
                    ${
                        work.client_name
                            ? `
                        <div class="work-client">
                            <svg viewBox="0 0 24 24" width="14" height="14">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" fill="none"/>
                                <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/>
                            </svg>
                            ${escapeHtml(work.client_name)}
                        </div>
                    `
                            : "<div></div>"
                    }
                    ${
                        isAdmin
                            ? `
                        <div class="work-actions" onclick="event.stopPropagation()">
                            <button class="work-edit-btn" onclick="editWork(${work.id})">
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" fill="none"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" fill="none"/>
                                </svg>
                            </button>
                            <button class="work-delete-btn" onclick="deleteWork(${work.id})">
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" fill="none"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" fill="none"/>
                                </svg>
                            </button>
                        </div>
                    `
                            : ""
                    }
                </div>
            </div>
        </div>
    `;
}

// Update stats
// Update stats
function updateWorksStats(stats) {
    const totalWorksCount = document.getElementById('totalWorksCount');
    const happyClientsCount = document.getElementById('happyClientsCount');
    const avgRatingCount = document.getElementById('avgRatingCount');

    if (totalWorksCount) totalWorksCount.textContent = stats.total_works || 0;
    if (happyClientsCount) happyClientsCount.textContent = stats.happy_clients || 0;
    
    // ✅ Update rating with real value from reviews
    if (avgRatingCount) {
        avgRatingCount.textContent = stats.avg_rating || '0';
    }
    
    // ✅ BONUS: Update rating with stars visualization
    const avgRatingStars = document.getElementById('avgRatingStars');
    if (avgRatingStars) {
        const rating = parseFloat(stats.avg_rating || 0);
        avgRatingStars.innerHTML = generateStarsHTML(Math.round(rating));
    }
}

// Filter works
function filterWorks(category, event) {
    const filterBtns = document.querySelectorAll(
        ".portfolio-filter .filter-btn"
    );
    const workItems = document.querySelectorAll(".work-item");
    const worksGrid = document.getElementById("worksGrid");

    // Update active button
    filterBtns.forEach((btn) => btn.classList.remove("active"));
    if (event && event.target) {
        event.target.classList.add("active");
    }

    // ✅ Hapus empty state dulu kalau ada
    const emptyState = worksGrid.querySelector(".empty-works");
    if (emptyState) {
        emptyState.remove();
    }

    // Filter works
    let visibleCount = 0;
    workItems.forEach((item) => {
        const itemCategory = item.dataset.category;
        if (category === "all" || itemCategory === category) {
            item.classList.remove("hidden");
            visibleCount++;
        } else {
            item.classList.add("hidden");
        }
    });

    // ✅ SHOW EMPTY STATE kalau gak ada yang visible
    if (visibleCount === 0) {
        const categoryName =
            event && event.target ? event.target.textContent : category;

        const emptyDiv = document.createElement("div");
        emptyDiv.className = "empty-works";
        emptyDiv.innerHTML = `
            <img src="/images/empty-portfolio.png" alt="No works" style="width: 200px; height: 200px; opacity: 0.6;">
            <h3>No ${categoryName} Yet</h3>
            <p>This category is empty. Check back later for amazing artworks!</p>
        `;
        worksGrid.appendChild(emptyDiv);
    }
}


// Open work form
// PERBAIKAN: Function openWorkForm yang lebih robust
// ✅ YANG BARU
// ✅ FIX: Open work form dengan reset state yang benar
function openWorkForm(workId = null) {
    const modal = document.getElementById("workFormModal");
    const form = document.getElementById("workForm");

    if (!modal || !form) {
        console.error("Modal or form not found");
        return;
    }

    // ✅ RESET GLOBAL VARIABLES - INI YANG PENTING!
    selectedWorkMedia = []; // Reset media yang dipilih
    currentWorkId = workId;

    // Reset form
    form.reset();

    // Reset preview
    const preview = document.getElementById("workMediaPreview");
    if (preview) preview.innerHTML = "";

    // Reset file input
    const fileInput = document.getElementById("workMediaFiles");
    if (fileInput) {
        fileInput.value = ""; // Clear input file
        // ✅ HAPUS ATTRIBUTE REQUIRED SAAT EDIT (karena sudah ada file existing)
        if (workId) {
            fileInput.removeAttribute("required");
        } else {
            fileInput.setAttribute("required", "required");
        }
    }

    // Reset character counter
    const charCount = document.getElementById("workDescCharCount");
    if (charCount) charCount.textContent = "0";

    // Set UI based on mode
    const title = document.getElementById("workFormTitle");
    const submitText = document.getElementById("workSubmitText");

    if (workId) {
        // EDIT MODE
        if (title) title.textContent = "Edit Work";
        if (submitText) submitText.textContent = "Update Work";

        // Set hidden field value
        const workIdField = document.getElementById("workId");
        if (workIdField) workIdField.value = workId;

        // Load work data
        loadWorkData(workId);
    } else {
        // ✅ ADD MODE - PASTIKAN SEMUA RESET
        if (title) title.textContent = "Add New Work";
        if (submitText) submitText.textContent = "Add to Portfolio";

        // Clear hidden field
        const workIdField = document.getElementById("workId");
        if (workIdField) workIdField.value = "";

        // Reset media counter
        updateMediaCounter();
    }

    // Show modal
    modal.style.display = "flex";
    
    console.log('✅ Work form opened:', {
        mode: workId ? 'edit' : 'add',
        selectedWorkMedia: selectedWorkMedia.length,
        currentWorkId: currentWorkId
    });
}

// Close work form
// PERBAIKAN: Reset form state dengan benar
// ✅ YANG BARU (fixed)
// ✅ FIX: Close work form dengan reset lengkap
function closeWorkForm() {
    const modal = document.getElementById('workFormModal');
    const form = document.getElementById('workForm');
    
    if (!modal || !form) return;

    modal.style.animation = 'fadeOut 0.3s forwards';
    
    setTimeout(() => {
        // 1. Reset modal display
        modal.style.display = 'none';
        modal.style.animation = 'fadeIn 0.3s forwards';
        
        // 2. Reset global variables - INI PENTING!
        currentWorkId = null;
        selectedWorkMedia = []; // ✅ RESET MEDIA
        
        // 3. Reset form
        form.reset();
        
        // 4. Reset hidden field
        const workIdField = document.getElementById('workId');
        if (workIdField) workIdField.value = '';
        
        // 5. Reset image preview
        const preview = document.getElementById('workMediaPreview');
        if (preview) preview.innerHTML = '';
        
        // 6. Reset file input
        const fileInput = document.getElementById('workMediaFiles');
        if (fileInput) {
            fileInput.value = '';
            fileInput.removeAttribute('required'); // Reset required attribute
        }
        
        // 7. Reset character counter
        const charCount = document.getElementById('workDescCharCount');
        if (charCount) charCount.textContent = '0';
        
        console.log('✅ Work form fully reset');
    }, 300);
}

// Load work data for editing
// Load work data for editing - FIXED VERSION
// ✅ FIX: Load work data dengan tombol remove untuk existing files
async function loadWorkData(id) {
    try {
        console.log('Loading work data for edit:', id);
        
        const response = await fetch(`/works/${id}`);
        const data = await response.json();

        console.log('Work data response:', data);

        if (data.success) {
            const work = data.work;
            
            // ✅ STORE EXISTING FILES DATA GLOBALLY
            window.existingWorkFiles = {
                images: work.images || [],
                videos: work.videos || []
            };

            console.log("✅ Existing files stored:", window.existingWorkFiles);
            
            // SET FORM VALUES
            document.getElementById("workId").value = work.id;
            document.getElementById("workTitle").value = work.title;
            document.getElementById("workDescription").value = work.description || "";
            document.getElementById("workCategory").value = work.category;
            document.getElementById("workClient").value = work.client_name || "";

            // Update character count
            const charCount = document.getElementById("workDescCharCount");
            if (charCount) charCount.textContent = (work.description || "").length;

            // ✅ DISPLAY EXISTING MEDIA DENGAN TOMBOL REMOVE
            const preview = document.getElementById("workMediaPreview");
            if (preview) {
                preview.innerHTML = '';
                
                let mediaIndex = 0;
                
                // Display existing images dengan remove button
                if (work.images && work.images.length > 0) {
                    work.images.forEach((img, index) => {
                        mediaIndex++;
                        const mediaItem = document.createElement('div');
                        mediaItem.className = 'media-preview-item existing-file';
                        mediaItem.innerHTML = `
                            <img src="/storage/works/${img}" alt="Current ${mediaIndex}" style="max-width: 180px; max-height: 120px; border-radius: 8px; object-fit: cover;">
                            <div class="media-type-badge image-badge">
                                <svg viewBox="0 0 24 24" width="12" height="12">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="1" fill="none"/>
                                </svg>
                                IMAGE
                            </div>
                            <div class="current-file-badge">
                                <svg viewBox="0 0 24 24" width="12" height="12">
                                    <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" fill="none"/>
                                </svg>
                                Existing
                            </div>
                            <button type="button" class="remove-existing-file" onclick="removeExistingFile('image', '${img}')" title="Remove this file">
                                <svg viewBox="0 0 24 24" width="14" height="14">
                                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                                </svg>
                            </button>
                            <div class="media-info">
                                <span class="media-name">${img}</span>
                                <span class="media-size">Existing File</span>
                                <span class="media-number">File ${mediaIndex}</span>
                            </div>
                        `;
                        preview.appendChild(mediaItem);
                    });
                }

                // Display existing videos dengan remove button
                if (work.videos && work.videos.length > 0) {
                    work.videos.forEach((video, index) => {
                        mediaIndex++;
                        const mediaItem = document.createElement('div');
                        mediaItem.className = 'media-preview-item existing-file';
                        mediaItem.innerHTML = `
                            <video controls style="max-width: 180px; max-height: 120px; border-radius: 8px; background: #000;">
                                <source src="/storage/works/${video}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                            <div class="media-type-badge video-badge">
                                <svg viewBox="0 0 24 24" width="12" height="12">
                                    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/>
                                </svg>
                                VIDEO
                            </div>
                            <div class="current-file-badge">
                                <svg viewBox="0 0 24 24" width="12" height="12">
                                    <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" fill="none"/>
                                </svg>
                                Existing
                            </div>
                            <button type="button" class="remove-existing-file" onclick="removeExistingFile('video', '${video}')" title="Remove this file">
                                <svg viewBox="0 0 24 24" width="14" height="14">
                                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                                </svg>
                            </button>
                            <div class="media-info">
                                <span class="media-name">${video}</span>
                                <span class="media-size">Existing File</span>
                                <span class="media-number">File ${mediaIndex}</span>
                            </div>
                        `;
                        preview.appendChild(mediaItem);
                    });
                }
            }

            // Update media counter
            updateMediaCounterForEdit(work);

            console.log('✅ Work data loaded successfully');

        } else {
            throw new Error(data.message || 'Failed to load work data');
        }
    } catch (error) {
        console.error("❌ Error loading work:", error);
        alert("Failed to load work data: " + error.message);
    }
}

// ✅ NEW: Remove existing file dari data work
function removeExistingFile(type, filename) {
    if (!confirm(`Are you sure you want to remove ${filename}? This file will be deleted from the server.`)) {
        return;
    }

    if (!window.existingWorkFiles) {
        window.existingWorkFiles = { images: [], videos: [] };
    }

    // Remove dari array yang sesuai
    if (type === 'image') {
        window.existingWorkFiles.images = window.existingWorkFiles.images.filter(img => img !== filename);
    } else if (type === 'video') {
        window.existingWorkFiles.videos = window.existingWorkFiles.videos.filter(vid => vid !== filename);
    }

    // Remove dari preview UI
    const previewItems = document.querySelectorAll('.media-preview-item.existing-file');
    previewItems.forEach(item => {
        const fileNameElement = item.querySelector('.media-name');
        if (fileNameElement && fileNameElement.textContent === filename) {
            item.remove();
        }
    });

    // Update counter
    updateMediaCounter();
    
    console.log('🗑️ Removed existing file:', { type, filename, remaining: window.existingWorkFiles });
}

// Helper function untuk update counter saat edit
function updateMediaCounterForEdit(work) {
    const mediaCount = document.getElementById('mediaCount');
    const imageCount = document.getElementById('imageCount');
    const videoCount = document.getElementById('videoCount');
    
    if (mediaCount && imageCount && videoCount) {
        const totalImages = work.images ? work.images.length : 0;
        const totalVideos = work.videos ? work.videos.length : 0;
        const totalMedia = totalImages + totalVideos;
        
        mediaCount.textContent = totalMedia;
        imageCount.textContent = totalImages;
        videoCount.textContent = totalVideos;
        
        // Remove required attribute when editing (since we have existing files)
        const fileInput = document.getElementById('workMediaFiles');
        if (fileInput && totalMedia > 0) {
            fileInput.removeAttribute('required');
        }
    }
}

// Handle work images upload
function handleWorkImagesUpload(event) {
    const files = Array.from(event.target.files);

    if (selectedWorkImages.length + files.length > 5) {
        alert('Maximum 5 images allowed');
        event.target.value = '';
        return;
    }

    files.forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
            alert(`${file.name} is too large. Maximum 10MB per image.`);
            return;
        }

        selectedWorkImages.push(file);
    });

    refreshWorkImagesPreview();
}

// Refresh work images preview
function refreshWorkImagesPreview() {
    const container = document.getElementById('workImagesPreview');
    if (!container) return;

    container.innerHTML = '';

    selectedWorkImages.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'image-preview-item';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="Preview ${index + 1}">
                <button type="button" class="image-preview-remove" onclick="removeWorkImage(${index})">
                    <svg viewBox="0 0 24 24" width="14" height="14">
                        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </button>
                <span class="image-number">${index + 1}</span>
            `;
            container.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    });
}

// Remove work image
function removeWorkImage(index) {
    selectedWorkImages.splice(index, 1);
    refreshWorkImagesPreview();

    const fileInput = document.getElementById('workImages');
    if (fileInput) fileInput.value = '';
}

// Init description char counter
function initWorkDescCharCounter() {
    const textarea = document.getElementById('workDescription');
    const charCount = document.getElementById('workDescCharCount');

    if (textarea && charCount) {
        textarea.addEventListener('input', function() {
            charCount.textContent = this.value.length;

            if (this.value.length > 450) {
                charCount.style.color = '#f44336';
            } else if (this.value.length > 400) {
                charCount.style.color = '#FF9800';
            } else {
                charCount.style.color = 'rgba(255, 255, 255, 0.5)';
            }
        });
    }
}

// Submit work form
// Update function initWorkForm untuk debug
// ✅ FIX: Form submission yang benar - kirim existing + new files
// ✅ FIX: Form submission dengan data existing yang benar
// ✅ PAKAI INI - Versi baru yang KIRIM existing files
function initWorkForm() {
    const form = document.getElementById("workForm");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const csrfToken = document.querySelector('meta[name="csrf-token"]');
        if (!csrfToken) {
            console.error('CSRF token not found');
            alert('Security token missing. Please refresh the page.');
            return;
        }

        const formData = new FormData(this);

        const workIdField = document.getElementById("workId");
        const workId = workIdField ? workIdField.value : null;

        console.log('📤 Form submission started:', {
            mode: workId ? 'edit' : 'add',
            selectedWorkMedia: selectedWorkMedia.length,
            existingWorkFiles: window.existingWorkFiles || 'none'
        });

        // Remove default files
        formData.delete("media_files[]");
        formData.delete("existing_images[]");
        formData.delete("existing_videos[]");
        formData.delete("removed_images[]");
        formData.delete("removed_videos[]");

        // ✅ KIRIM EXISTING FILES YANG MASIH ADA (EDIT MODE)
        if (workId && window.existingWorkFiles) {
            // Kirim existing images sebagai array
            if (window.existingWorkFiles.images && window.existingWorkFiles.images.length > 0) {
                window.existingWorkFiles.images.forEach(img => {
                    formData.append("existing_images[]", img);
                });
            }
            
            // Kirim existing videos sebagai array  
            if (window.existingWorkFiles.videos && window.existingWorkFiles.videos.length > 0) {
                window.existingWorkFiles.videos.forEach(vid => {
                    formData.append("existing_videos[]", vid);
                });
            }

            console.log('✅ Sending existing files:', {
                images: window.existingWorkFiles.images,
                videos: window.existingWorkFiles.videos
            });
        }

        // ✅ KIRIM NEW FILES
        if (selectedWorkMedia && selectedWorkMedia.length > 0) {
            selectedWorkMedia.forEach((file) => {
                formData.append("media_files[]", file);
            });
            
            console.log('✅ Sending new files:', selectedWorkMedia.map(f => f.name));
        }

        // ✅ KIRIM REMOVED FILES (jika ada)
        if (workId) {
            const works = window.worksData || [];
            const originalWork = works.find(w => w.id === parseInt(workId));
            
            if (originalWork && window.existingWorkFiles) {
                const removedImages = (originalWork.images || []).filter(img => 
                    !window.existingWorkFiles.images.includes(img)
                );
                const removedVideos = (originalWork.videos || []).filter(vid => 
                    !window.existingWorkFiles.videos.includes(vid)
                );
                
                removedImages.forEach(img => formData.append("removed_images[]", img));
                removedVideos.forEach(vid => formData.append("removed_videos[]", vid));
                
                console.log('✅ Sending removed files:', {
                    removedImages: removedImages,
                    removedVideos: removedVideos
                });
            }
        }

        // Log final form data
        console.log('📦 Final form data entries:');
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(key + ': [File] ' + value.name + ' (' + value.size + ' bytes)');
            } else {
                console.log(key + ': ' + value);
            }
        }

        const submitBtn = this.querySelector(".auth-submit-btn");
        if (!submitBtn) return;

        const originalHTML = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="spinner" viewBox="0 0 24 24" width="20" height="20">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25"/>
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" fill="none"/>
            </svg>
            ${workId ? "Updating..." : "Creating..."}
        `;

        try {
            const url = workId ? `/works/${workId}` : "/works";
            const method = "POST";

            console.log('Submitting to:', url, 'Method:', method);

            if (workId) {
                formData.append("_method", "PUT");
            }

            const response = await fetch(url, {
                method: method,
                body: formData,
                headers: {
                    "X-CSRF-TOKEN": csrfToken.content,
                },
            });

            console.log('Response status:', response.status);
            
            const data = await response.json();
            console.log('Response data:', data);

            if (data.success) {
                console.log('✅ Work saved successfully');
                submitBtn.innerHTML = `<span>✓ Success!</span>`;
                submitBtn.style.background = "linear-gradient(135deg, #4CAF50, #45a049)";

                setTimeout(() => {
                    closeWorkForm();
                    loadWorksData();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.style.background = "";
                }, 1000);
            } else {
                console.error('❌ Server error:', data);
                let errorMessage = data.message || "Failed to save work";
                
                if (data.errors) {
                    const errorDetails = Object.values(data.errors).flat().join(', ');
                    errorMessage += ': ' + errorDetails;
                }
                
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error("❌ Fetch error:", error);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
            
            let errorMessage = error.message || "Failed to save work. Please try again.";
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMessage = "Network error. Please check your connection and try again.";
            }
            
            alert(errorMessage);
        }
    });
}

// Edit work
function editWork(id) {
    event.stopPropagation();
    openWorkForm(id);
}

// Delete work
async function deleteWork(id) {
    event.stopPropagation();

    if (!confirm('Are you sure you want to delete this work?')) {
        return;
    }

    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    if (!csrfToken) return;

    try {
        const response = await fetch(`/works/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': csrfToken.content,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            loadWorksData();
        } else {
            throw new Error(data.message || 'Failed to delete work');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Failed to delete work. Please try again.');
    }
}

// View work gallery
// View work gallery - FIXED VERSION
// View work gallery - FIXED VERSION
// ✅ FIXED: View work gallery dengan support video
// ✅ FIXED: View work gallery - COMBINE images + videos
function viewWorkGallery(workId) {
    const works = window.worksData || [];
    const work = works.find(w => w.id === workId);

    if (!work) {
        console.error('Work not found:', workId);
        return;
    }

    // ✅ COMBINE images + videos into single array
    const allMedia = [
        ...(work.images || []),
        ...(work.videos || [])
    ];

    if (allMedia.length === 0) {
        console.error('No media found for work:', workId);
        return;
    }

    // ✅ SET WORKS GALLERY dengan semua media
    worksGalleryImages = allMedia;
    worksGalleryIndex = 0;
    activeGalleryType = 'works';

    console.log('🎨 Works Gallery FIXED:', {
        workId: workId,
        totalMedia: allMedia.length,
        images: work.images ? work.images.length : 0,
        videos: work.videos ? work.videos.length : 0,
        allFiles: allMedia
    });

    showGalleryLightbox();
}

// Show work gallery lightbox (reuse commission gallery with modification)


function handleGalleryImageError(imgElement) {
    console.error("Gallery image failed to load:", imgElement.src);
    imgElement.onerror = null;
    imgElement.src = "/images/default-commission.jpg";

    // Untuk thumbnails, sembunyikan jika error
    if (imgElement.classList.contains("gallery-thumb")) {
        imgElement.style.opacity = "0.3";
    }
}


// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...

    // Works overlay click outside
    const worksOverlay = document.getElementById('worksOverlay');
    if (worksOverlay) {
        worksOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeOverlay('worksOverlay');
            }
        });
    }

    // Work form modal click outside
    const workFormModal = document.getElementById('workFormModal');
    if (workFormModal) {
        workFormModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeWorkForm();
            }
        });
    }

     initWorkDescCharCounter();

    // Init work form
    initWorkForm();
});

// Make functions global
window.loadWorksData = loadWorksData;
window.filterWorks = filterWorks;
window.openWorkForm = openWorkForm;
window.closeWorkForm = closeWorkForm;
window.editWork = editWork;
window.deleteWork = deleteWork;
window.viewWorkGallery = viewWorkGallery;
window.handleWorkImagesUpload = handleWorkImagesUpload;
window.removeWorkImage = removeWorkImage;

let selectedWorkMedia = [];

// Handle mixed media upload (images + videos)
// ✅ FIX: Handle work media upload dengan logic edit yang benar
// ✅ FIX: Handle work media upload dengan existing files removal
function handleWorkMediaUpload(event) {
    const files = Array.from(event.target.files);
    
    // ✅ HITUNG TOTAL: Remaining existing files + New files
    let remainingExistingFilesCount = 0;
    if (currentWorkId && window.existingWorkFiles) {
        remainingExistingFilesCount = (window.existingWorkFiles.images ? window.existingWorkFiles.images.length : 0) + 
                                    (window.existingWorkFiles.videos ? window.existingWorkFiles.videos.length : 0);
    }
    
    const totalAfterUpload = remainingExistingFilesCount + selectedWorkMedia.length + files.length;
    
    if (totalAfterUpload > 5) {
        const availableSlots = 5 - (remainingExistingFilesCount + selectedWorkMedia.length);
        alert(`Maximum 5 files total. You can only add ${availableSlots} more files.`);
        event.target.value = "";
        return;
    }

    files.forEach((file) => {
        // Validate file size (50MB)
        if (file.size > 50 * 1024 * 1024) {
            alert(`${file.name} is too large. Maximum 50MB per file.`);
            return;
        }

        // Validate file type
        const validImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
        const validVideoTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];

        if (!validImageTypes.includes(file.type) && !validVideoTypes.includes(file.type)) {
            alert(`${file.name} is not a valid file. Please select images or videos.`);
            return;
        }

        selectedWorkMedia.push(file);
    });

    refreshWorkMediaPreview();
    updateMediaCounter();
    
    console.log('📦 Media upload:', {
        mode: currentWorkId ? 'edit' : 'add',
        remainingExistingFiles: remainingExistingFilesCount,
        newFiles: files.length,
        selectedMedia: selectedWorkMedia.length,
        totalAfter: totalAfterUpload
    });
}

// Refresh mixed media preview
// ✅ VERSI BARU - Render existing + new files
function refreshWorkMediaPreview() {
    const container = document.getElementById("workMediaPreview");
    if (!container) return;

    container.innerHTML = ""; // Clear dulu

    let mediaIndex = 0;

    // ✅ 1. RENDER EXISTING FILES DULU (jika EDIT mode)
    if (currentWorkId && window.existingWorkFiles) {
        // Render existing images
        if (window.existingWorkFiles.images && window.existingWorkFiles.images.length > 0) {
            window.existingWorkFiles.images.forEach((img, index) => {
                mediaIndex++;
                const mediaItem = document.createElement('div');
                mediaItem.className = 'media-preview-item existing-file';
                mediaItem.innerHTML = `
                    <img src="/storage/works/${img}" alt="Current ${mediaIndex}" style="max-width: 180px; max-height: 120px; border-radius: 8px; object-fit: cover;">
                    <div class="media-type-badge image-badge">
                        <svg viewBox="0 0 24 24" width="12" height="12">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="1" fill="none"/>
                        </svg>
                        IMAGE
                    </div>
                    <div class="current-file-badge">
                        <svg viewBox="0 0 24 24" width="12" height="12">
                            <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                        Existing
                    </div>
                    <button type="button" class="remove-existing-file" onclick="removeExistingFile('image', '${img}')" title="Remove this file">
                        <svg viewBox="0 0 24 24" width="14" height="14">
                            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>
                    <div class="media-info">
                        <span class="media-name">${img}</span>
                        <span class="media-size">Existing File</span>
                        <span class="media-number">File ${mediaIndex}</span>
                    </div>
                `;
                container.appendChild(mediaItem);
            });
        }

        // Render existing videos
        if (window.existingWorkFiles.videos && window.existingWorkFiles.videos.length > 0) {
            window.existingWorkFiles.videos.forEach((video, index) => {
                mediaIndex++;
                const mediaItem = document.createElement('div');
                mediaItem.className = 'media-preview-item existing-file';
                mediaItem.innerHTML = `
                    <video controls style="max-width: 180px; max-height: 120px; border-radius: 8px; background: #000;">
                        <source src="/storage/works/${video}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <div class="media-type-badge video-badge">
                        <svg viewBox="0 0 24 24" width="12" height="12">
                            <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/>
                        </svg>
                        VIDEO
                    </div>
                    <div class="current-file-badge">
                        <svg viewBox="0 0 24 24" width="12" height="12">
                            <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                        Existing
                    </div>
                    <button type="button" class="remove-existing-file" onclick="removeExistingFile('video', '${video}')" title="Remove this file">
                        <svg viewBox="0 0 24 24" width="14" height="14">
                            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>
                    <div class="media-info">
                        <span class="media-name">${video}</span>
                        <span class="media-size">Existing File</span>
                        <span class="media-number">File ${mediaIndex}</span>
                    </div>
                `;
                container.appendChild(mediaItem);
            });
        }
    }

    // ✅ 2. RENDER NEW FILES (selectedWorkMedia)
    selectedWorkMedia.forEach((file, index) => {
        mediaIndex++;
        const isVideo = file.type.startsWith("video/");
        const fileUrl = URL.createObjectURL(file);

        const previewItem = document.createElement("div");
        previewItem.className = "media-preview-item new-file";
        previewItem.innerHTML = `
            ${
                isVideo
                    ? `
                <video controls style="max-width: 180px; max-height: 120px; border-radius: 8px; background: #000;">
                    <source src="${fileUrl}" type="${file.type}">
                    Your browser does not support the video tag.
                </video>
                <div class="media-type-badge video-badge">
                    <svg viewBox="0 0 24 24" width="12" height="12">
                        <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/>
                    </svg>
                    VIDEO
                </div>
            `
                    : `
                <img src="${fileUrl}" alt="Preview ${
                          mediaIndex
                      }" style="max-width: 180px; max-height: 120px; border-radius: 8px; object-fit: cover;">
                <div class="media-type-badge image-badge">
                    <svg viewBox="0 0 24 24" width="12" height="12">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="1" fill="none"/>
                    </svg>
                    IMAGE
                </div>
            `
            }
            <div class="new-file-badge" style="color: green;">
                <svg viewBox="0 0 24 24" width="12" height="12">
                    <path d="M12 5v14M5 12h14" stroke="green" stroke-width="2"/>
                </svg>
                NEW
            </div>
            <div class="media-info">
                <span class="media-name">${file.name}</span>
                <span class="media-size">${(file.size / (1024 * 1024)).toFixed(
                    2
                )} MB</span>
                <span class="media-number">File ${mediaIndex}</span>
                <button type="button" class="media-preview-remove" onclick="removeWorkMedia(${index})">
                    <svg viewBox="0 0 24 24" width="14" height="14">
                        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </button>
            </div>
        `;
        container.appendChild(previewItem);
    });

    console.log('✅ Preview refreshed:', {
        existingFiles: mediaIndex - selectedWorkMedia.length,
        newFiles: selectedWorkMedia.length,
        total: mediaIndex
    });
}

// Update media counter
// ✅ FIX: Update media counter dengan info existing files
// ✅ FIX: Update media counter dengan remaining existing files
// ✅ FIX: Update media counter untuk edit mode
function updateMediaCounter() {
    const mediaCount = document.getElementById("mediaCount");
    const imageCount = document.getElementById("imageCount");
    const videoCount = document.getElementById("videoCount");

    if (mediaCount && imageCount && videoCount) {
        // Hitung dari selected media (new files)
        const newImages = selectedWorkMedia.filter((file) =>
            file.type.startsWith("image/")
        ).length;
        const newVideos = selectedWorkMedia.filter((file) =>
            file.type.startsWith("video/")
        ).length;
        const newTotal = selectedWorkMedia.length;

        // Hitung REMAINING existing files
        let remainingExistingImages = 0;
        let remainingExistingVideos = 0;

        if (currentWorkId && window.existingWorkFiles) {
            remainingExistingImages = window.existingWorkFiles.images
                ? window.existingWorkFiles.images.length
                : 0;
            remainingExistingVideos = window.existingWorkFiles.videos
                ? window.existingWorkFiles.videos.length
                : 0;
        }

        const totalImages = remainingExistingImages + newImages;
        const totalVideos = remainingExistingVideos + newVideos;
        const totalAll =
            remainingExistingImages + remainingExistingVideos + newTotal;

        // Update display
        if (currentWorkId) {
            mediaCount.textContent = `${totalAll} total (${
                remainingExistingImages + remainingExistingVideos
            } existing + ${newTotal} new)`;
            imageCount.textContent = `${totalImages} images`;
            videoCount.textContent = `${totalVideos} videos`;
        } else {
            mediaCount.textContent = `${newTotal} files selected`;
            imageCount.textContent = `${newImages} images`;
            videoCount.textContent = `${newVideos} videos`;
        }

        // Warning colors
        if (totalAll >= 5) {
            mediaCount.style.color = "#f44336";
        } else if (totalAll >= 4) {
            mediaCount.style.color = "#FF9800";
        } else {
            mediaCount.style.color = "rgba(255,255,255,0.5)";
        }
    }
}

// Remove specific media file
function removeWorkMedia(index) {
    selectedWorkMedia.splice(index, 1);
    refreshWorkMediaPreview();
    updateMediaCounter();

    const fileInput = document.getElementById("workMediaFiles");
    if (fileInput) fileInput.value = "";
}

// ========================================
// 💬 CHAT BACKGROUND
// ========================================

// Change background dynamically based on time, theme, or user preference
function setChatBackground(imageUrl) {
    const chatMain = document.getElementById('chatMain');
    if (!chatMain) return; // 👈 TAMBAH INI untuk cek element ada atau tidak
    
    chatMain.style.backgroundImage = `url('${imageUrl}')`;
    chatMain.style.backgroundSize = 'cover';
    chatMain.style.backgroundPosition = 'center';
}

// Example: Change based on time of day
function setTimeBasedBackground() {
    const chatMain = document.getElementById('chatMain');
    if (!chatMain) return; // 👈 TAMBAH INI juga
    
    const hour = new Date().getHours();
    let bgImage;
    
    if (hour >= 6 && hour < 12) {
        bgImage = "/images/bg-chat.png";
    } else if (hour >= 12 && hour < 18) {
        bgImage = "/images/bg-chat.png";
    } else {
        bgImage = "/images/bg-chat.png";
    }
    
    setChatBackground(bgImage);
}

// Call on page load - hanya jalan kalau element ada
document.addEventListener('DOMContentLoaded', function() {
    const chatMain = document.getElementById('chatMain');
    if (chatMain) {
        setTimeBasedBackground();
    }
});
 
function switchAuthModal(target) {
    // Close all modals
    document.querySelectorAll('.auth-modal').forEach(modal => {
        modal.style.display = 'none';
    });
    
    // Open target modal
    if (target === 'login') {
        document.getElementById('loginModal').style.display = 'flex';
    } else if (target === 'register') {
        document.getElementById('registerModal').style.display = 'flex';
    } else if (target === 'forgotPassword') {
        document.getElementById('forgotPasswordModal').style.display = 'flex';
    }
}

// ========================================
// 🔐 FORGOT PASSWORD HANDLER (PALING BAWAH!)
// ========================================
window.addEventListener('load', function() {
    console.log('🚀 Window loaded, checking forgot form...');
    
    const forgotForm = document.getElementById('forgotPasswordForm');
    console.log('🔍 Forgot form:', forgotForm);
    
    if (forgotForm) {
        console.log('✅ Forgot form found!');
        
        forgotForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            console.log('📧 Form submitted!');
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const buttonText = document.getElementById('forgotButtonText');
            const buttonIcon = document.getElementById('forgotButtonIcon');
            const email = document.getElementById('forgotEmail').value;
            const errorElement = document.getElementById('forgotEmailError');
            const successElement = document.getElementById('forgotSuccessMessage');
            const successText = document.getElementById('forgotSuccessText');
            
            // Clear previous messages
            errorElement.style.display = 'none';
            errorElement.textContent = '';
            successElement.style.display = 'none';
            
            // Disable button
            submitBtn.disabled = true;
            buttonText.textContent = 'Sending...';
            if (buttonIcon) buttonIcon.style.display = 'none';
            
            try {
                console.log('📤 Sending to /forgot-password with email:', email);
                
                const response = await fetch('/forgot-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ email: email })
                });
                
                console.log('📥 Response status:', response.status);
                
                const data = await response.json();
                console.log('📥 Response data:', data);
                
                if (response.ok && data.success) {
                    successText.textContent = data.message;
                    successElement.style.display = 'block';
                    
                    const toastSound = document.getElementById('toastSound');
                    if (toastSound) {
                        toastSound.play().catch(() => {});
                    }
                    
                    document.getElementById('forgotEmail').value = '';
                    
                    setTimeout(() => {
                        closeAuthModal('forgotPasswordModal');
                        successElement.style.display = 'none';
                    }, 5000);
                } else {
                    throw data;
                }
            } catch (error) {
                console.error('❌ Forgot password error:', error);
                
                let errorMessage = 'Failed to send reset link. Please try again.';
                
                if (error.errors && error.errors.email) {
                    errorMessage = error.errors.email[0];
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                errorElement.textContent = errorMessage;
                errorElement.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                buttonText.textContent = 'Send Reset Link';
                if (buttonIcon) buttonIcon.style.display = 'block';
            }
        });
    } else {
        console.log('❌ Forgot form NOT found!');
    }
});

// ================================================
// BADGE SELECTION SYSTEM
// ================================================

let selectedBadges = [];
const MAX_BADGES = 5;

// Badge configuration
const BADGE_CONFIG = {
    positive: [
        { id: 'good_communication', label: '💬 Good Communication' },
        { id: 'professional', label: '👔 Professional' },
        { id: 'fast_delivery', label: '⚡ Fast Delivery' },
        { id: 'great_quality', label: '⭐ Great Quality' },
        { id: 'creative', label: '🎨 Very Creative' },
        { id: 'friendly', label: '😊 Friendly Service' },
        { id: 'responsive', label: '📱 Responsive' },
        { id: 'detail_oriented', label: '🔍 Detail Oriented' },
    ],
    negative: [
        { id: 'poor_communication', label: '💭 Poor Communication' },
        { id: 'slow_delivery', label: '🐌 Slow Delivery' },
        { id: 'low_quality', label: '📉 Low Quality' },
        { id: 'not_creative', label: '😐 Not Creative' },
        { id: 'unprofessional', label: '❌ Unprofessional' },
        { id: 'unresponsive', label: '📵 Unresponsive' },
    ]
};

// Initialize badge selection
function initBadgeSelection() {
    console.log('✅ Badge selection initialized');
}

// Update badges based on rating
function updateBadgesByRating(rating) {
    const badgeSelector = document.getElementById('badgeSelector');
    if (!badgeSelector) return;

    // Reset selected badges
    selectedBadges = [];
    updateBadgeHiddenInput();

    // Clear container
    badgeSelector.innerHTML = '';

    // Determine badge type based on rating
    let badges = [];
    let badgeType = '';
    
    if (rating >= 4) {
        // 4-5 stars: Show positive badges
        badges = BADGE_CONFIG.positive;
        badgeType = 'positive';
    } else if (rating <= 2) {
        // 1-2 stars: Show negative badges
        badges = BADGE_CONFIG.negative;
        badgeType = 'negative';
    } else {
        // 3 stars: Show both
        badges = [...BADGE_CONFIG.positive, ...BADGE_CONFIG.negative];
        badgeType = 'mixed';
    }

    // Create badge elements
    badges.forEach(badge => {
        const badgeEl = document.createElement('div');
        badgeEl.className = `badge-item ${getBadgeClass(badge.id)}`;
        badgeEl.dataset.badgeId = badge.id;
        badgeEl.innerHTML = badge.label;
        
        badgeEl.addEventListener('click', () => toggleBadge(badge.id));
        
        badgeSelector.appendChild(badgeEl);
    });

    // Add counter
    const counter = document.createElement('div');
    counter.className = 'badge-counter';
    counter.id = 'badgeCounter';
    counter.textContent = `0 / ${MAX_BADGES} selected`;
    badgeSelector.appendChild(counter);
}

// Determine badge class (positive/negative)
function getBadgeClass(badgeId) {
    const positiveBadges = BADGE_CONFIG.positive.map((b) => b.id);
    return positiveBadges.includes(badgeId) ? 'positive' : 'negative';
}

// Toggle badge selection
function toggleBadge(badgeId) {
    const index = selectedBadges.indexOf(badgeId);
    
    if (index > -1) {
        // Remove badge
        selectedBadges.splice(index, 1);
    } else {
        // Add badge (if not max)
        if (selectedBadges.length < MAX_BADGES) {
            selectedBadges.push(badgeId);
        } else {
            alert(`Maximum ${MAX_BADGES} badges can be selected`);
            return;
        }
    }
    
    // Update UI
    updateBadgeUI();
    updateBadgeHiddenInput();
}

// Update badge UI state
function updateBadgeUI() {
    const badgeItems = document.querySelectorAll('.badge-item');
    
    badgeItems.forEach(item => {
        const badgeId = item.dataset.badgeId;
        
        if (selectedBadges.includes(badgeId)) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
        
        // Disable unselected if max reached
        if (selectedBadges.length >= MAX_BADGES && !selectedBadges.includes(badgeId)) {
            item.classList.add('disabled');
        } else {
            item.classList.remove('disabled');
        }
    });
    
    // Update counter
    const counter = document.getElementById('badgeCounter');
    if (counter) {
        counter.textContent = `${selectedBadges.length} / ${MAX_BADGES} selected`;
        
        if (selectedBadges.length >= MAX_BADGES) {
            counter.classList.add('max-reached');
        } else {
            counter.classList.remove('max-reached');
        }
    }
}

// Update hidden input with selected badges
function updateBadgeHiddenInput() {
    const hiddenInput = document.getElementById('selectedBadges');
    if (hiddenInput) {
        hiddenInput.value = JSON.stringify(selectedBadges);
    }
}

// ================================================
// UPDATE: Modify initStarRatingInput()
// ================================================
function initStarRatingInput() {
    const stars = document.querySelectorAll('.star-input');
    const ratingLabel = document.getElementById('ratingLabel');
    const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.dataset.rating);
            const ratingValue = document.getElementById('ratingValue');
            if (ratingValue) ratingValue.value = selectedRating;

            // Update visual
            stars.forEach(s => {
                if (parseInt(s.dataset.rating) <= selectedRating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });

            // Update label
            if (ratingLabel) {
                ratingLabel.textContent = ratingLabels[selectedRating];
                ratingLabel.classList.add('selected');
            }

            // ✅ UPDATE BADGES BASED ON RATING
            updateBadgesByRating(selectedRating);
        });

        // Hover effect (existing code)
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            stars.forEach(s => {
                if (parseInt(s.dataset.rating) <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });

    // Reset on mouse leave (existing code)
    const starRatingInput = document.getElementById('starRatingInput');
    if (starRatingInput) {
        starRatingInput.addEventListener('mouseleave', function() {
            stars.forEach(s => {
                if (parseInt(s.dataset.rating) <= selectedRating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    }
}

// ================================================
// UPDATE: Modify initReviewForm()
// ================================================
function initReviewForm() {
    const reviewForm = document.getElementById("reviewForm");
    if (!reviewForm) return;

    reviewForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Validate rating
        if (selectedRating === 0) {
            alert("Please select a rating");
            return;
        }

        const csrfToken = document.querySelector('meta[name="csrf-token"]');
        if (!csrfToken) return;

        const formData = new FormData(this);

        // Remove default badges input
        formData.delete("badges");

        // Add badges as array
        if (selectedBadges && selectedBadges.length > 0) {
            selectedBadges.forEach((badge) => {
                formData.append("badges[]", badge);
            });
        }

        // Add selected images
        selectedImages.forEach((file) => {
            formData.append("images[]", file);
        });

        const submitBtn = this.querySelector(".auth-submit-btn");
        if (!submitBtn) return;

        const originalHTML = submitBtn.innerHTML;

        // Show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="spinner" viewBox="0 0 24 24" width="20" height="20">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25"/>
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" fill="none"/>
            </svg>
            Submitting...
        `;

        try {
            const response = await fetch("/reviews", {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRF-TOKEN": csrfToken.content,
                },
            });

            const data = await response.json();

            if (data.success) {
                // ✅ Show success state
                submitBtn.innerHTML = "✓ Review Submitted!";
                submitBtn.style.background =
                    "linear-gradient(135deg, #4CAF50, #45a049)";

                setTimeout(() => {
                    // ✅ RESET BUTTON DULU sebelum close
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.style.background = "";

                    // Close form
                    closeReviewForm();

                    // ✅ Set flag bahwa user baru submit (pending)
                    userHasReviewed = true;

                    // ✅ Update status di localStorage untuk prevent toast spam
                    localStorage.setItem(
                        "lastReviewSubmitTime",
                        Date.now().toString()
                    );

                    // Show toast
                    showToast(
                        "Review Submitted! 🎉",
                        "Thank you! Your review will be published after admin approval.",
                        null
                    );

                    // Update CTA
                    updateReviewCTA();

                    // Force check status
                    setTimeout(() => {
                        checkReviewStatusRealtime();
                    }, 1000);
                }, 1500);
            } else {
                throw new Error(data.message || "Failed to submit review");
            }
        } catch (error) {
            console.error("Error:", error);
            alert(
                error.message || "Failed to submit review. Please try again."
            );

            // ✅ RESET button on error juga
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
            submitBtn.style.background = "";
        }
    });
}

// ================================================
// UPDATE REVIEW CTA VISIBILITY
// ================================================

/**
 * Update review CTA based on user status
 */
function updateReviewCTA() {
    const writeReviewBtn = document.getElementById('writeReviewBtn');
    const reviewCTA = document.querySelector('.review-cta');
    
    if (!writeReviewBtn && !reviewCTA) {
        console.log('ℹ️ Review CTA elements not found (user might be on different page)');
        return;
    }
    
    if (userHasReviewed) {
        // User already reviewed - hide CTA
        if (reviewCTA) reviewCTA.style.display = 'none';
        if (writeReviewBtn) writeReviewBtn.style.display = 'none';
        
        console.log('✅ User has reviewed - CTA hidden');
    } else {
        // User hasn't reviewed - show CTA
        if (reviewCTA) reviewCTA.style.display = 'block';
        if (writeReviewBtn) writeReviewBtn.style.display = 'inline-flex';
        
        console.log('ℹ️ User can review - CTA visible');
    }
}

// Make function global
window.updateReviewCTA = updateReviewCTA;

// ================================================
// UPDATE: Display badges in review HTML
// ================================================
function generateReviewHTML(review) {
    const stars = generateStarsHTML(review.rating);
    const images = review.images ? generateReviewImagesHTML(review.images) : '';
    
    const verifiedBadge = review.verified ? `
        <div class="verified-badge">
            <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" fill="#4A9EFF"/>
            </svg>
            <span>Verified Purchase</span>
        </div>
    ` : '';

    // ✅ GENERATE BADGES HTML
    let badgesHTML = '';
    if (review.badges && review.badges.length > 0) {
        badgesHTML = '<div class="review-badges">';
        review.badges.forEach(badgeId => {
            const badge = findBadgeById(badgeId);
            if (badge) {
                const badgeClass = getBadgeClass(badgeId);
                badgesHTML += `<span class="review-badge ${badgeClass}">${badge.label}</span>`;
            }
        });
        badgesHTML += '</div>';
    }

    return `
        <div class="review-item" data-rating="${review.rating}" data-images="${review.images ? 'true' : 'false'}">
            <div class="review-header">
                <div class="reviewer-avatar">
                    <img src="${review.user.avatar || '/images/profile/default-avatar.png'}" alt="${review.user.name}">
                </div>
                <div class="reviewer-info">
                    <h4>${review.user.name}</h4>
                    <div class="review-stars">${stars}</div>
                    <span class="review-date">${review.time_ago}</span>
                </div>
                ${verifiedBadge}
            </div>
            <div class="review-content">
                <p>${escapeHtml(review.comment)}</p>
                ${badgesHTML}
                ${images}
            </div>
            ${review.commission_type ? `
                <div class="review-footer">
                    <span class="review-type">${review.commission_type}</span>
                </div>
            ` : ''}
        </div>
    `;
}

// Helper function to find badge by ID
function findBadgeById(badgeId) {
    const allBadges = [...BADGE_CONFIG.positive, ...BADGE_CONFIG.negative];
    return allBadges.find(b => b.id === badgeId);
}

// Make functions global
window.initBadgeSelection = initBadgeSelection;
window.updateBadgesByRating = updateBadgesByRating;
window.toggleBadge = toggleBadge;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    initBadgeSelection();
});

// ================================================
// ADMIN PANEL - REVIEW MANAGEMENT
// ================================================

// Load pending reviews
async function loadPendingReviews() {
    const list = document.getElementById('pendingReviewsList');
    if (!list) return;

    try {
        list.innerHTML = `
            <div class="loading-spinner">
                <svg class="spinner" viewBox="0 0 24 24" width="40" height="40">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25"/>
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" fill="none"/>
                </svg>
                <p>Loading pending reviews...</p>
            </div>
        `;

        const response = await fetch('/reviews/pending');
        const data = await response.json();

        if (data.success) {
            const pendingCount = document.getElementById('pendingCount');
            const adminBadge = document.getElementById('adminBadge');
            const adminBadgeCount = document.getElementById('adminBadgeCount');
            
            if (pendingCount) pendingCount.textContent = data.reviews.length;
            
            // Update badge
            if (data.reviews.length > 0) {
                if (adminBadge) adminBadge.style.display = 'flex';
                if (adminBadgeCount) adminBadgeCount.textContent = data.reviews.length;
            } else {
                if (adminBadge) adminBadge.style.display = 'none';
            }

            if (data.reviews.length === 0) {
                list.innerHTML = `
                    <div class="empty-reviews">
                        <svg viewBox="0 0 24 24" width="60" height="60">
                            <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="none"/>
                            <polyline points="20 6 9 17 4 12" stroke="white" stroke-width="2" fill="none"/>
                        </svg>
                        <h3>All Clear! 🎉</h3>
                        <p>No pending reviews at the moment</p>
                    </div>
                `;
                return;
            }

            list.innerHTML = data.reviews.map(review => generateAdminReviewHTML(review)).join('');
        }
    } catch (error) {
        debugError('Failed to load pending reviews', error);
        list.innerHTML = `
            <div class="empty-reviews">
                <svg viewBox="0 0 24 24" width="60" height="60">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="2"/>
                </svg>
                <h3>Failed to load reviews</h3>
                <p>Please try again later</p>
            </div>
        `;
    }
}

// ✅ NEW: Generate Admin Review HTML with Badges
function generateAdminReviewHTML(review) {
    // Generate star rating display
    const starsHTML = Array.from({length: 5}, (_, i) => 
        `<span style="color:${i < review.rating ? '#FFD700' : '#444'};font-size:20px;">★</span>`
    ).join('');

    // ✅ Generate badges HTML
    let badgesHTML = '';
    if (review.badges && review.badges.length > 0) {
        badgesHTML = '<div class="admin-review-badges">';
        review.badges.forEach(badgeId => {
            const badge = findBadgeById(badgeId);
            if (badge) {
                const badgeClass = getBadgeClass(badgeId);
                badgesHTML += `<span class="review-badge ${badgeClass}">${badge.label}</span>`;
            }
        });
        badgesHTML += '</div>';
    }

    // Generate images/videos HTML
    let mediaHTML = '';
    if (review.images && review.images.length > 0) {
        mediaHTML = '<div class="review-images">';
        review.images.forEach(img => {
            const filepath = `/storage/reviews/${img}`;
            const isVideo = /\.(mp4|webm|mov)$/i.test(img);
            
            mediaHTML += isVideo ? `
                <div class="review-media-item" style="position:relative;display:inline-block;margin:5px;">
                    <video 
                        src="${filepath}" 
                        style="width:150px;height:150px;object-fit:cover;border-radius:8px;cursor:pointer;"
                        onclick="viewImage('${filepath}')">
                    </video>
                    <div style="position:absolute;top:8px;left:8px;background:rgba(0,0,0,0.8);color:white;padding:4px 8px;border-radius:4px;font-size:10px;font-weight:bold;pointer-events:none;">
                        VIDEO
                    </div>
                </div>
            ` : `
                <img src="${filepath}" alt="Review image" onclick="viewImage('${filepath}')" style="cursor:pointer;">
            `;
        });
        mediaHTML += '</div>';
    }

    return `
        <div class="admin-review-card" data-id="${review.id}">
            <div class="admin-review-header">
                <div class="reviewer-info">
                    <img src="${review.user.avatar || '/images/profile/default-avatar.png'}" alt="${escapeHtml(review.user.name)}">
                    <div>
                        <h4>${escapeHtml(review.user.name)}</h4>
                        <p>${escapeHtml(review.user.email)}</p>
                        <span class="review-date">${new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="review-rating" style="display:flex;align-items:center;gap:8px;">
                    <div style="display:flex;gap:2px;">
                        ${starsHTML}
                    </div>
                    <span style="color:#FFD700;font-size:16px;font-weight:600;">${review.rating}/5</span>
                </div>
            </div>
            
            <div class="admin-review-content">
                ${review.commission_type ? `<span class="commission-type-badge">${escapeHtml(review.commission_type)}</span>` : ''}
                <p>${escapeHtml(review.comment)}</p>
                
                ${badgesHTML}
                ${mediaHTML}
            </div>
            
            <div class="admin-review-actions">
                <button class="approve-btn" onclick="approveReview(${review.id})">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                        <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                    Approve
                </button>
                <button class="verify-btn" onclick="toggleVerified(${review.id})" title="Toggle Verified Badge">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" fill="currentColor"/>
                    </svg>
                    Verify
                </button>
                <button class="reject-btn" onclick="deleteReview(${review.id})">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                        <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" fill="none"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                    Delete
                </button>
            </div>
        </div>
    `;
}

// Make function global
window.loadPendingReviews = loadPendingReviews;
window.generateAdminReviewHTML = generateAdminReviewHTML;

// ================================================
// REAL-TIME REVIEW STATUS POLLING
// ================================================

let reviewStatusInterval = null;
let userCanReview = true;
let lastReviewStatus = {
    has_approved_review: false,
    has_pending_review: false,
    can_review: true
};

/**
 * Start polling user review status
 */
function startReviewStatusPolling() {
    // Stop existing interval if any
    if (reviewStatusInterval) {
        clearInterval(reviewStatusInterval);
    }

    console.log('🔄 Starting review status polling...');

    // Check immediately
    checkReviewStatusRealtime();

    // Then check every 5 seconds
    reviewStatusInterval = setInterval(() => {
        checkReviewStatusRealtime();
    }, 5000); // Check every 5 seconds
}

/**
 * Stop polling
 */
function stopReviewStatusPolling() {
    if (reviewStatusInterval) {
        clearInterval(reviewStatusInterval);
        reviewStatusInterval = null;
        console.log('⏹️ Review status polling stopped');
    }
}

/**
 * Check review status in real-time
 */
/**
 * ✅ Check review status in real-time - FIXED VERSION
 */
async function checkReviewStatusRealtime() {
    // Only check if user is logged in
    if (!window.chatUserId || window.chatUserRole === 'guest') {
        return;
    }

    try {
        const response = await fetch('/reviews/user-status', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (data.success) {
            const statusChanged = (
                data.has_approved_review !== lastReviewStatus.has_approved_review ||
                data.has_pending_review !== lastReviewStatus.has_pending_review
            );

            // ✅ DETECT: Review just got APPROVED
            if (!lastReviewStatus.has_approved_review && data.has_approved_review) {
                console.log('🎉 Review got APPROVED! Resetting form...');
                
                // ✅ CHECK: Jangan show toast kalau baru reload page
                const lastSubmitTime = localStorage.getItem('lastReviewSubmitTime');
                const lastApprovalNotif = localStorage.getItem('lastApprovalNotification');
                const currentTime = Date.now();
                
                // ✅ Only show toast if:
                // 1. Not just reloaded (more than 3 seconds after submit)
                // 2. Not already shown (check timestamp)
                const shouldShowToast = (
                    (!lastSubmitTime || (currentTime - parseInt(lastSubmitTime)) > 3000) &&
                    (!lastApprovalNotif || (currentTime - parseInt(lastApprovalNotif)) > 60000) // Max 1x per minute
                );
                
                if (shouldShowToast) {
                    showToast(
                        '🎉 Review Approved!',
                        'Your review has been published. You can now submit another review!',
                        null
                    );
                    
                    // ✅ Save timestamp untuk prevent spam
                    localStorage.setItem('lastApprovalNotification', currentTime.toString());
                }

                // Reset form state
                resetReviewFormState();
                
                // ✅ Clear submit flag
                localStorage.removeItem('lastReviewSubmitTime');
                
                // Update CTA visibility
                userCanReview = data.can_review;
                updateReviewCTA();
            }

            // ✅ DETECT: Pending review was rejected
            if (lastReviewStatus.has_pending_review && !data.has_pending_review && !data.has_approved_review) {
                console.log('❌ Pending review was rejected');
                
                // ✅ CHECK: Prevent toast spam on reload
                const lastRejectionNotif = localStorage.getItem('lastRejectionNotification');
                const currentTime = Date.now();
                
                if (!lastRejectionNotif || (currentTime - parseInt(lastRejectionNotif)) > 60000) {
                    showToast(
                        'Review Status Changed',
                        'You can submit a new review now',
                        null
                    );
                    
                    localStorage.setItem('lastRejectionNotification', currentTime.toString());
                }

                resetReviewFormState();
                userCanReview = true;
                updateReviewCTA();
                
                // Clear submit flag
                localStorage.removeItem('lastReviewSubmitTime');
            }

            // Update last status
            lastReviewStatus = {
                has_approved_review: data.has_approved_review,
                has_pending_review: data.has_pending_review,
                can_review: data.can_review
            };

            userCanReview = data.can_review;

            // Update UI if status changed
            if (statusChanged) {
                console.log('📊 Review status updated:', lastReviewStatus);
                updateReviewCTA();
            }
        }
    } catch (error) {
        console.error('❌ Failed to check review status:', error);
    }
}

/**
 * Reset review form state (allow new submission)
 */
function resetReviewFormState() {
    console.log('🔄 Resetting review form state...');
    
    // Reset global variables
    selectedRating = 0;
    selectedImages = [];
    selectedBadges = [];
    userHasReviewed = false;
    
    // Reset form if it exists
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.reset();
    }
    
    // Clear star rating
    const stars = document.querySelectorAll('.star-input');
    stars.forEach(s => s.classList.remove('active'));
    
    const ratingLabel = document.getElementById('ratingLabel');
    if (ratingLabel) {
        ratingLabel.textContent = 'Select rating';
        ratingLabel.classList.remove('selected');
    }
    
    // Clear badges
    const badgeSelector = document.getElementById('badgeSelector');
    if (badgeSelector) {
        badgeSelector.innerHTML = '<p class="badge-hint">⬆️ Please select a star rating first</p>';
    }
    
    // Clear image preview
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) {
        imagePreview.innerHTML = '';
    }
    
    // Clear character count
    const charCount = document.getElementById('charCount');
    if (charCount) {
        charCount.textContent = '0';
    }
    
    console.log('✅ Review form reset complete');
}

/**
 * Update review CTA visibility based on status
 */
function updateReviewCTA() {
    const writeReviewBtn = document.getElementById('writeReviewBtn');
    const reviewCTA = document.querySelector('.review-cta');
    
    if (!writeReviewBtn && !reviewCTA) {
        return;
    }
    
    if (userCanReview) {
        // User CAN review - show CTA
        if (reviewCTA) reviewCTA.style.display = 'block';
        if (writeReviewBtn) {
            writeReviewBtn.style.display = 'inline-flex';
            writeReviewBtn.disabled = false;
            writeReviewBtn.style.opacity = '1';
        }
        
        console.log('✅ User can review - CTA enabled');
    } else {
        // User CANNOT review - hide CTA
        if (reviewCTA) reviewCTA.style.display = 'none';
        if (writeReviewBtn) {
            writeReviewBtn.style.display = 'none';
            writeReviewBtn.disabled = true;
            writeReviewBtn.style.opacity = '0.5';
        }
        
        console.log('⛔ User cannot review - CTA disabled');
    }
}

// Make functions global
window.startReviewStatusPolling = startReviewStatusPolling;
window.stopReviewStatusPolling = stopReviewStatusPolling;
window.checkReviewStatusRealtime = checkReviewStatusRealtime;
window.resetReviewFormState = resetReviewFormState;
window.updateReviewCTA = updateReviewCTA;

// ================================================
// INITIALIZE ON PAGE LOAD
// ================================================

document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 App Initialized");

    // ... existing code ...

    // ✅ START REVIEW STATUS POLLING (if user is client)
    if (window.chatUserId && window.chatUserRole === "client") {
        console.log("👤 Client logged in, starting review status polling...");

        // ✅ Load initial status (tanpa toast dulu)
        fetch("/reviews/user-status", {
            method: "GET",
            credentials: "include",
        })
            .then((r) => r.json())
            .then((data) => {
                if (data.success) {
                    // ✅ Set initial state tanpa trigger toast
                    lastReviewStatus = {
                        has_approved_review: data.has_approved_review,
                        has_pending_review: data.has_pending_review,
                        can_review: data.can_review,
                    };

                    userCanReview = data.can_review;
                    userHasReviewed =
                        data.has_pending_review || data.has_approved_review;

                    // Update CTA
                    updateReviewCTA();

                    console.log("📊 Initial review status:", lastReviewStatus);

                    // ✅ THEN start polling after 2 seconds
                    setTimeout(() => {
                        startReviewStatusPolling();
                    }, 2000);
                }
            })
            .catch((error) => {
                console.error("Failed to get initial review status:", error);
                // Still start polling even if initial fetch fails
                setTimeout(() => {
                    startReviewStatusPolling();
                }, 2000);
            });
    }

    // ✅ STOP POLLING when page is hidden
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            console.log("📴 Page hidden, stopping review polling...");
            stopReviewStatusPolling();
        } else {
            console.log("📱 Page visible, resuming review polling...");
            if (window.chatUserId && window.chatUserRole === "client") {
                startReviewStatusPolling();
            }
        }
    });

    // ✅ STOP POLLING before page unload
    window.addEventListener("beforeunload", function () {
        stopReviewStatusPolling();
    });
});

// end

// Delete message (admin only)
async function deleteMessage(messageId) {
    if (!confirm('Delete this message?')) return;
    
    const csrf = document.querySelector('meta[name="csrf-token"]').content;
    
    try {
        const res = await fetch(`/chat/message/${messageId}`, {
            method: 'DELETE',
            headers: { 'X-CSRF-TOKEN': csrf }
        });
        
        const data = await res.json();
        
        if (data.success) {
            await smartRefreshMessages();
            showToast('Message Deleted', 'Message removed successfully', null);
        }
    } catch (error) {
        alert('Failed to delete message');
    }
}

// Block/Unblock user (dengan toggle)
async function blockUser(userId, userName) {
    // ✅ Get current block status dari UI
    const convItem = document.querySelector(`.conversation-item[onclick*="${userId}"]`);
    const isCurrentlyBlocked = convItem && convItem.classList.contains('blocked');
    
    const action = isCurrentlyBlocked ? 'unblock' : 'block';
    const confirmMessage = isCurrentlyBlocked 
        ? `Unblock ${userName}? They will be able to send messages again.`
        : `Block ${userName}? They won't be able to send messages.`;
    
    if (!confirm(confirmMessage)) return;
    
    const csrf = document.querySelector('meta[name="csrf-token"]').content;
    
    try {
        const res = await fetch('/chat/block-user', {
            method: 'POST',
            headers: { 
                'X-CSRF-TOKEN': csrf, 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ user_id: userId })
        });
        
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.success) {
            const newStatus = data.is_blocked ? 'blocked' : 'unblocked';
            showToast(
                `User ${newStatus}!`, 
                `${userName} has been ${newStatus}`, 
                null
            );
            
            // ✅ REFRESH conversations list
            await loadConversations();
            
            // ✅ CLOSE chat jika sedang dibuka
            if (currentChatUserId === userId) {
                document.getElementById('chatMain').innerHTML = `
                    <div class="empty-chat">
                        <svg viewBox="0 0 24 24" width="60" height="60">
                            <circle cx="12" cy="12" r="10" stroke="red" stroke-width="2" fill="none"/>
                            <line x1="15" y1="9" x2="9" y2="15" stroke="red" stroke-width="2"/>
                            <line x1="9" y1="9" x2="15" y2="15" stroke="red" stroke-width="2"/>
                        </svg>
                        <h3>User ${newStatus}</h3>
                        <p>${userName} has been ${newStatus}</p>
                    </div>
                `;
                currentChatUserId = null;
            }
        } else {
            throw new Error(data.message || 'Failed to toggle block status');
        }
    } catch (error) {
        console.error('Block user error:', error);
        alert('Failed to update block status: ' + error.message);
    }
}

// Delete conversation
async function deleteConversation(userId, userName) {
    if (!confirm(`Delete entire conversation with ${userName}?`)) return;
    
    const csrf = document.querySelector('meta[name="csrf-token"]').content;
    
    try {
        const res = await fetch('/chat/conversation', {
            method: 'DELETE',
            headers: { 'X-CSRF-TOKEN': csrf, 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
        });
        
        const data = await res.json();
        
        if (data.success) {
            showToast('Conversation Deleted', 'All messages removed', null);
            loadConversations();
            document.getElementById('chatMain').innerHTML = '<div class="empty-chat"><p>Select a conversation</p></div>';
        }
    } catch (error) {
        alert('Failed to delete conversation');
    }
}

// Make global
window.deleteMessage = deleteMessage;
window.blockUser = blockUser;
window.deleteConversation = deleteConversation;



class ChibiInteractive {
    constructor() {
        this.chibi = document.getElementById("chibiLottie");
        this.chibiImg = document.getElementById("chibiImage");

        if (!this.chibi || !this.chibiImg) return;

        // GIF paths
        this.gifs = {
            walk: "/images/cat/cat-walk1-unscreen.gif",
            lifted: "/images/cat/cat-lift1-unscreen.gif",
            react: "/images/cat/cat-reaction1-unscreen.gif",
        };

        // State
        this.isDragging = false;
        this.isReacting = false;
        this.isFalling = false;
        this.isHovering = false;
        this.wasClickOnImage = false; // ✅ TRACK APAKAH KLIK DI IMAGE
        this.startX = 0;
        this.startY = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.currentX = 100;
        this.currentBottom = 30;
        this.facingRight = true;
        this.autoWalkInterval = null;
        this.clickTimeout = null;
        this.holdTimer = null;

        this.init();
        this.applyGreenScreenRemoval();
        this.startAutoWalk();
    }

    init() {
        // Set initial position
        this.chibi.style.left = this.currentX + "px";
        this.chibi.style.bottom = this.currentBottom + "px";

        // ✅ SEMUA EVENT DI IMAGE, BUKAN CONTAINER
        this.chibiImg.addEventListener("mouseenter", () => {
            this.isHovering = true;
            if (!this.isDragging && !this.isReacting) {
                clearInterval(this.autoWalkInterval);
            }
        });

        this.chibiImg.addEventListener("mouseleave", () => {
            this.isHovering = false;
            if (!this.isDragging && !this.isReacting && !this.isFalling) {
                this.startAutoWalk();
            }
        });

        this.chibiImg.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.wasClickOnImage = true; // ✅ MARK BAHWA KLIK DI IMAGE
            this.handlePressStart(e.clientX, e.clientY);
        });

        document.addEventListener("mousemove", (e) => {
            if (this.isDragging) {
                e.preventDefault();
                this.handleMove(e.clientX, e.clientY);
            }
        });

        document.addEventListener("mouseup", (e) => {
            if (this.holdTimer) {
                clearTimeout(this.holdTimer);
                this.holdTimer = null;
            }

            // ✅ CEK APAKAH KLIK AWAL DI IMAGE
            if (!this.isDragging && this.wasClickOnImage) {
                this.react();
            } else if (this.isDragging) {
                this.stopDrag();
            }

            // ✅ RESET FLAG
            this.wasClickOnImage = false;
        });

        this.chibiImg.addEventListener("touchstart", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.isHovering = true;
            this.wasClickOnImage = true; // ✅ MARK TOUCH DI IMAGE
            const touch = e.touches[0];
            this.handlePressStart(touch.clientX, touch.clientY);
        });

        document.addEventListener(
            "touchmove",
            (e) => {
                if (this.isDragging) {
                    e.preventDefault();
                    const touch = e.touches[0];
                    this.handleMove(touch.clientX, touch.clientY);
                }
            },
            { passive: false }
        );

        document.addEventListener("touchend", (e) => {
            if (this.holdTimer) {
                clearTimeout(this.holdTimer);
                this.holdTimer = null;
            }

            this.isHovering = false;

            // ✅ CEK APAKAH TOUCH AWAL DI IMAGE
            if (!this.isDragging && this.wasClickOnImage) {
                this.react();
            } else if (this.isDragging) {
                this.stopDrag();
            }

            // ✅ RESET FLAG
            this.wasClickOnImage = false;
        });

        this.chibiImg.addEventListener("dragstart", (e) => e.preventDefault());
    }

    handlePressStart(clientX, clientY) {
        if (this.holdTimer) {
            clearTimeout(this.holdTimer);
        }

        this.startX = clientX;
        this.startY = clientY;

        const rect = this.chibi.getBoundingClientRect();
        this.offsetX = clientX - rect.left;
        this.offsetY = clientY - rect.top;

        this.holdTimer = setTimeout(() => {
            this.startDrag();
        }, 150);
    }

    handleMove(clientX, clientY) {
        if (!this.isDragging) return;

        const newX = clientX - this.offsetX;
        const newY = clientY - this.offsetY;

        const maxX = window.innerWidth - 120;
        const maxY = window.innerHeight - 120;

        this.currentX = Math.max(0, Math.min(newX, maxX));
        const topPosition = Math.max(0, Math.min(newY, maxY));
        this.currentBottom = window.innerHeight - topPosition - 120;

        this.chibi.style.left = this.currentX + "px";
        this.chibi.style.bottom = this.currentBottom + "px";

        const deltaX = clientX - this.startX;
        if (Math.abs(deltaX) > 5) {
            if (deltaX > 0) {
                this.chibi.classList.remove("flip");
                this.facingRight = true;
            } else {
                this.chibi.classList.add("flip");
                this.facingRight = false;
            }
            this.startX = clientX;
        }
    }

    applyGreenScreenRemoval() {
        this.chibiImg.classList.add("chroma-key");
    }

    changeGif(type) {
        const newSrc = this.gifs[type];
        if (newSrc && !this.chibiImg.src.includes(newSrc)) {
            this.chibiImg.src = newSrc;
        }
    }

    startAutoWalk() {
        clearInterval(this.autoWalkInterval);
        this.autoWalkInterval = setInterval(() => {
            if (
                !this.isDragging &&
                !this.isReacting &&
                !this.isHovering &&
                !this.isFalling
            ) {
                this.walk();
            }
        }, 6000);
    }

    walk() {
        const maxX = window.innerWidth - 120;
        const targetX = Math.random() * maxX;
        const distance = Math.abs(targetX - this.currentX);
        const duration = distance * 4;

        this.chibi.classList.add("walking");
        this.changeGif("walk");

        if (targetX > this.currentX) {
            this.chibi.classList.remove("flip");
            this.facingRight = true;
        } else {
            this.chibi.classList.add("flip");
            this.facingRight = false;
        }

        this.chibi.style.transition = `left ${duration}ms linear`;
        this.chibi.style.left = targetX + "px";
        this.currentX = targetX;

        setTimeout(() => {
            this.chibi.classList.remove("walking");
        }, duration);
    }

    react() {
        if (this.isReacting || this.isDragging || this.isFalling) return;

        this.isReacting = true;
        this.chibi.classList.add("reacting");
        this.changeGif("react");

        const clickSound = document.getElementById("chibiClickSound");
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.volume = 0.5;
            clickSound
                .play()
                .catch((e) => console.log("Sound play failed:", e));
        }

        setTimeout(() => {
            this.chibi.classList.remove("reacting");
            this.changeGif("walk");
            this.isReacting = false;
        }, 800);
    }

    startDrag() {
        if (this.isReacting || this.isFalling) return;

        this.isDragging = true;
        this.chibi.classList.add("grabbing");
        this.changeGif("lifted");

        clearInterval(this.autoWalkInterval);
        this.chibi.classList.remove("walking");
        this.chibi.style.transition = "none";
    }

    stopDrag() {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.isFalling = true;

        this.chibi.classList.remove("grabbing");
        this.chibi.classList.add("falling");
        this.changeGif("walk");

        const targetBottom = 30;

        this.chibi.style.transition =
            "bottom 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55), transform 0.3s ease";
        this.chibi.style.bottom = targetBottom + "px";
        this.currentBottom = targetBottom;

        const dropSound = document.getElementById("closeSound");
        if (dropSound) {
            setTimeout(() => {
                dropSound.currentTime = 0;
                dropSound.volume = 0.5;
                dropSound.play().catch((e) => console.log("Sound failed:", e));
            }, 400);
        }

        setTimeout(() => {
            this.chibi.classList.remove("falling");
            this.isFalling = false;

            this.chibi.style.transition =
                "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.2s ease, bottom 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)";

            if (!this.isHovering) {
                this.startAutoWalk();
            }
        }, 600);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        new ChibiInteractive();
    });
} else {
    new ChibiInteractive();
}
