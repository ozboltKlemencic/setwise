import { getTranslations } from "next-intl/server"
import { Eye, Languages, Activity, FastForward } from "lucide-react"
import type { ReactNode } from "react"
import { Iphone } from "@/components/ui/mobileDevices/Phone"

export { generateMetadata } from './metadata'

const richTextComponents = {
    strong: (chunks: ReactNode) => <strong className="text-surface-900 font-semibold">{chunks}</strong>,
    brand: (chunks: ReactNode) => <span className="primaryGradient">{chunks}</span>,
}

export default async function ProfileSettingsPage() {
    const t = await getTranslations('Guides.ProfileSettingsPage')

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

                    {/* INTRO Section */}
                    <section id="intro" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-12)">
                        <div className="text-footnote md:text-subheadline text-surface-700 max-w-prose whitespace-pre-line leading-relaxed">
                            {t.rich('intro.description', richTextComponents)}
                        </div>

                        {/* Image */}
                        <div className="flex justify-start w-full py-(--space-4) md:py-(--space-6)">
                            <div className="w-50 md:w-60">
                                <Iphone src="/app-screens/light/profile/profile.png" darkSrc="/app-screens/dark/profile/profile.png" priority />
                            </div>
                        </div>
                    </section>

                    <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                    {/* PREFERENCES Section */}
                    <section id="preferences" className="scroll-mt-32 space-y-(--space-8) md:space-y-(--space-12)">
                        <div className="space-y-(--space-2)">
                            <h2 className="text-title-2 md:text-title-1 lg:text-large-title font-bold text-surface-900 tracking-tight">
                                {t('preferences.title')}
                            </h2>
                        </div>

                        {/* Appearance */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight flex items-center gap-(--space-2)">
                                    <Eye className="size-5 text-brand-500" />
                                    {t('preferences.appearance.title')}
                                </h3>
                                <p className="text-footnote md:text-subheadline text-surface-700">
                                    {t('preferences.appearance.description')}
                                </p>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    {[1, 2, 3, 4].map((i) => (
                                        <li key={i}>{t.rich(`preferences.appearance.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex justify-start w-full">
                                <div className="w-50 md:w-60">
                                    <Iphone src="/app-screens/light/profile/theme.png" darkSrc="/app-screens/dark/profile/theme.png" />

                                </div>
                            </div>
                        </div>

                        {/* Language */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight flex items-center gap-(--space-2)">
                                    <Languages className="size-5 text-brand-500" />
                                    {t('preferences.language.title')}
                                </h3>
                                <p className="text-footnote md:text-subheadline text-surface-700">
                                    {t('preferences.language.description')}
                                </p>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    {[1, 2, 3].map((i) => (
                                        <li key={i}>{t.rich(`preferences.language.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex justify-start w-full">
                                <div className="w-50 md:w-60">
                                    <Iphone src="/app-screens/light/profile/language.png" darkSrc="/app-screens/dark/profile/language.png" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                    {/* TRAINING Section */}
                    <section id="training" className="scroll-mt-32 space-y-(--space-8) md:space-y-(--space-12)">
                        <div className="space-y-(--space-2)">
                            <h2 className="text-title-2 md:text-title-1 lg:text-large-title font-bold text-surface-900 tracking-tight">
                                {t('training.title')}
                            </h2>
                        </div>

                        {/* Advanced Analytics */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight flex items-center gap-(--space-2)">
                                    <Activity className="size-5 text-brand-500" />
                                    {t('training.advancedAnalytics.title')}
                                </h3>
                                <p className="text-footnote md:text-subheadline text-surface-700">
                                    {t('training.advancedAnalytics.description')}
                                </p>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    {[1, 2, 3].map((i) => (
                                        <li key={i}>{t.rich(`training.advancedAnalytics.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                                <p className="text-footnote md:text-subheadline text-surface-700 italic">
                                    {t('training.advancedAnalytics.footer')}
                                </p>
                            </div>
                            <div className="flex justify-start w-full">
                                <div className="w-50 md:w-60">
                                    <Iphone src="/app-screens/light/profile/profile-2.png" darkSrc="/app-screens/dark/profile/profile-2.png" />

                                </div>
                            </div>
                        </div>

                        {/* Auto-advance */}
                        <div className="flex flex-col gap-(--space-8)">
                            <div className="space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight flex items-center gap-(--space-2)">
                                    <FastForward className="size-5 text-brand-500" />
                                    {t('training.autoAdvance.title')}
                                </h3>
                                <p className="text-footnote md:text-subheadline text-surface-700 whitespace-pre-line leading-relaxed">
                                    {t('training.autoAdvance.description')}
                                </p>
                            </div>
                            <div className="flex justify-start w-full">
                                <div className="w-50 md:w-60">
                                    <Iphone src="/app-screens/light/profile/profile-2.png" darkSrc="/app-screens/dark/profile/profile-2.png" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="w-full border-t border-surface-200/80 dark:border-surface-300/60" />

                    {/* ACCOUNT Section */}
                    <section id="account" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-12)">
                        <div className="space-y-(--space-4)">
                            <h2 className="text-title-2 md:text-title-1 lg:text-large-title font-bold text-surface-900 tracking-tight flex items-center gap-(--space-2)">
                                {t('account.title')}
                            </h2>
                            <p className="text-footnote md:text-subheadline text-surface-700">
                                {t.rich('account.description', richTextComponents)}
                            </p>
                        </div>
                        <div className="flex justify-start w-full">
                            <div className="w-50 md:w-60">
                                <Iphone src="/app-screens/light/profile/profile-2.png" darkSrc="/app-screens/dark/profile/profile-2.png" />
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="pt-(--space-8)">
                            <div className="p-(--space-4) md:p-(--space-6) border border-surface-200 dark:border-surface-300/40 bg-surface-50 dark:bg-surface-200/10 space-y-(--space-4)">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                    {t('tips.title')}
                                </h3>
                                <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
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
