// Language switching functionality
class LanguageSwitcher {
    constructor() {
        this.currentLang = 'en';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadLanguage();
    }

    bindEvents() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                this.switchLanguage(lang);
            });
        });
    }

    switchLanguage(lang) {
        this.currentLang = lang;
        
        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
        
        // Update document direction and language
        if (lang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'ar');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', 'en');
        }
        
        // Update all elements with data attributes
        this.updateElements();
        
        // Save language preference
        localStorage.setItem('preferred-language', lang);
    }

    updateElements() {
        const elements = document.querySelectorAll('[data-en], [data-ar]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${this.currentLang}`);
            if (text) {
                element.textContent = text;
            }
        });

        // Update placeholders
        const inputs = document.querySelectorAll('[data-en-placeholder], [data-ar-placeholder]');
        inputs.forEach(input => {
            const placeholder = input.getAttribute(`data-${this.currentLang}-placeholder`);
            if (placeholder) {
                input.setAttribute('placeholder', placeholder);
            }
        });
    }

    loadLanguage() {
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
            this.switchLanguage(savedLang);
        }
    }
}

// Mobile menu functionality
class MobileMenu {
    constructor() {
        this.menuToggle = document.getElementById('mobile-menu-toggle');
        this.nav = document.getElementById('nav');
        this.isOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.menuToggle.addEventListener('click', () => {
            this.toggleMenu();
        });

        // Close menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.nav.contains(e.target) && !this.menuToggle.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.nav.classList.add('mobile-open');
        this.menuToggle.classList.add('active');
        this.isOpen = true;
        
        // Animate hamburger lines
        const lines = this.menuToggle.querySelectorAll('.hamburger-line');
        lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    }

    closeMenu() {
        this.nav.classList.remove('mobile-open');
        this.menuToggle.classList.remove('active');
        this.isOpen = false;
        
        // Reset hamburger lines
        const lines = this.menuToggle.querySelectorAll('.hamburger-line');
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
    }
}

// Form handling
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Validation rules
        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'phone':
                if (value && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long';
                }
                break;
        }

        if (!isValid) {
            field.classList.add('error');
            this.showError(field, errorMessage);
        }

        return isValid;
    }

    showError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        field.parentNode.appendChild(errorDiv);
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    async handleSubmit() {
        if (!this.validateForm()) {
            return;
        }

        // Check honeypot
        const honeypot = this.form.querySelector('input[name="website"]');
        if (honeypot.value) {
            console.log('Spam detected');
            return;
        }

        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual endpoint)
            await this.submitForm();
            this.showSuccessMessage();
            this.form.reset();
        } catch (error) {
            this.showErrorMessage();
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async submitForm() {
        const formData = new FormData(this.form);
        
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                if (Math.random() > 0.1) { // 90% success rate
                    resolve();
                } else {
                    reject(new Error('Submission failed'));
                }
            }, 2000);
        });
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.style.cssText = `
            background-color: #d4edda;
            color: #155724;
            padding: 1rem;
            border-radius: 5px;
            margin-top: 1rem;
            border: 1px solid #c3e6cb;
        `;
        
        const currentLang = document.documentElement.getAttribute('lang');
        message.textContent = currentLang === 'ar' 
            ? 'شكرًا لتواصلكم، سنعاود الاتصال قريبًا.'
            : 'Thank you for reaching out, we will get back to you soon.';
        
        this.form.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    showErrorMessage() {
        const message = document.createElement('div');
        message.className = 'error-message';
        message.style.cssText = `
            background-color: #f8d7da;
            color: #721c24;
            padding: 1rem;
            border-radius: 5px;
            margin-top: 1rem;
            border: 1px solid #f5c6cb;
        `;
        
        const currentLang = document.documentElement.getAttribute('lang');
        message.textContent = currentLang === 'ar' 
            ? 'حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.'
            : 'There was an error sending your message. Please try again.';
        
        this.form.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
}

// Smooth scrolling for navigation links
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.getElementById('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Scroll animations
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.observeElements();
    }

    observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.service-card, .feature-item, .team-member, .testimonial-card, .resource-card'
        );
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
}

// Header scroll effect
class HeaderScroll {
    constructor() {
        this.header = document.getElementById('header');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
}

// Newsletter form
class NewsletterForm {
    constructor() {
        this.form = document.querySelector('.newsletter-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.bindEvents();
        }
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    async handleSubmit() {
        const email = this.form.querySelector('input[type="email"]').value;
        const submitBtn = this.form.querySelector('button');
        const originalText = submitBtn.textContent;
        
        if (!email) return;
        
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;
        
        try {
            // Simulate subscription
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const currentLang = document.documentElement.getAttribute('lang');
            const message = currentLang === 'ar' 
                ? 'تم الاشتراك بنجاح!'
                : 'Successfully subscribed!';
            
            alert(message);
            this.form.reset();
        } catch (error) {
            const currentLang = document.documentElement.getAttribute('lang');
            const message = currentLang === 'ar' 
                ? 'حدث خطأ في الاشتراك.'
                : 'Subscription failed.';
            
            alert(message);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LanguageSwitcher();
    new MobileMenu();
    new ContactForm();
    new SmoothScroll();
    new ScrollAnimations();
    new HeaderScroll();
    new NewsletterForm();
});
