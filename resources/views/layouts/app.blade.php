<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Hilal Prayogi - Portfolio')</title>
    @vite(['resources/css/app.css'])
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet">
    <style>
        /* Ganti variabel SCSS dengan CSS custom properties */
        :root {
            --light-cyan: #d6fff6;
            --medium-turquoise: #4dccbd;
            --russian-violet: #110d31;
            --french-blue: #2374ab;
            --light-coral: #ff8484;
            --size: 80px;
            --animation-duration: 2s;
        }

        .preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--light-coral);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease-out, visibility 0.5s ease-out;
        }

        .preloader.hidden {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }

        .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
        }

        .scene {
            position: relative;
            z-index: 2;
            height: calc(var(--size) * 2.75);
            width: calc(var(--size) * 2.75);
            display: grid;
            place-items: center;
        }

        .cube-wrapper {
            transform-style: preserve-3d;
            animation: bouncing var(--animation-duration) infinite;
        }

        .cube {
            transform-style: preserve-3d;
            transform: rotateX(45deg) rotateZ(45deg);
            animation: rotation var(--animation-duration) infinite;
        }

        .cube-faces {
            transform-style: preserve-3d;
            height: var(--size);
            width: var(--size);
            position: relative;
            transform-origin: 0 0;
            transform: translateX(0) translateY(0) translateZ(calc(var(--size) / -2));
        }

        .cube-face {
            position: absolute;
            inset: 0;
            background: var(--russian-violet);
            border: solid 1px var(--light-coral);
        }

        .cube-face.shadow {
            transform: translateZ(calc(var(--size) * -1));
            animation: bouncing-shadow var(--animation-duration) infinite;
        }

        .cube-face.top {
            transform: translateZ(var(--size));
        }

        .cube-face.front {
            transform-origin: 0 50%;
            transform: rotateY(-90deg);
        }

        .cube-face.back {
            transform-origin: 0 50%;
            transform: rotateY(-90deg) translateZ(calc(var(--size) * -1));
        }

        .cube-face.right {
            transform-origin: 50% 0;
            transform: rotateX(-90deg) translateY(calc(var(--size) * -1));
        }

        .cube-face.left {
            transform-origin: 50% 0;
            transform: rotateX(-90deg) translateY(calc(var(--size) * -1)) translateZ(var(--size));
        }

        .cube-face.bottom {
            /* Bottom face styling */
        }

        /* Loading Text Styles */
        .loading-text {
            color: var(--russian-violet);
            font-size: 1.5rem;
            font-weight: 600;
            text-align: center;
            position: relative;
        }

        /* Animasi Typing */
        .typing-text {
            overflow: hidden;
            border-right: 2px solid var(--russian-violet);
            white-space: nowrap;
            animation: typing 3.5s steps(40, end) infinite, blink-caret 0.75s step-end infinite;
        }

        /* Animasi Dots Bouncing */
        .dots-text {
            display: inline-block;
        }

        .dots-text::after {
            content: '';
            animation: dots 1.5s steps(4, end) infinite;
        }

        /* Animasi Pulse */
        .pulse-text {
            animation: pulse 2s ease-in-out infinite;
        }

        /* Animasi Fade In Out */
        .fade-text {
            animation: fadeInOut 2s ease-in-out infinite;
        }

        /* Progress Bar */
        .progress-container {
            width: 200px;
            height: 4px;
            background: rgba(17, 13, 49, 0.2);
            border-radius: 10px;
            overflow: hidden;
            margin-top: 1rem;
        }

        .progress-bar {
            height: 100%;
            background: var(--russian-violet);
            border-radius: 10px;
            animation: progress 2s ease-in-out infinite;
            transform-origin: left;
        }

        @keyframes rotation {
            0% {
                transform: rotateX(45deg) rotateY(0) rotateZ(45deg);
                animation-timing-function: cubic-bezier(0.17,0.84,0.44,1);
            }
            50% {
                transform: rotateX(45deg) rotateY(0) rotateZ(225deg);
                animation-timing-function: cubic-bezier(0.76,0.05,0.86,0.06);
            }
            100% {
                transform: rotateX(45deg) rotateY(0) rotateZ(405deg);
                animation-timing-function: cubic-bezier(0.17,0.84,0.44,1);
            }
        }

        @keyframes bouncing {
            0% {
                transform: translateY(calc(var(--size) * -0.5));
                animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
            }
            45% {
                transform: translateY(calc(var(--size) * 0.5));
                animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
            }
            100% {
                transform: translateY(calc(var(--size) * -0.5));
                animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
            }
        }

        @keyframes bouncing-shadow {
            0% {
                transform: translateZ(calc(var(--size) * -1)) scale(1.3);
                animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
                opacity: .05;
            }
            45% {
                transform: translateZ(0);
                animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
                opacity: .3;
            }
            100% {
                transform: translateZ(calc(var(--size) * -1)) scale(1.3);
                animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
                opacity: .05;
            }
        }

        /* Animasi Teks Loading */
        @keyframes typing {
            0% { width: 0 }
            50% { width: 100% }
            90% { width: 100% }
            100% { width: 0 }
        }

        @keyframes blink-caret {
            from, to { border-color: transparent }
            50% { border-color: var(--russian-violet) }
        }

        @keyframes dots {
            0%, 20% { content: ''; }
            40% { content: '.'; }
            60% { content: '..'; }
            80%, 100% { content: '...'; }
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
        }

        @keyframes fadeInOut {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }

        @keyframes progress {
            0% { transform: scaleX(0); }
            50% { transform: scaleX(1); }
            100% { transform: scaleX(0); }
        }

        /* Responsive */
        @media (max-width: 768px) {
            .loading-text {
                font-size: 1.2rem;
            }
            
            .progress-container {
                width: 150px;
            }
        }
    </style>
