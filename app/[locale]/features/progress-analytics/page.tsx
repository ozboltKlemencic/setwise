import { getTranslations } from "next-intl/server"
import { Check } from "lucide-react"
import { Iphone } from "@/components/ui/mobileDevices/Phone"

const richTextComponents = {
    brand: (children: React.ReactNode) => <span className="text-brand-500 font-bold">{children}</span>,
}

export default async function ProgressAnalyticsPage() {
    const t = await getTranslations('FeaturesSidebar.progressAnalytics')

    return (
        <div className="w-full h-full flex flex-col items-center justify-start font-sans pt-12 md:pt-0">
            <div className="w-full px-(--space-5) md:px-(--space-12) max-w-5xl min-[1152px]:border-0 md:border-l md:border-r border-surface-200">

                {/* -- Page Header ---------------------------------------------- */}
                <header className="pt-(--space-8) pb-(--space-5) md:pt-(--space-16) md:pb-(--space-10) min-[1152px]:pr-(--space-8)">

                    <p className="text-caption-2 tracking-wider font-semibold primaryGradient mb-1">
                        {t('title')}
                    </p>

                    <h1 className="text-title-1 md:text-display-sm lg:text-display font-bold text-surface-900 tracking-tight text-balance">
                        {t('heading')}
                    </h1>
                    <p className="mt-4 text-footnote md:text-subheadline lg:text-callout text-surface-700 leading-relaxed max-w-prose">
                        {t('subHeading')}
                    </p>
                </header>

                <div className="space-y-(--space-10) md:space-y-(--space-16) lg:space-y-(--space-20) pb-20">

                    {/* Progress Section */}
                    <section id="progress" className="scroll-mt-32">
                        <div className="flex flex-col gap-8 items-center text-center md:text-left">
                            <div className="w-full">
                                <h2 className="text-title-2 md:text-title-1 font-bold text-surface-900 tracking-tight mb-4">{t('progress.title')}</h2>
                                <p className="text-body md:text-subheadline text-surface-700 leading-relaxed max-w-prose mb-8">{t('progress.description')}</p>
                            </div>
                            <div className="flex justify-center w-full">
                                <Iphone src="/workout-in-progres.png" className="w-full max-w-[250px]" />
                            </div>
                        </div>
                    </section>

                    {/* Workout Details Section */}
                    <section id="workout-details" className="scroll-mt-32">
                        <div className="flex flex-col gap-8 items-center text-center md:text-left">
                            <div className="w-full space-y-8">
                                <div>
                                    <h2 className="text-title-2 md:text-title-1 font-bold text-surface-900 tracking-tight mb-4">{t('workoutDetails.title')}</h2>
                                    <p className="text-body md:text-subheadline text-surface-700 leading-relaxed max-w-prose">{t('workoutDetails.description')}</p>
                                </div>
                                <div>
                                    <h3 className="text-title-3 font-bold text-surface-900 tracking-tight mb-2">{t('workoutDetails.exercisesSets.title')}</h3>
                                    <p className="text-body md:text-subheadline text-surface-700 leading-relaxed max-w-prose">{t('workoutDetails.exercisesSets.description')}</p>
                                </div>
                            </div>
                            <div className="flex justify-center w-full">
                                <Iphone src="/workout.png" className="w-full max-w-[250px]" />
                            </div>
                        </div>
                    </section>

                    {/* Analytics Section */}
                    <section id="analytics" className="scroll-mt-32">
                        <div className="flex flex-col gap-12 items-center text-center md:text-left">
                            {/* Analytics Intro */}
                            <div className="w-full">
                                <h2 className="text-title-2 md:text-title-1 font-bold text-surface-900 tracking-tight mb-4">{t('analytics.title')}</h2>
                                <p className="text-body md:text-subheadline text-surface-700 leading-relaxed max-w-prose">{t('analytics.description')}</p>
                            </div>

                            {/* Volume Chart */}
                            <div className="flex flex-col gap-8 w-full">
                                <div>
                                    <h3 className="text-title-3 font-bold text-surface-900 tracking-tight mb-2">{t('analytics.volumeChart.title')}</h3>
                                    <p className="text-body md:text-subheadline text-surface-700 leading-relaxed max-w-prose">{t('analytics.volumeChart.description')}</p>
                                </div>
                                <div className="flex justify-center w-full">
                                    <Iphone src="/demo-phone-pic.avif" className="w-full max-w-[250px]" />
                                </div>
                            </div>

                            {/* Exercise Chart */}
                            <div className="flex flex-col gap-8 w-full">
                                <div>
                                    <h3 className="text-title-3 font-bold text-surface-900 tracking-tight mb-2">{t('analytics.exerciseChart.title')}</h3>
                                    <p className="text-body md:text-subheadline text-surface-700 leading-relaxed max-w-prose">{t('analytics.exerciseChart.description')}</p>
                                </div>
                                <div className="flex justify-center w-full">
                                    <Iphone src="/demo-phone-pic.avif" className="w-full max-w-[250px]" />
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
