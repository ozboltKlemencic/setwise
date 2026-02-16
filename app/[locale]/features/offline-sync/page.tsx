import { getTranslations } from "next-intl/server"
import { WifiOff, RefreshCw, Wifi } from "lucide-react"
import { KeyFeatureSection } from "@/components/features/feature-cards"

export default async function OfflineSyncPage() {
    const t = await getTranslations('FeaturesSidebar.offlineSync')

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

                <div className="flex flex-col gap-(--space-8) md:gap-(--space-12) pb-20">

                    {/* Works Offline Section */}
                    <div id="works-offline" className="scroll-mt-32">
                        <KeyFeatureSection compact icon={WifiOff} title={t('worksOffline.title')}>
                            <p className="text-body text-surface-700 leading-relaxed max-w-prose">
                                {t('worksOffline.description')}
                            </p>
                        </KeyFeatureSection>
                    </div>

                    {/* Sync Section */}
                    <div id="sync" className="scroll-mt-32">
                        <KeyFeatureSection compact icon={RefreshCw} title={t('sync.title')}>
                            <p className="text-body text-surface-700 leading-relaxed max-w-prose">
                                {t('sync.description')}
                            </p>
                        </KeyFeatureSection>
                    </div>

                    {/* Connection Required Section */}
                    <div id="connection-required" className="scroll-mt-32">
                        <KeyFeatureSection compact icon={Wifi} title={t('connectionRequired.title')}>
                            <p className="text-body text-surface-700 leading-relaxed max-w-prose">
                                {t('connectionRequired.description')}
                            </p>
                        </KeyFeatureSection>
                    </div>

                </div>
            </div>
        </div>
    );
}