</head>
<body class="dark-mode">
    <!-- Preloader yang sudah diperbaiki -->
    <div class="preloader" id="preloader">
        <div class="scene">
            <div class="cube-wrapper">
                <div class="cube">
                    <div class="cube-faces">
                        <div class="cube-face shadow"></div>
                        <div class="cube-face bottom"></div>
                        <div class="cube-face top"></div>
                        <div class="cube-face left"></div>
                        <div class="cube-face right"></div>
                        <div class="cube-face back"></div>
                        <div class="cube-face front"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Style 2: Dots Animation (uncomment untuk menggunakan) -->
        <div class="loading-text">Loading<span class="dots-text"></span></div>
    </div>

    <!-- User Menu (Kiri Atas) -->
    <x-auth.user-menu />

    <!-- Theme Toggle (Kanan Atas) -->
    <x-theme-toggle />

    <!-- Main Content -->
    <div class="container">
        @yield('content')
    </div>
    
    <!-- Audio elements -->
    <audio id="navSound" preload="auto">
        <source src="{{ asset('sounds/hover-click.mp3') }}" type="audio/mpeg">
    </audio>

    <audio id="closeSound" preload="auto">
        <source src="{{ asset('sounds/close-cick.mp3') }}" type="audio/mpeg">
    </audio>

    <audio id="toastSound" preload="auto">
        <source src="{{ asset('sounds/toast-notif.mp3') }}" type="audio/mpeg">
    </audio>

    <audio id="chibiClickSound" preload="auto">
        <source src="{{ asset('sounds/cat-sound.mp3') }}" type="audio/mpeg">
    </audio>

    <!-- Overlays -->
    <x-overlays.about />
    <x-overlays.links />
    <x-overlays.works />
    <x-overlays.contact />
    <x-overlays.faq />
    <x-overlays.rating />
    <x-overlays.review-form />
    <x-overlays.commission />
    <x-overlays.chat />
    <x-overlays.admin />

    <!-- Auth Modals -->
    <x-auth.login-modal />
    <x-auth.register-modal />
    <x-auth.forgot-password />

    <div id="chibiLottie" class="chibi-lottie">
        <img id="chibiImage" 
            src="{{ asset('images/cat/cat-update-base-gif-unscreen.gif') }}" 
            alt="Chibi Character"
            draggable="false">
    </div>

    @auth
    <div id="userData" data-user='{"is_admin": {{ Auth::user()->isAdmin() ? "true" : "false" }}, "name": "{{ Auth::user()->name }}" }' style="display: none;"></div>
    @endauth

    <script>
        @auth
            window.chatUserRole = '{{ auth()->user()->role }}';
            window.chatUserId = {{ auth()->user()->id }};
            window.chatUserName = '{{ addslashes(auth()->user()->name) }}';
            window.chatUserAvatar = '{{ auth()->user()->avatar ?? "/images/default-avatar.jpg" }}';
        @else
            window.chatUserRole = 'guest';
            window.chatUserId = null;
            window.chatUserName = null;
            window.chatUserAvatar = null;
        @endauth
    </script>

    <script>
        window.addEventListener('load', function() {
            const preloader = document.getElementById('preloader');
            
            // Tunggu sebentar agar animasi terlihat
            setTimeout(() => {
                preloader.classList.add('hidden');
                
                // Hapus dari DOM setelah animasi selesai
                setTimeout(() => {
                    preloader.remove();
                }, 500);
            }, 2000); // Delay 2 detik
        });

        // Fallback jika window.load tidak trigger
        setTimeout(() => {
            const preloader = document.getElementById('preloader');
            if (preloader && !preloader.classList.contains('hidden')) {
                preloader.classList.add('hidden');
                setTimeout(() => preloader.remove(), 500);
            }
        }, 3000); // Maksimal 3 detik

        // Optional: Simulasi progress loading
        document.addEventListener('DOMContentLoaded', function() {
            const progressBar = document.querySelector('.progress-bar');
            let progress = 0;
            
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                }
                progressBar.style.transform = `scaleX(${progress / 100})`;
            }, 200);
        });
    </script>

    <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/relativeTime.js"></script>
    <script>
        dayjs.extend(window.dayjs_plugin_relativeTime);
    </script>
    
    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>