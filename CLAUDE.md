# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `bundle install` - Install Ruby dependencies
- `bundle exec jekyll serve` or `npm start` - Start local development server at localhost:4000
- `npm run dev` - Start development with live reloading (combines Grunt watch and Jekyll serve)

### Build & Asset Management
- `grunt` or `grunt default` - Build all assets (uglify JS, compile LESS to CSS, add banners)
- `grunt watch` - Watch for changes and auto-rebuild assets
- `grunt uglify` - Minify JavaScript files
- `grunt less` - Compile LESS files to CSS

### Content Creation
- `rake post title="Post Title" subtitle="Post Subtitle"` - Create new blog post with proper front matter

## Architecture

This is a Jekyll static site generator blog forked from Hux Blog with the following key features:

### Blog Structure
- **Posts**: Located in `_posts/` directory as Markdown files with YAML front matter
- **Layouts**: HTML templates in `_layouts/` (default.html, post.html, page.html, keynote.html)
- **Includes**: Reusable components in `_includes/` (navigation, sidebar, footer, etc.)
- **Assets**: CSS in `css/`, JavaScript in `js/`, images in `img/`

### Front Matter Configuration
Posts support these key front matter options:
- `layout: post` - Standard blog post layout
- `layout: keynote` - Special layout for HTML presentations with `iframe` parameter
- `header-img` - Header background image path
- `mathjax: true` - Enable LaTeX math rendering
- `mermaid: true` - Enable Mermaid 10.9.0 diagram support with automatic dark theme adaptation
- `catalog: true` - Enable table of contents
- `update` - Article last update timestamp
- `tags` - Post categorization

### Asset Pipeline
- **LESS**: Source files in `less/` compiled to `css/` via Grunt
- **JavaScript**: Source files minified and banners added via Grunt
- **Main files**: `less/hux-blog.less` → `css/hux-blog.css`, `js/hux-blog.js` → `js/hux-blog.min.js`

### Site Configuration
Key `_config.yml` settings:
- **Multilingual**: Supports English/Chinese content
- **Social**: GitHub, LinkedIn integration
- **Analytics**: Google Analytics and Disqus comments
- **PWA**: Service worker enabled for Progressive Web App features
- **Jekyll**: Uses kramdown markdown processor with syntax highlighting
- **Mermaid**: Version 10.9.0 with configurable version (`mermaid_version`) and automatic dark theme support
- **Theme**: `default_theme: "dark"` controls both site theme and mermaid diagram themes
- **RSS**: `RSS: true` enables RSS feed at `/feed.xml`
- **Sitemap**: `sitemap: true` enables XML sitemap at `/sitemap.xml`

### Special Features
- **Keynote Support**: Embed HTML presentations using iframe layout
- **Featured Tags**: Automatic tag cloud generation
- **Sidebar**: Dynamic sidebar with author info and social links
- **Search**: JSON-based search functionality
- **PWA**: Progressive Web App with service worker and manifest
- **Mermaid Diagrams**: Unified handling through `_includes/mermaid.html` with automatic theme switching and dynamic re-rendering support
- **RSS Feed**: Automatic RSS 2.0 feed generation for content syndication
- **XML Sitemap**: SEO-optimized sitemap generation for search engine indexing
- **Giscus Comments**: GitHub Discussions-based comment system with unified configuration and theme support
- **Medium Zoom**: Click-to-zoom functionality for images with theme-aware background

### Mermaid Configuration
The blog uses a centralized mermaid configuration system:
- **Include File**: `_includes/mermaid.html` handles all mermaid initialization
- **Version Control**: Set version in `_config.yml` with `mermaid_version: "10.9.0"`
- **Theme Adaptation**: Automatically switches between `dark` and `default` themes based on site configuration
- **Dynamic Updates**: Global `updateMermaidTheme(isDark)` function for runtime theme switching
- **Supported Charts**: flowcharts, sequence diagrams, gantt charts, class diagrams, mindmaps, timelines, and more

