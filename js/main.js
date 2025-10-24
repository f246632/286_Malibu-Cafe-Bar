/* =================================================================
   MALIBU CAFE BAR - MAIN JAVASCRIPT
   Interactive Features & UX Enhancements
   ================================================================= */

'use strict';

// ===== DOM ELEMENTS =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scrollTop');
const contactForm = document.getElementById('contactForm');

// ===== NAVBAR SCROLL EFFECT =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Show/hide scroll to top button
    if (currentScroll > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }

    lastScroll = currentScroll;
});

// ===== MOBILE NAVIGATION TOGGLE =====
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// ===== SMOOTH SCROLLING FOR NAVIGATION LINKS =====
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Only handle internal links
        if (href.startsWith('#')) {
            e.preventDefault();

            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Close mobile menu if open
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';

                // Scroll to section with offset for fixed navbar
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active link
                updateActiveLink(link);
            }
        }
    });
});

// ===== UPDATE ACTIVE NAVIGATION LINK =====
function updateActiveLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// ===== ACTIVE SECTION HIGHLIGHTING =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset + navbar.offsetHeight + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ===== SCROLL TO TOP BUTTON =====
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== CONTACT FORM VALIDATION & SUBMISSION =====
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        // Validate form
        if (!validateForm(formData)) {
            return;
        }

        // Show success message (in production, this would send to server)
        showFormMessage('success', 'Vielen Dank für Ihre Nachricht! Wir melden uns bald bei Ihnen.');

        // Reset form
        contactForm.reset();
    });
}

// ===== FORM VALIDATION =====
function validateForm(data) {
    const errors = [];

    // Name validation
    if (data.name.length < 2) {
        errors.push('Bitte geben Sie einen gültigen Namen ein.');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        errors.push('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
    }

    // Message validation
    if (data.message.length < 10) {
        errors.push('Bitte geben Sie eine ausführlichere Nachricht ein (mindestens 10 Zeichen).');
    }

    // Show errors if any
    if (errors.length > 0) {
        showFormMessage('error', errors.join('<br>'));
        return false;
    }

    return true;
}

// ===== SHOW FORM MESSAGE =====
function showFormMessage(type, message) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.innerHTML = message;

    // Style message
    Object.assign(messageDiv.style, {
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '8px',
        backgroundColor: type === 'success' ? '#d4edda' : '#f8d7da',
        color: type === 'success' ? '#155724' : '#721c24',
        border: `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
        animation: 'fadeInUp 0.3s ease'
    });

    // Insert message
    contactForm.insertBefore(messageDiv, contactForm.firstChild);

    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animatedElements = document.querySelectorAll('.feature-card, .menu-category, .review-card, .info-card');
animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// ===== LAZY LOADING IMAGES =====
const lazyImages = document.querySelectorAll('img[loading="lazy"]');

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
} else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
}

// ===== OPENING HOURS CURRENT DAY HIGHLIGHT =====
const highlightCurrentDay = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    const currentDay = days[today];

    const hoursRows = document.querySelectorAll('.hours-row');
    hoursRows.forEach((row, index) => {
        const rowText = row.textContent.toLowerCase();
        if (rowText.includes(currentDay) ||
            (today >= 1 && today <= 6 && rowText.includes('montag') && index === 0) ||
            (today === 0 && rowText.includes('sonntag'))) {
            row.style.backgroundColor = 'rgba(0, 168, 204, 0.1)';
            row.style.fontWeight = '600';
            row.style.color = 'var(--primary-color)';
        }
    });
};

// Call on page load
highlightCurrentDay();

// ===== PERFORMANCE OPTIMIZATION - DEBOUNCE SCROLL =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== DETECT IF ELEMENT IS IN VIEWPORT =====
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ===== ACCESSIBILITY - KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== ADD FOCUS VISIBLE POLYFILL =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ===== CONSOLE WELCOME MESSAGE =====
console.log(
    '%c🌴 Malibu Cafe Bar 🌴',
    'color: #00A8CC; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);'
);
console.log(
    '%cWillkommen! Welcome! 欢迎!',
    'color: #FFB84D; font-size: 16px; font-weight: bold;'
);
console.log(
    '%cWebsite developed with ❤️',
    'color: #7F8C8D; font-size: 12px;'
);

// ===== READY STATE =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Malibu Cafe Bar website loaded successfully!');
});

// ===== SERVICE WORKER REGISTRATION (Optional - for PWA) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}
