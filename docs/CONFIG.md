# Fluency Checker Configuration Guide

This document explains how to use and modify the configuration system in Fluency Checker.

## Configuration Structure

The configuration is organized into several modules:

- `app.ts`: Application features and settings
- `seo.ts`: SEO-related configurations
- `site.ts`: Site-wide settings and navigation
- `languages.ts`: Language-specific configurations

All configurations are exported from the main `config/index.ts` file.

## Using Configurations

Import configurations in your components like this:

```tsx
import { config } from "@/config";

// Access specific config values
const siteUrl = config.site.url;
const defaultLanguage = config.app.settings.defaultLanguage;
```

Or import specific configurations directly:

```tsx
import { appConfig } from "@/config/app";
import { siteConfig } from "@/config/site";
```

## SEO Configuration

The SEO configuration provides:

- Metadata settings for the entire site
- OpenGraph data for social sharing
- Twitter card information
- Viewport settings

To use in a Next.js page:

```tsx
import { generateMetadata } from "@/config";

// In page.tsx or layout.tsx
export const metadata = generateMetadata({
  // Override default values
  title: "Custom Page Title - Fluency Checker",
  description: "A custom page description",
});
```

## App Configuration

The app configuration provides feature flags and application settings:

- `features`: Toggle features on/off
- `settings`: Application-wide settings like limits and defaults

```tsx
import { appConfig } from "@/config";

// Check if a feature is enabled
if (appConfig.features.enableAudioRecording) {
  // Show audio recording UI
}
```

## Site Configuration

The site configuration provides:

- Basic site information
- Navigation structure
- Footer links

```tsx
import { siteConfig } from "@/config";

// Generate navigation menu
function NavMenu() {
  return (
    <nav>
      {siteConfig.mainNav.map((item) => (
        <a key={item.href} href={item.href}>
          {item.title}
        </a>
      ))}
    </nav>
  );
}
```

## Languages Configuration

The languages configuration provides:

- List of supported languages
- Language-specific features
- Utility functions for language operations

```tsx
import { getEnabledLanguages, getLanguageById } from "@/config/languages";

// Get all enabled languages
const languages = getEnabledLanguages();

// Get a specific language
const english = getLanguageById("english");
```

## Modifying Configurations

To change configuration values:

1. Edit the appropriate file in the `config` directory
2. All changes will be reflected across the application

For environment-specific configurations, consider using environment variables:

```tsx
// In config/app.ts
export const appConfig: AppConfig = {
  // ...
  settings: {
    // ...
    apiEndpoint: process.env.API_ENDPOINT || "/api",
    // ...
  },
};
```
