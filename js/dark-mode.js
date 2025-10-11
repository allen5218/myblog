/**
 * Dark Mode Toggle Functionality
 * Handles theme switching between light and dark modes
 */

(function() {
    'use strict';

    // Theme storage key
    const THEME_KEY = 'blog-theme';
    const DARK_THEME = 'dark';
    const LIGHT_THEME = 'light';
    
    // Get default theme from config (injected by Jekyll in head.html)
    const DEFAULT_THEME = window.defaultTheme || 'light';
    
    // Toggle state management
    let isToggling = false;
    const TOGGLE_COOLDOWN = 300;

    // Get current theme from localStorage or use config default
    function getCurrentTheme() {
        return localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
    }

    // Set theme in localStorage
    function setTheme(theme) {
        localStorage.setItem(THEME_KEY, theme);
    }

    // Apply theme to document
    function applyTheme(theme) {
        if (theme === DARK_THEME) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        // Update Disqus theme if present
        updateDisqusTheme(theme);
        // Update Giscus theme if present
        updateGiscusTheme(theme);
        // Update Medium Zoom theme if present
        updateMediumZoomTheme(theme);
    }

    // Check if current page should skip navbar theme switching
    function shouldSkipNavbarTheme() {
        // Get page front matter variables
        const hasHeaderImg = window.pageHeaderImg !== undefined && window.pageHeaderImg !== '';
        const hasHeaderBgCss = window.pageHeaderBgCss !== undefined && window.pageHeaderBgCss !== '';
        
        // If header-img or header-bg-css is set, skip navbar theme switching
        return hasHeaderImg || hasHeaderBgCss;
    }

    // Apply conditional theme logic based on page front matter
    function applyConditionalTheme(theme) {
        if (shouldSkipNavbarTheme()) {
            // Only apply theme to content areas, not navbar
            applyContentTheme(theme);
        } else {
            // Apply theme to all areas including navbar
            applyTheme(theme);
        }
    }

    // Apply theme only to content areas (excluding navbar)
    function applyContentTheme(theme) {
        if (theme === DARK_THEME) {
            document.documentElement.setAttribute('data-theme', 'dark');
            // Add a class to indicate navbar should be excluded
            document.body.classList.add('navbar-theme-excluded');
        } else {
            document.documentElement.removeAttribute('data-theme');
            document.body.classList.remove('navbar-theme-excluded');
        }
        
        updateDisqusTheme(theme);
        // Update Giscus theme if present
        updateGiscusTheme(theme);
        // Update Medium Zoom theme if present
        updateMediumZoomTheme(theme);
    }

    // Toggle theme with debounce protection
    function toggleTheme() {
        // Prevent rapid consecutive toggles
        if (isToggling) {
            return;
        }
        
        isToggling = true;
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
        
        // Use requestAnimationFrame for smooth transitions
        requestAnimationFrame(() => {
            setTheme(newTheme);
            applyConditionalTheme(newTheme);
            
            // Reset toggle lock after cooldown
            setTimeout(() => {
                isToggling = false;
            }, TOGGLE_COOLDOWN);
        });
    }

    // Update Disqus theme
    function updateDisqusTheme(theme) {
        // Disqus theme updating
        if (window.DISQUS) {
            try {
                // Reload Disqus with new theme
                window.DISQUS.reset({
                    reload: true,
                    config: function () {
                        this.page.url = window.location.href;
                        this.page.identifier = window.disqus_identifier || window.location.pathname;
                        // Disqus doesn't have built-in dark mode, but we can style it via CSS
                    }
                });
            } catch (e) {
                console.log('Disqus theme update failed:', e);
            }
        }
    }

    // Update Medium Zoom theme
    function updateMediumZoomTheme(theme) {
        // Call the global function if it exists (defined in medium-zoom-init.js)
        if (typeof window.updateMediumZoomTheme === 'function') {
            const isDark = theme === DARK_THEME;
            window.updateMediumZoomTheme(isDark);
        }
    }

    // Update Giscus theme
    function updateGiscusTheme(theme) {
        const giscusFrame = document.querySelector('iframe.giscus-frame');
        if (giscusFrame) {
            const isDark = theme === DARK_THEME;

            // Get theme names from giscusConfig (set in giscus.html from _config.yml)
            const config = window.giscusConfig || {};
            const darkTheme = config.darkTheme || 'dark_dimmed';
            const lightTheme = config.lightTheme || 'light';

            const giscusTheme = isDark ? darkTheme : lightTheme;

            giscusFrame.contentWindow.postMessage({
                giscus: {
                    setConfig: {
                        theme: giscusTheme
                    }
                }
            }, 'https://giscus.app');
        }
    }

    // Initialize theme on page load - optimized to prevent flashing
    function initTheme() {
        const savedTheme = getCurrentTheme();
        
        // Temporarily hide theme toggle to prevent flash during init
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.style.opacity = '0';
        }
        
        // Apply theme immediately
        applyConditionalTheme(savedTheme);
        
        // Show theme toggle after applying theme
        requestAnimationFrame(() => {
            if (themeToggle) {
                themeToggle.style.opacity = '';
                themeToggle.style.transition = 'opacity 0.2s ease';
            }
        });
    }

    // Initialize when DOM is ready
    function init() {
        // Set config default theme if not already saved
        if (!localStorage.getItem(THEME_KEY)) {
            setTheme(DEFAULT_THEME);
        }
        
        initTheme();
        
        // Make toggleTheme globally available
        window.toggleTheme = toggleTheme;
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle page navigation (for single-page apps or dynamic content)
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            initTheme();
        }
    });

})();