/* =================================================================
   MALIBU CAFE BAR - GALLERY & LIGHTBOX
   Interactive Image Gallery with Modal Viewer
   ================================================================= */

'use strict';

// ===== DOM ELEMENTS =====
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

// ===== GALLERY STATE =====
let currentImageIndex = 0;
let galleryImages = [];

// ===== INITIALIZE GALLERY =====
function initGallery() {
    // Collect all gallery images
    galleryImages = Array.from(galleryItems).map((item, index) => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-overlay h4');

        return {
            src: img.src,
            alt: img.alt,
            caption: caption ? caption.textContent : '',
            index: index
        };
    });

    // Add click event to each gallery item
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));

        // Keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `View image: ${galleryImages[index].alt}`);

        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });
}

// ===== OPEN LIGHTBOX =====
function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus on lightbox for keyboard navigation
    lightbox.focus();

    // Preload adjacent images
    preloadAdjacentImages();
}

// ===== CLOSE LIGHTBOX =====
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== UPDATE LIGHTBOX IMAGE =====
function updateLightboxImage() {
    const currentImage = galleryImages[currentImageIndex];

    // Fade out
    lightboxImg.style.opacity = '0';

    setTimeout(() => {
        lightboxImg.src = currentImage.src;
        lightboxImg.alt = currentImage.alt;
        lightboxCaption.textContent = currentImage.caption;

        // Fade in
        lightboxImg.style.opacity = '1';
    }, 150);

    // Update navigation button states
    updateNavigationButtons();
}

// ===== NAVIGATE TO PREVIOUS IMAGE =====
function showPreviousImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
    preloadAdjacentImages();
}

// ===== NAVIGATE TO NEXT IMAGE =====
function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxImage();
    preloadAdjacentImages();
}

// ===== UPDATE NAVIGATION BUTTONS =====
function updateNavigationButtons() {
    // Hide/show navigation buttons based on number of images
    if (galleryImages.length <= 1) {
        lightboxPrev.style.display = 'none';
        lightboxNext.style.display = 'none';
    } else {
        lightboxPrev.style.display = 'block';
        lightboxNext.style.display = 'block';
    }
}

// ===== PRELOAD ADJACENT IMAGES =====
function preloadAdjacentImages() {
    const prevIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    const nextIndex = (currentImageIndex + 1) % galleryImages.length;

    // Preload previous image
    const prevImg = new Image();
    prevImg.src = galleryImages[prevIndex].src;

    // Preload next image
    const nextImg = new Image();
    nextImg.src = galleryImages[nextIndex].src;
}

// ===== EVENT LISTENERS =====

// Close button
if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

// Navigation buttons
if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPreviousImage();
    });
}

if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });
}

// Click outside image to close
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    switch(e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            showPreviousImage();
            break;
        case 'ArrowRight':
            showNextImage();
            break;
    }
});

// Touch/Swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const difference = touchStartX - touchEndX;

    if (Math.abs(difference) > swipeThreshold) {
        if (difference > 0) {
            // Swipe left - next image
            showNextImage();
        } else {
            // Swipe right - previous image
            showPreviousImage();
        }
    }
}

// ===== IMAGE LOADING WITH FADE EFFECT =====
if (lightboxImg) {
    lightboxImg.style.transition = 'opacity 0.3s ease';

    lightboxImg.addEventListener('load', () => {
        lightboxImg.style.opacity = '1';
    });
}

// ===== GALLERY FILTERING (Optional Enhancement) =====
const galleryFilters = document.querySelectorAll('[data-filter]');

if (galleryFilters.length > 0) {
    galleryFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const category = filter.getAttribute('data-filter');

            // Update active filter
            galleryFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');

            // Filter gallery items
            filterGallery(category);
        });
    });
}

function filterGallery(category) {
    galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 10);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });

    // Reinitialize gallery with filtered items
    setTimeout(initGallery, 350);
}

// ===== LAZY LOADING FOR GALLERY IMAGES =====
const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target.querySelector('img');
            if (img && img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                entry.target.classList.add('loaded');
            }
            galleryObserver.unobserve(entry.target);
        }
    });
}, {
    rootMargin: '50px'
});

galleryItems.forEach(item => {
    galleryObserver.observe(item);
});

// ===== IMAGE ZOOM ON HOVER (Desktop Only) =====
if (window.matchMedia('(min-width: 1024px)').matches) {
    galleryItems.forEach(item => {
        const img = item.querySelector('img');

        item.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.1)';
        });

        item.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });
    });
}

// ===== INITIALIZE ON DOM READY =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
} else {
    initGallery();
}

// ===== ACCESSIBILITY IMPROVEMENTS =====
// Add ARIA labels and roles
if (lightbox) {
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image gallery lightbox');
}

// ===== PERFORMANCE - REQUEST ANIMATION FRAME =====
function optimizedResize() {
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Recalculate layout if needed
            updateLightboxImage();
        }, 250);
    });
}

optimizedResize();

// ===== CONSOLE LOG =====
console.log('🖼️ Gallery initialized with', galleryImages.length, 'images');
