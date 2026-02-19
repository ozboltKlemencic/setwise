import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Guides.AiFeaturesPage' })

    return {
        title: t('title'),
        description: 'Learn how to use AI-powered features in SetWise. Paste any workout plan and convert it into a structured program with exercises, sets, and days instantly.',
    }
}
