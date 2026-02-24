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

export { generateMetadata } from './metadata'

// -- Rich text renderers ------------------------------------------------

const richTextComponents = {
    strong: (chunks: ReactNode) => <strong className="text-surface-900 font-semibold">{chunks}</strong>,
    brand: (chunks: ReactNode) => <span className="primaryGradient">{chunks}</span>,
}

// -- Page Component -----------------------------------------------

export default async function WorkoutsPage() {
    const t = await getTranslations('Guides.WorkoutsPage')

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
                    <p className="text-footnote md:text-subheadline lg:text-callout text-surface-700 max-w-prose mt-1">
                        {t('description')}
                    </p>
                </header>

                {/* ── Sections ───────────────────────────────── */}
                <div className="space-y-(--space-10) md:space-y-(--space-16) lg:space-y-(--space-20) pb-(--space-10) md:pb-(--space-16)">

                    {/* Create Program Section */}
                    <section id="create-program" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-10)">
                        <div className="space-y-(--space-2)">
                            <div className="flex items-center gap-(--space-2) md:gap-(--space-2)">
                                <div className="flex items-center justify-center rounded-lg bg-linear-to-tr from-brand-500/5 to-brand-500/15 size-7 md:size-8">
                                    <ListPlus className="size-3.5 md:size-4 text-brand-500/80" />
                                </div>
                                <h2 className="text-title-2 md:text-title-1 lg:text-large-title font-bold text-surface-900 tracking-tight">
                                    {t('createProgram.title')}
                                </h2>
                            </div>
                            <p className="text-footnote md:text-subheadline lg:text-callout text-surface-700 max-w-prose leading-relaxed">
                                {t.rich('createProgram.subtitle', richTextComponents)}
                            </p>
                            <p className="text-footnote md:text-subheadline text-surface-700 max-w-prose leading-relaxed pt-(--space-2) whitespace-pre-line">
                                {t.rich('createProgram.description', richTextComponents)}
                            </p>
                        </div>

                        {/* What You'll Do */}
                        <div className="p-(--space-4) md:p-(--space-6) border border-surface-200 dark:border-surface-300/40 bg-surface-50/50 dark:bg-surface-900/20 max-w-prose">
                            <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight mb-(--space-4)">{t('createProgram.whatYouWillDo.title')}</h3>
                            <ul className="space-y-(--space-3)">
                                {[1, 2, 3, 4].map(i => (
                                    <li key={i} className="flex gap-(--space-2) text-footnote md:text-subheadline text-surface-700">
                                        <div className="size-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                                        <span>{t.rich(`createProgram.whatYouWillDo.list.${i}`, richTextComponents)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Steps */}
                        {(() => {
                            const createProgramSteps = [
                                {
                                    step: 1, listItems: [1, 2, 3, 4], subListItems: [], images:
                                        [{
                                            light: "/app-screens/light/program/program-page.png",
                                            dark: "/app-screens/dark/program/program-page.png"
                                        },
                                        {
                                            light: "/app-screens/light/program/create-program.png",
                                            dark: "/app-screens/dark/program/create-program.png"
                                        }
                                        ]
                                },
                                {
                                    step: 2, listItems: [1, 2, 3, 4], subListItems: [], images:
                                        [{
                                            light: "/app-screens/light/template/create-template.png",
                                            dark: "/app-screens/dark/template/create-template.png"
                                        },
                                        ]
                                },
                                {
                                    step: 3, listItems: [1, 2, 3], subListItems: [1, 2, 3], images:
                                        [{
                                            light: "/app-screens/light/template/edit-template.png",
                                            dark: "/app-screens/dark/template/edit-template.png"
                                        },
                                        {
                                            light: "/app-screens/light/template/add-exercise.png",
                                            dark: "/app-screens/dark/template/add-exercise.png"
                                        },
                                        {
                                            light: "/app-screens/light/template/edit-exercise.png",
                                            dark: "/app-screens/dark/template/edit-exercise.png"
                                        }]

                                },
                                {
                                    step: 4, listItems: [], subListItems: [], images:
                                        [{
                                            light: "/app-screens/light/workout/set-note.png",
                                            dark: "/app-screens/dark/workout/set-note.png"
                                        }]
                                },
                                {
                                    step: 5, listItems: [1, 2, 3, 4, 5], subListItems: [], images:
                                        [{
                                            light: "/app-screens/light/workout/edit-sets-2.png",
                                            dark: "/app-screens/dark/workout/edit-sets-2.png"
                                        }]
                                },
                            ]

                            return (
                                <div className="space-y-(--space-8) md:space-y-(--space-12)">
                                    {createProgramSteps.map(({ step, listItems, subListItems, images }) => (
                                        <div key={step} className="flex flex-col gap-(--space-8)">
                                            {/* Text Content */}
                                            <div className="space-y-(--space-4)">
                                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                                    {t(`createProgram.steps.${step}.title`)}
                                                </h3>

                                                {/* Description */}
                                                {t.has(`createProgram.steps.${step}.description`) && (
                                                    <div className="text-footnote md:text-subheadline text-surface-700 whitespace-pre-line max-w-prose">
                                                        {t.rich(`createProgram.steps.${step}.description`, richTextComponents)}
                                                    </div>
                                                )}

                                                {/* List */}
                                                {listItems.length > 0 && t.has(`createProgram.steps.${step}.list`) && (
                                                    <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                                        {listItems.map((i) => (
                                                            <li key={i}>{t.rich(`createProgram.steps.${step}.list.${i}`, richTextComponents)}</li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {/* SubDescription & SubList */}
                                                {t.has(`createProgram.steps.${step}.subDescription`) && (
                                                    <div className="mt-(--space-4)">
                                                        <p className="text-footnote md:text-subheadline text-surface-700 mb-(--space-2)">
                                                            {t.rich(`createProgram.steps.${step}.subDescription`, richTextComponents)}
                                                        </p>
                                                        {subListItems.length > 0 && t.has(`createProgram.steps.${step}.subList`) && (
                                                            <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                                                {subListItems.map((i) => (
                                                                    <li key={i}>{t.rich(`createProgram.steps.${step}.subList.${i}`, richTextComponents)}</li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Footer */}
                                                {t.has(`createProgram.steps.${step}.footer`) && (
                                                    <p className="text-footnote md:text-subheadline text-surface-700 italic max-w-prose">
                                                        {t.rich(`createProgram.steps.${step}.footer`, richTextComponents)}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Phone Images */}
                                            <div className={`flex ${images.length > 1 ? 'justify-start' : 'justify-start'} md:flex-row flex-col gap-(--space-6) w-full`}>
                                                {images.map((img, idx) => (
                                                    <div key={idx} className="w-50 md:w-60">
                                                        <div className="dark:hidden">
                                                            <Iphone src={img.light} priority />
                                                        </div>
                                                        <div className="hidden dark:block">
                                                            <Iphone src={img.dark} priority />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        })()}

                        {/* Search & Tips Grid */}
                        <div className="grid md:grid-cols-2 gap-(--space-3) md:gap-(--space-4)">
                            {/* Search */}
                            <div className="p-(--space-4) md:p-(--space-6) border border-surface-200 dark:border-surface-300/40 bg-surface-50/50 dark:bg-surface-900/20">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight mb-(--space-2) flex items-center gap-(--space-2)">
                                    <Search className="size-5 text-brand-500" />
                                    {t('createProgram.search.title')}
                                </h3>
                                <p className="text-footnote md:text-subheadline text-surface-700">
                                    {t.rich('createProgram.search.description', richTextComponents)}
                                </p>
                            </div>

                            {/* Tips */}
                            <div className="p-(--space-4) md:p-(--space-6) border border-surface-200 dark:border-surface-300/40 bg-surface-50/50 dark:bg-surface-900/20">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight mb-(--space-2) flex items-center gap-(--space-2)">
                                    <Info className="size-5 text-brand-500" />
                                    {t('createProgram.tips.title')}
                                </h3>
                                <ul className="list-disc list-outside ml-4 space-y-1 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                    {[1, 2, 3].map(i => (
                                        <li key={i}>{t.rich(`createProgram.tips.list.${i}`, richTextComponents)}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>


                    {/* Start Template Section */}
                    <section id="start-template" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-10) pt-(--space-8) border-t border-surface-200/80 dark:border-surface-300/60">
                        <div className="space-y-(--space-2)">
                            <div className="flex items-center gap-(--space-2) md:gap-(--space-2)">
                                <div className="flex items-center justify-center rounded-lg bg-linear-to-tr from-brand-500/5 to-brand-500/15 size-7 md:size-8">
                                    <Play className="size-3.5 md:size-4 text-brand-500/80" />
                                </div>
                                <h2 className="text-title-2 md:text-title-1 lg:text-large-title font-bold text-surface-900 tracking-tight">
                                    {t('startTemplate.title')}
                                </h2>
                            </div>
                            <p className="text-footnote md:text-subheadline lg:text-callout text-surface-700 max-w-prose leading-relaxed">
                                {t.rich('startTemplate.subtitle', richTextComponents)}
                            </p>
                            <p className="text-footnote md:text-subheadline text-surface-700 max-w-prose leading-relaxed pt-(--space-2)">
                                {t.rich('startTemplate.description', richTextComponents)}
                            </p>
                        </div>

                        {/* Steps */}
                        {(() => {
                            const startTemplateSteps = [
                                {
                                    step: 1, listItems: [1, 2, 3], images: [{
                                        light: "/app-screens/light/workout/start-workout.png",
                                        dark: "/app-screens/dark/workout/start-workout.png"
                                    }]
                                },
                                {
                                    step: 2, listItems: [1, 2, 3], images: [{
                                        light: "/app-screens/light/workout/workout-in-progres.png",
                                        dark: "/app-screens/dark/workout/workout-in-progres.png"
                                    }]
                                },
                                {
                                    step: 3, listItems: [1, 2, 3], images: [{
                                        light: "/app-screens/light/workout/workout-action.png",
                                        dark: "/app-screens/dark/workout/workout-action.png"
                                    }]
                                },
                                {
                                    step: 4, listItems: [1, 2], images: [{
                                        light: "/app-screens/light/workout/finnished-workout.png",
                                        dark: "/app-screens/dark/workout/finnished-workout.png"
                                    }]
                                },
                                {
                                    step: 5, listItems: [1, 2], images: [{
                                        light: "/app-screens/light/workout/resume.png",
                                        dark: "/app-screens/dark/workout/resume.png"
                                    }]
                                },
                            ]

                            return (
                                <div className="space-y-(--space-8) md:space-y-(--space-12)">
                                    {startTemplateSteps.map(({ step, listItems, images }) => (
                                        <div key={step} className="flex flex-col gap-(--space-8)">
                                            {/* Text Content */}
                                            <div className="space-y-(--space-4)">
                                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                                    {t(`startTemplate.steps.${step}.title`)}
                                                </h3>

                                                {/* Description */}
                                                {t.has(`startTemplate.steps.${step}.description`) && (
                                                    <div className="text-footnote md:text-subheadline text-surface-700 whitespace-pre-line max-w-prose">
                                                        {t.rich(`startTemplate.steps.${step}.description`, richTextComponents)}
                                                    </div>
                                                )}

                                                {/* List */}
                                                {listItems.length > 0 && t.has(`startTemplate.steps.${step}.list`) && (
                                                    <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                                        {listItems.map((i) => (
                                                            <li key={i}>{t.rich(`startTemplate.steps.${step}.list.${i}`, richTextComponents)}</li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {/* Footer */}
                                                {t.has(`startTemplate.steps.${step}.footer`) && (
                                                    <p className="text-footnote md:text-subheadline text-surface-700 italic max-w-prose">
                                                        {t.rich(`startTemplate.steps.${step}.footer`, richTextComponents)}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Phone Images */}
                                            <div className={`flex justify-start md:flex-row flex-col gap-(--space-6) w-full`}>
                                                {images.map((img, idx) => (
                                                    <div key={idx} className="w-50 md:w-60">
                                                        <Iphone src={img.light} darkSrc={img.dark} priority />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        })()}
                    </section>


                    {/* Quick Start Section */}
                    <section id="quick-start" className="scroll-mt-32 space-y-(--space-6) md:space-y-(--space-10) pt-(--space-8) border-t border-surface-200/80 dark:border-surface-300/60">
                        <div className="space-y-(--space-2)">
                            <div className="flex items-center gap-(--space-2) md:gap-(--space-2)">
                                <div className="flex items-center justify-center rounded-lg bg-linear-to-tr from-brand-500/5 to-brand-500/15 size-7 md:size-8">
                                    <Dumbbell className="size-3.5 md:size-4 text-brand-500/80" />
                                </div>
                                <h2 className="text-title-2 md:text-title-1 lg:text-large-title font-bold text-surface-900 tracking-tight">
                                    {t('quickStart.title')}
                                </h2>
                            </div>
                            <p className="text-footnote md:text-subheadline lg:text-callout text-surface-700 max-w-prose leading-relaxed">
                                {t.rich('quickStart.subtitle', richTextComponents)}
                            </p>
                            <p className="text-footnote md:text-subheadline text-surface-700 max-w-prose leading-relaxed pt-(--space-2)">
                                {t.rich('quickStart.description', richTextComponents)}
                            </p>
                        </div>

                        {/* Steps */}
                        {(() => {
                            const quickStartSteps = [
                                {
                                    step: 1, listItems: [1, 2], images: [
                                        {
                                            light: "/app-screens/light/workout/start-workout.png",
                                            dark: "/app-screens/dark/workout/start-workout.png"
                                        }]
                                },
                                {
                                    step: 2, listItems: [1, 2], images: [{
                                        light: "/app-screens/light/template/add-exercise-2.png",
                                        dark: "/app-screens/dark/template/add-exercise-2.png"
                                    }]
                                },
                                {
                                    step: 3, listItems: [1, 2, 3], images: [{
                                        light: "/app-screens/light/quick-workout/quick-workout.png",
                                        dark: "/app-screens/dark/quick-workout/quick-workout.png"
                                    }]
                                },
                                {
                                    step: 4, listItems: [1, 2, 3], images: [{
                                        light: "/app-screens/light/quick-workout/quick-workout-actions.png",
                                        dark: "/app-screens/dark/quick-workout/quick-workout-actions.png"
                                    }]
                                },
                                {
                                    step: 5, listItems: [1, 2], images: [{
                                        light: "/app-screens/light/quick-workout/finnished-quick-workout.png",
                                        dark: "/app-screens/dark/quick-workout/finnished-quick-workout.png"
                                    }]
                                },
                            ]

                            return (
                                <div className="space-y-(--space-8) md:space-y-(--space-12)">
                                    {quickStartSteps.map(({ step, listItems, images }) => (
                                        <div key={step} className="flex flex-col gap-(--space-8)">
                                            {/* Text Content */}
                                            <div className="space-y-(--space-4)">
                                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                                    {t(`quickStart.steps.${step}.title`)}
                                                </h3>

                                                {/* Description */}
                                                {t.has(`quickStart.steps.${step}.description`) && (
                                                    <div className="text-footnote md:text-subheadline text-surface-700 whitespace-pre-line max-w-prose">
                                                        {t.rich(`quickStart.steps.${step}.description`, richTextComponents)}
                                                    </div>
                                                )}

                                                {/* List */}
                                                {listItems.length > 0 && t.has(`quickStart.steps.${step}.list`) && (
                                                    <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                                        {listItems.map((i) => (
                                                            <li key={i}>{t.rich(`quickStart.steps.${step}.list.${i}`, richTextComponents)}</li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {/* SubTitle & SubDescription */}
                                                {t.has(`quickStart.steps.${step}.subTitle`) && (
                                                    <div className="w-full h-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-surface-900/10">
                                                        <h4 className="text-headline font-semibold text-surface-900 mb-(--space-2)">
                                                            {t(`quickStart.steps.${step}.subTitle`)}
                                                        </h4>
                                                        <p className="text-footnote md:text-subheadline text-surface-700 whitespace-pre-line max-w-prose">
                                                            {t.rich(`quickStart.steps.${step}.subDescription`, richTextComponents)}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Footer */}
                                                {t.has(`quickStart.steps.${step}.footer`) && (
                                                    <p className="text-footnote md:text-subheadline text-surface-700 italic max-w-prose">
                                                        {t.rich(`quickStart.steps.${step}.footer`, richTextComponents)}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Phone Images */}
                                            <div className={`flex justify-start md:flex-row flex-col gap-(--space-6) w-full`}>
                                                {images.map((img, idx) => (
                                                    <div key={idx} className="w-50 md:w-60">
                                                        <Iphone src={img.light} darkSrc={img.dark} priority />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        })()}

                        {/* Resume */}
                        <div className="p-(--space-4) md:p-(--space-6) border border-surface-200 dark:border-surface-300/40 bg-surface-50/50 dark:bg-surface-900/20 max-w-prose">
                            <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight mb-(--space-4)">{t('quickStart.resume.title')}</h3>
                            <div className="flex flex-col md:flex-row gap-(--space-4) md:gap-(--space-6) items-start">
                                <p className="text-footnote md:text-subheadline text-surface-700 whitespace-pre-line flex-1">
                                    {t.rich('quickStart.resume.description', richTextComponents)}
                                </p>
                                <div className="w-30 shrink-0 hidden md:block">
                                    <Iphone className="w-full!"
                                        src="/app-screens/light/quick-workout/resume-quick-workout.png"
                                        darkSrc="/app-screens/dark/quick-workout/resume-quick-workout.png" />
                                </div>
                            </div>
                        </div>
                    </section>


                    {/* Logging Section */}
                    <section id="logging" className="scroll-mt-32 space-y-(--space-10) pt-(--space-8) border-t border-surface-200/80 dark:border-surface-300/60">
                        <div className="space-y-(--space-2)">
                            <div className="flex items-center gap-(--space-2) md:gap-(--space-2)">
                                <div className="flex items-center justify-center rounded-lg bg-linear-to-tr from-brand-500/5 to-brand-500/15 size-7 md:size-8">
                                    <Edit3 className="size-3.5 md:size-4 text-brand-500/80" />
                                </div>
                                <h2 className="text-title-2 md:text-title-1 lg:text-large-title font-bold text-surface-900 tracking-tight">
                                    {t('logging.title')}
                                </h2>
                            </div>
                            <p className="text-footnote md:text-subheadline lg:text-callout text-surface-700 max-w-prose">
                                {t.rich('logging.subtitle', richTextComponents)}
                            </p>
                        </div>

                        {(() => {
                            const loggingSteps = [
                                {
                                    step: 1, listItems: [1, 2], images: [

                                        {
                                            light: "/app-screens/light/workout/edit-sets.png",
                                            dark: "/app-screens/dark/workout/edit-sets.png"
                                        },
                                    ]
                                },
                                {
                                    step: 2, listItems: [], images: [
                                        {
                                            light: "/app-screens/light/workout/workout-in-progres.png",
                                            dark: "/app-screens/dark/workout/workout-in-progres.png"
                                        },

                                    ]
                                },
                                {
                                    step: 3, listItems: [1, 2, 3], images: [
                                        {
                                            light: "/app-screens/light/workout/edit-sets-2.png",
                                            dark: "/app-screens/dark/workout/edit-sets-2.png"
                                        },
                                    ]
                                },
                                {
                                    step: 4, listItems: [1], images: [
                                        {
                                            light: "/app-screens/light/workout/workout-action.png",
                                            dark: "/app-screens/dark/workout/workout-action.png"
                                        },

                                    ]
                                },
                                {
                                    step: 5, listItems: [], images: [
                                        {
                                            light: "/app-screens/light/workout/workout-action.png",
                                            dark: "/app-screens/dark/workout/workout-action.png"
                                        },

                                    ]
                                },
                                {
                                    step: 6, listItems: [1, 2, 3, 4], images: [
                                        {
                                            light: "/app-screens/light/workout/set-note.png",
                                            dark: "/app-screens/dark/workout/set-note.png"
                                        },

                                    ]
                                },
                            ]

                            return (
                                <div className="space-y-(--space-8) md:space-y-(--space-12)">
                                    {loggingSteps.map(({ step, listItems, images }) => (
                                        <div key={step} className="flex flex-col gap-(--space-8)">
                                            {/* Text Content */}
                                            <div className="space-y-(--space-4)">
                                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight">
                                                    {t(`logging.steps.${step}.title`)}
                                                </h3>

                                                {/* Description */}
                                                {t.has(`logging.steps.${step}.description`) && (
                                                    <div className="text-footnote md:text-subheadline text-surface-700 whitespace-pre-line leading-relaxed">
                                                        {t.rich(`logging.steps.${step}.description`, richTextComponents)}
                                                    </div>
                                                )}

                                                {/* List */}
                                                {listItems.length > 0 && t.has(`logging.steps.${step}.list`) && (
                                                    <ul className="list-disc list-outside ml-4 space-y-2 text-footnote md:text-subheadline text-surface-700 marker:text-surface-400">
                                                        {listItems.map((i) => (
                                                            <li key={i}>{t.rich(`logging.steps.${step}.list.${i}`, richTextComponents)}</li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {/* SubDescription */}
                                                {t.has(`logging.steps.${step}.subDescription`) && (
                                                    <p className="text-footnote md:text-subheadline text-surface-700">
                                                        {t.rich(`logging.steps.${step}.subDescription`, richTextComponents)}
                                                    </p>
                                                )}

                                                {/* Footer */}
                                                {t.has(`logging.steps.${step}.footer`) && (
                                                    <p className="text-footnote md:text-subheadline text-surface-700 italic">
                                                        {t.rich(`logging.steps.${step}.footer`, richTextComponents)}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Phone Images */}
                                            <div className={`flex justify-start md:flex-row flex-col gap-(--space-6) w-full`}>
                                                {images.map((img, idx) => (
                                                    <div key={idx} className="w-50 md:w-60">
                                                        <Iphone src={img.light} darkSrc={img.dark} priority />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        })()}

                        {/* Tip */}
                        <div className="p-(--space-3) md:p-(--space-5) bg-surface-50 dark:bg-surface-200/10 border border-surface-200 dark:border-surface-300/40 flex gap-(--space-3) text-footnote md:text-subheadline text-surface-700 max-w-prose">
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
