import { getTranslations } from "next-intl/server"
import { Bot, Clipboard, Check, ShieldCheck } from "lucide-react"
import {
    StepCard,
} from "@/components/features/feature-cards"
import type { ReactNode } from "react"
import { Iphone } from "@/components/ui/mobileDevices/Phone"

const richTextComponents = {
    strong: (chunks: ReactNode) => <strong className="text-surface-900 font-semibold">{chunks}</strong>,
    brand: (chunks: ReactNode) => <span className="primaryGradient">{chunks}</span>,
}

export default async function AiFeaturesPage() {
    const t = await getTranslations('Guides.AiFeaturesPage')

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

                <div className="space-y-(--space-10) md:space-y-(--space-16) lg:space-y-(--space-20) pb-(--space-10) md:pb-(--space-16)">

                    {/* OVERVIEW Section */}
                    <section id="overview" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-12)">
                        <div className="space-y-(--space-2)">
                            <h2 className="text-title-2 md:text-title-1 lg:text-large-title font-bold text-surface-900 tracking-tight">
                                {t('overview.title')}
                            </h2>
                            <div className="text-footnote md:text-subheadline text-surface-700 max-w-prose whitespace-pre-line">
                                {t.rich('overview.description', richTextComponents)}
                            </div>
                        </div>

                        {/* Image */}
                        <div className="flex justify-center w-full py-(--space-4) md:py-(--space-6) bg-surface-50 dark:bg-surface-200/10 border border-surface-200 dark:border-surface-300/40">
                            <div className="w-50 md:w-60">
                                <Iphone>
                                    <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                        <span className="text-caption-1 text-surface-400 font-medium">
                                            {t('overview.imageAlt')}
                                        </span>
                                    </div>
                                </Iphone>
                            </div>
                        </div>

                        <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                        {/* When to use AI */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                    {t('overview.whenToUse.title')}
                                </h3>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    {[1, 2, 3].map((i) => (
                                        <li key={i}>{t.rich(`overview.whenToUse.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                        {/* Requirements */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                    {t('overview.requirements.title')}
                                </h3>
                                <p className="text-footnote md:text-subheadline text-surface-600">
                                    {t('overview.requirements.description')}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* IMPORT PLAN Section */}
                    <section id="import-plan" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-12)">
                        <div className="space-y-(--space-2)">
                            <h2 className="text-title-2 md:text-title-1 lg:text-large-title font-bold text-surface-900 tracking-tight">
                                {t('importPlan.title')}
                            </h2>
                            <div className="text-footnote md:text-subheadline text-surface-700 max-w-prose whitespace-pre-line">
                                {t.rich('importPlan.description', richTextComponents)}
                            </div>
                        </div>

                        {/* Image: Import Plan Screen */}
                        <div className="flex justify-center w-full py-(--space-4) md:py-(--space-6) bg-surface-50 dark:bg-surface-200/10 border border-surface-200 dark:border-surface-300/40">
                            <div className="w-50 md:w-60">
                                <Iphone>
                                    <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                        <span className="text-caption-1 text-surface-400 font-medium">
                                            {t('importPlan.imageAlt')}
                                        </span>
                                    </div>
                                </Iphone>
                            </div>
                        </div>

                        <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                        {/* 1) Paste Plan */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                    {t('importPlan.pastePlan.title')}
                                </h3>
                                <ul className="list-decimal list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    {[1, 2, 3].map((i) => (
                                        <li key={i}>{t.rich(`importPlan.pastePlan.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                                <p className="text-footnote md:text-subheadline text-surface-600">
                                    {t('importPlan.pastePlan.note')}
                                </p>
                            </div>
                            <div className="flex justify-center w-full">
                                <div className="w-50 md:w-60">
                                    <Iphone>
                                        <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                            <span className="text-caption-1 text-surface-400 font-medium">
                                                {t('importPlan.pastePlan.imageAlt')}
                                            </span>
                                        </div>
                                    </Iphone>
                                </div>
                            </div>
                        </div>

                        <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                        {/* 2) Preview */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                    {t('importPlan.preview.title')}
                                </h3>
                                <div className="text-footnote md:text-subheadline text-surface-600 max-w-prose">
                                    {t.rich('importPlan.preview.description', richTextComponents)}
                                </div>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    {[1, 2, 3].map((i) => (
                                        <li key={i}>{t.rich(`importPlan.preview.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4 justify-center w-full">
                                <div className="w-50 md:w-60">
                                    <Iphone>
                                        <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                            <span className="text-caption-1 text-surface-400 font-medium">
                                                {t('importPlan.preview.imageAlt1')}
                                            </span>
                                        </div>
                                    </Iphone>
                                </div>
                                <div className="w-50 md:w-60">
                                    <Iphone>
                                        <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                            <span className="text-caption-1 text-surface-400 font-medium">
                                                {t('importPlan.preview.imageAlt2')}
                                            </span>
                                        </div>
                                    </Iphone>
                                </div>
                            </div>
                        </div>

                        <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                        {/* 3) Confidence */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                    {t('importPlan.confidence.title')}
                                </h3>
                                <div className="text-footnote md:text-subheadline text-surface-600 max-w-prose">
                                    {t.rich('importPlan.confidence.description', richTextComponents)}
                                </div>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    {[1, 2].map((i) => (
                                        <li key={i}>{t.rich(`importPlan.confidence.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex justify-center w-full">
                                <div className="w-50 md:w-60">
                                    <Iphone>
                                        <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                            <span className="text-caption-1 text-surface-400 font-medium">
                                                {t('importPlan.confidence.imageAlt')}
                                            </span>
                                        </div>
                                    </Iphone>
                                </div>
                            </div>
                        </div>

                        <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                        {/* 4) Edit */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                    {t('importPlan.edit.title')}
                                </h3>
                                <div className="text-footnote md:text-subheadline text-surface-600 max-w-prose">
                                    {t.rich('importPlan.edit.description', richTextComponents)}
                                </div>

                                {/* Chips */}
                                <div className="space-y-2 pt-4">
                                    <h4 className="text-subheadline md:text-callout font-semibold text-surface-900">
                                        {t('importPlan.edit.chips.title')}
                                    </h4>
                                    <p className="text-footnote md:text-subheadline text-surface-600">
                                        {t('importPlan.edit.chips.description')}
                                    </p>
                                    <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                        {[1, 2, 3].map((i) => (
                                            <li key={i}>{t.rich(`importPlan.edit.chips.list.${i}`, richTextComponents)}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex justify-center w-full py-4">
                                    <div className="w-50 md:w-60">
                                        <Iphone>
                                            <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                                <span className="text-caption-1 text-surface-400 font-medium">
                                                    {t('importPlan.edit.chips.imageAlt')}
                                                </span>
                                            </div>
                                        </Iphone>
                                    </div>
                                </div>

                                {/* Sets */}
                                <div className="space-y-2 pt-4">
                                    <h4 className="text-subheadline md:text-callout font-semibold text-surface-900">
                                        {t('importPlan.edit.sets.title')}
                                    </h4>
                                    <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                        {[1, 2].map((i) => (
                                            <li key={i}>{t.rich(`importPlan.edit.sets.list.${i}`, richTextComponents)}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex justify-center w-full py-4">
                                    <div className="w-50 md:w-60">
                                        <Iphone>
                                            <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                                <span className="text-caption-1 text-surface-400 font-medium">
                                                    {t('importPlan.edit.sets.imageAlt')}
                                                </span>
                                            </div>
                                        </Iphone>
                                    </div>
                                </div>

                                {/* Instructions */}
                                <div className="space-y-2 pt-4">
                                    <h4 className="text-subheadline md:text-callout font-semibold text-surface-900">
                                        {t('importPlan.edit.instructions.title')}
                                    </h4>
                                    <p className="text-footnote md:text-subheadline text-surface-600">
                                        {t.rich('importPlan.edit.instructions.description', richTextComponents)}
                                    </p>
                                </div>
                                <div className="flex justify-center w-full py-4">
                                    <div className="w-50 md:w-60">
                                        <Iphone>
                                            <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                                <span className="text-caption-1 text-surface-400 font-medium">
                                                    {t('importPlan.edit.instructions.imageAlt')}
                                                </span>
                                            </div>
                                        </Iphone>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                        {/* 5) Save */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                    {t('importPlan.save.title')}
                                </h3>
                                <div className="text-footnote md:text-subheadline text-surface-600 max-w-prose">
                                    {t.rich('importPlan.save.description', richTextComponents)}
                                </div>
                                <ul className="list-decimal list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    {[1, 2].map((i) => (
                                        <li key={i}>{t.rich(`importPlan.save.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                                <p className="text-footnote md:text-subheadline text-surface-600 italic">
                                    {t('importPlan.save.footer')}
                                </p>
                            </div>
                            <div className="flex justify-center w-full">
                                <div className="w-50 md:w-60">
                                    <Iphone>
                                        <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                            <span className="text-caption-1 text-surface-400 font-medium">
                                                {t('importPlan.save.imageAlt')}
                                            </span>
                                        </div>
                                    </Iphone>
                                </div>
                            </div>
                        </div>

                        <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                        {/* Tips */}
                        <div className="space-y-(--space-6)">
                            <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                {t('importPlan.tips.title')}
                            </h3>
                            <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                {[1, 2, 3].map((i) => (
                                    <li key={i}>{t.rich(`importPlan.tips.list.${i}`, richTextComponents)}</li>
                                ))}
                            </ul>

                            <div className="p-(--space-4) md:p-(--space-6) border border-surface-200 dark:border-surface-300/40 bg-surface-50 dark:bg-surface-200/10">
                                <p className="text-footnote md:text-subheadline text-surface-600 whitespace-pre-line">
                                    {t.rich('importPlan.tips.note', richTextComponents)}
                                </p>
                            </div>
                        </div>

                    </section>
                </div>
            </div>
        </div>
    )
}
