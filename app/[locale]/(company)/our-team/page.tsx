import { getTranslations } from "next-intl/server"

export default async function OurTeamPage() {
    const t = await getTranslations('OurTeam')
    const sections = ['jernej', 'ozbolt'] as const

    return (
        <div className="w-full h-full flex flex-col items-center justify-start font-sans pt-0 md:pt-12 lg:pt-0">
            <div className="w-full px-(--space-5) md:px-(--space-12) max-w-3xl border-surface-200">

                {/* ── Page Header ────────────────────────────── */}
                <header className="pt-(--space-8) pb-(--space-5) md:pt-(--space-16) md:pb-(--space-10) min-[1152px]:pr-(--space-8)">
                    <h1 className="text-title-1 md:text-display-sm lg:text-display font-bold text-surface-900 tracking-tight text-balance mb-4">
                        {t('title')}
                    </h1>
                </header>

                {/* ── Content ───────────────────────────────── */}
                <div className="space-y-(--space-8) pb-(--space-16)">
                    <p className="text-body text-surface-700 leading-relaxed whitespace-pre-line">
                        {t('intro')}
                    </p>

                    <div className="space-y-(--space-8)">
                        {sections.map((section) => (
                            <div key={section} className="space-y-(--space-3)">
                                <h2 className="text-title-3 font-bold text-surface-900">
                                    {t(`sections.${section}.title`)}
                                </h2>
                                <p className="text-body text-surface-700 leading-relaxed whitespace-pre-line">
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
