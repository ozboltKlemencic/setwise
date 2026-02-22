
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import {
    Download,
    PlusCircle,
    NotebookPen,
    LineChart,
    Zap,
    Check,
    Mail,
    UserRoundCog,
    ArrowRight,
    StickyNote,
    History,
    Play
} from "lucide-react"
import { StepCard } from "@/components/features/feature-cards"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export { generateMetadata } from './metadata'

// -- Rich text renderers ------------------------------------------------

const richTextComponents = {
    strong: (chunks: ReactNode) => <strong className="text-surface-900 font-semibold">{chunks}</strong>,
}

// -- Page Component -----------------------------------------------

export default async function GuidesPage() {
    const t = await getTranslations('Guides.Page')

    const introPoints = [
        { icon: Download, text: t('intro.list.install') },
        { icon: PlusCircle, text: t('intro.list.create') },
        { icon: NotebookPen, text: t('intro.list.log') },
        { icon: LineChart, text: t('intro.list.review') },
        { icon: Zap, text: t('intro.list.features') },
    ]

    const learnMoreLinks = [
        { href: '/contact', icon: Mail, label: 'Contact', translationKey: 'contact' }, // Using 'Contact' namespace for label if needed, or hardcoded for now based on request "second link" which was contact
        { href: '/support', icon: UserRoundCog, label: 'Support', translationKey: 'support' },
    ] as const

    return (
        <div className="w-full h-full flex flex-col items-center justify-start font-sans pt-12 md:pt-0">
            <div className="w-full px-(--space-5) md:px-(--space-12) max-w-5xl min-[1152px]:border-0 md:border-l md:border-r border-surface-200">

                {/* ── Page Header: Welcome ────────────────────────────── */}
                <header id="welcome" className="pt-(--space-8) pb-(--space-10) md:pt-(--space-16) md:pb-(--space-16) min-[1152px]:pr-(--space-8) scroll-mt-32">
                    <p className="text-caption-2 tracking-wider font-semibold primaryGradient mb-1">
                        {t('badge')}
                    </p>
                    <h1 className="text-title-1 md:text-display-sm lg:text-display font-bold text-surface-900 tracking-tight text-balance">
                        {t('title')}
                    </h1>
                    <p className="mt-1 text-footnote md:text-subheadline lg:text-callout text-surface-700 leading-relaxed max-w-prose mb-(--space-6)">
                        {t('subtitle')}
                    </p>

                    <div className="mb-(--space-8)">
                        <h2 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight mb-(--space-4)">
                            {t('intro.title')}
                        </h2>
                        <ul className="space-y-(--space-3) mb-(--space-6)">
                            {introPoints.map((point, index) => (
                                <li key={index} className="flex items-start gap-(--space-3)">
                                    <div className="mt-0.5 p-1 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400 shrink-0">
                                        <point.icon className="size-3.5" />
                                    </div>
                                    <span className="text-footnote md:text-subheadline text-surface-700">{point.text}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="text-caption-1 text-surface-500 italic">
                            {t('intro.footer')}
                        </p>
                    </div>
                </header>

                <div className="h-px w-full bg-surface-200/80 dark:bg-surface-300/60 mb-(--space-10) md:mb-(--space-16)" />

                {/* ── Section: How to get the most ───────────────────── */}
                <section id="how-to-get-the-most" className="scroll-mt-32 space-y-(--space-10) md:space-y-(--space-16) pb-(--space-10) md:pb-(--space-16)">
                    <div>
                        <h2 className="text-title-2 md:text-title-1 lg:text-large-title font-bold text-surface-900 tracking-tight text-balance mb-(--space-2)">
                            {t('howTo.title')}
                        </h2>
                        <p className="text-footnote md:text-subheadline lg:text-callout text-surface-700 leading-relaxed max-w-prose">
                            {t('howTo.description')}
                        </p>
                    </div>

                    <div className="space-y-(--space-8) md:space-y-(--space-12)">
                        {/* Point 1: Templates */}
                        <div className="flex flex-col md:flex-row gap-(--space-4) md:gap-(--space-8)">
                            <div className="flex-none">
                                <div className="flex items-center justify-center rounded-lg bg-linear-to-tr from-surface-200/70 to-surface-300 dark:bg-surface-300/20 shrink-0 size-8 md:size-10 text-callout font-bold text-surface-900">
                                    1
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight mb-(--space-2)">
                                    {t('howTo.points.1.title').replace('1) ', '')}
                                </h3>
                                <p className="text-footnote md:text-subheadline text-surface-700 leading-relaxed whitespace-pre-line">
                                    {t.rich('howTo.points.1.description', richTextComponents)}
                                </p>
                            </div>
                        </div>

                        {/* Point 2: Start fast with Last */}
                        <div className="flex flex-col md:flex-row gap-(--space-4) md:gap-(--space-8)">
                            <div className="flex-none">
                                <div className="flex items-center justify-center rounded-lg bg-linear-to-tr from-surface-200/70 to-surface-300 dark:bg-surface-300/20 shrink-0 size-8 md:size-10 text-callout font-bold text-surface-900">
                                    2
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight mb-(--space-2)">
                                    {t('howTo.points.2.title').replace('2) ', '')}
                                </h3>
                                <p className="text-footnote md:text-subheadline text-surface-700 leading-relaxed whitespace-pre-line">
                                    {t.rich('howTo.points.2.description', richTextComponents)}
                                </p>
                            </div>
                        </div>

                        {/* Point 3: Notes */}
                        <div className="flex flex-col md:flex-row gap-(--space-4) md:gap-(--space-8)">
                            <div className="flex-none">
                                <div className="flex items-center justify-center rounded-lg bg-linear-to-tr from-surface-200/70 to-surface-300 dark:bg-surface-300/20 shrink-0 size-8 md:size-10 text-callout font-bold text-surface-900">
                                    3
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight mb-(--space-2)">
                                    {t('howTo.points.3.title').replace('3) ', '')}
                                </h3>
                                <p className="text-footnote md:text-subheadline text-surface-700 leading-relaxed mb-(--space-3)">
                                    {t('howTo.points.3.description')}
                                </p>
                                <ul className="space-y-1 mb-(--space-3) list-disc list-inside text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    <li>{t('howTo.points.3.list.pain')}</li>
                                    <li>{t('howTo.points.3.list.technique')}</li>
                                    <li>{t('howTo.points.3.list.setup')}</li>
                                </ul>
                                <p className="text-footnote md:text-subheadline text-surface-700 leading-relaxed">
                                    {t('howTo.points.3.footer')}
                                </p>
                            </div>
                        </div>

                        {/* Point 4: Quick Start */}
                        <div className="flex flex-col md:flex-row gap-(--space-4) md:gap-(--space-8)">
                            <div className="flex-none">
                                <div className="flex items-center justify-center rounded-lg bg-linear-to-tr from-surface-200/70 to-surface-300 dark:bg-surface-300/20 shrink-0 size-8 md:size-10 text-callout font-bold text-surface-900">
                                    4
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight mb-(--space-2)">
                                    {t('howTo.points.4.title').replace('4) ', '')}
                                </h3>
                                <p className="text-footnote md:text-subheadline text-surface-700 leading-relaxed whitespace-pre-line">
                                    {t.rich('howTo.points.4.description', richTextComponents)}
                                </p>
                            </div>
                        </div>

                        {/* Point 5: Progress */}
                        <div className="flex flex-col md:flex-row gap-(--space-4) md:gap-(--space-8)">
                            <div className="flex-none">
                                <div className="flex items-center justify-center rounded-lg bg-linear-to-tr from-surface-200/70 to-surface-300 dark:bg-surface-300/20 shrink-0 size-8 md:size-10 text-callout font-bold text-surface-900">
                                    5
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight mb-(--space-2)">
                                    {t('howTo.points.5.title').replace('5) ', '')}
                                </h3>
                                <p className="text-footnote md:text-subheadline text-surface-700 leading-relaxed mb-(--space-3)">
                                    {t.rich('howTo.points.5.description', richTextComponents)}
                                </p>
                                <ul className="space-y-1 list-disc list-inside text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    <li>{t('howTo.points.5.list.past')}</li>
                                    <li>{t('howTo.points.5.list.details')}</li>
                                    <li>{t('howTo.points.5.list.trends')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Tips Box (CTA Card Style) */}
                    <div className="relative isolate overflow-hidden rounded-2xl border border-brand-300/40 dark:border-brand-400/25 bg-linear-to-br from-brand-500/20 via-brand-500/8 to-brand-500/25 shadow-(--shadow-lg) mt-(--space-8) md:mt-(--space-12)">
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

                        {/* Content — on top of decorative lines */}
                        <div className="relative z-20 p-(--space-5) md:p-(--space-8) w-full flex flex-col items-start gap-(--space-4)">
                            <div className="flex items-center gap-(--space-3)">
                                <div className="p-1.5 rounded-lg bg-brand-100/80 dark:bg-brand-800/50 text-brand-700 dark:text-brand-200">
                                    <Zap className="size-5" />
                                </div>
                                <h3 className="text-title-3 font-bold text-surface-900 tracking-tight">
                                    {t('tips.title')}
                                </h3>
                            </div>

                            <ul className="space-y-(--space-3) w-full">
                                <li className="flex gap-(--space-3) text-footnote md:text-subheadline text-surface-800">
                                    <span className="text-brand-600 dark:text-brand-400 font-bold mt-0.5">•</span>
                                    <span>{t('tips.list.consistency')}</span>
                                </li>
                                <li className="flex gap-(--space-3) text-footnote md:text-subheadline text-surface-800">
                                    <span className="text-brand-600 dark:text-brand-400 font-bold mt-0.5">•</span>
                                    <span>{t('tips.list.quality')}</span>
                                </li>
                                <li className="flex gap-(--space-3) text-footnote md:text-subheadline text-surface-800">
                                    <span className="text-brand-600 dark:text-brand-400 font-bold mt-0.5">•</span>
                                    <span>{t.rich('tips.list.form', richTextComponents)}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ── Section: Quick Links (About Page Style) ────────────────────────────── */}
                <div className="h-px w-full bg-surface-200/80 dark:bg-surface-300/60 mb-(--space-10) md:mb-(--space-16)" />

                <section id="learn-more" className="pb-(--space-10) md:pb-(--space-16)">
                    <div>
                        <h2 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                            {t('learnMore.title')}
                        </h2>
                        <div className="flex flex-col gap-(--space-2.5) mt-(--space-3)">
                            {learnMoreLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="inline-flex items-center gap-(--space-1.5) text-footnote font-medium text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors duration-(--duration-fast) ease-(--ease-apple)"
                                >
                                    <link.icon className="size-3.5 shrink-0" />
                                    <span>{t(`learnMore.${link.translationKey}`)}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}
