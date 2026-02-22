import { getTranslations } from "next-intl/server"
import { ArrowRight, Calendar, History, TrendingUp, Info } from "lucide-react"
import type { ReactNode } from "react"
import { Iphone } from "@/components/ui/mobileDevices/Phone"

export { generateMetadata } from './metadata'

// -- Rich text renderers ------------------------------------------------
const richTextComponents = {
    strong: (chunks: ReactNode) => <strong className="text-surface-900 font-semibold">{chunks}</strong>,
    brand: (chunks: ReactNode) => <span className="primaryGradient">{chunks}</span>,
}

export default async function ProgressPage() {
    const t = await getTranslations('Guides.ProgressPage')

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
                    <p className="mt-1 text-footnote md:text-subheadline lg:text-callout text-surface-700 leading-relaxed max-w-prose">
                        {t.rich('subHeading', richTextComponents)}
                    </p>
                </header>

                {/* ── Sections ───────────────────────────────── */}
                <div className="space-y-(--space-10) md:space-y-(--space-16) lg:space-y-(--space-20) pb-(--space-10) md:pb-(--space-16)">

                    {/* PROGRESS OVERVIEW Section */}
                    <section id="overview" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-12)">
                        <div className="space-y-(--space-2)">
                            <h2 className="text-title-2 md:text-title-1 lg:text-large-title font-bold text-surface-900 tracking-tight">
                                {t('overview.title')}
                            </h2>
                            <div className="text-footnote md:text-subheadline text-surface-700 max-w-prose whitespace-pre-line leading-relaxed">
                                {t.rich('overview.description', richTextComponents)}
                            </div>

                            {/* Overview List */}
                            <ul className="list-disc list-outside ml-4 space-y-1 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400 mt-(--space-4)">
                                {[1, 2, 3].map((i) => (
                                    <li key={i}>{t.rich(`overview.list.${i}`, richTextComponents)}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Main Image */}
                        <div className="flex justify-center w-full py-(--space-4) md:py-(--space-6)">
                            <div className="w-50 md:w-60">
                                <div className="dark:hidden">
                                    <Iphone src="" priority />
                                </div>
                                <div className="hidden dark:block">
                                    <Iphone src="" priority />
                                </div>
                            </div>
                        </div>


                        {/* 1) Calendar Filter */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight flex items-center gap-(--space-2)">
                                    <Calendar className="size-5 text-brand-500" />
                                    {t('overview.calendar.title')}
                                </h3>
                                <div className="text-footnote md:text-subheadline text-surface-700 max-w-prose">
                                    {t.rich('overview.calendar.description', richTextComponents)}
                                </div>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    {[1, 2].map((i) => (
                                        <li key={i}>{t.rich(`overview.calendar.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                                <p className="text-footnote md:text-subheadline text-surface-700 italic">
                                    {t('overview.calendar.footer')}
                                </p>
                            </div>

                            <div className="flex justify-center w-full">
                                <div className="w-50 md:w-60">
                                    <div className="dark:hidden">
                                        <Iphone src="" priority />
                                    </div>
                                    <div className="hidden dark:block">
                                        <Iphone src="" priority />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2) Workout History List */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight flex items-center gap-(--space-2)">
                                    <History className="size-5 text-brand-500" />
                                    {t('overview.history.title')}
                                </h3>
                                <div className="text-footnote md:text-subheadline text-surface-700 max-w-prose">
                                    {t.rich('overview.history.description', richTextComponents)}
                                </div>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    {[1, 2, 3, 4].map((i) => (
                                        <li key={i}>{t.rich(`overview.history.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                                <p className="text-footnote md:text-subheadline text-surface-700">
                                    {t('overview.history.scrollNote')}
                                </p>
                                <p className="text-footnote md:text-subheadline text-surface-700 italic">
                                    {t.rich('overview.history.footer', richTextComponents)}
                                </p>
                            </div>

                            <div className="flex justify-center w-full">
                                <div className="w-50 md:w-60">
                                    <div className="dark:hidden">
                                        <Iphone src="" priority />
                                    </div>
                                    <div className="hidden dark:block">
                                        <Iphone src="" priority />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3) Workout Details */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight flex items-center gap-(--space-2)">
                                    <ArrowRight className="size-5 text-brand-500" />
                                    {t('overview.details.title')}
                                </h3>
                                <div className="text-footnote md:text-subheadline text-surface-700 max-w-prose whitespace-pre-line leading-relaxed">
                                    {t.rich('overview.details.description', richTextComponents)}
                                </div>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    {[1, 2, 3].map((i) => (
                                        <li key={i}>{t.rich(`overview.details.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex justify-center w-full">
                                <div className="w-50 md:w-60">
                                    <div className="dark:hidden">
                                        <Iphone src="" priority />
                                    </div>
                                    <div className="hidden dark:block">
                                        <Iphone src="" priority />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tip */}
                        <div className="p-(--space-4) md:p-(--space-6) border border-surface-200 dark:border-surface-300/40 bg-surface-50/50 dark:bg-surface-900/20">
                            <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight mb-(--space-2) flex items-center gap-(--space-2)">
                                <Info className="size-5 text-brand-500" />
                                {t('overview.tip.title')}
                            </h3>
                            <p className="text-footnote md:text-subheadline text-surface-700">
                                {t.rich('overview.tip.description', richTextComponents)}
                            </p>
                        </div>

                    </section>

                    {/* WORKOUT DETAILS Section */}
                    <section id="workout-details" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-12)">
                        <div className="space-y-(--space-2)">
                            <h2 className="text-title-2 md:text-title-1 lg:text-large-title font-bold text-surface-900 tracking-tight">
                                {t('workoutDetails.title')}
                            </h2>
                            <div className="text-footnote md:text-subheadline text-surface-700 max-w-prose whitespace-pre-line leading-relaxed">
                                {t.rich('workoutDetails.intro.text', richTextComponents)}
                            </div>

                            {/* Tabs List */}
                            <ul className="list-disc list-outside ml-4 space-y-1 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400 mt-(--space-4)">
                                {[1, 2, 3].map((i) => (
                                    <li key={i}>{t.rich(`workoutDetails.intro.list.${i}`, richTextComponents)}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Tabs Image */}
                        <div className="flex justify-center w-full py-(--space-4) md:py-(--space-6)">
                            <div className="w-50 md:w-60">
                                <div className="dark:hidden">
                                    <Iphone src="" priority />
                                </div>
                                <div className="hidden dark:block">
                                    <Iphone src="" priority />
                                </div>
                            </div>
                        </div>

                        <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                        {/* 1) Summary Tab */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                    {t('workoutDetails.summary.title')}
                                </h3>
                                <div className="text-footnote md:text-subheadline text-surface-700 max-w-prose">
                                    {t.rich('workoutDetails.summary.description', richTextComponents)}
                                </div>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    {[1, 2, 3, 4].map((i) => (
                                        <li key={i}>{t.rich(`workoutDetails.summary.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>

                                <div className="pt-(--space-2)">
                                    <p className="text-footnote md:text-subheadline text-surface-700 font-semibold mb-(--space-2)">
                                        {t('workoutDetails.summary.achievements.title')}
                                    </p>
                                    <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                        {[1, 2, 3].map((i) => (
                                            <li key={i}>{t.rich(`workoutDetails.summary.achievements.list.${i}`, richTextComponents)}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="flex justify-center w-full">
                                <div className="w-50 md:w-60">
                                    <div className="dark:hidden">
                                        <Iphone src="" priority />
                                    </div>
                                    <div className="hidden dark:block">
                                        <Iphone src="" priority />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                        {/* 2) Exercises Tab */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                    {t('workoutDetails.exercises.title')}
                                </h3>
                                <div className="text-footnote md:text-subheadline text-surface-700 max-w-prose">
                                    {t.rich('workoutDetails.exercises.description', richTextComponents)}
                                </div>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    {[1, 2, 3, 4].map((i) => (
                                        <li key={i}>{t.rich(`workoutDetails.exercises.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                                <p className="text-footnote md:text-subheadline text-surface-700 italic">
                                    {t('workoutDetails.exercises.note')}
                                </p>
                            </div>

                            <div className="flex justify-center w-full">
                                <div className="w-50 md:w-60">
                                    <div className="dark:hidden">
                                        <Iphone src="" priority />
                                    </div>
                                    <div className="hidden dark:block">
                                        <Iphone src="" priority />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                        {/* 3) Analysis Tab */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                    {t('workoutDetails.analysis.title')}
                                </h3>
                                <div className="text-footnote md:text-subheadline text-surface-700 max-w-prose">
                                    {t.rich('workoutDetails.analysis.description', richTextComponents)}
                                </div>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    {[1, 2].map((i) => (
                                        <li key={i}>{t.rich(`workoutDetails.analysis.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>

                                <div className="pt-(--space-2)">
                                    <p className="text-footnote md:text-subheadline text-surface-700 font-semibold mb-(--space-2)">
                                        {t('workoutDetails.analysis.filters.title')}
                                    </p>
                                    <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                        {[1, 2].map((i) => (
                                            <li key={i}>{t.rich(`workoutDetails.analysis.filters.list.${i}`, richTextComponents)}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="flex justify-center w-full">
                                <div className="w-50 md:w-60">
                                    <div className="dark:hidden">
                                        <Iphone src="" priority />
                                    </div>
                                    <div className="hidden dark:block">
                                        <Iphone src="" priority />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                        {/* Tip */}
                        <div className="p-(--space-4) md:p-(--space-6) border border-surface-200 dark:border-surface-300/40 bg-surface-50/50 dark:bg-surface-900/20">
                            <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight mb-(--space-2) flex items-center gap-(--space-2)">
                                <Info className="size-5 text-brand-500" />
                                {t('workoutDetails.tip.title')}
                            </h3>
                            <p className="text-footnote md:text-subheadline text-surface-700">
                                {t.rich('workoutDetails.tip.description', richTextComponents)}
                            </p>
                        </div>

                    </section>

                    {/* VOLUME TREND Section */}
                    <section id="volume-trend" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-12)">
                        <div className="space-y-(--space-2)">
                            <h2 className="text-title-2 md:text-title-1 lg:text-large-title font-bold text-surface-900 tracking-tight">
                                {t('volumeTrend.title')}
                            </h2>
                            <div className="text-footnote md:text-subheadline text-surface-700 max-w-prose whitespace-pre-line leading-relaxed">
                                {t.rich('volumeTrend.description', richTextComponents)}
                            </div>
                        </div>

                        {/* Main Image */}
                        <div className="flex justify-center w-full py-(--space-4) md:py-(--space-6)">
                            <div className="w-50 md:w-60">
                                <div className="dark:hidden">
                                    <Iphone src="" priority />
                                </div>
                                <div className="hidden dark:block">
                                    <Iphone src="" priority />
                                </div>
                            </div>
                        </div>

                        <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                        {/* 1) What Chart Shows */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                    {t('volumeTrend.chartShows.title')}
                                </h3>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    {[1, 2, 3].map((i) => (
                                        <li key={i}>{t.rich(`volumeTrend.chartShows.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex justify-center w-full">
                                <div className="w-50 md:w-60">
                                    <div className="dark:hidden">
                                        <Iphone src="" priority />
                                    </div>
                                    <div className="hidden dark:block">
                                        <Iphone src="" priority />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                        {/* 2) Compare */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                    {t('volumeTrend.compare.title')}
                                </h3>
                                <div className="text-footnote md:text-subheadline text-surface-700 max-w-prose">
                                    {t.rich('volumeTrend.compare.description', richTextComponents)}
                                </div>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    {[1, 2].map((i) => (
                                        <li key={i}>{t.rich(`volumeTrend.compare.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                                <p className="text-footnote md:text-subheadline text-surface-700 italic">
                                    {t('volumeTrend.compare.note')}
                                </p>
                            </div>

                            <div className="flex justify-center w-full">
                                <div className="w-50 md:w-60">
                                    <div className="dark:hidden">
                                        <Iphone src="" priority />
                                    </div>
                                    <div className="hidden dark:block">
                                        <Iphone src="" priority />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                        {/* 3) Timeframe */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                    {t('volumeTrend.timeframe.title')}
                                </h3>
                                <div className="text-footnote md:text-subheadline text-surface-700 max-w-prose">
                                    {t.rich('volumeTrend.timeframe.description', richTextComponents)}
                                </div>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    {[1, 2, 3].map((i) => (
                                        <li key={i}>{t.rich(`volumeTrend.timeframe.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex justify-center w-full">
                                <div className="w-50 md:w-60">
                                    <div className="dark:hidden">
                                        <Iphone src="" priority />
                                    </div>
                                    <div className="hidden dark:block">
                                        <Iphone src="" priority />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                        {/* How To & Tip */}
                        <div className="space-y-(--space-6)">
                            <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                {t('volumeTrend.howTo.title')}
                            </h3>
                            <p className="text-footnote md:text-subheadline text-surface-700">
                                {t.rich('volumeTrend.howTo.description', richTextComponents)}
                            </p>

                            <div className="p-(--space-4) md:p-(--space-6) border border-surface-200 dark:border-surface-300/40 bg-surface-50/50 dark:bg-surface-900/20">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight mb-(--space-2) flex items-center gap-(--space-2)">
                                    <Info className="size-5 text-brand-500" />
                                    {t('volumeTrend.howTo.tip.title')}
                                </h3>
                                <p className="text-footnote md:text-subheadline text-surface-700 whitespace-pre-line leading-relaxed">
                                    {t.rich('volumeTrend.howTo.tip.text', {
                                        ...richTextComponents,
                                        link: (children) => <a href="#exercise-explorer" className="font-semibold text-brand-500 hover:text-brand-600 underline decoration-brand-500/30 underline-offset-4 transition-colors duration-200">{children}</a>
                                    })}
                                </p>
                            </div>
                        </div>


                    </section>

                    {/* EXERCISE EXPLORER Section */}
                    <section id="exercise-explorer" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-12)">
                        <div className="space-y-(--space-2)">
                            <h2 className="text-title-2 md:text-title-1 lg:text-large-title font-bold text-surface-900 tracking-tight">
                                {t('exerciseExplorer.title')}
                            </h2>
                            <div className="text-footnote md:text-subheadline text-surface-700 max-w-prose whitespace-pre-line leading-relaxed">
                                {t.rich('exerciseExplorer.description', richTextComponents)}
                            </div>
                        </div>

                        {/* Main Image */}
                        <div className="flex justify-center w-full py-(--space-4) md:py-(--space-6)">
                            <div className="w-50 md:w-60">
                                <div className="dark:hidden">
                                    <Iphone src="" priority />
                                </div>
                                <div className="hidden dark:block">
                                    <Iphone src="" priority />
                                </div>
                            </div>
                        </div>

                        <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                        {/* 1) Pick an exercise */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                    {t('exerciseExplorer.pickExercise.title')}
                                </h3>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    {[1, 2, 3].map((i) => (
                                        <li key={i}>{t.rich(`exerciseExplorer.pickExercise.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex justify-center w-full">
                                <div className="w-50 md:w-60">
                                    <div className="dark:hidden">
                                        <Iphone src="" priority />
                                    </div>
                                    <div className="hidden dark:block">
                                        <Iphone src="" priority />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                        {/* 2) What to track */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                    {t('exerciseExplorer.whatToTrack.title')}
                                </h3>
                                <div className="text-footnote md:text-subheadline text-surface-700 max-w-prose">
                                    {t.rich('exerciseExplorer.whatToTrack.description', richTextComponents)}
                                </div>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    {[1, 2, 3].map((i) => (
                                        <li key={i}>{t.rich(`exerciseExplorer.whatToTrack.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex justify-center w-full">
                                <div className="w-50 md:w-60">
                                    <div className="dark:hidden">
                                        <Iphone src="" priority />
                                    </div>
                                    <div className="hidden dark:block">
                                        <Iphone src="" priority />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                        {/* 3) Filters */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                    {t('exerciseExplorer.filters.title')}
                                </h3>
                                <div className="text-footnote md:text-subheadline text-surface-700 max-w-prose">
                                    {t.rich('exerciseExplorer.filters.description', richTextComponents)}
                                </div>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    {[1, 2].map((i) => (
                                        <li key={i}>{t.rich(`exerciseExplorer.filters.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                                <p className="text-footnote md:text-subheadline text-surface-700 italic">
                                    {t('exerciseExplorer.filters.note')}
                                </p>
                            </div>
                            <div className="flex justify-center w-full">
                                <div className="w-50 md:w-60">
                                    <div className="dark:hidden">
                                        <Iphone src="" priority />
                                    </div>
                                    <div className="hidden dark:block">
                                        <Iphone src="" priority />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                        {/* How To & Tip */}
                        <div className="space-y-(--space-6)">
                            <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                {t('exerciseExplorer.howTo.title')}
                            </h3>
                            <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                {[1, 2, 3].map((i) => (
                                    <li key={i}>{t.rich(`exerciseExplorer.howTo.list.${i}`, richTextComponents)}</li>
                                ))}
                            </ul>

                            <div className="p-(--space-4) md:p-(--space-6) border border-surface-200 dark:border-surface-300/40 bg-surface-50/50 dark:bg-surface-900/20">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight mb-(--space-2) flex items-center gap-(--space-2)">
                                    <Info className="size-5 text-brand-500" />
                                    {t('exerciseExplorer.tip.title')}
                                </h3>
                                <p className="text-footnote md:text-subheadline text-surface-700">
                                    {t.rich('exerciseExplorer.tip.description', richTextComponents)}
                                </p>
                            </div>
                        </div>

                    </section>
                </div>
            </div>
        </div>
    )
}
