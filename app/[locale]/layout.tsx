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

// Generate metadata based on locale
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params

    // Load messages for metadata
    const messages = (await import(`../../messages/${locale}.json`)).default
    const meta = messages.Metadata

    return {
        title: meta.title,
        description: meta.description,
        keywords: meta.keywords,
        alternates: {
            canonical: locale === 'sl' ? '/' : `/${locale}`,
            languages: {
                'sl': '/',
                'en': '/en',
            },
        },
        openGraph: {
            title: meta.title,
            description: meta.description,
            locale: locale === 'sl' ? 'sl_SI' : 'en_US',
            alternateLocale: locale === 'sl' ? ['en_US'] : ['sl_SI'],
            type: 'website',
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
    // This layout just adds the i18n provider
    return (
        <NextIntlClientProvider messages={messages}>
            {children}
        </NextIntlClientProvider>
    )
}

