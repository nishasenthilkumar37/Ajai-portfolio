// ========================================================================= //
// AJAIKANTH SARAVANAN - THE DEVELOPER CHRONICLES                            //
// 2.5D CINEMATIC MANGA INTERACTIVE ENGINE                                   //
// ========================================================================= //

document.addEventListener('DOMContentLoaded', () => {
    initAudioSystem();
    initIntroParticleCanvas();
    initCinematicIntroParallax();
    initIntroFlow();
    initCustomCursor();
    initHeroTilt();
    initTypewriter();
    initFilterTabs();
    initAvatarSpeechSystem();
    initModals();
    initContactForm();
    initMobileNav();
    initScrollTopButton();
});

// ========================================================================= //
// 1. WEB AUDIO API SYNTHESIZER (CINEMATIC SFX)                              //
// ========================================================================= //
let audioCtx = null;
let soundEnabled = true;

function initAudioSystem() {
    const audioBtn = document.getElementById('audio-toggle-btn');
    const introAudioBtn = document.getElementById('intro-audio-btn');

    function toggleAudio(e) {
        if (e) e.stopPropagation();
        soundEnabled = !soundEnabled;
        const icon = soundEnabled ? 'volume-2' : 'volume-x';
        
        if (audioBtn) {
            audioBtn.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4 ${soundEnabled ? 'text-black' : 'text-neutral-400'}"></i>`;
        }
        if (introAudioBtn) {
            introAudioBtn.innerHTML = `<i data-lucide="${icon}" class="w-3.5 h-3.5 text-white"></i> <span class="text-[10px] font-mono font-bold tracking-widest text-white/80">${soundEnabled ? 'SFX ON' : 'SFX OFF'}</span>`;
        }
        if (window.lucide) lucide.createIcons();
        if (soundEnabled) playTone(880, 'sine', 0.1, 0.05);
    }

    if (audioBtn) audioBtn.addEventListener('click', toggleAudio);
    if (introAudioBtn) introAudioBtn.addEventListener('click', toggleAudio);

    // Attach ambient click & hover SFX
    document.querySelectorAll('button, a, .manga-exact-tag, .manga-card, .project-modal-trigger').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (soundEnabled) playTone(580, 'triangle', 0.03, 0.015);
        });
        el.addEventListener('click', (e) => {
            if (soundEnabled) playTone(920, 'sine', 0.06, 0.03);
            createMangaSFX(e.clientX, e.clientY);
        });
    });
}

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playTone(freq, type = 'sine', duration = 0.1, vol = 0.04) {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {}
}

function playCinematicZoomSound() {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        
        // Sub-bass sweep
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sawtooth';
        subOsc.frequency.setValueAtTime(50, now);
        subOsc.frequency.exponentialRampToValueAtTime(650, now + 1.1);
        subGain.gain.setValueAtTime(0.09, now);
        subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 1.1);

        // High frequency chime
        setTimeout(() => playTone(1200, 'sine', 0.25, 0.04), 300);
        setTimeout(() => playTone(1600, 'sine', 0.35, 0.05), 650);
    } catch (e) {}
}


// ========================================================================= //
// 2. PARTICLES & AMBIENT DUST CANVAS ENGINE                                 //
// ========================================================================= //
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

function initIntroParticleCanvas() {
    const canvas = document.getElementById('intro-particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const numParticles = window.innerWidth < 768 ? 35 : 75;

    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.6 + 0.4,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: -Math.random() * 0.6 - 0.2,
            opacity: Math.random() * 0.5 + 0.1,
            pulse: Math.random() * Math.PI
        });
    }

    function render() {
        ctx.clearRect(0, 0, width, height);

        // Subtle radial mouse glow
        const gradient = ctx.createRadialGradient(mouseX, mouseY, 10, mouseX, mouseY, 320);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Draw dust particles
        particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.pulse += 0.02;

            if (p.y < -10) {
                p.y = height + 10;
                p.x = Math.random() * width;
            }
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;

            const alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.shadowBlur = 4;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        requestAnimationFrame(render);
    }

    render();
}


