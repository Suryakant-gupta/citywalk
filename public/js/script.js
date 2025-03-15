// Slider functionality
const slider = {
    currentSlide: 0,
    slides: document.querySelectorAll('.slide'),
    dots: document.querySelector('.slider-dots'),
    autoPlayTimeout: null,
    init() {
        if (this.slides.length === 0) return;
        
        // Create dots
        this.slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dots.appendChild(dot);
        });

        // Add event listeners for next/prev buttons
        const prevBtn = document.querySelector('.prev');
        const nextBtn = document.querySelector('.next');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

        // Add swipe functionality for mobile
        this.addSwipeListeners();
        
        // Start auto-sliding
        this.startAutoSlide();
    },
    addSwipeListeners() {
        const slider = document.querySelector('.slider');
        if (!slider) return;
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    },
    handleSwipe(startX, endX) {
        const threshold = 50; // Minimum distance to be considered a swipe
        
        if (startX - endX > threshold) {
            // Swipe left, go to next slide
            this.nextSlide();
        } else if (endX - startX > threshold) {
            // Swipe right, go to previous slide
            this.prevSlide();
        }
    },
    goToSlide(n) {
        if (this.slides.length === 0) return;
        
        this.slides[this.currentSlide].classList.remove('active');
        const dots = document.querySelectorAll('.dot');
        if (dots.length > 0) {
            dots[this.currentSlide].classList.remove('active');
        }
        
        this.currentSlide = (n + this.slides.length) % this.slides.length;
        
        this.slides[this.currentSlide].classList.add('active');
        if (dots.length > 0) {
            dots[this.currentSlide].classList.add('active');
        }
    },
    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
        this.resetAutoSlide();
    },
    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
        this.resetAutoSlide();
    },
    startAutoSlide() {
        this.autoPlayTimeout = setInterval(() => this.nextSlide(), 5000);
    },
    resetAutoSlide() {
        if (this.autoPlayTimeout) {
            clearInterval(this.autoPlayTimeout);
            this.startAutoSlide();
        }
    }
};

// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get the modal
    const costingModal = document.getElementById('costingModal');
    
    // Get all buttons that open the modal (selecting both classes)
    const costingBtns = document.querySelectorAll('[data-modal="costing"]');
    
    // Get the <span> element that closes the modal
    const closeBtn = costingModal.querySelector('.close-modal');

    // Attach event listener to all buttons that trigger the modal
    costingBtns.forEach(button => {
        button.addEventListener('click', function() {
            costingModal.style.display = "block";
        });
    });

    // When the user clicks on <span> (x), close the modal
    closeBtn.addEventListener('click', function() {
        costingModal.style.display = "none";
    });

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', function(event) {
        if (event.target == costingModal) {
            costingModal.style.display = "none";
        }
    });
});


  
// Image Popup functionality
const imagePopup = {
    currentIndex: 0,
    images: [],
    init() {
        // Get all gallery images
        this.images = Array.from(document.querySelectorAll('.gallery-popup-img'));
        
        // Add click events for gallery images
        this.images.forEach((img, index) => {
            img.addEventListener('click', (e) => {
                this.currentIndex = index;
                this.openPopup(e.target.src, e.target.alt);
            });
        });

        // Add click event for close button
        const closeBtn = document.querySelector('.close-popup');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closePopup());
        }

        // Close popup when clicking outside the image
        const popup = document.getElementById('imagePopup');
        if (popup) {
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    this.closePopup();
                }
            });
        }

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (popup && popup.style.display === 'block') {
                if (e.key === 'Escape') {
                    this.closePopup();
                } else if (e.key === 'ArrowRight') {
                    this.nextImage();
                } else if (e.key === 'ArrowLeft') {
                    this.prevImage();
                }
            }
        });
        
        // Add navigation buttons to popup if they don't exist
        this.addNavigationButtons();
    },
    addNavigationButtons() {
        const popup = document.getElementById('imagePopup');
        if (!popup) return;
        
        // Check if buttons already exist
        if (!popup.querySelector('.popup-nav')) {
            const popupContent = popup.querySelector('.popup-content');
            
            // Create navigation buttons
            const navContainer = document.createElement('div');
            navContainer.className = 'popup-nav';
            
            const prevBtn = document.createElement('button');
            prevBtn.className = 'popup-nav-btn prev-btn';
            prevBtn.innerHTML = '❮';
            prevBtn.addEventListener('click', () => this.prevImage());
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'popup-nav-btn next-btn';
            nextBtn.innerHTML = '❯';
            nextBtn.addEventListener('click', () => this.nextImage());
            
            navContainer.appendChild(prevBtn);
            navContainer.appendChild(nextBtn);
            
            popupContent.appendChild(navContainer);
            
            // Add styles for navigation buttons
            const style = document.createElement('style');
            style.textContent = `
                .popup-nav {
                    position: absolute;
                    top: 50%;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    padding: 0 20px;
                    transform: translateY(-50%);
                    z-index: 2002;
                }
                .popup-nav-btn {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 1.5rem;
                    transition: all 0.3s ease;
                }
                .popup-nav-btn:hover {
                    background: rgba(255, 255, 255, 0.4);
                    transform: scale(1.1);
                }
            `;
            document.head.appendChild(style);
        }
    },
    nextImage() {
        if (this.images.length <= 1) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        const nextImg = this.images[this.currentIndex];
        this.updatePopupImage(nextImg.src, nextImg.alt);
    },
    prevImage() {
        if (this.images.length <= 1) return;
        
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        const prevImg = this.images[this.currentIndex];
        this.updatePopupImage(prevImg.src, prevImg.alt);
    },
    updatePopupImage(src, alt) {
        const popupImg = document.getElementById('popupImage');
        if (popupImg) {
            // Add fade out effect
            popupImg.style.opacity = '0';
            
            setTimeout(() => {
                popupImg.src = src;
                popupImg.alt = alt || 'Image';
                popupImg.style.opacity = '1';
            }, 300);
        }
    },
    openPopup(src, alt) {
        const popup = document.getElementById('imagePopup');
        const popupImg = document.getElementById('popupImage');
        
        if (popup && popupImg) {
            popupImg.src = src;
            popupImg.alt = alt || 'Image';
            
            popup.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Add animation
            popup.classList.add('fadeIn');
        }
    },
    closePopup() {
        const popup = document.getElementById('imagePopup');
        if (popup) {
            popup.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
};

// Smooth scroll functionality
const smoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                    
                    window.scrollTo({
                        top: targetPosition - headerHeight,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navLinks = document.querySelector('.nav-links');
                    if (navLinks && navLinks.classList.contains('active')) {
                        mobileMenu.toggleMenu();
                    }
                    
                    // Update URL hash without scrolling
                    history.pushState(null, null, targetId);
                }
            });
        });
    }
};

