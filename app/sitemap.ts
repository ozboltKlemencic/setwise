import type { MetadataRoute } from 'next'

const BASE_URL = 'https://setwise.app'

type PageEntry = {
    path: string
    slPath?: string
    changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency']
    priority?: number
}

const pages: PageEntry[] = [
    // Home
    { path: '/', slPath: '/', changeFrequency: 'weekly', priority: 1.0 },

    // Features
    { path: '/features', slPath: '/funkcije', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/features/quick-logging', slPath: '/funkcije/hitro-belezenje', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/features/templates-programs', slPath: '/funkcije/predloge-in-programi', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/features/progress-analytics', slPath: '/funkcije/napredek-in-analitika', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/features/advanced-metrics', slPath: '/funkcije/napredne-metrike', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/features/intensifiers', slPath: '/funkcije/intenzifikatorji', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/features/offline-sync', slPath: '/funkcije/brez-povezave-in-sinhronizacija', changeFrequency: 'monthly', priority: 0.8 },

    // Guides
    { path: '/guides', slPath: '/vodici', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/guides/installation', slPath: '/vodici/namestitev', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/guides/workouts', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/guides/progress', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/guides/profile-settings', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/guides/ai-features', changeFrequency: 'monthly', priority: 0.7 },

    // Resources
    { path: '/community', slPath: '/skupnost', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/faq', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/changelog', slPath: '/dnevnik-sprememb', changeFrequency: 'weekly', priority: 0.6 },
    { path: '/support', slPath: '/podpora', changeFrequency: 'monthly', priority: 0.6 },

    // Tools
    { path: '/tools', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/tools/bmr-calculator', slPath: '/orodja/bmr-kalkulator', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/tools/body-fat-calculator', slPath: '/orodja/body-fat-kalkulator', changeFrequency: 'monthly', priority: 0.7 },

    // Products
    { path: '/products/coachwise', slPath: '/izdelki/coachwise', changeFrequency: 'monthly', priority: 0.7 },

    // Company
    { path: '/about', slPath: '/o-nas', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/our-team', slPath: '/nasa-ekipa', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/contact', slPath: '/kontakt', changeFrequency: 'monthly', priority: 0.5 },

    // Legal
    { path: '/privacy-policy', slPath: '/politika-zasebnosti', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/terms-of-use', slPath: '/pogoji-uporabe', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/cookies', slPath: '/piskotki', changeFrequency: 'yearly', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
    return pages.map(({ path, slPath, changeFrequency, priority }) => {
        const enUrl = `${BASE_URL}${path === '/' ? '' : path}`
        const slUrl = `${BASE_URL}/sl${slPath || path}`

        return {
            url: enUrl,
            lastModified: new Date(),
            changeFrequency,
            priority,
            alternates: {
                languages: {
                    en: enUrl,
                    sl: slUrl,
                },
            },
        }
    })
}
