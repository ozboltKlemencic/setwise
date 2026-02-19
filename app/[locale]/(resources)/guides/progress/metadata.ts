import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Guides.ProgressPage' })

    return {
        title: t('title'),
        description: 'Learn how to track your workout progress in SetWise. Use calendar filters, workout history, volume trends, and exercise analytics to see your gains over time.',
    }
}
