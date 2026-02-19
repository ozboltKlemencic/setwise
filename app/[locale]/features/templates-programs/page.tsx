import { getTranslations } from "next-intl/server"
import { Iphone } from "@/components/ui/mobileDevices/Phone"
import type { ReactNode } from "react"

const richTextComponents = {
    strong: (chunks: ReactNode) => <strong className="text-surface-900 font-semibold">{chunks}</strong>,
    brand: (chunks: ReactNode) => <span className="primaryGradient">{chunks}</span>,
}

export default async function TemplatesProgramsPage() {
    const t = await getTranslations('FeaturesSidebar.templates')

    return (
        <div className="w-full h-full flex flex-col items-center justify-start font-sans pt-12 md:pt-0">
            <div className="w-full px-(--space-5) md:px-(--space-12) max-w-5xl min-[1152px]:border-0 md:border-l md:border-r border-surface-200">

                {/* ── Page Header ────────────────────────────── */}
                <header className="pt-(--space-8) pb-(--space-5) md:pt-(--space-16) md:pb-(--space-10) min-[1152px]:pr-(--space-8)">

                    <p className="text-caption-2 tracking-wider font-semibold primaryGradient mb-1">
                        {t('title')}
                    </p>

                    <h1 className="text-title-1 md:text-display-sm lg:text-display font-bold text-surface-900 tracking-tight text-balance">
                        {t('heading')}
                    </h1>
                    <p className="mt-1 text-footnote md:text-subheadline lg:text-callout text-surface-700 leading-relaxed max-w-prose">
                        {t('subHeading')}
                    </p>
                </header>

                {/* ── Sections ───────────────────────────────── */}
                <div className="space-y-(--space-10) md:space-y-(--space-16) lg:space-y-(--space-20) pb-(--space-10) md:pb-(--space-16)">

                    <section id="import-plan" className="scroll-mt-32 space-y-(--space-4) md:space-y-(--space-6)">
                        <div>
                            <h2 className="text-title-2 md:text-title-1 lg:text-large-title font-bold text-surface-900 tracking-tight">
                                {t('importPlan.title')}
                            </h2>
                            <p className="mt-(--space-1) md:mt-(--space-2) text-footnote md:text-subheadline lg:text-callout text-surface-700 leading-relaxed max-w-prose">
                                {t('importPlan.description')}
                            </p>
                        </div>
                        <div className="flex justify-center w-full">
                            <Iphone src="/workout-in-progres.png" className="w-full max-w-62.5" />
                        </div>
                    </section>

                    <section id="create-new" className="scroll-mt-32 space-y-(--space-4) md:space-y-(--space-6)">
                        <div>
                            <h2 className="text-title-2 md:text-title-1 lg:text-large-title font-bold text-surface-900 tracking-tight">
                                {t('createNew.title')}
                            </h2>
                            <p className="mt-(--space-1) md:mt-(--space-2) text-footnote md:text-subheadline lg:text-callout text-surface-700 leading-relaxed max-w-prose">
                                {t('createNew.description')}
                            </p>
                        </div>
                        <div className="flex justify-center w-full">
                            <Iphone src="/workout.png" className="w-full max-w-62.5" />
                        </div>
                    </section>

                </div>
            </div>
        </div>
    )
}
