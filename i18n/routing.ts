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

        '/storitve': {
            sl: '/storitve',
            en: '/services',
        },
        '/contact': {
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
        '/features/quick-logging': {
            sl: '/funkcije/hitro-belezenje',
            en: '/features/quick-logging',
        },
        '/features/templates-programs': {
            sl: '/funkcije/predloge-in-programi',
            en: '/features/templates-programs',
        },
        '/features/history': {
            sl: '/funkcije/zgodovina',
            en: '/features/history',
        },
        '/features/progress-analytics': {
            sl: '/funkcije/napredek-in-analitika',
            en: '/features/progress-analytics',
        },
        '/features/advanced-metrics': {
            sl: '/funkcije/napredne-metrike',
            en: '/features/advanced-metrics',
        },
        '/features/intensifiers': {
            sl: '/funkcije/intenzifikatorji',
            en: '/features/intensifiers',
        },
        '/features/auto-compare': {
            sl: '/funkcije/samodejna-primerjava',
            en: '/features/auto-compare',
        },
        '/features/offline-sync': {
            sl: '/funkcije/brez-povezave-in-sinhronizacija',
            en: '/features/offline-sync',
        },
        '/tools': {
            sl: '/orodja',
            en: '/tools',
        },
        '/products/coachwise': {
            sl: '/izdelki/coachwise',
            en: '/products/coachwise',
        },
        '/tools/bmr-calculator': {
            sl: '/orodja/bmr-kalkulator',
            en: '/tools/bmr-calculator',
        },
        '/tools/body-fat-calculator': {
            sl: '/orodja/body-fat-kalkulator',
            en: '/tools/body-fat-calculator',
        },
        '/community': {
            sl: '/skupnost',
            en: '/community',
        },
        '/changelog': {
            sl: '/dnevnik-sprememb',
            en: '/changelog',
        },
        '/support': {
            sl: '/podpora',
            en: '/support',
        },
        '/about': {
            sl: '/o-nas',
            en: '/about',
        },
        '/our-team': {
            sl: '/nasa-ekipa',
            en: '/our-team',
        },
        '/privacy-policy': {
            sl: '/politika-zasebnosti',
            en: '/privacy-policy',
        },
        '/terms-of-use': {
            sl: '/pogoji-uporabe',
            en: '/terms-of-use',
        },
        '/cookies': {
            sl: '/piskotki',
            en: '/cookies',
        },
        '/guides': {
            sl: '/vodici',
            en: '/guides',
        },
        '/guides/installation': {
            sl: '/vodici/namestitev',
            en: '/guides/installation',
        },
        '/guides/create-workout': {
            sl: '/vodici/ustvari-trening',
            en: '/guides/create-workout',
        },
    },
});

// Type for pathnames (useful for Link component)
export type Pathnames = keyof typeof routing.pathnames;
