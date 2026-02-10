/* ============================================
   Sparkle & Shine Cleaning Co. — Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Custom Cursor ---------- */
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX - 4 + 'px';
            cursor.style.top = mouseY - 4 + 'px';
        });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Hover effect on interactive elements
        document.querySelectorAll('a, button, .service-card, .pricing-card, .trust-badge, .review-card').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    /* ---------- Navbar Scroll ---------- */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        // Active nav link
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) current = section.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    });

    /* ---------- Mobile Menu ---------- */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });

    /* ---------- Scroll Reveal ---------- */
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger siblings
                const parent = entry.target.parentElement;
                const siblings = Array.from(parent.querySelectorAll('.reveal'));
                const index = siblings.indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));

    /* ---------- Counter Animation ---------- */
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.target);
                const isDecimal = el.dataset.decimal === 'true';
                const duration = 2000;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = eased * target;
                    el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
                    if (progress < 1) requestAnimationFrame(update);
                }
                requestAnimationFrame(update);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));

    /* ---------- Reviews Carousel ---------- */
    const track = document.getElementById('reviewsTrack');
    const cards = track.querySelectorAll('.review-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');

    let currentSlide = 0;
    let slidesVisible = 3;
    let totalSlides = cards.length;
    let autoplayInterval;

    function updateSlidesVisible() {
        if (window.innerWidth < 768) slidesVisible = 1;
        else if (window.innerWidth < 1024) slidesVisible = 2;
        else slidesVisible = 3;
    }

    function getMaxSlide() {
        return Math.max(0, totalSlides - slidesVisible);
    }

    function buildDots() {
        dotsContainer.innerHTML = '';
        const max = getMaxSlide() + 1;
        for (let i = 0; i < max; i++) {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot' + (i === currentSlide ? ' active' : '');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function goToSlide(n) {
        currentSlide = Math.max(0, Math.min(n, getMaxSlide()));
        const cardWidth = cards[0].offsetWidth + 24; // card + gap
        track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
        dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() {
        goToSlide(currentSlide >= getMaxSlide() ? 0 : currentSlide + 1);
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    prevBtn.addEventListener('click', () => { stopAutoplay(); goToSlide(currentSlide - 1); startAutoplay(); });
    nextBtn.addEventListener('click', () => { stopAutoplay(); nextSlide(); startAutoplay(); });

    // Touch/swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; stopAutoplay(); }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? nextSlide() : goToSlide(currentSlide - 1);
        }
        startAutoplay();
    }, { passive: true });

    function initCarousel() {
        updateSlidesVisible();
        buildDots();
        goToSlide(0);
        startAutoplay();
    }

    window.addEventListener('resize', () => {
        updateSlidesVisible();
        buildDots();
        goToSlide(Math.min(currentSlide, getMaxSlide()));
    });

    initCarousel();

    /* ---------- Form Floating Labels for Selects ---------- */
    document.querySelectorAll('.form-group select').forEach(select => {
        select.addEventListener('change', () => {
            const label = select.nextElementSibling;
            if (select.value) label.classList.add('active');
            else label.classList.remove('active');
        });
    });

    /* ---------- Form Submit ---------- */
    document.getElementById('quoteForm').addEventListener('submit', e => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        btn.innerHTML = '<span>✓ Quote Request Sent!</span>';
        btn.style.background = 'linear-gradient(135deg, #059669, #10B981)';
        setTimeout(() => {
            btn.innerHTML = '<span>Send Quote Request</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/></svg>';
            btn.style.background = '';
            e.target.reset();
        }, 3000);
    });

    /* ---------- Sparkle / Bubble Particles ---------- */
    const canvas = document.getElementById('heroCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.offsetWidth;
            this.y = Math.random() * canvas.offsetHeight;
            this.size = Math.random() * 3 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3 - 0.2;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.fadeSpeed = Math.random() * 0.003 + 0.001;
            this.life = 1;
            this.isBubble = Math.random() > 0.6;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.fadeSpeed;
            if (this.life <= 0 || this.y < -10 || this.x < -10 || this.x > canvas.offsetWidth + 10) {
                this.reset();
                this.y = canvas.offsetHeight + 10;
            }
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.life * this.opacity;
            if (this.isBubble) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(8, 145, 178, 0.4)';
                ctx.lineWidth = 0.5;
                ctx.stroke();
                // Highlight
                ctx.beginPath();
                ctx.arc(this.x - this.size * 0.5, this.y - this.size * 0.5, this.size * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fill();
            } else {
                // Sparkle (4-point star)
                const s = this.size;
                ctx.fillStyle = `rgba(34, 211, 238, ${this.life * 0.8})`;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - s);
                ctx.lineTo(this.x + s * 0.3, this.y);
                ctx.lineTo(this.x, this.y + s);
                ctx.lineTo(this.x - s * 0.3, this.y);
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(this.x - s, this.y);
                ctx.lineTo(this.x, this.y + s * 0.3);
                ctx.lineTo(this.x + s, this.y);
                ctx.lineTo(this.x, this.y - s * 0.3);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
        }
    }

    function initParticles() {
        resizeCanvas();
        particles = [];
        const count = Math.min(80, Math.floor(canvas.offsetWidth * canvas.offsetHeight / 12000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        particles.forEach(p => { p.update(); p.draw(); });
        animId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animId);
        initParticles();
        animateParticles();
    });

    /* ---------- Smooth scroll for all anchor links ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