// Form submission
const forms = {
    init() {
        const leadForm = document.getElementById('leadForm');
        const modalForms = document.querySelectorAll('.modal-form');

        if (leadForm) {
            leadForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        modalForms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        });
        
        // Add input validation
        this.addInputValidation();
    },
    addInputValidation() {
        const inputs = document.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value.trim() === '') {
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            input.addEventListener('focus', () => {
                input.classList.remove('error');
            });
        });
    },
    handleSubmit(e) {
        e.preventDefault();
        
        // Basic validation
        let isValid = true;
        const requiredInputs = e.target.querySelectorAll('input[required]');
        
        requiredInputs.forEach(input => {
            if (input.value.trim() === '') {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });
        
        if (!isValid) {
            this.showMessage('Please fill in all required fields.', 'error');
            return;
        }
        
        // Add your form submission logic here
        console.log('Form submitted');
        
        if (e.target.closest('.modal')) {
            modal.closeModal();
        }

        // Reset form
        e.target.reset();

        // Show success message
        this.showMessage('Thank you for your interest! We will contact you soon.', 'success');
    },
    showMessage(message, type = 'success') {
        // Remove any existing message
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type} slideIn`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.classList.add('fadeOut');
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }, 3000);
    }
};

// Mobile menu
const mobileMenu = {
    init() {
        const menuBtn = document.querySelector('.menu-btn');
        
        if (menuBtn) {
            menuBtn.addEventListener('click', () => this.toggleMenu());
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                const navLinks = document.querySelector('.nav-links');
                if (navLinks && navLinks.classList.contains('active') && 
                    !e.target.closest('.nav-links') && 
                    !e.target.closest('.menu-btn')) {
                    this.toggleMenu();
                }
            });
        }
    },
    toggleMenu() {
        const menuBtn = document.querySelector('.menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        if (menuBtn && navLinks) {
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        }
    }
};

// Intersection Observer for animations
const animations = {
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                    entry.target.style.opacity = '1';
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe sections and elements
        const elements = document.querySelectorAll('.section-title, .price-card, .gallery-item, .stat-item, .contact-item, .master-plan-image, .location-highlights');
        
        elements.forEach(element => {
            element.style.opacity = '0';
            observer.observe(element);
        });
    }
};

// Add styles for messages and animations
const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .message {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 4px;
            box-shadow: var(--shadow);
            z-index: 1000;
            transition: all 0.3s ease;
        }
        
        .message-success {
            background: var(--accent-color);
            color: white;
        }
        
        .message-error {
            background: var(--secondary-color);
            color: white;
        }
        
        .fadeOut {
            opacity: 0;
            transform: translateY(20px);
        }
        
        input.error {
            border-color: var(--secondary-color) !important;
            box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2) !important;
        }

        .menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .menu-btn.active span:nth-child(2) {
            opacity: 0;
        }

        .menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        #popupImage {
            transition: opacity 0.3s ease;
        }
    `;
    document.head.appendChild(style);
};

