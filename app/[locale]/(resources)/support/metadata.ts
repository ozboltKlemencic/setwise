import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Support' })

    return {
        title: t('title'),
        description: 'Get help with SetWise. Find installation guides, workout setup instructions, account management, and answers to common questions.',
    }
}
