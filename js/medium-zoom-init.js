/**
 * Medium Zoom Initialization
 * Enables click-to-zoom functionality for images in blog posts
 */

(function() {
    'use strict';

    function initMediumZoom() {
        // Wait for DOM to be fully loaded
        if (typeof mediumZoom === 'undefined') {
            console.warn('Medium Zoom library not loaded');
            return;
        }

        // Get current theme for zoom background
        const THEME_KEY = 'blog-theme';
        const currentTheme = localStorage.getItem(THEME_KEY) || 'light';
        const isDark = currentTheme === 'dark' || document.documentElement.getAttribute('data-theme') === 'dark';

        // Configure zoom background based on theme
        const zoomBackground = isDark ? 'rgba(25, 25, 25, 0.95)' : 'rgba(255, 255, 255, 0.95)';

        // Initialize Medium Zoom for post content images
        const zoom = mediumZoom('.post-container img', {
            margin: 24,
            background: zoomBackground,
            scrollOffset: 0,
        });

        // Update zoom background when theme changes
        // Listen for theme changes via custom event or storage
        window.addEventListener('storage', function(e) {
            if (e.key === THEME_KEY) {
                const newTheme = e.newValue;
                const newIsDark = newTheme === 'dark';
                const newBackground = newIsDark ? 'rgba(25, 25, 25, 0.95)' : 'rgba(255, 255, 255, 0.95)';

                // Update zoom background
                zoom.update({
                    background: newBackground
                });
            }
        });

        // Also provide a global function to update zoom background
        window.updateMediumZoomTheme = function(isDark) {
            const newBackground = isDark ? 'rgba(25, 25, 25, 0.95)' : 'rgba(255, 255, 255, 0.95)';
            zoom.update({
                background: newBackground
            });
        };
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMediumZoom);
    } else {
        initMediumZoom();
    }
})();