// Lazy loading for images
const lazyLoad = {
    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                        }
                        
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
            });
        }
    }
};

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addStyles();
    slider.init();
    modal.init();
    imagePopup.init();
    smoothScroll.init();
    forms.init();
    mobileMenu.init();
    animations.init();
    lazyLoad.init();
    
    // Fix for Safari mobile viewport height issue
    const setVh = () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVh();
    window.addEventListener('resize', setVh);
});


// Add these to your existing script.js

// Testimonials Slider
const testimonialSlider = {
    currentSlide: 0,
    slides: document.querySelectorAll('.testimonial-slide'),
    dots: document.querySelector('.testimonial-dots'),
    autoPlayTimeout: null,
    
    init() {
        if (this.slides.length === 0) return;
        
        // Create dots
        this.slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('testimonial-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dots.appendChild(dot);
        });

        // Add button listeners
        const prevBtn = document.querySelector('.testimonials .prev');
        const nextBtn = document.querySelector('.testimonials .next');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

        // Add swipe functionality
        this.addSwipeListeners();
        
        // Start auto-play
        this.startAutoPlay();
    },

    addSwipeListeners() {
        const slider = document.querySelector('.testimonials-slider');
        if (!slider) return;
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    },

    handleSwipe(startX, endX) {
        const threshold = 50;
        
        if (startX - endX > threshold) {
            this.nextSlide();
        } else if (endX - startX > threshold) {
            this.prevSlide();
        }
    },

    goToSlide(n) {
        this.slides[this.currentSlide].classList.remove('active');
        document.querySelectorAll('.testimonial-dot')[this.currentSlide].classList.remove('active');
        
        this.currentSlide = (n + this.slides.length) % this.slides.length;
        
        this.slides[this.currentSlide].classList.add('active');
        document.querySelectorAll('.testimonial-dot')[this.currentSlide].classList.add('active');
    },

    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
        this.resetAutoPlay();
    },

    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
        this.resetAutoPlay();
    },

    startAutoPlay() {
        this.autoPlayTimeout = setInterval(() => this.nextSlide(), 5000);
    },

    resetAutoPlay() {
        if (this.autoPlayTimeout) {
            clearInterval(this.autoPlayTimeout);
            this.startAutoPlay();
        }
    }
};

// Gallery View More functionality
const galleryViewMore = {
    init() {
        const gallery = document.querySelector('.gallery-grid');
        const viewMoreBtn = document.querySelector('.btn-view-more');

        // Apply limited state only for screens ≤ 768px
        this.setInitialState(gallery, viewMoreBtn);

        // Click event listener for the button
        viewMoreBtn.addEventListener('click', () => {
            if (gallery.classList.contains('limited')) {
                gallery.classList.remove('limited');
                gallery.classList.add('expanded');
                viewMoreBtn.textContent = 'View Less';
            } else {
                gallery.classList.add('limited');
                gallery.classList.remove('expanded');
                viewMoreBtn.textContent = 'View More';
                gallery.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });

        // Handle screen resize events
        window.addEventListener('resize', () => {
            this.setInitialState(gallery, viewMoreBtn);
        });
    },

    setInitialState(gallery, viewMoreBtn) {
        if (window.innerWidth <= 768) {
            gallery.classList.add('limited');
            viewMoreBtn.style.display = 'block';
            viewMoreBtn.textContent = 'View More';
        } else {
            gallery.classList.remove('limited', 'expanded');
            viewMoreBtn.style.display = 'none';
        }
    }
};





// Update the initialization
document.addEventListener('DOMContentLoaded', () => {
    // ... existing initializations ...
    testimonialSlider.init();
    galleryViewMore.init();
});