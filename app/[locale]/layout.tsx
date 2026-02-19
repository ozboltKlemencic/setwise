import type React from "react"
import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"

type Props = {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}

// Generate static params for all locales
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

const BASE_URL = 'https://setwise.app'

// Generate metadata based on locale
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params

    const messages = (await import(`../../messages/${locale}.json`)).default
    const meta = messages.Metadata
    const url = locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}`

    return {
        metadataBase: new URL(BASE_URL),
        title: {
            template: '%s | SetWise',
            default: meta.title,
        },
        description: meta.description,
        keywords: meta.keywords,
        authors: [{ name: 'SetWise', url: BASE_URL }],
        creator: 'SetWise',
        publisher: 'SetWise',
        applicationName: 'SetWise',
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        alternates: {
            canonical: url,
            languages: {
                'en': BASE_URL,
                'sl': `${BASE_URL}/sl`,
            },
        },
        openGraph: {
            title: meta.ogTitle,
            description: meta.ogDescription,
            url,
            siteName: 'SetWise',
            locale: locale === 'sl' ? 'sl_SI' : 'en_US',
            alternateLocale: locale === 'sl' ? ['en_US'] : ['sl_SI'],
            type: 'website',
            images: [{
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: meta.title,
            }],
        },
        twitter: {
            card: 'summary_large_image',
            title: meta.ogTitle,
            description: meta.ogDescription,
            images: ['/og-image.png'],
        },
    }
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params

    // Enable static rendering
    setRequestLocale(locale)

    // Get messages for this locale
    const messages = await getMessages()

    // The root layout provides html/body tags
    // This layout just adds the i18n provider with locale
    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
    )
}
