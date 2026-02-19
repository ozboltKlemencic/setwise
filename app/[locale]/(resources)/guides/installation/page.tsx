import { getTranslations } from "next-intl/server"
import { Smartphone, RefreshCw, AlertCircle, CheckCircle, Info } from "lucide-react" // Added icons
import {
    KeyFeatureSection,
    FeatureTextBlock,
} from "@/components/features/feature-cards"
import type { ReactNode } from "react"

export { generateMetadata } from './metadata'

// -- Rich text renderers ------------------------------------------------

const richTextComponents = {
    strong: (chunks: ReactNode) => <strong className="text-surface-900 font-semibold">{chunks}</strong>,
    brand: (chunks: ReactNode) => <span className="primaryGradient">{chunks}</span>,
}

// -- Page Component -----------------------------------------------

export default async function InstallationPage() {
    const t = await getTranslations('Guides.InstallationPage')

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
                <div className="space-y-(--space-10) md:space-y-(--space-16) lg:space-y-(--space-20) pb-(--space-10) md:pb-(--space-16)">

                    {/* iOS Section */}
                    <section id="ios" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-10)">
                        <div className="space-y-(--space-2)">
                            <h2 className="text-title-2 md:text-title-1 lg:text-large-title font-bold text-surface-900 tracking-tight">
                                {t('ios.title')}
                            </h2>
                            <p className="text-footnote md:text-subheadline lg:text-callout text-surface-600 max-w-prose">
                                {t.rich('ios.subtitle', richTextComponents)}
                            </p>
                            <p className="text-footnote md:text-subheadline text-surface-700 max-w-prose leading-relaxed pt-2">
                                {t.rich('ios.description', richTextComponents)}
                            </p>
                        </div>

                        {/* Steps */}
                        <div className="space-y-(--space-8)">
                            {[1, 2, 3, 4, 5].map((step) => (
                                <div key={step} className="flex gap-(--space-4) md:gap-(--space-6)">
                                    <div className="flex-none pt-1">
                                        <div className="size-7 md:size-8 rounded-lg flex items-center justify-center bg-linear-to-tr from-surface-200/70 to-surface-300 dark:bg-surface-300/20 text-callout font-bold text-surface-900">
                                            {step}
                                        </div>
                                    </div>
                                    <div className="space-y-(--space-2) max-w-prose">
                                        <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                            {t(`ios.steps.${step}.title`).replace(/^\d+\)\s*/, '')}
                                        </h3>
                                        {/* Description if present */}
                                        {(step === 2 || step === 3 || step === 5) && (
                                            <p className="text-footnote md:text-subheadline text-surface-600">
                                                {t.rich(`ios.steps.${step}.description`, richTextComponents)}
                                            </p>
                                        )}
                                        {/* List */}
                                        <ul className="list-disc list-outside ml-4 space-y-1 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                            {/* We iterate blindly because we don't know list length easily, or we hardcode. 
                                                Checking translations keys is safer but async. 
                                                For now we assume list structure based on steps. 
                                            */}
                                            {/* Using a helper or fixed iteration based on known content. 
                                                Step 1: 4 items, Step 2: 2 items, Step 3: 3 items, Step 4: 5 items, Step 5: 2 items
                                            */}
                                            {(step === 1 ? [1, 2, 3, 4] :
                                                step === 2 ? [1, 2] :
                                                    step === 3 ? [1, 2, 3] :
                                                        step === 4 ? [1, 2, 3, 4, 5] :
                                                            [1, 2]).map((i) => (
                                                                <li key={i}>{t.rich(`ios.steps.${step}.list.${i}`, richTextComponents)}</li>
                                                            ))}
                                        </ul>
                                        {/* Note if present */}
                                        {step === 1 && (
                                            <div className="flex gap-(--space-2) p-(--space-3) bg-surface-50 dark:bg-surface-200/10 border border-surface-200 dark:border-surface-300/40 text-footnote text-surface-600 mt-(--space-2)">
                                                <Info className="size-4 shrink-0 mt-0.5" />
                                                <p>{t('ios.steps.1.note')}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Updates */}
                        <div className="p-(--space-4) md:p-(--space-6) border border-surface-200 dark:border-surface-300/40 bg-surface-50/50 dark:bg-surface-900/20">
                            <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight mb-(--space-2) flex items-center gap-(--space-2)">
                                <RefreshCw className="size-5 text-brand-500" />
                                {t('ios.updates.title')}
                            </h3>
                            <p className="text-footnote md:text-subheadline text-surface-600 mb-(--space-4)">{t('ios.updates.description')}</p>
                            <ul className="list-disc list-outside ml-4 space-y-1 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                <li>{t('ios.updates.list.1')}</li>
                                <li>{t('ios.updates.list.2')}</li>
                            </ul>
                        </div>

                        {/* Troubleshooting */}
                        <div>
                            <h3 className="text-headline font-bold text-surface-900 mb-4">{t('ios.troubleshooting.title')}</h3>
                            <div className="grid md:grid-cols-2 gap-(--space-3) md:gap-(--space-4)">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="p-(--space-3) md:p-(--space-4) border border-surface-200 dark:border-surface-300/40">
                                        <h4 className="font-semibold text-surface-900 mb-2">{t(`ios.troubleshooting.items.${item}.title`)}</h4>
                                        {item === 3 ? (
                                            <p className="text-footnote text-surface-600">{t(`ios.troubleshooting.items.${item}.description`)}</p>
                                        ) : (
                                            <ul className="list-disc list-outside ml-4 space-y-1 text-footnote text-surface-600 marker:text-surface-400">
                                                {(item === 1 ? [1, 2] : [1, 2, 3]).map((i) => (
                                                    <li key={i}>{t.rich(`ios.troubleshooting.items.${item}.list.${i}`, richTextComponents)}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Android Section */}
                    <section id="android" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-10) pt-(--space-8) border-t border-surface-200/80 dark:border-surface-300/60">
                        <div className="space-y-(--space-2)">
                            <h2 className="text-title-2 md:text-title-1 lg:text-large-title font-bold text-surface-900 tracking-tight">
                                {t('android.title')}
                            </h2>
                            <p className="text-footnote md:text-subheadline lg:text-callout text-surface-600 max-w-prose">
                                {t.rich('android.subtitle', richTextComponents)}
                            </p>
                            <p className="text-footnote md:text-subheadline text-surface-700 max-w-prose leading-relaxed pt-2">
                                {t.rich('android.description', richTextComponents)}
                            </p>
                        </div>

                        {/* Steps */}
                        <div className="space-y-(--space-8)">
                            {[1, 2, 3, 4].map((step) => (
                                <div key={step} className="flex gap-(--space-4) md:gap-(--space-6)">
                                    <div className="flex-none pt-1">
                                        <div className="size-7 md:size-8 rounded-lg flex items-center justify-center bg-linear-to-tr from-surface-200/70 to-surface-300 dark:bg-surface-300/20 text-callout font-bold text-surface-900">
                                            {step}
                                        </div>
                                    </div>
                                    <div className="space-y-(--space-2) max-w-prose">
                                        <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                            {t(`android.steps.${step}.title`).replace(/^\d+\)\s*/, '')}
                                        </h3>
                                        {/* Description if present */}
                                        {(step === 2 || step === 4) && (
                                            <p className="text-footnote md:text-subheadline text-surface-600">
                                                {t.rich(`android.steps.${step}.description`, richTextComponents)}
                                            </p>
                                        )}
                                        {/* List */}
                                        <ul className="list-disc list-outside ml-4 space-y-1 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                            {(step === 1 ? [1, 2, 3, 4] :
                                                step === 2 ? [1, 2] :
                                                    step === 3 ? [1, 2, 3] :
                                                        [1, 2]).map((i) => (
                                                            <li key={i}>{t.rich(`android.steps.${step}.list.${i}`, richTextComponents)}</li>
                                                        ))}
                                        </ul>
                                        {/* Note if present */}
                                        {step === 3 && (
                                            <div className="flex gap-(--space-2) p-(--space-3) bg-surface-50 dark:bg-surface-200/10 border border-surface-200 dark:border-surface-300/40 text-footnote text-surface-600 mt-(--space-2)">
                                                <Info className="size-4 shrink-0 mt-0.5" />
                                                <p>{t.rich('android.steps.3.note', richTextComponents)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Updates */}
                        <div className="p-(--space-4) md:p-(--space-6) border border-surface-200 dark:border-surface-300/40 bg-surface-50/50 dark:bg-surface-900/20">
                            <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight mb-(--space-2) flex items-center gap-(--space-2)">
                                <RefreshCw className="size-5 text-brand-500" />
                                {t('android.updates.title')}
                            </h3>
                            <p className="text-footnote md:text-subheadline text-surface-600 mb-(--space-4)">{t('android.updates.description')}</p>
                            <ul className="list-disc list-outside ml-4 space-y-1 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                <li>{t.rich('android.updates.list.1', richTextComponents)}</li>
                                <li>{t.rich('android.updates.list.2', richTextComponents)}</li>
                            </ul>
                        </div>

                        {/* Troubleshooting */}
                        <div>
                            <h3 className="text-headline font-bold text-surface-900 mb-4">{t('android.troubleshooting.title')}</h3>
                            <div className="grid md:grid-cols-2 gap-(--space-3) md:gap-(--space-4)">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="p-(--space-3) md:p-(--space-4) border border-surface-200 dark:border-surface-300/40">
                                        <h4 className="font-semibold text-surface-900 mb-2">{t(`android.troubleshooting.items.${item}.title`)}</h4>
                                        {item === 3 ? (
                                            <ul className="list-disc list-outside ml-4 space-y-1 text-footnote text-surface-600 marker:text-surface-400">
                                                {[1, 2, 3].map((i) => (
                                                    <li key={i}>{t.rich(`android.troubleshooting.items.${item}.list.${i}`, richTextComponents)}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-footnote text-surface-600">
                                                {t.rich(`android.troubleshooting.items.${item}.description`, richTextComponents)}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Requirements Section */}
                    <section id="requirements" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-8) pt-(--space-8) border-t border-surface-200/80 dark:border-surface-300/60">
                        <h2 className="text-title-2 md:text-title-1 lg:text-large-title font-bold text-surface-900 tracking-tight">
                            {t('requirements.title')}
                        </h2>

                        <div className="grid gap-(--space-4) md:gap-(--space-6) md:grid-cols-2 lg:grid-cols-3">
                            {/* iOS Req */}
                            <div className="p-(--space-4) md:p-(--space-6) border border-surface-200 dark:border-surface-300/40 bg-surface-50 dark:bg-surface-200/10">
                                <h3 className="text-headline font-bold text-surface-900 mb-4">{t('requirements.ios.title')}</h3>
                                <ul className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <li key={i} className="flex gap-(--space-2) text-footnote md:text-subheadline text-surface-700">
                                            <CheckCircle className="size-5 text-brand-500 shrink-0" />
                                            <span>{t.rich(`requirements.ios.list.${i}`, richTextComponents)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Android Req */}
                            <div className="p-(--space-4) md:p-(--space-6) border border-surface-200 dark:border-surface-300/40 bg-surface-50 dark:bg-surface-200/10">
                                <h3 className="text-headline font-bold text-surface-900 mb-4">{t('requirements.android.title')}</h3>
                                <ul className="space-y-3 mb-4">
                                    {[1, 2].map(i => (
                                        <li key={i} className="flex gap-(--space-2) text-footnote md:text-subheadline text-surface-700">
                                            <CheckCircle className="size-5 text-brand-500 shrink-0" />
                                            <span>{t.rich(`requirements.android.list.${i}`, richTextComponents)}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-footnote text-surface-500 border-t border-surface-200 dark:border-surface-700 pt-3">
                                    {t.rich('requirements.android.compatibility', richTextComponents)}
                                </p>
                            </div>

                            {/* Internet Req */}
                            <div className="p-(--space-4) md:p-(--space-6) border border-surface-200 dark:border-surface-300/40 bg-surface-50 dark:bg-surface-200/10">
                                <h3 className="text-headline font-bold text-surface-900 mb-4">{t('requirements.internet.title')}</h3>
                                <ul className="space-y-3">
                                    {[1, 2].map(i => (
                                        <li key={i} className="flex gap-(--space-2) text-footnote md:text-subheadline text-surface-700">
                                            <Info className="size-5 text-surface-500 shrink-0" />
                                            <span>{t.rich(`requirements.internet.list.${i}`, richTextComponents)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="p-(--space-3) md:p-(--space-4) bg-surface-50 dark:bg-surface-200/10 border border-surface-200 dark:border-surface-300/40 flex gap-(--space-3) text-footnote md:text-subheadline text-surface-600">
                            <AlertCircle className="size-5 shrink-0 mt-0.5" />
                            <p>{t('requirements.notCompatible')}</p>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    )
}
