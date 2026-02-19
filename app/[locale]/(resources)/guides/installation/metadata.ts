import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Guides.InstallationPage' })

    return {
        title: t('title'),
        description: 'Step-by-step guide to install SetWise on iPhone (iOS via TestFlight) and Android (Google Play). Get the workout tracker app running in seconds.',
    }
}
