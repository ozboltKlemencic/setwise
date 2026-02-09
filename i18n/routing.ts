import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'sl'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
    // All supported locales
    locales,

    // Default locale (English) - no prefix
    defaultLocale: 'en',

    // Only show prefix for non-default locales
    localePrefix: 'as-needed',

    // Disable automatic locale detection from browser
    // This allows manual language switching to work properly
    localeDetection: false,

    // Translated pathnames for future pages
    // Add new routes here as the project grows
    pathnames: {
        '/': '/',
        '/o-nas': {
            sl: '/o-nas',
            en: '/about',
        },
        '/storitve': {
            sl: '/storitve',
            en: '/services',
        },
        '/kontakt': {
            sl: '/kontakt',
            en: '/contact',
        },
        '/blog': {
            sl: '/blog',
            en: '/blog',
        },
        '/blog/[slug]': {
            sl: '/blog/[slug]',
            en: '/blog/[slug]',
        },
        '/cenik': {
            sl: '/cenik',
            en: '/pricing',
        },
        '/features': {
            sl: '/funkcije',
            en: '/features',
        },
        '/tools': {
            sl: '/orodja',
            en: '/tools',
        },
    },
});

// Type for pathnames (useful for Link component)
export type Pathnames = keyof typeof routing.pathnames;
