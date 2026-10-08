// ========================================================================= //
// AJAIKANTH SARAVANAN - MANGA PORTFOLIO INTERACTIVE CONTROLLER               //
// ========================================================================= //

document.addEventListener('DOMContentLoaded', () => {
    initAudioSystem();
    initCinematicEntrance();
    initSpeedlinesCanvas();
    initTypewriter();
    initCustomCursor();
    initHeroTilt();
    initFilterTabs();
    initModals();
    initContactForm();
    initMobileNav();
    initScrollTopButton();
});

// ========================================================================= //
// 1. SOUND EFFECTS SYNTHESIZER (WEB AUDIO API)                              //
// ========================================================================= //
let audioCtx = null;
let soundEnabled = true;

function initAudioSystem() {
    const audioBtn = document.getElementById('audio-toggle-btn');
    const audioLandingBtn = document.getElementById('audio-toggle-landing');
    const audioStatusText = document.getElementById('audio-status-text');
    
    function toggleAudio() {
        soundEnabled = !soundEnabled;
        const icon = soundEnabled ? 'volume-2' : 'volume-x';
        
        if (audioBtn) {
            audioBtn.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4 ${soundEnabled ? 'text-black' : 'text-neutral-400'}"></i>`;
        }
        if (audioLandingBtn) {
            audioLandingBtn.innerHTML = `<i data-lucide="${icon}" class="w-3.5 h-3.5"></i> <span id="audio-status-text">${soundEnabled ? 'AUDIO ON' : 'AUDIO OFF'}</span>`;
        }
        lucide.createIcons();
        if (soundEnabled) playTone(880, 'sine', 0.1, 0.05);
    }

    if (audioBtn) audioBtn.addEventListener('click', toggleAudio);
    if (audioLandingBtn) audioLandingBtn.addEventListener('click', toggleAudio);

    // Attach click SFX to buttons & links
    document.querySelectorAll('button, a, .manga-exact-tag, .manga-card, .project-modal-trigger').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (soundEnabled) playTone(540, 'triangle', 0.04, 0.02);
        });
        el.addEventListener('click', (e) => {
            if (soundEnabled) playTone(880, 'sine', 0.08, 0.04);
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

function playTone(freq, type = 'sine', duration = 0.1, vol = 0.05) {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
        // Ignore audio policy errors before interaction
    }
}

function playCinematicZoomSound() {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        
        // Deep sub bass sweep
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sawtooth';
        subOsc.frequency.setValueAtTime(60, now);
        subOsc.frequency.exponentialRampToValueAtTime(800, now + 1.2);
        subGain.gain.setValueAtTime(0.08, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 1.2);

        // Cyber chime
        setTimeout(() => playTone(1200, 'sine', 0.3, 0.05), 400);
        setTimeout(() => playTone(1600, 'sine', 0.4, 0.06), 800);
    } catch (e) {}
}