### RSS & Sitemap Configuration
The blog includes automatic RSS and sitemap generation:

#### RSS Feed (`feed.xml`)
- **Location**: Available at `/feed.xml`
- **Format**: RSS 2.0 standard with full content
- **Content**: Latest 10 posts with titles, descriptions, publication dates
- **Features**: Includes post tags, categories, and permalinks
- **Control**: Enable/disable with `RSS: true/false` in `_config.yml`

#### XML Sitemap (`sitemap.xml`)
- **Location**: Available at `/sitemap.xml`
- **Format**: XML Sitemap 0.9 standard with hreflang support for multilingual pages
- **Content**: All pages including homepage, static pages, and posts
- **Multilingual Support**:
  - Pages with `multilingual: true` automatically include hreflang alternate links
  - Generates language-specific URLs with `?lang=zh` and `?lang=en` parameters
  - Includes `x-default` hreflang for default language fallback
  - Example: `/about/` page generates links for `/about/?lang=zh`, `/about/?lang=en`, and default
- **Priority Scheme**:
  - Homepage: 1.0 (weekly updates)
  - About page: 0.9 (monthly updates)
  - Archive page: 0.8 (weekly updates)
  - Other static pages: 0.7 (monthly updates)
  - Blog posts: 0.6 (yearly updates)
- **Exclusions**: 404.html and offline.html pages are excluded
- **Control**: Enable/disable with `sitemap: true/false` in `_config.yml`
- **Implementation**: Plugin-free custom Jekyll template with xhtml namespace for SEO best practices

Both systems use conditional rendering and will only generate content when their respective configuration flags are enabled.

### Giscus Comments Configuration
The blog uses Giscus for comments, with all settings centralized in `_config.yml`:

**Configuration Location**: `_config.yml` (lines 69-81)
```yaml
giscus:
  repo: allen5218/myblog
  repo_id: R_kgDOPaqk9Q
  category: Comments
  category_id: DIC_kwDOPaqk9c4Cuwao
  mapping: pathname
  strict: 0
  reactions_enabled: 0
  input_position: top
  dark_theme: dark_dimmed
  light_theme: light
  emit_metadata: 0
  lang: zh-TW
```

**Implementation Details**:
- **Unified Configuration**: All Giscus settings are defined in `_config.yml` and passed to JavaScript via `_includes/giscus.html`
- **Theme Integration**: Automatically switches between `dark_theme` and `light_theme` based on site theme
- **Layout Support**: Available in both `post.html` and `keynote.html` layouts
- **Setup Script**: `js/giscus-setup.js` reads configuration from `window.giscusConfig`
- **Theme Switching**: `js/dark-mode.js` updates Giscus theme in real-time when user toggles site theme

**To modify Giscus settings**: Only edit `_config.yml` - no need to touch JavaScript files.

### Medium Zoom Configuration
The blog includes Medium Zoom for image click-to-zoom functionality:

**Implementation**:
- **Library**: `js/medium-zoom.min.js` (v1.1.0, ~10KB)
- **Initialization**: `js/medium-zoom-init.js` handles setup and theme integration
- **Target**: All images within `.post-container` automatically get zoom functionality
- **Theme Support**: Background color adapts to current theme
  - Light mode: `rgba(255, 255, 255, 0.95)`
  - Dark mode: `rgba(25, 25, 25, 0.95)`
- **Layout Support**: Enabled in both `post.html` and `keynote.html` layouts

**Configuration Options** (in `js/medium-zoom-init.js`):
- `margin: 24` - Space around zoomed image
- `background` - Theme-aware background color
- `scrollOffset: 0` - Scroll offset for zoom

**Theme Switching**: Integrated with `js/dark-mode.js` via `window.updateMediumZoomTheme()` function.

When modifying posts, ensure proper YAML front matter format and follow existing conventions for tags, images, and metadata.