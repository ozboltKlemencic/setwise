import { getTranslations } from "next-intl/server"
import { Eye, Languages, Activity, FastForward, MessageCircle, LogOut } from "lucide-react"
import {
    FeatureCard,
    MiniFeatureCard,
    StepCard,
    FeatureTextBlock,
} from "@/components/features/feature-cards"
import type { ReactNode } from "react"
import { Iphone } from "@/components/ui/mobileDevices/Phone"

const richTextComponents = {
    strong: (chunks: ReactNode) => <strong className="text-surface-900 font-semibold">{chunks}</strong>,
    brand: (chunks: ReactNode) => <span className="primaryGradient">{chunks}</span>,
}

export default async function ProfileSettingsPage() {
    const t = await getTranslations('Guides.ProfileSettingsPage')

    return (
        <div className="w-full h-full flex flex-col items-center justify-start font-sans pt-0 md:pt-12 lg:pt-0">
            <div className="w-full px-(--space-5) md:px-(--space-12) max-w-5xl min-[1152px]:border-0 md:border-l md:border-r border-surface-200">

                {/* ── Page Header ────────────────────────────── */}
                <header className="pt-(--space-8) pb-(--space-5) md:pt-(--space-16) md:pb-(--space-10) min-[1152px]:pr-(--space-8)">
                    <p className="text-caption-2 uppercase tracking-wider font-semibold primaryGradient mb-1">
                        {t('badge')}
                    </p>
                    <h1 className="text-title-1 md:text-display-sm lg:text-display font-bold text-surface-900 tracking-tight text-balance">
                        {t.rich('heading', richTextComponents)}
                    </h1>
                </header>

                <div className="space-y-(--space-10) md:space-y-(--space-16) lg:space-y-(--space-20) pb-20">

                    {/* INTRO Section */}
                    <section id="intro" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-12)">
                        <div className="text-body text-surface-700 max-w-prose whitespace-pre-line">
                            {t.rich('intro.description', richTextComponents)}
                        </div>

                        {/* Image */}
                        <div className="flex justify-center w-full py-8 bg-surface-50/50 dark:bg-surface-900/20 rounded-2xl border border-surface-200 dark:border-surface-800">
                            <div className="w-[200px] md:w-[240px]">
                                <Iphone>
                                    <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                        <span className="text-caption-1 text-surface-400 font-medium">
                                            {t('intro.imageAlt')}
                                        </span>
                                    </div>
                                </Iphone>
                            </div>
                        </div>
                    </section>

                    <div className="w-full h-px bg-surface-200 dark:bg-surface-800" />

                    {/* PREFERENCES Section */}
                    <section id="preferences" className="scroll-mt-32 space-y-(--space-8) md:space-y-(--space-12)">
                        <div className="space-y-(--space-2)">
                            <h2 className="text-title-2 md:text-title-1 font-bold text-surface-900 tracking-tight">
                                {t('preferences.title')}
                            </h2>
                        </div>

                        {/* Appearance */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 font-bold text-surface-900 flex items-center gap-2">
                                    <Eye className="size-5 text-brand-500" />
                                    {t('preferences.appearance.title')}
                                </h3>
                                <p className="text-body text-surface-600">
                                    {t('preferences.appearance.description')}
                                </p>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-body text-surface-700 marker:text-surface-400">
                                    {[1, 2, 3, 4].map((i) => (
                                        <li key={i}>{t.rich(`preferences.appearance.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex justify-center w-full">
                                <div className="w-[200px] md:w-[240px]">
                                    <Iphone>
                                        <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                            <span className="text-caption-1 text-surface-400 font-medium">
                                                {t('preferences.appearance.imageAlt')}
                                            </span>
                                        </div>
                                    </Iphone>
                                </div>
                            </div>
                        </div>

                        {/* Language */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 font-bold text-surface-900 flex items-center gap-2">
                                    <Languages className="size-5 text-brand-500" />
                                    {t('preferences.language.title')}
                                </h3>
                                <p className="text-body text-surface-600">
                                    {t('preferences.language.description')}
                                </p>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-body text-surface-700 marker:text-surface-400">
                                    {[1, 2, 3].map((i) => (
                                        <li key={i}>{t.rich(`preferences.language.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex justify-center w-full">
                                <div className="w-[200px] md:w-[240px]">
                                    <Iphone>
                                        <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                            <span className="text-caption-1 text-surface-400 font-medium">
                                                {t('preferences.language.imageAlt')}
                                            </span>
                                        </div>
                                    </Iphone>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="w-full h-px bg-surface-200 dark:bg-surface-800" />

                    {/* TRAINING Section */}
                    <section id="training" className="scroll-mt-32 space-y-(--space-8) md:space-y-(--space-12)">
                        <div className="space-y-(--space-2)">
                            <h2 className="text-title-2 md:text-title-1 font-bold text-surface-900 tracking-tight">
                                {t('training.title')}
                            </h2>
                        </div>

                        {/* Advanced Analytics */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 font-bold text-surface-900 flex items-center gap-2">
                                    <Activity className="size-5 text-brand-500" />
                                    {t('training.advancedAnalytics.title')}
                                </h3>
                                <p className="text-body text-surface-600">
                                    {t('training.advancedAnalytics.description')}
                                </p>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-body text-surface-700 marker:text-surface-400">
                                    {[1, 2, 3].map((i) => (
                                        <li key={i}>{t.rich(`training.advancedAnalytics.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                                <p className="text-body text-surface-600 italic">
                                    {t('training.advancedAnalytics.footer')}
                                </p>
                            </div>
                            <div className="flex justify-center w-full">
                                <div className="w-[200px] md:w-[240px]">
                                    <Iphone>
                                        <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                            <span className="text-caption-1 text-surface-400 font-medium">
                                                {t('training.advancedAnalytics.imageAlt')}
                                            </span>
                                        </div>
                                    </Iphone>
                                </div>
                            </div>
                        </div>

                        {/* Auto-advance */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 font-bold text-surface-900 flex items-center gap-2">
                                    <FastForward className="size-5 text-brand-500" />
                                    {t('training.autoAdvance.title')}
                                </h3>
                                <p className="text-body text-surface-600 whitespace-pre-line">
                                    {t('training.autoAdvance.description')}
                                </p>
                            </div>
                            <div className="flex justify-center w-full">
                                <div className="w-[200px] md:w-[240px]">
                                    <Iphone>
                                        <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                            <span className="text-caption-1 text-surface-400 font-medium">
                                                {t('training.autoAdvance.imageAlt')}
                                            </span>
                                        </div>
                                    </Iphone>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="w-full h-px bg-surface-200 dark:bg-surface-800" />

                    <div className="w-full h-px bg-surface-200 dark:bg-surface-800" />

                    {/* ACCOUNT Section */}
                    <section id="account" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-12)">
                        <div className="space-y-(--space-4)">
                            <h3 className="text-title-2 md:text-title-1 font-bold text-surface-900 tracking-tight flex items-center gap-2">
                                {t('account.title')}
                            </h3>
                            <p className="text-body text-surface-600">
                                {t.rich('account.description', richTextComponents)}
                            </p>
                        </div>
                        <div className="flex justify-center w-full">
                            <div className="w-[200px] md:w-[240px]">
                                <Iphone>
                                    <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                        <span className="text-caption-1 text-surface-400 font-medium">
                                            {t('account.imageAlt')}
                                        </span>
                                    </div>
                                </Iphone>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="pt-8">
                            <div className="p-6 rounded-2xl border border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/20 space-y-4">
                                <h3 className="text-headline font-bold text-surface-900">
                                    {t('tips.title')}
                                </h3>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-body text-surface-700 marker:text-surface-400">
                                    {[1, 2].map((i) => (
                                        <li key={i}>{t.rich(`tips.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
