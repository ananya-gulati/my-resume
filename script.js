document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       MOBILE DRAWER NAVIGATION
       ========================================================================== */
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const closeDrawer = document.querySelector('.close-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openMobileDrawer() {
        mobileDrawer.classList.add('open');
    }

    function closeMobileDrawer() {
        mobileDrawer.classList.remove('open');
    }

    if (mobileMenuToggle && mobileDrawer && closeDrawer) {
        mobileMenuToggle.addEventListener('click', openMobileDrawer);
        closeDrawer.addEventListener('click', closeMobileDrawer);
    }

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeMobileDrawer);
    });

    /* ==========================================================================
       THEME TOGGLER
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    /* ==========================================================================
       TYPEWRITER EFFECT
       ========================================================================== */
    const typewriterEl = document.getElementById('typewriter');
    const phrases = [
        "AI-First Developer workflows",
        "Scalable Backend Services",
        "High-Performance APIs",
        "Configurable Architectures",
        "Robust Cloud Microservices"
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        if (!typewriterEl) return;

        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster deletion
        } else {
            typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }

    // Initialize typewriter
    setTimeout(type, 1000);

    /* ==========================================================================
       PROJECT FILTER LOGIC
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from other buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active to current
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Add fade animation out
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.style.display = 'flex';
                        // Trigger fade in
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    /* ==========================================================================
       SCROLL REVEAL & NAV ACTIVE LINK HIGH LIGHTER
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    // Reveal options
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Active Section Link Highlighter
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.35
    });

    sections.forEach(sec => sectionObserver.observe(sec));

    /* ==========================================================================
       CONTACT FORM SUBMISSION (FORMSUBMIT AJAX API)
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="bx bx-loader-alt bx-spin"></i>';
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            fetch("https://formsubmit.co/ajax/ananya97.mail@gmail.com", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                if (data.success === "true" || data.success === true) {
                    formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                    formStatus.classList.add('success');
                    contactForm.reset();
                } else {
                    formStatus.textContent = 'Oops! There was a problem submitting your form.';
                    formStatus.classList.add('error');
                }
                
                // Clear status after 5s
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 5000);
            })
            .catch(error => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                formStatus.textContent = 'Oops! There was a network error. Please try again.';
                formStatus.classList.add('error');
                
                // Clear status after 5s
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 5000);
            });
        });
    }
});
