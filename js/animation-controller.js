/**
 * Enhanced Animation Controller for HumanAId Website
 * Provides scroll-triggered animations, hover effects, and smooth transitions
 */

class AnimationController {
    constructor(options = {}) {
        this.options = {
            threshold: options.threshold || [0.1, 0.3, 0.5],
            rootMargin: options.rootMargin || '0px 0px -50px 0px',
            animationDuration: options.animationDuration || 600,
            animationEasing: options.animationEasing || 'cubic-bezier(0.4, 0, 0.2, 1)',
            staggerDelay: options.staggerDelay || 100,
            ...options
        };

        this.animations = new Map();
        this.animatedElements = new Set();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }

    init() {
        this.createIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupParallaxEffects();
        
        // Listen for reduced motion preference changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.isReducedMotion = e.matches;
            this.updateAnimationsForMotionPreference();
        });
    }

    createIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => this.handleIntersection(entry));
        }, {
            threshold: this.options.threshold,
            rootMargin: this.options.rootMargin
        });
    }

    handleIntersection(entry) {
        if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
            this.animateElement(entry.target);
            this.animatedElements.add(entry.target);
        }
    }

    animateElement(element) {
        const animationType = element.dataset.animation || 'fadeInUp';
        const delay = parseInt(element.dataset.animationDelay) || 0;
        const duration = parseInt(element.dataset.animationDuration) || this.options.animationDuration;

        if (this.isReducedMotion) {
            // Simplified animation for reduced motion preference
            element.style.opacity = '1';
            element.style.transform = 'none';
            return;
        }

        setTimeout(() => {
            this.playAnimation(element, animationType, duration);
        }, delay);
    }

    playAnimation(element, animationType, duration = this.options.animationDuration) {
        const animations = {
            fadeIn: {
                from: { opacity: '0' },
                to: { opacity: '1' }
            },
            fadeInUp: {
                from: { opacity: '0', transform: 'translateY(30px)' },
                to: { opacity: '1', transform: 'translateY(0)' }
            },
            fadeInDown: {
                from: { opacity: '0', transform: 'translateY(-30px)' },
                to: { opacity: '1', transform: 'translateY(0)' }
            },
            fadeInLeft: {
                from: { opacity: '0', transform: 'translateX(-30px)' },
                to: { opacity: '1', transform: 'translateX(0)' }
            },
            fadeInRight: {
                from: { opacity: '0', transform: 'translateX(30px)' },
                to: { opacity: '1', transform: 'translateX(0)' }
            },
            scaleIn: {
                from: { opacity: '0', transform: 'scale(0.8)' },
                to: { opacity: '1', transform: 'scale(1)' }
            },
            slideInUp: {
                from: { transform: 'translateY(100%)', opacity: '0' },
                to: { transform: 'translateY(0)', opacity: '1' }
            },
            rotateIn: {
                from: { opacity: '0', transform: 'rotate(-10deg) scale(0.8)' },
                to: { opacity: '1', transform: 'rotate(0deg) scale(1)' }
            }
        };

        const animation = animations[animationType] || animations.fadeInUp;
        
        // Set initial state
        Object.assign(element.style, animation.from);
        element.style.transition = `all ${duration}ms ${this.options.animationEasing}`;
        
        // Trigger animation
        requestAnimationFrame(() => {
            Object.assign(element.style, animation.to);
        });

        // Clean up transition after animation completes
        setTimeout(() => {
            element.style.transition = '';
        }, duration + 50);
    }

    setupScrollAnimations() {
        // Register elements for scroll animations
        const elementsToAnimate = [
            { selector: '.service-card', animation: 'fadeInUp', stagger: true },
            { selector: '.value-item', animation: 'scaleIn', stagger: true },
            { selector: '.news-item', animation: 'fadeInUp', stagger: true },
            { selector: '.highlight-slide', animation: 'fadeInLeft' },
            { selector: '.team-member', animation: 'fadeInUp', stagger: true },
            { selector: '.timeline-item', animation: 'fadeInLeft', stagger: true },
            { selector: '.tech-item', animation: 'scaleIn', stagger: true },
            { selector: '.culture-item', animation: 'fadeInUp', stagger: true },
            { selector: '.department-card', animation: 'fadeInUp', stagger: true }
        ];

        elementsToAnimate.forEach(({ selector, animation, stagger }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                element.dataset.animation = animation;
                
                if (stagger) {
                    element.dataset.animationDelay = (index * this.options.staggerDelay).toString();
                }
                
                // Set initial state
                element.style.opacity = '0';
                element.style.transform = this.getInitialTransform(animation);
                
                this.observer.observe(element);
            });
        });
    }

    getInitialTransform(animationType) {
        const transforms = {
            fadeIn: 'none',
            fadeInUp: 'translateY(30px)',
            fadeInDown: 'translateY(-30px)',
            fadeInLeft: 'translateX(-30px)',
            fadeInRight: 'translateX(30px)',
            scaleIn: 'scale(0.8)',
            slideInUp: 'translateY(100%)',
            rotateIn: 'rotate(-10deg) scale(0.8)'
        };
        return transforms[animationType] || 'translateY(30px)';
    }

    setupHoverAnimations() {
        // Enhanced hover effects for interactive elements
        const hoverElements = [
            { selector: '.service-card', effect: 'lift' },
            { selector: '.news-item', effect: 'lift' },
            { selector: '.team-member', effect: 'lift' },
            { selector: '.btn-primary', effect: 'scale' },
            { selector: '.btn-secondary', effect: 'scale' },
            { selector: '.floating-card', effect: 'float' },
            { selector: '.value-item', effect: 'tilt' },
            { selector: '.tech-item', effect: 'glow' }
        ];

        hoverElements.forEach(({ selector, effect }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                this.addHoverEffect(element, effect);
            });
        });
    }

    addHoverEffect(element, effect) {
        if (this.isReducedMotion) return;

        const effects = {
            lift: {
                hover: 'translateY(-8px) scale(1.02)',
                normal: 'translateY(0) scale(1)'
            },
            scale: {
                hover: 'scale(1.05)',
                normal: 'scale(1)'
            },
            float: {
                hover: 'translateY(-12px)',
                normal: 'translateY(0)'
            },
            tilt: {
                hover: 'rotate(2deg) scale(1.05)',
                normal: 'rotate(0deg) scale(1)'
            },
            glow: {
                hover: 'scale(1.03)',
                normal: 'scale(1)'
            }
        };

        const effectConfig = effects[effect];
        if (!effectConfig) return;

        element.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease';
        
        element.addEventListener('mouseenter', () => {
            element.style.transform = effectConfig.hover;
            
            if (effect === 'lift' || effect === 'glow') {
                element.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
            }
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = effectConfig.normal;
            element.style.boxShadow = '';
        });
    }

    setupParallaxEffects() {
        if (this.isReducedMotion) return;

        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;

        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    // Method to add custom animations
    registerCustomAnimation(selector, animationType, options = {}) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.dataset.animation = animationType;
            
            if (options.stagger) {
                element.dataset.animationDelay = (index * (options.staggerDelay || this.options.staggerDelay)).toString();
            }
            
            if (options.duration) {
                element.dataset.animationDuration = options.duration.toString();
            }
            
            element.style.opacity = '0';
            element.style.transform = this.getInitialTransform(animationType);
            
            this.observer.observe(element);
        });
    }

    // Method to trigger animations manually
    triggerAnimation(element, animationType, duration) {
        this.playAnimation(element, animationType, duration);
    }

    updateAnimationsForMotionPreference() {
        if (this.isReducedMotion) {
            // Disable complex animations
            document.documentElement.style.setProperty('--animation-duration', '0.1s');
            document.documentElement.style.setProperty('--animation-easing', 'linear');
        } else {
            // Restore normal animations
            document.documentElement.style.setProperty('--animation-duration', `${this.options.animationDuration}ms`);
            document.documentElement.style.setProperty('--animation-easing', this.options.animationEasing);
        }
    }

    // Cleanup method
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.animations.clear();
        this.animatedElements.clear();
    }
}

// Initialize animation controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController({
        threshold: [0.1, 0.3, 0.5],
        rootMargin: '0px 0px -50px 0px',
        animationDuration: 600,
        staggerDelay: 100
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}