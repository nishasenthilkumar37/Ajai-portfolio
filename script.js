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
    initTerminalBot();
    initContactForm();
    initMobileNav();
    initScrollTopButton();
});

// ========================================================================= //
// 1. SOUND EFFECTS SYNTHESIZER (WEB AUDIO API - ZERO EXTERNAL ASSETS)       //
// ========================================================================= //
let audioCtx = null;
let soundEnabled = true;

function initAudioSystem() {
    const audioBtn = document.getElementById('audio-toggle-btn');
    
    // Toggle sound
    if (audioBtn) {
        audioBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            audioBtn.innerHTML = soundEnabled 
                ? '<i data-lucide="volume-2" class="w-4 h-4"></i>' 
                : '<i data-lucide="volume-x" class="w-4 h-4 text-neutral-500"></i>';
            lucide.createIcons();
            if (soundEnabled) playTone(880, 'sine', 0.1, 0.05);
        });
    }

    // Attach click SFX to buttons & links
    document.querySelectorAll('button, a, .manga-badge, .project-modal-trigger').forEach(el => {
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
        // Audio policy ignore
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
// 2. CINEMATIC MANGA ENTRANCE (2-STAGE ZOOM & SCROLL CONTROLLER)            //
// ========================================================================= //
function initCinematicEntrance() {
    const landing = document.getElementById('cinematic-landing');
    const stage = document.getElementById('entrance-stage');
    const portal = document.getElementById('portal-trigger');
    const charWrapper = document.getElementById('landing-character-wrapper');
    const stageTiny = document.getElementById('stage-tiny-info');
    const stageZoomed = document.getElementById('stage-zoomed-info');
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const startBtn = document.getElementById('start-portfolio-btn');
    const buildingOverlay = document.getElementById('building-overlay');
    const buildingProgress = document.getElementById('building-progress');
    const buildingConsole = document.getElementById('building-console');
    const portfolioApp = document.getElementById('portfolio-app');
    const skipBtn = document.getElementById('skip-intro-btn');
    const replayBtn = document.getElementById('replay-intro-btn');

    let isZoomed = false;
    let isEntering = false;

    // Stage 1 -> Stage 2: Zoom In
    function zoomIn() {
        if (isZoomed || isEntering) return;
        isZoomed = true;
        
        playTone(660, 'sine', 0.15, 0.05);
        setTimeout(() => playTone(880, 'triangle', 0.2, 0.05), 100);

        stage.classList.remove('state-tiny');
        stage.classList.add('state-zoomed');

        stageTiny.classList.add('hidden');
        stageZoomed.classList.remove('hidden');
        stageZoomed.classList.add('flex');

        lucide.createIcons();
    }

    // Stage 2 -> Stage 1: Zoom Out
    function zoomOut() {
        if (!isZoomed || isEntering) return;
        isZoomed = false;

        playTone(440, 'sine', 0.1, 0.04);

        stage.classList.remove('state-zoomed');
        stage.classList.add('state-tiny');

        stageZoomed.classList.add('hidden');
        stageZoomed.classList.remove('flex');
        stageTiny.classList.remove('hidden');

        lucide.createIcons();
    }

    // Stage 2 -> Launch: Click to Start & Full Cinematic Burst
    function launchPortfolio() {
        if (isEntering) return;
        isEntering = true;

        playCinematicZoomSound();

        // 1. Zoom Character Beyond Screen & Fade Info
        charWrapper.classList.add('zooming-active');
        stageZoomed.style.opacity = '0';
        stageZoomed.style.transform = 'translateY(20px)';

        // 2. Show "BUILDING..." Overlay
        setTimeout(() => {
            buildingOverlay.style.opacity = '1';
            buildingOverlay.style.pointerEvents = 'auto';
            
            // Progress Bar Animation
            setTimeout(() => {
                buildingProgress.style.width = '100%';
            }, 100);

            // Diagnostics Feed cycling
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
                if (logIdx < logs.length) {
                    buildingConsole.innerHTML = `<span>${logs[logIdx]}</span>`;
                } else {
                    clearInterval(logTimer);
                }
            }, 280);

        }, 350);

        // 3. Seamless Transition to Homepage
        setTimeout(() => {
            landing.style.opacity = '0';
            landing.style.pointerEvents = 'none';
            portfolioApp.style.opacity = '1';
            document.body.style.overflow = 'auto';

            // Refresh icons after DOM display
            lucide.createIcons();
            
            // Cleanup entrance classes
            setTimeout(() => {
                charWrapper.classList.remove('zooming-active');
                buildingOverlay.style.opacity = '0';
                buildingProgress.style.width = '0%';
                stageZoomed.style.opacity = '1';
                stageZoomed.style.transform = 'none';
                zoomOut();
                isEntering = false;
            }, 1000);

        }, 1850);
    }

    // Event Triggers
    if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);
    if (startBtn) startBtn.addEventListener('click', launchPortfolio);

    // Clicking Character: if tiny -> zoom in; if zoomed -> launch!
    if (portal) {
        portal.addEventListener('click', () => {
            if (!isZoomed) {
                zoomIn();
            } else {
                launchPortfolio();
            }
        });
    }

    // Mouse Wheel Scroll on Entrance Screen
    if (landing) {
        landing.addEventListener('wheel', (e) => {
            if (landing.style.pointerEvents === 'none') return;
            if (e.deltaY > 15 && !isZoomed) {
                zoomIn();
            } else if (e.deltaY < -15 && isZoomed) {
                zoomOut();
            }
        }, { passive: true });

        // Touch Swipe on Mobile
        let touchStartY = 0;
        landing.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        landing.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            if (diff > 30 && !isZoomed) {
                zoomIn(); // Swiped up/scrolled down
            } else if (diff < -30 && isZoomed) {
                zoomOut(); // Swiped down/scrolled up
            }
        }, { passive: true });
    }

    // Skip Intro Button
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            landing.style.opacity = '0';
            landing.style.pointerEvents = 'none';
            portfolioApp.style.opacity = '1';
            document.body.style.overflow = 'auto';
            lucide.createIcons();
        });
    }

    // Replay Intro Button in Navbar
    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'instant' });
            portfolioApp.style.opacity = '0';
            landing.style.opacity = '1';
            landing.style.pointerEvents = 'auto';
            document.body.style.overflow = 'hidden';
            zoomOut();
        });
    }
}


