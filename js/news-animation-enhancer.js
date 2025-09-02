/**
 * News Animation Enhancer
 * Adds smooth animations to dynamically loaded news items
 */

class NewsAnimationEnhancer {
    constructor() {
        this.animationController = window.animationController;
        this.init();
    }

    init() {
        // Watch for news container changes
        this.observeNewsContainer();
        
        // Enhance existing news items
        this.enhanceExistingNewsItems();
    }

    observeNewsContainer() {
        const newsContainer = document.getElementById('newsContainer');
        if (!newsContainer) return;

        // Use MutationObserver to watch for new news items
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('news-item')) {
                            this.enhanceNewsItem(node);
                        }
                    });
                }
            });
        });

        observer.observe(newsContainer, {
            childList: true,
            subtree: true
        });
    }

    enhanceExistingNewsItems() {
        const newsItems = document.querySelectorAll('.news-item');
        newsItems.forEach((item, index) => {
            this.enhanceNewsItem(item, index * 100);
        });
    }

    enhanceNewsItem(newsItem, delay = 0) {
        // Add animation classes
        newsItem.classList.add('card-animated', 'hover-lift');
        
        // Set animation attributes
        newsItem.dataset.animation = 'fadeInUp';
        newsItem.dataset.animationDelay = delay.toString();
        
        // Set initial state for animation
        newsItem.style.opacity = '0';
        newsItem.style.transform = 'translateY(30px)';
        
        // Add to animation controller if available
        if (this.animationController && this.animationController.observer) {
            this.animationController.observer.observe(newsItem);
        } else {
            // Fallback animation
            setTimeout(() => {
                newsItem.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                newsItem.style.opacity = '1';
                newsItem.style.transform = 'translateY(0)';
            }, delay);
        }

        // Add click animation
        this.addClickAnimation(newsItem);
    }

    addClickAnimation(newsItem) {
        newsItem.addEventListener('click', (e) => {
            // Don't animate if clicking on a link
            if (e.target.tagName === 'A') return;
            
            // Add click effect
            newsItem.style.transform = 'scale(0.98)';
            newsItem.style.transition = 'transform 0.1s ease';
            
            setTimeout(() => {
                newsItem.style.transform = '';
                newsItem.style.transition = '';
            }, 100);
        });
    }

    // Method to animate news loading states
    animateNewsLoading() {
        const newsLoading = document.getElementById('newsLoading');
        if (newsLoading) {
            newsLoading.style.opacity = '0';
            newsLoading.style.transform = 'scale(0.9)';
            newsLoading.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            setTimeout(() => {
                newsLoading.style.opacity = '1';
                newsLoading.style.transform = 'scale(1)';
            }, 100);
        }
    }

    // Method to animate news error states
    animateNewsError() {
        const newsError = document.getElementById('newsError');
        if (newsError) {
            newsError.style.opacity = '0';
            newsError.style.transform = 'translateY(20px)';
            newsError.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            setTimeout(() => {
                newsError.style.opacity = '1';
                newsError.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    // Method to create staggered animation for multiple news items
    staggerNewsItems(newsItems, baseDelay = 0) {
        newsItems.forEach((item, index) => {
            const delay = baseDelay + (index * 100);
            this.enhanceNewsItem(item, delay);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for animation controller to be ready
    const initNewsAnimations = () => {
        if (window.animationController) {
            window.newsAnimationEnhancer = new NewsAnimationEnhancer();
        } else {
            setTimeout(initNewsAnimations, 100);
        }
    };
    
    initNewsAnimations();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NewsAnimationEnhancer;
}