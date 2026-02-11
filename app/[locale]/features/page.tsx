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
import { Iphone } from "@/components/ui/mobileDevices/Phone"
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
        <div className="w-full h-full flex flex-col items-center justify-start font-sans pt-12 md:pt-0">
            <div className="w-full px-(--space-5) md:px-(--space-12) max-w-5xl min-[1152px]:border-0 md:border-l md:border-r border-surface-200">

                {/* ── Page Header ────────────────────────────── */}
                <header className="pt-(--space-8) pb-(--space-5) md:pt-(--space-16) md:pb-(--space-10) min-[1152px]:pr-(--space-8)">

                    <p className="text-caption-2 tracking-wider font-semibold primaryGradient mb-1">
                        {t('badge')}
                    </p>

                    <h1 className="text-title-1 md:text-display-sm lg:text-display font-bold text-surface-900 tracking-tight text-balance">
                        {t.rich('heading', richTextComponents)}
                    </h1>
                </header>

                {/* ── Sections ───────────────────────────────── */}
                <div className="space-y-(--space-10) md:space-y-(--space-16) lg:space-y-(--space-20) ">

                    {/* OVERVIEW Section */}
                    <section id="overview" className="scroll-mt-32 space-y-(--space-4) md:space-y-(--space-6) lg:space-y-(--space-6)">
                        <div className="grid md:grid-cols-1 md:gap-x-(--space-8) lg:gap-x-(--space-10) md:items-start">
                            <h2 className="md:col-span-5 text-title-2 md:text-title-1 lg:text-large-title font-bold text-surface-900 tracking-tight text-balance">
                                {t('overview.title')}
                            </h2>

                            <p className="md:col-span-7 md:pt-1 text-footnote md:text-subheadline lg:text-callout text-surface-700 leading-relaxed max-w-prose">
                                {t.rich('overview.description', richTextComponents)}
                            </p>
                        </div>
                        {/* Cards with full-bleed decorative background */}
                        <div className="relative">
                            {/* Decorative lines — breaks out of parent padding to span full width */}
                            <div className="absolute inset-0 -mx-(--space-5) border-b border-surface-200/90 border-t md:-mx-(--space-12) overflow-hidden pointer-events-none">
                                {Array.from({ length: 300 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute h-(--space-4) w-full -rotate-45 origin-top-left outline-[0.5px] outline-surface-200/80 outline-offset-[-0.25px]"
                                        style={{
                                            top: `${i * 16 - 120}px`,
                                            left: "-100%",
                                            width: "300%",
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Cards grid — on top of decorative background */}
                            <div className="grid md:grid-cols-2 gap-(--space-2) md:gap-(--space-3) py-(--space-3) md:py-(--space-5) w-full relative z-10">
                                {overviewCardKeys.map((key) => (
                                    <FeatureCard
                                        key={key}
                                        icon={overviewCardIcons[key]}
                                        title={t(`overview.cards.${key}.title`)}
                                        description={t(`overview.cards.${key}.description`)}
                                        compact
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* KEY FEATURES Section */}
                    <section id="key-features" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-12)">
                        <div className="space-y-(--space-1.5) md:space-y-(--space-2)">
                            <p className="text-caption-2 md:text-caption-1  tracking-wider font-semibold primaryGradient">
                                {t('keyFeatures.badge')}
                            </p>
                            <h2 className="text-title-2 md:text-title-1 lg:text-large-title font-bold text-surface-900 tracking-tight">
                                {t('keyFeatures.title')}
                            </h2>
                        </div>

                        {/* Feature 1 — Quick Logging */}
                        <KeyFeatureSection compact icon={Zap} title={t('keyFeatures.quickLogging.title')}>
                            <div className="space-y-(--space-2.5) md:space-y-(--space-3) max-w-prose">
                                <FeatureTextBlock compact lead={t('keyFeatures.quickLogging.liveSession.lead')}>
                                    {t.rich('keyFeatures.quickLogging.liveSession.text', richTextComponents)}
                                </FeatureTextBlock>
                                <FeatureTextBlock compact lead={t('keyFeatures.quickLogging.manualLog.lead')}>
                                    {t.rich('keyFeatures.quickLogging.manualLog.text', richTextComponents)}
                                </FeatureTextBlock>
                                <FeatureTextBlock compact lead={t('keyFeatures.quickLogging.platesCalc.lead')}>
                                    {t.rich('keyFeatures.quickLogging.platesCalc.text', richTextComponents)}
                                </FeatureTextBlock>
                            </div>
                        </KeyFeatureSection>

                        {/* Feature 2 — Templates & Programs */}
                        <KeyFeatureSection compact icon={LayoutTemplate} title={t('keyFeatures.templates.title')}>
                            <div className="space-y-(--space-2.5) md:space-y-(--space-3) max-w-prose">
                                <FeatureTextBlock compact lead={t('keyFeatures.templates.myTemplates.lead')}>
                                    {t.rich('keyFeatures.templates.myTemplates.text', richTextComponents)}
                                </FeatureTextBlock>
                                <FeatureTextBlock compact lead={t('keyFeatures.templates.publicPrograms.lead')}>
                                    {t.rich('keyFeatures.templates.publicPrograms.text', richTextComponents)}
                                </FeatureTextBlock>
                            </div>
                        </KeyFeatureSection>

                        {/* Feature 3 — History & Personal Records */}
                        <KeyFeatureSection compact icon={History} title={t('keyFeatures.history.title')}>
                            <div className="space-y-(--space-2.5) md:space-y-(--space-3) max-w-prose">
                                <FeatureTextBlock compact lead={t('keyFeatures.history.workoutLog.lead')}>
                                    {t.rich('keyFeatures.history.workoutLog.text', richTextComponents)}
                                </FeatureTextBlock>
                                <FeatureTextBlock compact lead={t('keyFeatures.history.personalRecords.lead')}>
                                    {t.rich('keyFeatures.history.personalRecords.text', richTextComponents)}
                                </FeatureTextBlock>
                                <FeatureTextBlock compact lead={t('keyFeatures.history.calendarView.lead')}>
                                    {t.rich('keyFeatures.history.calendarView.text', richTextComponents)}
                                </FeatureTextBlock>
                            </div>
                        </KeyFeatureSection>

                        {/* Feature 4 — Progress & Analytics */}
                        <KeyFeatureSection compact icon={TrendingUp} title={t('keyFeatures.analytics.title')}>
                            <ul className="list-none space-y-(--space-2) md:space-y-(--space-2.5) max-w-prose">
                                {analyticsKeys.map((key) => (
                                    <li key={key} className="flex gap-(--space-2) md:gap-(--space-2.5) text-footnote md:text-subheadline text-surface-700 leading-relaxed">
                                        <span className="mt-1.5 size-1.25 rounded-full bg-surface-900 shrink-0" />
                                        <span>
                                            <strong className="text-surface-900 font-semibold">{t(`keyFeatures.analytics.${key}.lead`)}:</strong>{" "}
                                            {t(`keyFeatures.analytics.${key}.text`)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </KeyFeatureSection>

                        {/* Feature 5 — Advanced Features */}
                        <KeyFeatureSection compact icon={Zap} title={t('keyFeatures.advanced.title')}>
                            <div className="relative py-(--space-3) md:py-(--space-5)">
                                {/* Decorative lines — breaks out of all parent padding to span full width */}
                                <div className="absolute inset-0 -mx-(--space-5) md:-ml-25 md:-mr-(--space-12) border-b border-surface-200/90 border-t md:-mx-(--space-12) overflow-hidden pointer-events-none">
                                    {Array.from({ length: 300 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute h-(--space-4) w-full -rotate-45 origin-top-left outline-[0.5px] outline-surface-200/65 outline-offset-[-0.25px]"
                                            style={{
                                                top: `${i * 16 - 120}px`,
                                                left: "-100%",
                                                width: "300%",
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Cards grid — on top of decorative background */}
                                <div className="grid md:grid-cols-2 gap-(--space-2) md:gap-(--space-3) relative z-10">
                                    {advancedCardKeys.map((key) => (
                                        <MiniFeatureCard
                                            key={key}
                                            title={t(`keyFeatures.advanced.${key}.title`)}
                                            description={t(`keyFeatures.advanced.${key}.description`)}
                                            compact
                                        />
                                    ))}
                                </div>
                            </div>
                        </KeyFeatureSection>
                    </section>

                    {/* GET STARTED Section */}
                    <section id="get-started" className="scroll-mt-32 space-y-(--space-5) md:space-y-(--space-10) pb-(--space-10) md:pb-(--space-18)">
                        <div className="space-y-(--space-1.5) md:space-y-(--space-2)">
                            <p className="text-caption-2 md:text-caption-1  tracking-wider font-semibold primaryGradient">
                                {t('getStarted.badge')}
                            </p>
                            <h2 className="text-title-2 md:text-title-1 lg:text-large-title font-bold text-surface-900 tracking-tight flex items-center gap-(--space-2) md:gap-(--space-3)">
                                {t('getStarted.title')}
                            </h2>
                        </div>

                        {/* CTA Card */}
                        <div className="relative isolate overflow-hidden rounded-2xl border border-brand-300/40 dark:border-brand-400/25 bg-linear-to-br from-brand-500/20 via-brand-500/8 to-brand-500/25 shadow-(--shadow-lg)">
                            {/* Decorative lines — behind content */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none mask-[radial-gradient(360px_circle_at_35%_40%,white,transparent)]">
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

                            {/* Soft brand glows */}
                            <div aria-hidden="true" className="absolute -top-20 -left-20 size-64 rounded-full bg-brand-500/15 blur-3xl pointer-events-none" />
                            <div aria-hidden="true" className="absolute -bottom-24 right-12 size-72 rounded-full bg-brand-500/12 blur-3xl pointer-events-none" />

                            {/* Subtle phone visual — intentionally cropped */}
                            <div aria-hidden="true" className="absolute -right-18 md:-right-14.5 lg:-right-10 -bottom-55 md:-bottom-62.5 lg:-bottom-66.25 z-0 w-56 md:w-72 lg:w-80 rotate-12 opacity-50 dark:opacity-45 pointer-events-none hidden md:block">
                                <Iphone src="/workout.png" darkSrc="/dark/dark-workouts.png" />
                            </div>

                            {/* Fade content edge so phone stays decorative */}
                            <div aria-hidden="true" className="absolute inset-y-0 right-0 w-1/2 bg-linear-to-l from-card/85 via-card/30 to-transparent pointer-events-none hidden md:block z-10" />

                            {/* Content — on top of decorative lines */}
                            <div className="relative z-20 p-(--space-5) md:p-(--space-8) lg:p-(--space-10) w-full md:max-w-xl lg:max-w-2xl flex flex-col items-start gap-(--space-4) md:gap-(--space-3)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                    {t('getStarted.beta.title')}
                                </h3>
                                <p className="text-footnote md:text-subheadline text-surface-800 max-w-prose leading-relaxed">
                                    {t.rich('getStarted.beta.description', richTextComponents)}
                                </p>

                                <div className="grid gap-(--space-2) sm:grid-cols-2 mb-(--space-5)">
                                    {benefitKeys.map((key) => (
                                        <BenefitBadge compact key={key} icon={Check} label={t(`getStarted.benefits.${key}`)} />
                                    ))}
                                </div>

                                <BetaSignupDialog trigger={<ButtonRotatingGradient>{t('getStarted.beta.button')}</ButtonRotatingGradient>} />
                            </div>
                        </div>

                        {/* Steps */}
                        <div className="grid md:grid-cols-3 gap-(--space-4) md:gap-(--space-6)">
                            {stepKeys.map((key, i) => (
                                <StepCard
                                    compact
                                    key={key}
                                    step={i + 1}
                                    title={t(`getStarted.steps.${key}.title`)}
                                    description={t(`getStarted.steps.${key}.description`)}
                                />
                            ))}
                        </div>
                    </section>



                    {/* SECURITY & PRIVACY Section */}
                    <section className="scroll-mt-32 relative">
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
                        <div className="relative z-10 space-y-(--space-4) md:space-y-(--space-4) p-(--space-4) py-(--space-6) md:p-(--space-6) md:py-(--space-16)">
                            <div className="">
                                <p className="text-caption-2 md:text-caption-1  tracking-wider font-semibold text-surface-500">
                                    {t('security.badge')}
                                </p>
                                <h2 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                    {t('security.title')}
                                </h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-(--space-4) md:gap-(--space-6)">
                                {securityKeys.map((key) => (
                                    <SecurityItem
                                        compact
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
