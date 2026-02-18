import { getTranslations } from "next-intl/server"
import { ArrowRight, Book, Dumbbell, Edit3, Info, Play, Plus, Search, Settings2, ListPlus, CheckCircle } from "lucide-react"
import {
    KeyFeatureSection,
    FeatureTextBlock,
} from "@/components/features/feature-cards"
import type { ReactNode } from "react"
import ButtonRotatingGradient from "@/components/ui/buttons/ButtonRotatingGradient"
import BetaSignupDialog from "@/components/beta-signup-dialog"
import { Iphone } from "@/components/ui/mobileDevices/Phone"

// -- Rich text renderers ------------------------------------------------

const richTextComponents = {
    strong: (chunks: ReactNode) => <strong className="text-surface-900 font-semibold">{chunks}</strong>,
    brand: (chunks: ReactNode) => <span className="primaryGradient">{chunks}</span>,
}

// -- Page Component -----------------------------------------------

export default async function WorkoutsPage() {
    const t = await getTranslations('Guides.WorkoutsPage')

    return (
        <div className="w-full h-full flex flex-col items-center justify-start font-sans pt-0 md:pt-12 lg:pt-0">
            <div className="w-full px-(--space-5) md:px-(--space-12) max-w-5xl min-[1152px]:border-0 md:border-l md:border-r border-surface-200 dark:border-surface-800">

                {/* ── Page Header ────────────────────────────── */}
                <header className="pt-(--space-8) pb-(--space-5) md:pt-(--space-16) md:pb-(--space-10) min-[1152px]:pr-(--space-8)">
                    <p className="text-caption-2 tracking-wider font-semibold primaryGradient mb-1">
                        {t('badge')}
                    </p>
                    <h1 className="text-title-1 md:text-display-sm lg:text-display font-bold text-surface-900 tracking-tight text-balance">
                        {t.rich('heading', richTextComponents)}
                    </h1>
                    <p className="text-subheadline md:text-body text-surface-600 max-w-prose mt-4">
                        {t('description')}
                    </p>
                </header>

                {/* ── Sections ───────────────────────────────── */}
                <div className="space-y-(--space-16) md:space-y-(--space-24) pb-(--space-20)">

                    {/* Create Program Section */}
                    <section id="create-program" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-10)">
                        <div className="space-y-(--space-2)">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
                                    <ListPlus className="size-6" />
                                </div>
                                <h1 className="text-title-1 md:text-large-title font-bold text-surface-900 tracking-tight">
                                    {t('createProgram.title')}
                                </h1>
                            </div>
                            <p className="text-subheadline md:text-title-3 text-surface-600 max-w-prose">
                                {t.rich('createProgram.subtitle', richTextComponents)}
                            </p>
                            <p className="text-body text-surface-700 max-w-prose leading-relaxed pt-2 whitespace-pre-line">
                                {t.rich('createProgram.description', richTextComponents)}
                            </p>
                        </div>

                        {/* What You'll Do */}
                        <div className="p-6 rounded-2xl border border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/20 max-w-prose">
                            <h3 className="text-headline font-bold text-surface-900 mb-4">{t('createProgram.whatYouWillDo.title')}</h3>
                            <ul className="space-y-3">
                                {[1, 2, 3, 4].map(i => (
                                    <li key={i} className="flex gap-2 text-body text-surface-700">
                                        <div className="size-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                                        <span>{t.rich(`createProgram.whatYouWillDo.list.${i}`, richTextComponents)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Steps */}
                        <div className="space-y-(--space-16)">
                            {[1, 2, 3, 4, 5].map((step) => (
                                <div key={step} className="flex flex-col gap-(--space-8)">
                                    {/* Text Content */}
                                    <div className="space-y-(--space-4)">
                                        <h3 className="text-title-3 font-bold text-surface-900">
                                            {t(`createProgram.steps.${step}.title`)}
                                        </h3>

                                        {/* Description */}
                                        {t.has(`createProgram.steps.${step}.description`) && (
                                            <div className="text-body text-surface-600 whitespace-pre-line max-w-prose">
                                                {t.rich(`createProgram.steps.${step}.description`, richTextComponents)}
                                            </div>
                                        )}

                                        {/* List */}
                                        {t.has(`createProgram.steps.${step}.list`) && (
                                            <ul className="list-disc list-outside ml-4 space-y-2 text-body text-surface-700 marker:text-surface-400">
                                                {(step === 1 ? [1, 2, 3, 4] :
                                                    step === 2 ? [1, 2, 3, 4] :
                                                        step === 3 ? [1, 2, 3] :
                                                            step === 5 ? [1, 2, 3, 4, 5] :
                                                                []).map((i) => (
                                                                    <li key={i}>{t.rich(`createProgram.steps.${step}.list.${i}`, richTextComponents)}</li>
                                                                ))}
                                            </ul>
                                        )}

                                        {/* SubDescription & SubList for Step 3 */}
                                        {t.has(`createProgram.steps.${step}.subDescription`) && (
                                            <div className="mt-4">
                                                <p className="text-body text-surface-600 mb-2">
                                                    {t.rich(`createProgram.steps.${step}.subDescription`, richTextComponents)}
                                                </p>
                                                {t.has(`createProgram.steps.${step}.subList`) && (
                                                    <ul className="list-disc list-outside ml-4 space-y-2 text-body text-surface-700 marker:text-surface-400">
                                                        {[1, 2, 3].map((i) => (
                                                            <li key={i}>{t.rich(`createProgram.steps.${step}.subList.${i}`, richTextComponents)}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        )}

                                        {/* Footer */}
                                        {t.has(`createProgram.steps.${step}.footer`) && (
                                            <p className="text-body text-surface-600 italic max-w-prose">
                                                {t.rich(`createProgram.steps.${step}.footer`, richTextComponents)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Phone Image/Placeholder */}
                                    <div className="flex justify-center w-full">
                                        <div className="w-[200px] md:w-[240px]">
                                            <Iphone>
                                                <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                                    <span className="text-caption-1 text-surface-400 font-medium">
                                                        {t(`createProgram.steps.${step}.imageAlt`)}
                                                    </span>
                                                </div>
                                            </Iphone>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Search & Tips Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Search */}
                            <div className="p-6 rounded-2xl border border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/20">
                                <h3 className="text-headline font-bold text-surface-900 mb-2 flex items-center gap-2">
                                    <Search className="size-5 text-brand-500" />
                                    {t('createProgram.search.title')}
                                </h3>
                                <p className="text-body text-surface-600">
                                    {t.rich('createProgram.search.description', richTextComponents)}
                                </p>
                            </div>

                            {/* Tips */}
                            <div className="p-6 rounded-2xl border border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/20">
                                <h3 className="text-headline font-bold text-surface-900 mb-2 flex items-center gap-2">
                                    <Info className="size-5 text-brand-500" />
                                    {t('createProgram.tips.title')}
                                </h3>
                                <ul className="list-disc list-outside ml-4 space-y-1 text-body text-surface-600 marker:text-surface-400">
                                    {[1, 2, 3].map(i => (
                                        <li key={i}>{t(`createProgram.tips.list.${i}`)}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>


                    {/* Start Template Section */}
                    <section id="start-template" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-10) pt-(--space-8) border-t border-surface-200 dark:border-surface-800">
                        <div className="space-y-(--space-2)">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
                                    <Play className="size-6" />
                                </div>
                                <h2 className="text-title-2 md:text-title-1 font-bold text-surface-900 tracking-tight">
                                    {t('startTemplate.title')}
                                </h2>
                            </div>
                            <p className="text-subheadline md:text-body text-surface-600 max-w-prose">
                                {t.rich('startTemplate.subtitle', richTextComponents)}
                            </p>
                            <p className="text-body text-surface-700 max-w-prose leading-relaxed pt-2">
                                {t.rich('startTemplate.description', richTextComponents)}
                            </p>
                        </div>

                        {/* Steps */}
                        <div className="space-y-(--space-16)">
                            {[1, 2, 3, 4, 5].map((step) => (
                                <div key={step} className="flex flex-col gap-(--space-8)">
                                    {/* Text Content */}
                                    <div className="space-y-(--space-4)">
                                        <h3 className="text-title-3 font-bold text-surface-900">
                                            {t(`startTemplate.steps.${step}.title`)}
                                        </h3>

                                        {/* Description */}
                                        {t.has(`startTemplate.steps.${step}.description`) && (
                                            <div className="text-body text-surface-600 whitespace-pre-line max-w-prose">
                                                {t.rich(`startTemplate.steps.${step}.description`, richTextComponents)}
                                            </div>
                                        )}

                                        {/* List */}
                                        {t.has(`startTemplate.steps.${step}.list`) && (
                                            <ul className="list-disc list-outside ml-4 space-y-2 text-body text-surface-700 marker:text-surface-400">
                                                {(step === 1 ? [1, 2, 3] :
                                                    step === 2 ? [1, 2, 3] :
                                                        step === 3 ? [1, 2, 3] :
                                                            step === 4 ? [1, 2] :
                                                                step === 5 ? [1, 2] :
                                                                    []).map((i) => (
                                                                        <li key={i}>{t.rich(`startTemplate.steps.${step}.list.${i}`, richTextComponents)}</li>
                                                                    ))}
                                            </ul>
                                        )}

                                        {/* Footer */}
                                        {t.has(`startTemplate.steps.${step}.footer`) && (
                                            <p className="text-body text-surface-600 italic max-w-prose">
                                                {t.rich(`startTemplate.steps.${step}.footer`, richTextComponents)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Phone Image/Placeholder */}
                                    <div className="flex justify-center w-full">
                                        <div className="w-[200px] md:w-[240px]">
                                            <Iphone>
                                                <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                                    <span className="text-caption-1 text-surface-400 font-medium">
                                                        {t(`startTemplate.steps.${step}.imageAlt`)}
                                                    </span>
                                                </div>
                                            </Iphone>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>


                    {/* Quick Start Section */}
                    <section id="quick-start" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-10) pt-(--space-8) border-t border-surface-200 dark:border-surface-800">
                        <div className="space-y-(--space-2)">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
                                    <Dumbbell className="size-6" />
                                </div>
                                <h2 className="text-title-2 md:text-title-1 font-bold text-surface-900 tracking-tight">
                                    {t('quickStart.title')}
                                </h2>
                            </div>
                            <p className="text-subheadline md:text-body text-surface-600 max-w-prose">
                                {t.rich('quickStart.subtitle', richTextComponents)}
                            </p>
                            <p className="text-body text-surface-700 max-w-prose leading-relaxed pt-2">
                                {t.rich('quickStart.description', richTextComponents)}
                            </p>
                        </div>

                        {/* Steps */}
                        <div className="space-y-(--space-16)">
                            {[1, 2, 3, 4, 5].map((step) => (
                                <div key={step} className="flex flex-col gap-(--space-8)">
                                    {/* Text Content */}
                                    <div className="space-y-(--space-4)">
                                        <h3 className="text-title-3 font-bold text-surface-900">
                                            {t(`quickStart.steps.${step}.title`)}
                                        </h3>

                                        {/* Description */}
                                        {t.has(`quickStart.steps.${step}.description`) && (
                                            <div className="text-body text-surface-600 whitespace-pre-line max-w-prose">
                                                {t.rich(`quickStart.steps.${step}.description`, richTextComponents)}
                                            </div>
                                        )}

                                        {/* List */}
                                        {t.has(`quickStart.steps.${step}.list`) && (
                                            <ul className="list-disc list-outside ml-4 space-y-2 text-body text-surface-700 marker:text-surface-400">
                                                {(step === 1 ? [1, 2] :
                                                    step === 2 ? [1, 2] :
                                                        step === 3 ? [1, 2, 3] :
                                                            step === 4 ? [1, 2, 3] :
                                                                step === 5 ? [1, 2] :
                                                                    []).map((i) => (
                                                                        <li key={i}>{t.rich(`quickStart.steps.${step}.list.${i}`, richTextComponents)}</li>
                                                                    ))}
                                            </ul>
                                        )}

                                        {/* SubTitle & SubDescription for Step 2 */}
                                        {t.has(`quickStart.steps.${step}.subTitle`) && (
                                            <div className="w-full h-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-surface-900/10">
                                                <h4 className="text-headline font-semibold text-surface-900 mb-2">
                                                    {t(`quickStart.steps.${step}.subTitle`)}
                                                </h4>
                                                <p className="text-body text-surface-600 whitespace-pre-line max-w-prose">
                                                    {t.rich(`quickStart.steps.${step}.subDescription`, richTextComponents)}
                                                </p>
                                            </div>
                                        )}

                                        {/* Footer */}
                                        {t.has(`quickStart.steps.${step}.footer`) && (
                                            <p className="text-body text-surface-600 italic max-w-prose">
                                                {t.rich(`quickStart.steps.${step}.footer`, richTextComponents)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Phone Image/Placeholder */}
                                    <div className="flex justify-center w-full">
                                        <div className="w-[200px] md:w-[240px]">
                                            <Iphone>
                                                <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                                    <span className="text-caption-1 text-surface-400 font-medium">
                                                        {t(`quickStart.steps.${step}.imageAlt`)}
                                                    </span>
                                                </div>
                                            </Iphone>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Resume */}
                        <div className="p-6 rounded-2xl border border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/20 max-w-prose">
                            <h3 className="text-headline font-bold text-surface-900 mb-4">{t('quickStart.resume.title')}</h3>
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <p className="text-body text-surface-700 whitespace-pre-line flex-1">
                                    {t.rich('quickStart.resume.description', richTextComponents)}
                                </p>
                                <div className="w-[120px] shrink-0 hidden md:block">
                                    <Iphone className="!w-full">
                                        <div className="w-full h-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center p-2 text-center">
                                            <span className="text-[10px] text-surface-400">
                                                {t('quickStart.resume.imageAlt')}
                                            </span>
                                        </div>
                                    </Iphone>
                                </div>
                            </div>
                        </div>
                    </section>


                    {/* Logging Section */}
                    <section id="logging" className="scroll-mt-32 space-y-(--space-10) pt-(--space-8) border-t border-surface-200 dark:border-surface-800">
                        <div className="space-y-(--space-2)">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
                                    <Edit3 className="size-6" />
                                </div>
                                <h2 className="text-title-2 md:text-title-1 font-bold text-surface-900 tracking-tight">
                                    {t('logging.title')}
                                </h2>
                            </div>
                            <p className="text-subheadline md:text-body text-surface-600 max-w-prose">
                                {t.rich('logging.subtitle', richTextComponents)}
                            </p>
                        </div>

                        <div className="space-y-(--space-16)">
                            {[1, 2, 3, 4, 5, 6].map((step) => (
                                <div key={step} className="flex flex-col gap-(--space-8)">
                                    {/* Text Content */}
                                    <div className="space-y-(--space-4)">
                                        <h3 className="text-title-3 font-bold text-surface-900">
                                            {t(`logging.steps.${step}.title`)}
                                        </h3>

                                        {/* Description */}
                                        {t.has(`logging.steps.${step}.description`) && (
                                            <div className="text-body text-surface-600 whitespace-pre-line">
                                                {t.rich(`logging.steps.${step}.description`, richTextComponents)}
                                            </div>
                                        )}

                                        {/* List */}
                                        {t.has(`logging.steps.${step}.list`) && (
                                            <ul className="list-disc list-outside ml-4 space-y-2 text-body text-surface-700 marker:text-surface-400">
                                                {(step === 1 ? [1, 2] :
                                                    step === 3 ? [1, 2, 3] :
                                                        step === 4 ? [1] :
                                                            step === 6 ? [1, 2, 3, 4] :
                                                                []).map((i) => (
                                                                    <li key={i}>{t.rich(`logging.steps.${step}.list.${i}`, richTextComponents)}</li>
                                                                ))}
                                            </ul>
                                        )}

                                        {/* SubDescription */}
                                        {t.has(`logging.steps.${step}.subDescription`) && (
                                            <p className="text-body text-surface-600">
                                                {t.rich(`logging.steps.${step}.subDescription`, richTextComponents)}
                                            </p>
                                        )}

                                        {/* Footer */}
                                        {t.has(`logging.steps.${step}.footer`) && (
                                            <p className="text-body text-surface-600 italic">
                                                {t.rich(`logging.steps.${step}.footer`, richTextComponents)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Phone Image/Placeholder */}
                                    <div className="flex justify-center w-full">
                                        <div className="w-[200px] md:w-[240px]">
                                            <Iphone>
                                                <div className="w-full h-full bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center">
                                                    <span className="text-caption-1 text-surface-400 font-medium">
                                                        {t(`logging.steps.${step}.imageAlt`)}
                                                    </span>
                                                </div>
                                            </Iphone>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tip */}
                        <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-900/40 border border-surface-200 dark:border-surface-800 flex gap-3 text-subheadline text-surface-600 max-w-prose">
                            <Info className="size-5 shrink-0 mt-0.5 text-brand-500" />
                            <div>
                                <strong className="font-semibold text-surface-900 block mb-1">{t('logging.tip.title')}</strong>
                                <p className="whitespace-pre-line">{t.rich('logging.tip.description', richTextComponents)}</p>
                            </div>
                        </div>

                    </section>

                </div>
            </div>
        </div>
    )
}
