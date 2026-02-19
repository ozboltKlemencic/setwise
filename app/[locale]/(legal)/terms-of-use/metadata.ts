import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'TermsOfUse' })

    return {
        title: t('title'),
        description: 'Terms of use for SetWise workout tracker app and setwise.app website. Read our terms before using the service.',
    }
}