// ========================================================================= //
// 2. CINEMATIC MANGA ENTRANCE CONTROLLER                                    //
// ========================================================================= //
function initCinematicEntrance() {
    const landing = document.getElementById('cinematic-landing');
    const bookContainer = document.getElementById('manga-book-container');
    const startBtn = document.getElementById('book-start-btn');
    const skipBtn = document.getElementById('skip-intro-btn');
    const replayBtn = document.getElementById('replay-intro-btn');
    const buildingOverlay = document.getElementById('building-overlay');
    const buildingProgress = document.getElementById('building-progress');
    const buildingConsole = document.getElementById('building-console');
    const portfolioApp = document.getElementById('portfolio-app');

    let isLaunching = false;

    // Launch Transition into Full Site
    function launchFullPortfolio() {
        if (isLaunching) return;
        isLaunching = true;

        playCinematicZoomSound();

        // 1. Show Building Overlay
        setTimeout(() => {
            if (buildingOverlay) {
                buildingOverlay.style.opacity = '1';
                buildingOverlay.style.pointerEvents = 'auto';
            }
            if (buildingProgress) {
                setTimeout(() => buildingProgress.style.width = '100%', 100);
            }

            const logs = [
                '> Loading neural weights...',
                '> Initializing PyTorch & CUDA engines...',
                '> Compiling Java high-throughput services...',
                '> Verifying data pipeline integrity...',
                '> Deploying Ajaikanth Portfolio System [OK]'
            ];
            
            let logIdx = 0;
            const logTimer = setInterval(() => {
                logIdx++;
                if (logIdx < logs.length && buildingConsole) {
                    buildingConsole.innerHTML = `<span>${logs[logIdx]}</span>`;
                } else {
                    clearInterval(logTimer);
                }
            }, 250);

        }, 150);

        // 2. Reveal Homepage
        setTimeout(() => {
            if (landing) {
                landing.style.opacity = '0';
                landing.style.pointerEvents = 'none';
            }
            if (portfolioApp) {
                portfolioApp.style.opacity = '1';
            }
            document.body.style.overflow = 'auto';
            lucide.createIcons();

            setTimeout(() => {
                if (buildingOverlay) buildingOverlay.style.opacity = '0';
                if (buildingProgress) buildingProgress.style.width = '0%';
                isLaunching = false;
            }, 1000);

        }, 1500);
    }

    if (startBtn) startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        launchFullPortfolio();
    });

    if (skipBtn) skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        launchFullPortfolio();
    });

    if (landing) {
        landing.addEventListener('click', launchFullPortfolio);
    }

    // Replay Book Cover from Navbar
    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'instant' });
            if (portfolioApp) portfolioApp.style.opacity = '0';
            if (landing) {
                landing.style.opacity = '1';
                landing.style.pointerEvents = 'auto';
            }
            document.body.style.overflow = 'hidden';
        });
    }
}


// ========================================================================= //
// 3. AMBIENT MANGA SPEEDLINES CANVAS                                        //
// ========================================================================= //
function initSpeedlinesCanvas() {
    const canvas = document.getElementById('speedlines-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const lines = [];
    const numLines = 30;

    for (let i = 0; i < numLines; i++) {
        lines.push({
            x: Math.random() * width,
            y: Math.random() * height,
            length: Math.random() * 80 + 30,
            speed: Math.random() * 2 + 1,
            opacity: Math.random() * 0.25 + 0.05,
            width: Math.random() * 1.5 + 0.5
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = '#000000';
        lines.forEach(line => {
            ctx.beginPath();
            ctx.lineWidth = line.width;
            ctx.globalAlpha = line.opacity;
            ctx.moveTo(line.x, line.y);
            ctx.lineTo(line.x, line.y + line.length);
            ctx.stroke();

            line.y += line.speed;
            if (line.y > height) {
                line.y = -line.length;
                line.x = Math.random() * width;
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
}


// ========================================================================= //
// 4. TYPEWRITER EFFECT FOR HERO HEADLINE                                    //
// ========================================================================= //
function initTypewriter() {
    const target = document.getElementById('hero-typewriter');
    if (!target) return;

    const roles = [
        "AI & Data Science",
        "Deep Learning",
        "Multi-Agent AI",
        "High-Scale Distributed",
        "Full-Stack Intelligent"
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIdx];
        
        if (isDeleting) {
            target.textContent = currentRole.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50;
        } else {
            target.textContent = currentRole.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 110;
        }

        if (!isDeleting && charIdx === currentRole.length) {
            isDeleting = true;
            typingSpeed = 1800; // Pause at full word
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            typingSpeed = 400;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}


// ========================================================================= //
// 5. CUSTOM ANIME CURSOR                                                    //
// ========================================================================= //
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    document.querySelectorAll('a, button, input, textarea, .manga-exact-tag, .manga-card').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
}


// ========================================================================= //
// 6. 3D TILT EFFECT ON HERO MANGA CARD                                      //
// ========================================================================= //
function initHeroTilt() {
    const card = document.getElementById('hero-manga-card');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const tiltX = (y / (rect.height / 2)) * -8;
        const tiltY = (x / (rect.width / 2)) * 8;

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
}


// ========================================================================= //
// 7. MANGA SFX FLOATING KANJI ON CLICKS                                     //
// ========================================================================= //
function createMangaSFX(x, y) {
    const container = document.getElementById('sfx-container');
    if (!container || !x || !y) return;

    const sfxList = [
        "ドドド (DODODO)",
        "ゴゴゴ (GOGOGO)",
        "バァン (BAAAM)",
        "ズキュウウウン",
        "シュッ (SWOOSH)",
        "ビシッ (SPARK)",
        "カチッ (CLICK)"
    ];

    const sfx = document.createElement('div');
    sfx.className = 'manga-sfx-float';
    sfx.textContent = sfxList[Math.floor(Math.random() * sfxList.length)];
    sfx.style.left = `${x}px`;
    sfx.style.top = `${y}px`;
    sfx.style.fontSize = `${Math.floor(Math.random() * 6 + 13)}px`;

    container.appendChild(sfx);

    setTimeout(() => {
        sfx.remove();
    }, 1200);
}


// ========================================================================= //
// 8. FILTER TABS (SKILLS)                                                   //
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
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 200);
                }
            });
        });
    });
}


