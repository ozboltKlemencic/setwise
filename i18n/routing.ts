import { defineRouting } from 'next-intl/routing';

export const locales = ['sl', 'en'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
    // All supported locales
    locales,

    // Default locale (Slovenian) - no prefix
    defaultLocale: 'sl',

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
    },
});

// Type for pathnames (useful for Link component)
export type Pathnames = keyof typeof routing.pathnames;