// ========================================================================= //
// 3. 2.5D MOUSE PARALLAX & IDLE MOVEMENT CONTROLLER                         //
// ========================================================================= //
function initCinematicIntroParallax() {
    const introStage = document.getElementById('intro-stage');
    const layerBg = document.querySelector('.intro-layer-bg');
    const layerChar = document.querySelector('.intro-layer-character');
    const layerFg = document.querySelector('.intro-layer-fg');
    const layerLight = document.getElementById('intro-cursor-light');

    if (!introStage) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    // Track mouse coordinates
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        targetX = (e.clientX - centerX) / centerX;
        targetY = (e.clientY - centerY) / centerY;

        if (layerLight) {
            layerLight.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`;
        }
    });

    // Touch support for mobile tilt
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            targetX = (touch.clientX - centerX) / centerX;
            targetY = (touch.clientY - centerY) / centerY;
        }
    }, { passive: true });

    // Smooth inertia interpolation (Lerp loop)
    function animateParallax() {
        currentX += (targetX - currentX) * 0.06;
        currentY += (targetY - currentY) * 0.06;

        if (layerBg) {
            layerBg.style.transform = `translate3d(${currentX * 12}px, ${currentY * 10}px, 0px) scale(1.02)`;
        }
        if (layerChar) {
            // Character moves slightly opposite for true 2.5D depth
            layerChar.style.transform = `translate3d(${-currentX * 18}px, ${-currentY * 14}px, 40px) rotateY(${currentX * 3.5}deg) rotateX(${-currentY * 3.5}deg)`;
        }
        if (layerFg) {
            layerFg.style.transform = `translate3d(${currentX * 8}px, ${currentY * 6}px, 70px)`;
        }

        requestAnimationFrame(animateParallax);
    }

    animateParallax();
}


// ========================================================================= //
// 4. CINEMATIC INTRO FLOW & ENTER THE CHRONICLES CONTROLLER                 //
// ========================================================================= //
function initIntroFlow() {
    const intro = document.getElementById('cinematic-intro');
    const enterBtn = document.getElementById('enter-chronicles-btn');
    const skipBtn = document.getElementById('skip-intro-btn');
    const replayBtn = document.getElementById('replay-intro-btn');
    const portfolioApp = document.getElementById('portfolio-app');

    let hasTransitioned = false;

    // Check if user already saw intro in current session
    const introSeen = sessionStorage.getItem('ajai_intro_seen');
    if (introSeen === 'true' && portfolioApp && intro) {
        intro.style.display = 'none';
        portfolioApp.style.opacity = '1';
        document.body.style.overflow = 'auto';
        if (window.lucide) lucide.createIcons();
    } else {
        // Initial Cinematic Fade Sequence
        setTimeout(() => {
            const charContainer = document.getElementById('intro-character-container');
            const introTitle = document.getElementById('intro-hero-title');
            const introCta = document.getElementById('intro-cta-wrapper');

            if (charContainer) {
                charContainer.style.opacity = '1';
                charContainer.style.filter = 'contrast(1.1) brightness(1)';
            }
            if (introTitle) {
                introTitle.style.opacity = '1';
                introTitle.style.transform = 'translateY(0)';
            }
            if (introCta) {
                introCta.style.opacity = '1';
                introCta.style.transform = 'translateY(0)';
            }
        }, 300);
    }

    function enterChronicles(immediate = false) {
        if (hasTransitioned) return;
        hasTransitioned = true;
        sessionStorage.setItem('ajai_intro_seen', 'true');

        if (immediate) {
            if (intro) {
                intro.style.opacity = '0';
                intro.style.pointerEvents = 'none';
                setTimeout(() => intro.style.display = 'none', 400);
            }
            if (portfolioApp) portfolioApp.style.opacity = '1';
            document.body.style.overflow = 'auto';
            if (window.lucide) lucide.createIcons();
            return;
        }

        // Play Cinematic Sound
        playCinematicZoomSound();

        // 3D Zoom Camera Rush Effect
        if (intro) {
            intro.classList.add('zoom-rush-active');
        }

        setTimeout(() => {
            if (intro) {
                intro.style.opacity = '0';
                intro.style.pointerEvents = 'none';
                setTimeout(() => intro.style.display = 'none', 600);
            }
            if (portfolioApp) {
                portfolioApp.style.opacity = '1';
            }
            document.body.style.overflow = 'auto';
            if (window.lucide) lucide.createIcons();

            // Automatically say hello in manga character voice upon entering
            setTimeout(() => {
                if (window.speakMangaGreeting) {
                    window.speakMangaGreeting();
                }
            }, 300);
        }, 900);
    }

    if (enterBtn) enterBtn.addEventListener('click', () => enterChronicles(false));
    if (skipBtn) skipBtn.addEventListener('click', () => enterChronicles(true));

    // Replay Intro from Navbar
    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            hasTransitioned = false;
            if (intro) {
                intro.style.display = 'flex';
                intro.classList.remove('zoom-rush-active');
                setTimeout(() => {
                    intro.style.opacity = '1';
                    intro.style.pointerEvents = 'auto';
                }, 50);
            }
            if (portfolioApp) portfolioApp.style.opacity = '0';
            window.scrollTo({ top: 0, behavior: 'instant' });
            document.body.style.overflow = 'hidden';
        });
    }
}


// ========================================================================= //
// 5. DYNAMIC CUSTOM CURSOR (DESKTOP)                                        //
// ========================================================================= //
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const label = document.getElementById('cursor-label');
    if (!cursor) return;

    // Hide custom cursor on mobile / touch
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        cursor.style.display = 'none';
        return;
    }

    window.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    // Handle cursor modes & labels
    function updateCursorTargets() {
        document.querySelectorAll('a, button, [data-cursor], .manga-card, .project-modal-trigger, .skill-tab-btn').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
                const customText = el.getAttribute('data-cursor') || (el.tagName === 'A' ? 'GO →' : 'OPEN');
                if (label) label.textContent = customText;
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
                if (label) label.textContent = '';
            });
        });
    }

    updateCursorTargets();

    // Change cursor color when over light/cream areas
    window.addEventListener('scroll', () => {
        const intro = document.getElementById('cinematic-intro');
        if (intro && intro.style.display !== 'none' && intro.style.opacity !== '0') {
            cursor.classList.remove('on-cream');
        } else {
            cursor.classList.add('on-cream');
        }
    }, { passive: true });
}


// ========================================================================= //
// 6. HERO 3D MANGA CARD PERSPECTIVE TILT                                    //
// ========================================================================= //
function initHeroTilt() {
    const card = document.getElementById('hero-manga-card');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const tiltX = (y / (rect.height / 2)) * -6;
        const tiltY = (x / (rect.width / 2)) * 6;

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
}


// ========================================================================= //
// 7. TYPEWRITER EFFECT FOR HERO HEADLINE                                    //
// ========================================================================= //
function initTypewriter() {
    const target = document.getElementById('hero-typewriter');
    if (!target) return;

    const roles = [
        "AI & Data Science Undergrad",
        "Applied Machine Learning",
        "Java & Python Developer",
        "React Native Mobile Engineer",
        "Smart India Hackathon '25 Winner"
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function type() {
        const currentRole = roles[roleIdx];
        
        if (isDeleting) {
            target.textContent = currentRole.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 40;
        } else {
            target.textContent = currentRole.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 95;
        }

        if (!isDeleting && charIdx === currentRole.length) {
            isDeleting = true;
            typingSpeed = 1900;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            typingSpeed = 350;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}


// ========================================================================= //
// 8. FLOATING SFX KANJI CLICK EFFECT                                        //
// ========================================================================= //
function createMangaSFX(x, y) {
    const container = document.getElementById('sfx-container');
    if (!container || !x || !y) return;

    const sfxList = [
        "ドドド (DODODO)",
        "ゴゴゴ (GOGOGO)",
        "バァン (BAAAM)",
        "ズキュウウン",
        "シュッ (SWOOSH)",
        "カチッ (CLICK)"
    ];

    const sfx = document.createElement('div');
    sfx.className = 'manga-sfx-float';
    sfx.textContent = sfxList[Math.floor(Math.random() * sfxList.length)];
    sfx.style.left = `${x}px`;
    sfx.style.top = `${y}px`;
    sfx.style.fontSize = `${Math.floor(Math.random() * 5 + 13)}px`;

    container.appendChild(sfx);
    setTimeout(() => sfx.remove(), 1200);
}


// ========================================================================= //
// 9. SKILLS FILTER TABS CONTROLLER                                          //
// ========================================================================= //
function initFilterTabs() {
    const skillBtns = document.querySelectorAll('.skill-tab-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    skillBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            skillBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            skillCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 40);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 180);
                }
            });
        });
    });
}


// ========================================================================= //
// 10. CASE FILES & RESUME MODAL SYSTEM                                      //
// ========================================================================= //
const projectData = {
    medroute: {
        title: "MedRoute - Emergency Ambulance Optimization",
        caseNum: "CASE FILE // 001",
        category: "MOBILE APP & GEO-ROUTING (JAVA / FIREBASE / GOOGLE MAPS)",
        description: "Mobile application engineered to optimize emergency ambulance response times by dynamically computing shortest travel paths and factoring in real-time traffic conditions. Incorporates live GPS tracking for dispatch stations and hospital arrival forecasting.",
        architecture: "Java, Android SDK, Firebase Realtime Database, Google Maps API, Geolocation Services.",
        role: "Solo Lead Developer (Architecture, Google Maps API Integration & Firebase Database Sync)",
        metrics: "Dynamic shortest-time route recalculation and real-time GPS telemetry for emergency response.",
        github: "https://github.com/Ajaikanth123"
    },
    medimartx: {
        title: "MediMartX - Healthcare E-Commerce Platform",
        caseNum: "CASE FILE // 002",
        category: "HEALTHCARE ECOMMERCE (REACT NATIVE / FIREBASE)",
        description: "Cross-platform mobile e-commerce application for ordering medicines online. Features digital prescription uploads, live order tracking, category filtering, and real-time inventory management with cloud sync.",
        architecture: "React Native, Expo, Firebase Firestore, Cloud Storage, Authentication.",
        role: "Full-Stack Mobile Developer (UI/UX, Prescription Pipeline, Firestore Cloud Backend)",
        metrics: "End-to-end medicine ordering flow with verified prescription upload workflows.",
        github: "https://github.com/Ajaikanth123"
    },
    cookify: {
        title: "Cookify - Recipe Discovery & Meal Planning",
        caseNum: "CASE FILE // 003",
        category: "RECIPE DISCOVERY APP (REACT NATIVE / REST API)",
        description: "Mobile culinary companion enabling users to search, filter, and follow structured recipes with category filters, detailed ingredient breakdowns, step-by-step preparation guides, and offline recipe bookmarking.",
        architecture: "React Native, RESTful APIs, AsyncStorage, State Management.",
        role: "Mobile App Developer (API Integration, Client Caching, Interactive Step-by-Step UI)",
        metrics: "Instant recipe search and step-by-step cooking guide companion.",
        github: "https://github.com/Ajaikanth123"
    },
    gym: {
        title: "Gym Attendance & Member Management",
        caseNum: "CASE FILE // 004",
        category: "CLIENT PRODUCTION APPLICATION (REACT NATIVE / FIREBASE)",
        description: "Freelance production mobile solution delivered for an active gym client. Streamlines daily member check-ins, automated attendance logs, membership renewal alerts, workout history tracking, and cloud sync.",
        architecture: "React Native, Firebase Firestore, Cloud Messaging, Authentication.",
        role: "Freelance Full-Stack Developer (Direct Client Delivery with full client payout and performance bonus)",
        metrics: "Production deployment with automated attendance logs and renewal notifications.",
        github: "https://github.com/Ajaikanth123"
    },
    lunarguardians: {
        title: "Team Lunar Guardians - SIH 2025 National Winner",
        caseNum: "CASE FILE // 005",
        category: "SPACE TECHNOLOGY / AI & DATA SCIENCE",
        description: "National 1st Prize Winner at Smart India Hackathon (SIH) 2025 in the Space Technology domain. Selected as Pre-Incubatee at Aakam360 incubation center for pioneering aerospace and space data tech solutions.",
        architecture: "Python, AI/ML, Data Science, System Design, Space Tech.",
        role: "Team Lunar Guardians Member & AI/Data Specialist",
        metrics: "National 1st Prize Winner at SIH 2025 & Pre-Incubatee @ Aakam360.",
        github: "https://github.com/Ajaikanth123"
    }
};

function initModals() {
    const projectModal = document.getElementById('project-modal');
    const closeProjectModal = document.getElementById('close-project-modal');
    const modalCaseNum = document.getElementById('modal-case-num');
    const modalTitle = document.getElementById('modal-project-title');
    const modalCategory = document.getElementById('modal-project-category');
    const modalBody = document.getElementById('modal-project-body');
    const modalGithub = document.getElementById('modal-project-github');

    document.querySelectorAll('.project-modal-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-project');
            const data = projectData[key];
            if (!data) return;

            if (modalCaseNum) modalCaseNum.textContent = data.caseNum;
            if (modalTitle) modalTitle.textContent = data.title;
            if (modalCategory) modalCategory.textContent = data.category;
            if (modalGithub) modalGithub.href = data.github;

            if (modalBody) {
                modalBody.innerHTML = `
                    <div class="space-y-4">
                        <div>
                            <h4 class="font-syne font-bold text-black text-xs uppercase tracking-wider">PROJECT OVERVIEW</h4>
                            <p class="text-xs text-neutral-800 mt-1 leading-relaxed">${data.description}</p>
                        </div>
                        <div class="p-4 bg-[#fdfcf9] border-2 border-black space-y-2.5 shadow-[2px_2px_0px_#000]">
                            <div class="font-mono text-xs text-neutral-900"><strong class="text-black">ROLE & SCOPE:</strong> ${data.role}</div>
                            <div class="font-mono text-xs text-neutral-900"><strong class="text-black">TECH STACK:</strong> ${data.architecture}</div>
                            <div class="font-mono text-xs text-emerald-800 font-bold"><strong class="text-black">DELIVERABLE:</strong> ${data.metrics}</div>
                        </div>
                    </div>
                `;
            }

            if (projectModal) {
                projectModal.style.opacity = '1';
                projectModal.style.pointerEvents = 'auto';
                document.body.style.overflow = 'hidden';
                if (window.lucide) lucide.createIcons();
            }
        });
    });

    if (closeProjectModal) {
        closeProjectModal.addEventListener('click', () => {
            if (projectModal) {
                projectModal.style.opacity = '0';
                projectModal.style.pointerEvents = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Resume Modal
    const resumeModal = document.getElementById('resume-modal');
    const heroResumeBtn = document.getElementById('hero-resume-btn');
    const closeResumeModal = document.getElementById('close-resume-modal');
    const downloadResumeBtn = document.getElementById('download-resume-btn');

    function openResume() {
        if (resumeModal) {
            resumeModal.style.opacity = '1';
            resumeModal.style.pointerEvents = 'auto';
            document.body.style.overflow = 'hidden';
            if (window.lucide) lucide.createIcons();
        }
    }

    if (heroResumeBtn) heroResumeBtn.addEventListener('click', openResume);

    if (closeResumeModal) {
        closeResumeModal.addEventListener('click', () => {
            if (resumeModal) {
                resumeModal.style.opacity = '0';
                resumeModal.style.pointerEvents = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', () => window.print());
    }

    // Close on backdrop click
    [projectModal, resumeModal].forEach(modal => {
        if (!modal) return;
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.opacity = '0';
                modal.style.pointerEvents = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
}


// ========================================================================= //
// 11. CONTACT FORM TRANSMISSION HANDLER                                     //
// ========================================================================= //
function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const submitBtn = document.getElementById('form-submit-btn');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="inline-block animate-spin mr-2">⚙</span> TRANSMITTING SIGNAL...';
        }

        setTimeout(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> TRANSMITTED SUCCESSFULLY';
            }
            if (status) status.classList.remove('hidden');
            form.reset();
            if (window.lucide) lucide.createIcons();

            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.innerHTML = '<i data-lucide="send" class="w-4 h-4"></i> TRANSMIT SIGNAL';
                    if (window.lucide) lucide.createIcons();
                }
            }, 3500);
        }, 1200);
    });
}


// ========================================================================= //
// 12. MOBILE NAVIGATION DRAWER                                              //
// ========================================================================= //
function initMobileNav() {
    const btn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-nav');
    const links = document.querySelectorAll('.mobile-nav-link');

    if (!btn || !drawer) return;

    let isOpen = false;

    function toggleMenu() {
        isOpen = !isOpen;
        drawer.style.maxHeight = isOpen ? '600px' : '0px';
    }

    btn.addEventListener('click', toggleMenu);

    links.forEach(link => {
        link.addEventListener('click', () => {
            isOpen = false;
            drawer.style.maxHeight = '0px';
        });
    });
}


// ========================================================================= //
// 13. FLOATING SCROLL PROGRESS & RETURN TO TOP                              //
// ========================================================================= //
function initScrollTopButton() {
    const fab = document.getElementById('scroll-top-fab');
    const btn = document.getElementById('scroll-top-btn');
    const circle = document.getElementById('scroll-progress-circle');

    if (!fab || !btn) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        if (totalHeight > 0 && circle) {
            const progress = Math.min(100, Math.max(0, (scrollTop / totalHeight) * 100));
            circle.setAttribute('stroke-dasharray', `${progress.toFixed(1)}, 100`);
        }

        if (scrollTop > 400) {
            fab.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
            fab.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
        } else {
            fab.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            fab.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        playTone(660, 'triangle', 0.12, 0.04);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


// ========================================================================= //
// 14. INTERACTIVE AVATAR SPEECH & ANIMATION ENGINE ("SAY HELLO")            //
// ========================================================================= //
function initAvatarSpeechSystem() {
    // Interactive avatar instance elements in Hero Section & About Section
    const avatarCards = [
        document.getElementById('hero-manga-card'),
        document.getElementById('about-avatar-card')
    ].filter(Boolean);

    const avatarImgs = [
        document.getElementById('hero-avatar-img'),
        document.getElementById('about-avatar-img')
    ].filter(Boolean);

    const avatarVideos = [
        document.getElementById('hero-avatar-video'),
        document.getElementById('about-avatar-video')
    ].filter(Boolean);

    const voiceBtns = [
        document.getElementById('hero-avatar-voice-btn'),
        document.getElementById('about-voice-btn')
    ].filter(Boolean);

    const helloPills = [
        document.getElementById('hero-say-hello-pill')
    ].filter(Boolean);

    if (avatarImgs.length === 0 && avatarVideos.length === 0) return;

    let isSpeaking = false;
    let lipSyncTimeouts = [];
    let blinkTimeout = null;
    let speechSafetyTimeout = null;

    const waveFrame = 'assets/images/manga-character-wave.jpg';
    const speakFrame = 'assets/images/manga-character-wave-speak.jpg';
    const blinkFrame = 'assets/images/manga-character-blink.jpg';
    const exactDialogue = "Hello! Welcome to my portfolio!";

    // Eagerly Preload all avatar keyframes for zero-latency frame transitions
    [waveFrame, speakFrame, blinkFrame].forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // 1. Natural Idle Blinking System (Every 3.5s - 5.5s)
    function scheduleNextBlink() {
        if (blinkTimeout) clearTimeout(blinkTimeout);
        const nextBlinkDelay = Math.random() * 2000 + 3500;
        blinkTimeout = setTimeout(() => {
            if (!isSpeaking) {
                avatarImgs.forEach(img => {
                    if (img && !img.classList.contains('hidden')) {
                        img.src = blinkFrame;
                    }
                });
                setTimeout(() => {
                    if (!isSpeaking) {
                        avatarImgs.forEach(img => {
                            if (img && !img.classList.contains('hidden')) {
                                img.src = waveFrame;
                            }
                        });
                    }
                    scheduleNextBlink();
                }, 140);
            } else {
                scheduleNextBlink();
            }
        }, nextBlinkDelay);
    }

    scheduleNextBlink();

    // 2. Video check (If MP4 video exists in assets/videos/avatar-welcome.mp4)
    avatarVideos.forEach(vid => {
        vid.addEventListener('loadeddata', () => {
            vid.classList.remove('hidden');
            avatarImgs.forEach(img => img.classList.add('hidden'));
            vid.play().catch(() => {});
        });
        vid.addEventListener('error', () => {
            vid.classList.add('hidden');
            avatarImgs.forEach(img => img.classList.remove('hidden'));
        });
        vid.src = 'assets/videos/avatar-welcome.mp4';
    });

    // 3. Manga Character Voice Speech & Lip-Sync Activation Engine
    function speakGreeting() {
        if (isSpeaking) return;
        isSpeaking = true;

        // Clear any active blink or sync timeouts
        if (blinkTimeout) clearTimeout(blinkTimeout);
        if (speechSafetyTimeout) clearTimeout(speechSafetyTimeout);
        lipSyncTimeouts.forEach(t => clearTimeout(t));
        lipSyncTimeouts = [];

        // Visual State Activation on Hero Card
        avatarCards.forEach(c => {
            c.classList.add('speaking-active');
            c.classList.add('manga-wave-active');
        });

        // Syllable-timed Lip-Sync Schedule for "Hello! Welcome to my portfolio!"
        const phonemeSchedule = [
            { time: 0, open: true },       // "Hel-"
            { time: 220, open: true },     // "-lo!"
            { time: 480, open: false },    // [pause]
            { time: 640, open: true },     // "Wel-"
            { time: 880, open: false },    // "-come"
            { time: 1080, open: true },    // "to"
            { time: 1280, open: true },    // "my"
            { time: 1520, open: true },    // "port-"
            { time: 1780, open: false },   // "-fo-"
            { time: 1980, open: true },    // "-li-"
            { time: 2220, open: true },    // "-o!"
            { time: 2550, open: false }    // End speech -> Smile
        ];

        phonemeSchedule.forEach(step => {
            const t = setTimeout(() => {
                if (isSpeaking) {
                    avatarImgs.forEach(img => {
                        if (img && !img.classList.contains('hidden')) {
                            img.src = step.open ? speakFrame : waveFrame;
                        }
                    });
                }
            }, step.time);
            lipSyncTimeouts.push(t);
        });

        // Replay any active videos
        avatarVideos.forEach(vid => {
            if (!vid.classList.contains('hidden')) {
                vid.currentTime = 0;
                vid.play().catch(() => {});
            }
        });

        // Anime Sparkle / Chime SFX
        if (soundEnabled) {
            playTone(840, 'triangle', 0.12, 0.05);
            setTimeout(() => playTone(1120, 'sine', 0.18, 0.05), 100);
        }

        // Manga Character Voice Speech Synthesis
        if ('speechSynthesis' in window) {
            try {
                window.speechSynthesis.resume();
                window.speechSynthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(exactDialogue);
                // Energetic, youthful anime protagonist voice tuning
                utterance.rate = 1.05;
                utterance.pitch = 1.25;
                utterance.volume = soundEnabled ? 1.0 : 0.0;

                const voices = window.speechSynthesis.getVoices();
                if (voices.length > 0) {
                    const preferredVoice = voices.find(v => 
                        v.lang.startsWith('en') && 
                        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Guy') || v.name.includes('David') || v.name.includes('Daniel') || v.name.includes('Male'))
                    ) || voices.find(v => v.lang.startsWith('en'));
                    if (preferredVoice) utterance.voice = preferredVoice;
                }

                utterance.onend = () => resetSpeakingState();
                utterance.onerror = () => resetSpeakingState();

                window.speechSynthesis.speak(utterance);
            } catch (err) {
                console.warn("SpeechSynthesis error:", err);
            }
        }

        // Safety fallback timer to guarantee reset even if browser speech API pauses or hangs
        speechSafetyTimeout = setTimeout(() => {
            resetSpeakingState();
        }, 2750);
    }

    function resetSpeakingState() {
        if (!isSpeaking) return;
        isSpeaking = false;

        if (speechSafetyTimeout) clearTimeout(speechSafetyTimeout);
        lipSyncTimeouts.forEach(t => clearTimeout(t));
        lipSyncTimeouts = [];

        avatarImgs.forEach(img => {
            if (img && !img.classList.contains('hidden')) {
                img.src = waveFrame;
            }
        });
        avatarCards.forEach(c => {
            c.classList.remove('speaking-active');
            c.classList.remove('manga-wave-active');
        });

        // Restart idle blink loop
        scheduleNextBlink();
    }

    // Export globally for automatic invocation
    window.speakMangaGreeting = speakGreeting;

    // Attach Click Events to all Interactive Greeting Triggers
    const triggerElements = [
        ...voiceBtns,
        ...helloPills,
        ...avatarImgs,
        ...avatarVideos
    ];

    triggerElements.forEach(el => {
        if (el) {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                speakGreeting();
            });
        }
    });

    // Warm-up SpeechSynthesis voices
    if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }
}