// ========================================================================= //
// 9. MODALS SYSTEM (PROJECT DETAIL & RESUME VIEWER)                         //
// ========================================================================= //
const projectData = {
    omnivision: {
        title: "OmniVision Neural Engine",
        category: "COMPUTER VISION & MULTIMODAL AI",
        description: "A production-grade multimodal perception platform designed for zero-shot real-time object tracking, spatial relationship graph parsing, and automated natural language scene synthesis.",
        architecture: "PyTorch, CUDA, FastAPI, YOLOv9, Vision-Language Transformers (CLIP + Qwen-VL), WebSockets.",
        metrics: "Sub-25ms frame inference, 94.6% mean Average Precision (mAP), deployed across GPU clusters with ONNX Runtime acceleration.",
        github: "https://github.com"
    },
    nexus: {
        title: "NexusAI Agentic Workflow Framework",
        category: "AUTONOMOUS MULTI-AGENT ORCHESTRATION",
        description: "An autonomous hierarchical agent orchestration engine that breaks down large-scale statistical data exploration into modular agent tasks (Data Profiler, Feature Synthesizer, Model Evaluator, Report Generator).",
        architecture: "LangGraph, Python, OpenAI GPT-4o, AsyncIO, Vector Embeddings (ChromaDB), Streamlit UI.",
        metrics: "Reduces exploratory data analysis turnaround time by 75% while producing reproducible Jupyter notebooks and executive summaries.",
        github: "https://github.com"
    },
    deepinsight: {
        title: "DeepInsight Time-Series Forecaster",
        category: "HIGH-FREQUENCY PREDICTIVE ANALYTICS",
        description: "Advanced deep probabilistic forecasting system combining Temporal Fusion Transformers (TFT) with conformal prediction intervals for risk-aware telemetry and demand projections.",
        architecture: "Python, PyTorch Forecasting, Pandas, NumPy, Optuna, Plotly, FastParquet.",
        metrics: "Achieved 98.4% directional accuracy on benchmark telemetry datasets with strict calibrated confidence bounds.",
        github: "https://github.com"
    },
    quantumscale: {
        title: "QuantumScale Distributed Backend",
        category: "HIGH-THROUGHPUT JAVA ENTERPRISE",
        description: "Ultra low-latency Java 21 distributed microservices infrastructure with non-blocking virtual threads and Kafka event streaming for real-time transactions.",
        architecture: "Java 21, Spring Boot 3, Apache Kafka, Redis Cluster, PostgreSQL, Docker, AWS ECS.",
        metrics: "Zero-data-loss pipeline processing 25,000 requests/sec with p99 response time under 12ms.",
        github: "https://github.com"
    },
    aegis: {
        title: "AegisSec Neural Shield",
        category: "AI CYBERSECURITY & ADVERSARIAL DEFENSE",
        description: "Real-time prompt injection and adversarial perturbation detection engine protecting production Large Language Model deployments.",
        architecture: "PyTorch, Hugging Face Transformers, FastAPI, Redis, Docker, Prometheus.",
        metrics: "99.1% detection rate on adversarial prompt benchmarks with under 15ms overhead per query.",
        github: "https://github.com"
    },
    dataflow: {
        title: "DataFlow Stream Engine",
        category: "SCALABLE DATA PIPELINES",
        description: "Unified streaming data pipeline framework built on Apache Spark & Iceberg for automated ETL, schema drift handling, and high-performance querying.",
        architecture: "Apache Spark, PySpark, Apache Iceberg, PostgreSQL, Docker, Kubernetes.",
        metrics: "Handles multi-gigabyte continuous event ingestion with automated compaction and sub-minute query latency.",
        github: "https://github.com"
    }
};

