import { getTranslations } from "next-intl/server" 

export default async function PrivacyPolicyPage() {
    const t = await getTranslations('PrivacyPolicy')
    const sections = ['overview', 'dataCollection', 'usage', 'dataProtection'] as const

    return (
        <div className="w-full h-full flex flex-col items-center justify-start font-sans pt-8 md:pt-0">
            <div className="w-full px-(--space-5) md:px-(--space-12) max-w-6xl  border-surface-200">

                {/* ── Page Header ────────────────────────────── */}
                <header className="pt-(--space-8) pb-(--space-5) md:pt-(--space-16) md:pb-(--space-10) min-[1152px]:pr-(--space-8)">
                    <h1 className="text-title-1 md:text-display-sm lg:text-display font-bold text-surface-900 tracking-tight text-balance">
                        {t('title')}
                    </h1>
                    <p className="text-footnote md:text-subheadline text-surface-500 font-medium mt-(--space-2)">
                        {t('lastUpdated')}
                    </p>
                </header>

                {/* ── Content ───────────────────────────────── */}
                <div className="space-y-(--space-6) md:space-y-(--space-8) pb-(--space-10) md:pb-(--space-16)">
                    <p className="text-footnote md:text-subheadline lg:text-callout text-surface-700 leading-relaxed max-w-prose">
                        {t('intro')}
                    </p>

                    <div className="space-y-(--space-6) md:space-y-(--space-8)">
                        {sections.map((section) => (
                            <div key={section} className="space-y-(--space-2) md:space-y-(--space-3)">
                                <h2 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                    {t(`sections.${section}.title`)}
                                </h2>
                                <p className="text-footnote md:text-subheadline lg:text-callout text-surface-700 leading-relaxed max-w-prose">
                                    {t(`sections.${section}.content`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
