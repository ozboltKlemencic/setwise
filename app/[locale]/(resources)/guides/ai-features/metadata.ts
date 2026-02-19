import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'PageMetadata.aiFeatures' })

    const path = '/guides/ai-features'
    const url = locale === 'en' ? `https://setwise.app${path}` : `https://setwise.app/${locale}${path}`

    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords'),
        alternates: {
            canonical: url,
            languages: {
                'en': `https://setwise.app${path}`,
                'sl': `https://setwise.app/sl${path}`,
            },
        },
        openGraph: {
            title: t('ogTitle'),
            description: t('ogDescription'),
            url,
            siteName: 'SetWise',
            locale: locale === 'sl' ? 'sl_SI' : 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: t('ogTitle'),
            description: t('ogDescription'),
        },
    }
}
