import { getTranslations } from "next-intl/server"
import { ArrowRight, Calendar, History, TrendingUp, Info } from "lucide-react"
import type { ReactNode } from "react"
import { Iphone } from "@/components/ui/mobileDevices/Phone"

// -- Rich text renderers ------------------------------------------------
const richTextComponents = {
    strong: (chunks: ReactNode) => <strong className="text-surface-900 font-semibold">{chunks}</strong>,
    brand: (chunks: ReactNode) => <span className="primaryGradient">{chunks}</span>,
}

export default async function ProgressPage() {
    const t = await getTranslations('Guides.ProgressPage')

    return (
        <div className="w-full h-full flex flex-col items-center justify-start font-sans pt-0 md:pt-12 lg:pt-0">
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
                <div className="space-y-(--space-10) md:space-y-(--space-16) lg:space-y-(--space-20) pb-20">

                    {/* PROGRESS OVERVIEW Section */}
                    <section id="overview" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-12)">
                        <div className="space-y-(--space-2)">
                            <h2 className="text-title-2 md:text-title-1 font-bold text-surface-900 tracking-tight">
                                {t('overview.title')}
                            </h2>
                            <div className="text-body text-surface-700 max-w-prose whitespace-pre-line">
                                {t.rich('overview.description', richTextComponents)}
                            </div>

                            {/* Overview List */}
                            <ul className="list-disc list-outside ml-4 space-y-1 text-body text-surface-700 marker:text-surface-400 mt-4">
                                {[1, 2, 3].map((i) => (
                                    <li key={i}>{t.rich(`overview.list.${i}`, richTextComponents)}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Main Image */}
                        <div className="flex justify-center w-full py-8 bg-surface-50/50 dark:bg-surface-900/20 rounded-2xl border border-surface-200 dark:border-surface-800">
                            <div className="w-[200px] md:w-[240px]">
                                <Iphone>
                                    <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                        <span className="text-caption-1 text-surface-400 font-medium">
                                            {t('overview.imageAlt')}
                                        </span>
                                    </div>
                                </Iphone>
                            </div>
                        </div>


                        {/* 1) Calendar Filter */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 font-bold text-surface-900 flex items-center gap-2">
                                    <Calendar className="size-5 text-brand-500" />
                                    {t('overview.calendar.title')}
                                </h3>
                                <div className="text-body text-surface-600 max-w-prose">
                                    {t.rich('overview.calendar.description', richTextComponents)}
                                </div>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-body text-surface-700 marker:text-surface-400">
                                    {[1, 2].map((i) => (
                                        <li key={i}>{t.rich(`overview.calendar.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                                <p className="text-body text-surface-600 italic">
                                    {t('overview.calendar.footer')}
                                </p>
                            </div>

                            <div className="flex justify-center w-full">
                                <div className="w-[200px] md:w-[240px]">
                                    <Iphone>
                                        <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                            <span className="text-caption-1 text-surface-400 font-medium">
                                                {t('overview.calendar.imageAlt')}
                                            </span>
                                        </div>
                                    </Iphone>
                                </div>
                            </div>
                        </div>

                        {/* 2) Workout History List */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 font-bold text-surface-900 flex items-center gap-2">
                                    <History className="size-5 text-brand-500" />
                                    {t('overview.history.title')}
                                </h3>
                                <div className="text-body text-surface-600 max-w-prose">
                                    {t.rich('overview.history.description', richTextComponents)}
                                </div>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-body text-surface-700 marker:text-surface-400">
                                    {[1, 2, 3, 4].map((i) => (
                                        <li key={i}>{t.rich(`overview.history.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                                <p className="text-body text-surface-600">
                                    {t('overview.history.scrollNote')}
                                </p>
                                <p className="text-body text-surface-600 italic">
                                    {t.rich('overview.history.footer', richTextComponents)}
                                </p>
                            </div>

                            <div className="flex justify-center w-full">
                                <div className="w-[200px] md:w-[240px]">
                                    <Iphone>
                                        <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                            <span className="text-caption-1 text-surface-400 font-medium">
                                                {t('overview.history.imageAlt')}
                                            </span>
                                        </div>
                                    </Iphone>
                                </div>
                            </div>
                        </div>

                        {/* 3) Workout Details */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 font-bold text-surface-900 flex items-center gap-2">
                                    <ArrowRight className="size-5 text-brand-500" />
                                    {t('overview.details.title')}
                                </h3>
                                <div className="text-body text-surface-600 max-w-prose whitespace-pre-line">
                                    {t.rich('overview.details.description', richTextComponents)}
                                </div>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-body text-surface-700 marker:text-surface-400">
                                    {[1, 2, 3].map((i) => (
                                        <li key={i}>{t.rich(`overview.details.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex justify-center w-full">
                                <div className="w-[200px] md:w-[240px]">
                                    <Iphone>
                                        <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                            <span className="text-caption-1 text-surface-400 font-medium">
                                                {t('overview.details.imageAlt')}
                                            </span>
                                        </div>
                                    </Iphone>
                                </div>
                            </div>
                        </div>

                        {/* Tip */}
                        <div className="p-6 rounded-2xl border border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/20">
                            <h3 className="text-headline font-bold text-surface-900 mb-2 flex items-center gap-2">
                                <Info className="size-5 text-brand-500" />
                                {t('overview.tip.title')}
                            </h3>
                            <p className="text-body text-surface-600">
                                {t.rich('overview.tip.description', richTextComponents)}
                            </p>
                        </div>

                    </section>

                    {/* WORKOUT DETAILS Section */}
                    <section id="workout-details" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-12)">
                        <div className="space-y-(--space-2)">
                            <h2 className="text-title-2 md:text-title-1 font-bold text-surface-900 tracking-tight">
                                {t('workoutDetails.title')}
                            </h2>
                            <div className="text-body text-surface-700 max-w-prose whitespace-pre-line">
                                {t.rich('workoutDetails.intro.text', richTextComponents)}
                            </div>

                            {/* Tabs List */}
                            <ul className="list-disc list-outside ml-4 space-y-1 text-body text-surface-700 marker:text-surface-400 mt-4">
                                {[1, 2, 3].map((i) => (
                                    <li key={i}>{t.rich(`workoutDetails.intro.list.${i}`, richTextComponents)}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Tabs Image */}
                        <div className="flex justify-center w-full py-8 bg-surface-50/50 dark:bg-surface-900/20 rounded-2xl border border-surface-200 dark:border-surface-800">
                            <div className="w-[200px] md:w-[240px]">
                                <Iphone>
                                    <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                        <span className="text-caption-1 text-surface-400 font-medium">
                                            {t('workoutDetails.intro.imageAlt')}
                                        </span>
                                    </div>
                                </Iphone>
                            </div>
                        </div>

                        <div className="w-full h-px bg-surface-200 dark:bg-surface-800 my-8" />

                        {/* 1) Summary Tab */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 font-bold text-surface-900">
                                    {t('workoutDetails.summary.title')}
                                </h3>
                                <div className="text-body text-surface-600 max-w-prose">
                                    {t.rich('workoutDetails.summary.description', richTextComponents)}
                                </div>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-body text-surface-700 marker:text-surface-400">
                                    {[1, 2, 3, 4].map((i) => (
                                        <li key={i}>{t.rich(`workoutDetails.summary.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>

                                <div className="pt-2">
                                    <p className="text-body text-surface-700 font-semibold mb-2">
                                        {t('workoutDetails.summary.achievements.title')}
                                    </p>
                                    <ul className="list-disc list-outside ml-4 space-y-2 text-body text-surface-700 marker:text-surface-400">
                                        {[1, 2, 3].map((i) => (
                                            <li key={i}>{t.rich(`workoutDetails.summary.achievements.list.${i}`, richTextComponents)}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="flex justify-center w-full">
                                <div className="w-[200px] md:w-[240px]">
                                    <Iphone>
                                        <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                            <span className="text-caption-1 text-surface-400 font-medium">
                                                {t('workoutDetails.summary.imageAlt')}
                                            </span>
                                        </div>
                                    </Iphone>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-px bg-surface-200 dark:bg-surface-800 my-8" />

                        {/* 2) Exercises Tab */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 font-bold text-surface-900">
                                    {t('workoutDetails.exercises.title')}
                                </h3>
                                <div className="text-body text-surface-600 max-w-prose">
                                    {t.rich('workoutDetails.exercises.description', richTextComponents)}
                                </div>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-body text-surface-700 marker:text-surface-400">
                                    {[1, 2, 3, 4].map((i) => (
                                        <li key={i}>{t.rich(`workoutDetails.exercises.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                                <p className="text-body text-surface-600 italic">
                                    {t('workoutDetails.exercises.note')}
                                </p>
                            </div>

                            <div className="flex justify-center w-full">
                                <div className="w-[200px] md:w-[240px]">
                                    <Iphone>
                                        <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                            <span className="text-caption-1 text-surface-400 font-medium">
                                                {t('workoutDetails.exercises.imageAlt')}
                                            </span>
                                        </div>
                                    </Iphone>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-px bg-surface-200 dark:bg-surface-800 my-8" />

                        {/* 3) Analysis Tab */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 font-bold text-surface-900">
                                    {t('workoutDetails.analysis.title')}
                                </h3>
                                <div className="text-body text-surface-600 max-w-prose">
                                    {t.rich('workoutDetails.analysis.description', richTextComponents)}
                                </div>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-body text-surface-700 marker:text-surface-400">
                                    {[1, 2].map((i) => (
                                        <li key={i}>{t.rich(`workoutDetails.analysis.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>

                                <div className="pt-2">
                                    <p className="text-body text-surface-700 font-semibold mb-2">
                                        {t('workoutDetails.analysis.filters.title')}
                                    </p>
                                    <ul className="list-disc list-outside ml-4 space-y-2 text-body text-surface-700 marker:text-surface-400">
                                        {[1, 2].map((i) => (
                                            <li key={i}>{t.rich(`workoutDetails.analysis.filters.list.${i}`, richTextComponents)}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="flex justify-center w-full">
                                <div className="w-[200px] md:w-[240px]">
                                    <Iphone>
                                        <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                            <span className="text-caption-1 text-surface-400 font-medium">
                                                {t('workoutDetails.analysis.imageAlt')}
                                            </span>
                                        </div>
                                    </Iphone>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-px bg-surface-200 dark:bg-surface-800 my-8" />

                        {/* Tip */}
                        <div className="p-6 rounded-2xl border border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/20">
                            <h3 className="text-headline font-bold text-surface-900 mb-2 flex items-center gap-2">
                                <Info className="size-5 text-brand-500" />
                                {t('workoutDetails.tip.title')}
                            </h3>
                            <p className="text-body text-surface-600">
                                {t.rich('workoutDetails.tip.description', richTextComponents)}
                            </p>
                        </div>

                    </section>
                </div>
            </div>
        </div>
    )
}