function initModals() {
    // Project Modal Elements
    const projectModal = document.getElementById('project-modal');
    const closeProjectModal = document.getElementById('close-project-modal');
    const modalTitle = document.getElementById('modal-project-title');
    const modalCategory = document.getElementById('modal-project-category');
    const modalBody = document.getElementById('modal-project-body');
    const modalGithub = document.getElementById('modal-project-github');

    document.querySelectorAll('.project-modal-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-project');
            const data = projectData[key];
            if (!data) return;

            modalTitle.textContent = data.title;
            modalCategory.textContent = data.category;
            modalGithub.href = data.github;

            modalBody.innerHTML = `
                <div class="space-y-4">
                    <div>
                        <h4 class="font-syne font-bold text-black text-sm uppercase">Overview</h4>
                        <p class="text-xs text-neutral-800 mt-1 leading-relaxed">${data.description}</p>
                    </div>
                    <div class="p-4 bg-white border-2 border-black space-y-2 shadow-[2px_2px_0px_#000]">
                        <div class="font-mono text-xs text-neutral-800"><strong class="text-black">ARCHITECTURE:</strong> ${data.architecture}</div>
                        <div class="font-mono text-xs text-emerald-800"><strong class="text-black">KEY METRICS:</strong> ${data.metrics}</div>
                    </div>
                </div>
            `;

            projectModal.style.opacity = '1';
            projectModal.style.pointerEvents = 'auto';
            document.body.style.overflow = 'hidden';
            lucide.createIcons();
        });
    });

    if (closeProjectModal) {
        closeProjectModal.addEventListener('click', () => {
            projectModal.style.opacity = '0';
            projectModal.style.pointerEvents = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Resume Modal Elements
    const resumeModal = document.getElementById('resume-modal');
    const heroResumeBtn = document.getElementById('hero-resume-btn');
    const closeResumeModal = document.getElementById('close-resume-modal');
    const downloadResumeBtn = document.getElementById('download-resume-btn');

    function openResume() {
        resumeModal.style.opacity = '1';
        resumeModal.style.pointerEvents = 'auto';
        document.body.style.overflow = 'hidden';
        lucide.createIcons();
    }

    if (heroResumeBtn) heroResumeBtn.addEventListener('click', openResume);

    if (closeResumeModal) {
        closeResumeModal.addEventListener('click', () => {
            resumeModal.style.opacity = '0';
            resumeModal.style.pointerEvents = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', () => {
            window.print();
        });
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
// 10. CONTACT FORM HANDLER                                                  //
// ========================================================================= //
function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const submitBtn = document.getElementById('form-submit-btn');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="animate-spin inline-block mr-2">⚙</span> TRANSMITTING...';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> TRANSMITTED';
            status.classList.remove('hidden');
            form.reset();
            lucide.createIcons();

            setTimeout(() => {
                submitBtn.innerHTML = '<i data-lucide="send" class="w-4 h-4"></i> TRANSMIT SIGNAL';
                lucide.createIcons();
            }, 4000);
        }, 1200);
    });
}


// ========================================================================= //
// 11. MOBILE NAVIGATION DRAWER                                              //
// ========================================================================= //
function initMobileNav() {
    const btn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-nav');
    const links = document.querySelectorAll('.mobile-nav-link');

    if (!btn || !drawer) return;

    let isOpen = false;

    function toggleMenu() {
        isOpen = !isOpen;
        if (isOpen) {
            drawer.style.maxHeight = '600px';
        } else {
            drawer.style.maxHeight = '0px';
        }
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
// 12. FLOATING SCROLL-TO-TOP & PROGRESS CONTROLLER                          //
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

        if (scrollTop > 350) {
            fab.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
            fab.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
        } else {
            fab.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            fab.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        playTone(660, 'triangle', 0.12, 0.04);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
