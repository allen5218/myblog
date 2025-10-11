/**
 * Giscus Setup Script
 * Reads configuration from window.giscusConfig (injected by giscus.html from _config.yml)
 * and initializes the Giscus comment system with proper theme handling.
 */

function determineGiscusTheme() {
  // Use the same theme key as dark-mode.js for consistency
  const THEME_KEY = 'blog-theme';
  let savedTheme = localStorage.getItem(THEME_KEY);

  // Get theme names from config
  const config = window.giscusConfig || {};
  const darkTheme = config.darkTheme || "dark_dimmed";
  const lightTheme = config.lightTheme || "light";

  if (savedTheme) {
    return savedTheme === 'dark' ? darkTheme : lightTheme;
  }

  // Check if site has data-theme attribute (set by dark-mode.js)
  const dataTheme = document.documentElement.getAttribute('data-theme');
  if (dataTheme === 'dark') return darkTheme;

  // Fallback to system preference
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? darkTheme : lightTheme;
}

(function setupGiscus() {
  // Get configuration from window.giscusConfig (injected by Jekyll)
  const config = window.giscusConfig;

  if (!config || !config.repo) {
    console.error('Giscus configuration not found. Please check _config.yml');
    return;
  }

  let giscusTheme = determineGiscusTheme();

  let giscusAttributes = {
    src: "https://giscus.app/client.js",
    "data-repo": config.repo,
    "data-repo-id": config.repoId,
    "data-category": config.category,
    "data-category-id": config.categoryId,
    "data-mapping": config.mapping,
    "data-strict": config.strict,
    "data-reactions-enabled": config.reactionsEnabled,
    "data-emit-metadata": config.emitMetadata,
    "data-input-position": config.inputPosition,
    "data-theme": giscusTheme,
    "data-lang": config.lang,
    crossorigin: "anonymous",
    async: true,
  };

  let giscusScript = document.createElement("script");
  Object.entries(giscusAttributes).forEach(([key, value]) =>
    giscusScript.setAttribute(key, value)
  );

  const giscusThread = document.getElementById("giscus_thread");
  if (giscusThread) {
    giscusThread.appendChild(giscusScript);
  }
})();

// Note: Giscus theme switching is handled by dark-mode.js
// through the updateGiscusTheme() function integrated with the site's
// theme toggle system.