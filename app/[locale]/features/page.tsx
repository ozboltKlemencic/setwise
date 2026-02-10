import { getTranslations } from "next-intl/server"
import { Check, Zap, LayoutTemplate, History, TrendingUp, ShieldCheck } from "lucide-react"
import {
    FeatureCard,
    KeyFeatureSection,
    MiniFeatureCard,
    StepCard,
    SecurityItem,
    BenefitBadge,
    FeatureTextBlock,
} from "@/components/features/feature-cards"
import BetaSignupDialog from "@/components/beta-signup-dialog"
import ButtonRotatingGradient from "@/components/ui/buttons/ButtonRotatingGradient"
import type { ReactNode } from "react"


// -- Icon Maps (icons can't live in JSON) --------------------------------

const overviewCardIcons = {
    fast: Zap,
    offline: ShieldCheck,
    compare: TrendingUp,
    analytics: History,
} as const

const overviewCardKeys = Object.keys(overviewCardIcons) as (keyof typeof overviewCardIcons)[]
const advancedCardKeys = ['dropSupersets', 'autoCompare', 'cloudSync', 'exerciseLibrary'] as const
const analyticsKeys = ['volumeCharts', 'strengthCurves', 'muscleHeatmap', 'rpeTracking'] as const
const stepKeys = ['step1', 'step2', 'step3'] as const
const benefitKeys = ['lifetimeFree', 'premiumFeatures', 'directFeedback', 'earlyAccess'] as const
const securityKeys = ['encryption', 'localStorage'] as const

// -- Rich text renderers ------------------------------------------------

const richTextComponents = {
    strong: (chunks: ReactNode) => <strong className="text-surface-900 font-semibold">{chunks}</strong>,
    check: (chunks: ReactNode) => (
        <span className="inline-flex px-1.5 py-0.5 rounded-md bg-surface-200/80 dark:bg-surface-300/30 text-surface-900 text-caption-1 font-mono">
            {chunks}
        </span>
    ),
    brand: (chunks: ReactNode) => <span className="primaryGradient">{chunks}</span>,
}

// -- Page Component -----------------------------------------------