// ========================================================================= //
// 3. AMBIENT MANGA SPEEDLINES & PARTICLES CANVAS                            //
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
    const numLines = 35;

    for (let i = 0; i < numLines; i++) {
        lines.push({
            x: Math.random() * width,
            y: Math.random() * height,
            length: Math.random() * 80 + 30,
            speed: Math.random() * 2 + 1,
            opacity: Math.random() * 0.3 + 0.05,
            width: Math.random() * 1.5 + 0.5
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = '#ffffff';
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

    document.querySelectorAll('a, button, input, textarea, .manga-badge, .manga-card, #portal-trigger').forEach(el => {
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

        const tiltX = (y / (rect.height / 2)) * -10;
        const tiltY = (x / (rect.width / 2)) * 10;

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
    sfx.style.fontSize = `${Math.floor(Math.random() * 8 + 14)}px`;

    container.appendChild(sfx);

    setTimeout(() => {
        sfx.remove();
    }, 1200);
}


// ========================================================================= //
// 8. FILTER TABS (SKILLS & PROJECTS)                                        //
// ========================================================================= //
function initFilterTabs() {
    // Skill Tabs
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

    // Project Tabs
    const projectBtns = document.querySelectorAll('.project-filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    projectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            projectBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            projectItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'flex';
                    setTimeout(() => item.style.opacity = '1', 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 200);
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
        metrics: "Sub-28ms frame inference, 94.6% mean Average Precision (mAP), deployed across GPU clusters with ONNX Runtime acceleration.",
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
        description: "Advanced deep probabilistic forecasting system combining Temporal Fusion Transformers (TFT) with conformal prediction intervals for risk-aware financial market and demand projections.",
        architecture: "Python, PyTorch Forecasting, Pandas, NumPy, Optuna, Plotly, FastParquet.",
        metrics: "Achieved 98.4% directional accuracy on benchmark telemetry datasets with strict calibrated confidence bounds.",
        github: "https://github.com"
    },
    neuraldoc: {
        title: "NeuralDoc Enterprise RAG Intelligence",
        category: "FULL STACK RETRIEVAL-AUGMENTED GENERATION",
        description: "Enterprise knowledge retrieval platform capable of parsing unstructured PDFs, markdown, and tabular files with hybrid vector + lexical keyword ranking and hallucination mitigation guardrails.",
        architecture: "Next.js 14, Java Spring Boot 3, Qdrant Vector Database, LangChain, Tailwind CSS, Docker.",
        metrics: "Processes 500+ page technical manuals in under 4 seconds with exact paragraph and footnote citation anchors.",
        github: "https://github.com"
    },
    autoflow: {
        title: "AutoFlow Distributed ETL & Streaming",
        category: "DISTRIBUTED DATA ENGINEERING",
        description: "Scalable streaming ingestion engine built to ingest, validate, and partition millions of streaming events per hour with automated schema evolution and Kafka integration.",
        architecture: "Java 21, Apache Kafka, Apache Spark, PostgreSQL, Docker, AWS S3.",
        metrics: "Zero-data-loss pipeline handling up to 15,000 events/second with sub-second message serialization.",
        github: "https://github.com"
    },
    cyberpulse: {
        title: "CyberPulse Clinical Diagnostics AI",
        category: "HEALTHCARE & INTERPRETABLE DEEP LEARNING",
        description: "Medical imaging triage assistant utilizing convolutional vision backbones augmented with Grad-CAM saliency heatmaps to provide explainable diagnostic assistance for radiologists.",
        architecture: "PyTorch, TorchVision, React, FastAPI, DICOM standard parser, Albumentations.",
        metrics: "Validated on benchmark chest X-ray and CT datasets with 97.2% sensitivity and visual heatmap interpretation.",
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
                        <h4 class="font-syne font-bold text-white text-sm uppercase">Overview</h4>
                        <p class="text-xs text-neutral-300 mt-1 leading-relaxed">${data.description}</p>
                    </div>
                    <div class="p-4 bg-neutral-900 rounded-lg border border-neutral-800 space-y-2">
                        <div class="font-mono text-xs text-neutral-400"><strong>ARCHITECTURE:</strong> ${data.architecture}</div>
                        <div class="font-mono text-xs text-emerald-400"><strong>KEY METRICS:</strong> ${data.metrics}</div>
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
    const mobileResumeBtn = document.getElementById('resume-modal-btn-mobile');
    const closeResumeModal = document.getElementById('close-resume-modal');
    const downloadResumeBtn = document.getElementById('download-resume-btn');

    function openResume() {
        resumeModal.style.opacity = '1';
        resumeModal.style.pointerEvents = 'auto';
        document.body.style.overflow = 'hidden';
        lucide.createIcons();
    }

    if (heroResumeBtn) heroResumeBtn.addEventListener('click', openResume);
    if (mobileResumeBtn) mobileResumeBtn.addEventListener('click', openResume);

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
// 10. INTERACTIVE MANGA AI TERMINAL ASSISTANT                               //
// ========================================================================= //
function initTerminalBot() {
    const form = document.getElementById('terminal-form');
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');

    if (!form || !input || !output) return;

    const botResponses = {
        help: "Available commands: 'skills', 'projects', 'experience', 'education', 'contact', 'about', 'clear'",
        skills: "Ajaikanth's Arsenal: PyTorch, TensorFlow, Python, Java, Apache Spark, LLMs, Computer Vision, FastAPI, Docker, BigQuery.",
        projects: "Flagship systems: OmniVision (CV), NexusAI (Multi-Agent), DeepInsight (Time Series), NeuralDoc (Enterprise RAG), AutoFlow (ETL).",
        experience: "AI & ML Engineer at Cognitive Labs (2024-Present), former Data Science Engineer at DataMatrix (2023-2024).",
        education: "B.Tech in CS & Engineering (AI & Data Science Specialization) • First Class with Distinction (CGPA: 9.2).",
        contact: "Direct email: ajaikanth.saravanan@email.com | GitHub: github.com/ajaikanth | LinkedIn: linkedin.com/in/ajaikanth",
        about: "Ajaikanth is an AI & Data Science Engineer building high-scale neural systems and distributed software.",
        clear: "__CLEAR__"
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const cmd = input.value.trim().toLowerCase();
        if (!cmd) return;

        input.value = '';

        if (cmd === 'clear') {
            output.innerHTML = '';
            return;
        }

        // Add user line
        const userLine = document.createElement('div');
        userLine.className = 'text-white font-semibold';
        userLine.textContent = `> ${cmd}`;
        output.appendChild(userLine);

        // Compute response
        let reply = botResponses[cmd];
        if (!reply) {
            if (cmd.includes('hire') || cmd.includes('job') || cmd.includes('work')) {
                reply = "Ajaikanth is open to high-impact AI/ML engineering roles! Send a transmission via the contact form.";
            } else if (cmd.includes('python') || cmd.includes('java')) {
                reply = "Proficient in Python (Deep Learning/Data) and Java (Scalable Microservices & Distributed Pipelines).";
            } else {
                reply = `Command '${cmd}' unrecognized. Type 'help' to see available commands or ask about skills/projects.`;
            }
        }

        // Add bot line
        const botLine = document.createElement('div');
        botLine.className = 'text-emerald-400';
        botLine.textContent = `ajai-bot: ${reply}`;
        output.appendChild(botLine);

        output.scrollTop = output.scrollHeight;
    });
}


// ========================================================================= //
// 11. CONTACT FORM HANDLER                                                  //
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
// 13. FLOATING SCROLL-TO-TOP & PROGRESS CONTROLLER                          //
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