export default async function FeaturesPage() {
    const t = await getTranslations('FeaturesPage')

    return (
        <div className="w-full h-full flex flex-col items-center justify-start font-sans pt-0 md:pt-12 lg:pt-0">
            <div className="w-full px-(--space-5) md:px-(--space-12) max-w-5xl min-[1152px]:border-0 md:border-l md:border-r border-surface-200">

                {/* ── Page Header ────────────────────────────── */}
                <header className="pt-(--space-8) pb-(--space-5) md:pt-(--space-16) md:pb-(--space-10) min-[1152px]:max-w-5/6">

                    <p className="text-caption-2 uppercase tracking-wider font-semibold primaryGradient mb-1">
                        {t('badge')}
                    </p>

                    <h1 className="text-title-1 md:text-display-sm lg:text-display font-bold text-surface-900 tracking-tight text-balance">
                        {t.rich('heading', richTextComponents)}
                    </h1>
                </header>

                {/* ── Sections ───────────────────────────────── */}
                <div className="space-y-(--space-10) md:space-y-(--space-16) lg:space-y-(--space-20) ">

                    {/* OVERVIEW Section */}
                    <section id="overview" className="scroll-mt-32  space-y-(--space-5) md:space-y-(--space-8)">
                        <div className="space-y-(--space-2) md:space-y-(--space-3)">
                            <h2 className="text-title-2 md:text-large-title font-bold text-surface-900 tracking-tight">
                                {t('overview.title')}
                            </h2>

                            <p className="text-footnote md:text-body text-surface-700 leading-relaxed max-w-prose">
                                {t.rich('overview.description', richTextComponents)}
                            </p>
                        </div>

                        {/* Cards with full-bleed decorative background */}
                        <div className="relative">
                            {/* Decorative lines — breaks out of parent padding to span full width */}
                            <div className="absolute inset-0 -mx-(--space-5) border-b border-surface-200 border-t md:-mx-(--space-12) overflow-hidden pointer-events-none">
                                {Array.from({ length: 300 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute h-(--space-4) w-full -rotate-45 origin-top-left outline-[0.5px] outline-surface-200 outline-offset-[-0.25px]"
                                        style={{
                                            top: `${i * 16 - 120}px`,
                                            left: "-100%",
                                            width: "300%",
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Cards grid — on top of decorative background */}
                            <div className="grid md:grid-cols-2 gap-(--space-2) py-(--space-3) md:py-(--space-6)  md:gap-(--space-2) w-full relative z-10">
                                {overviewCardKeys.map((key) => (
                                    <FeatureCard
                                        key={key}
                                        icon={overviewCardIcons[key]}
                                        title={t(`overview.cards.${key}.title`)}
                                        description={t(`overview.cards.${key}.description`)}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* KEY FEATURES Section */}
                    <section id="key-features" className="scroll-mt-32 space-y-(--space-8) md:space-y-(--space-16)">
                        <div className="space-y-(--space-2)">
                            <p className="text-caption-2 md:text-caption-1 uppercase tracking-wider font-semibold primaryGradient">
                                {t('keyFeatures.badge')}
                            </p>
                            <h2 className="text-title-2 md:text-large-title font-bold text-surface-900 tracking-tight">
                                {t('keyFeatures.title')}
                            </h2>
                        </div>

                        {/* Feature 1 — Quick Logging */}
                        <KeyFeatureSection icon={Zap} title={t('keyFeatures.quickLogging.title')}>
                            <div className="space-y-(--space-3) md:space-y-(--space-4) max-w-prose">
                                <FeatureTextBlock lead={t('keyFeatures.quickLogging.liveSession.lead')}>
                                    {t.rich('keyFeatures.quickLogging.liveSession.text', richTextComponents)}
                                </FeatureTextBlock>
                                <FeatureTextBlock lead={t('keyFeatures.quickLogging.manualLog.lead')}>
                                    {t.rich('keyFeatures.quickLogging.manualLog.text', richTextComponents)}
                                </FeatureTextBlock>
                                <FeatureTextBlock lead={t('keyFeatures.quickLogging.platesCalc.lead')}>
                                    {t.rich('keyFeatures.quickLogging.platesCalc.text', richTextComponents)}
                                </FeatureTextBlock>
                            </div>
                        </KeyFeatureSection>

                        {/* Feature 2 — Templates & Programs */}
                        <KeyFeatureSection icon={LayoutTemplate} title={t('keyFeatures.templates.title')}>
                            <div className="space-y-(--space-3) md:space-y-(--space-4) max-w-prose">
                                <FeatureTextBlock lead={t('keyFeatures.templates.myTemplates.lead')}>
                                    {t.rich('keyFeatures.templates.myTemplates.text', richTextComponents)}
                                </FeatureTextBlock>
                                <FeatureTextBlock lead={t('keyFeatures.templates.publicPrograms.lead')}>
                                    {t.rich('keyFeatures.templates.publicPrograms.text', richTextComponents)}
                                </FeatureTextBlock>
                            </div>
                        </KeyFeatureSection>

                        {/* Feature 3 — History & Personal Records */}
                        <KeyFeatureSection icon={History} title={t('keyFeatures.history.title')}>
                            <div className="space-y-(--space-3) md:space-y-(--space-4) max-w-prose">
                                <FeatureTextBlock lead={t('keyFeatures.history.workoutLog.lead')}>
                                    {t.rich('keyFeatures.history.workoutLog.text', richTextComponents)}
                                </FeatureTextBlock>
                                <FeatureTextBlock lead={t('keyFeatures.history.personalRecords.lead')}>
                                    {t.rich('keyFeatures.history.personalRecords.text', richTextComponents)}
                                </FeatureTextBlock>
                                <FeatureTextBlock lead={t('keyFeatures.history.calendarView.lead')}>
                                    {t.rich('keyFeatures.history.calendarView.text', richTextComponents)}
                                </FeatureTextBlock>
                            </div>
                        </KeyFeatureSection>

                        {/* Feature 4 — Progress & Analytics */}
                        <KeyFeatureSection icon={TrendingUp} title={t('keyFeatures.analytics.title')}>
                            <ul className="list-none space-y-(--space-2) md:space-y-(--space-3) max-w-prose">
                                {analyticsKeys.map((key) => (
                                    <li key={key} className="flex gap-(--space-2) md:gap-(--space-3) text-footnote md:text-body text-surface-700 leading-relaxed">
                                        <span className="mt-1.5 size-1.5 rounded-full bg-surface-900 shrink-0" />
                                        <span>
                                            <strong className="text-surface-900 font-semibold">{t(`keyFeatures.analytics.${key}.lead`)}:</strong>{" "}
                                            {t(`keyFeatures.analytics.${key}.text`)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </KeyFeatureSection>

                        {/* Feature 5 — Advanced Features */}
                        <KeyFeatureSection icon={Zap} title={t('keyFeatures.advanced.title')}>
                            <div className="relative py-(--space-3) md:py-(--space-6)">
                                {/* Decorative lines — breaks out of all parent padding to span full width */}
                                <div className="absolute inset-0 -mx-(--space-5) md:-ml-25 md:-mr-(--space-12) border-b border-surface-200 border-t md:-mx-(--space-12) overflow-hidden pointer-events-none">
                                    {Array.from({ length: 300 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute h-(--space-4) w-full -rotate-45 origin-top-left outline-[0.5px] outline-surface-200/70 outline-offset-[-0.25px]"
                                            style={{
                                                top: `${i * 16 - 120}px`,
                                                left: "-100%",
                                                width: "300%",
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Cards grid — on top of decorative background */}
                                <div className="grid md:grid-cols-2 gap-(--space-2) relative z-10">
                                    {advancedCardKeys.map((key) => (
                                        <MiniFeatureCard
                                            key={key}
                                            title={t(`keyFeatures.advanced.${key}.title`)}
                                            description={t(`keyFeatures.advanced.${key}.description`)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </KeyFeatureSection>
                    </section>

                    {/* GET STARTED Section */}
                    <section id="get-started" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-12) mb-(--space-10) md:mb-(--space-20)">
                        <div className="space-y-(--space-2)">
                            <p className="text-caption-2 md:text-caption-1 uppercase tracking-wider font-semibold primaryGradient">
                                {t('getStarted.badge')}
                            </p>
                            <h2 className="text-title-2 md:text-large-title font-bold text-surface-900 tracking-tight flex items-center gap-(--space-2) md:gap-(--space-3)">
                                {t('getStarted.title')}
                            </h2>
                        </div>

                        {/* CTA Card */}
                        <div className="bg-linear-to-tr from-brand-500/15 to-brand-500/5 border border-brand-200 relative rounded-md overflow-hidden shadow-(--shadow-sm) ">
                            {/* Decorative lines — behind content */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none mask-[radial-gradient(300px_circle_at_center,white,transparent)]">
                                {Array.from({ length: 300 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute h-(--space-4) w-full -rotate-45 origin-top-left outline-[0.5px] outline-surface-300/90 dark:outline-surface-400/30 outline-offset-[-0.25px]"
                                        style={{
                                            top: `${i * 16 - 120}px`,
                                            left: "-100%",
                                            width: "300%",
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Content — on top of decorative lines */}
                            <div className="relative z-10 p-(--space-4) md:p-(--space-8) ">
                                <h3 className="text-headline md:text-title-2 font-bold text-surface-900 mb-(--space-1) md:mb-(--space-2)">
                                    {t('getStarted.beta.title')}
                                </h3>
                                <p className="text-footnote md:text-body text-surface-700 mb-(--space-5) md:mb-(--space-8) max-w-prose">
                                    {t.rich('getStarted.beta.description', richTextComponents)}
                                </p>

                                <div className="grid gap-(--space-2) sm:grid-cols-2 lg:grid-cols-4 mb-(--space-5) md:mb-(--space-8)">
                                    {benefitKeys.map((key) => (
                                        <BenefitBadge key={key} icon={Check} label={t(`getStarted.benefits.${key}`)} />
                                    ))}
                                </div>

                                <BetaSignupDialog trigger={<ButtonRotatingGradient>{t('getStarted.beta.button')}</ButtonRotatingGradient>} />
                            </div>
                        </div>

                        {/* Steps */}
                        <div className="grid md:grid-cols-3 gap-(--space-5) md:gap-(--space-10)">
                            {stepKeys.map((key, i) => (
                                <StepCard
                                    key={key}
                                    step={i + 1}
                                    title={t(`getStarted.steps.${key}.title`)}
                                    description={t(`getStarted.steps.${key}.description`)}
                                />
                            ))}
                        </div>
                    </section>



                    {/* SECURITY & PRIVACY Section */}
                    <section className="scroll-mt-32 relative  ">
                        {/* Decorative lines — behind content, full width */}
                        <div className="absolute inset-0 -mx-(--space-5) md:-mx-(--space-12) border-t border-surface-200/80 dark:border-surface-300/60 overflow-hidden pointer-events-none">
                            {Array.from({ length: 300 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute h-(--space-4) w-full -rotate-45 origin-top-left outline-[0.5px] outline-surface-200/70 outline-offset-[-0.25px]"
                                    style={{
                                        top: `${i * 16 - 120}px`,
                                        left: "-100%",
                                        width: "300%",
                                    }}
                                />
                            ))}
                        </div>

                        {/* Content — on top */}
                        <div className="relative z-10 space-y-(--space-5) md:space-y-(--space-8) p-(--space-3) py-(--space-6) md:p-(--space-6) md:py-(--space-20)">
                            <div className="space-y-(--space-1) md:space-y-(--space-2)">
                                <p className="text-caption-2 md:text-caption-1 uppercase tracking-wider font-semibold text-surface-500">
                                    {t('security.badge')}
                                </p>
                                <h2 className="text-title-3 md:text-title-1 font-bold text-surface-900 tracking-tight">
                                    {t('security.title')}
                                </h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-(--space-4) md:gap-(--space-8)">
                                {securityKeys.map((key) => (
                                    <SecurityItem
                                        key={key}
                                        icon={ShieldCheck}
                                        title={t(`security.${key}.title`)}
                                        description={t(`security.${key}.description`)}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    )
}
