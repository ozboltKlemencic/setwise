import { getTranslations } from "next-intl/server"

const richTextComponents = {
    brand: (children: React.ReactNode) => <span className="text-brand-500 font-bold">{children}</span>,
}

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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    {/* Works Offline Card */}
                    <div id="works-offline" className="p-6 rounded-2xl bg-surface-100 dark:bg-surface-100/5 border border-surface-200/60 flex flex-col gap-3 scroll-mt-32">
                        <h3 className="text-subheadline font-semibold text-surface-900">{t('worksOffline.title')}</h3>
                        <p className="text-footnote text-surface-600 leading-relaxed">{t('worksOffline.description')}</p>
                    </div>

                    {/* Sync Card */}
                    <div id="sync" className="p-6 rounded-2xl bg-surface-100 dark:bg-surface-100/5 border border-surface-200/60 flex flex-col gap-3 scroll-mt-32">
                        <h3 className="text-subheadline font-semibold text-surface-900">{t('sync.title')}</h3>
                        <p className="text-footnote text-surface-600 leading-relaxed">{t('sync.description')}</p>
                    </div>

                    {/* Connection Required Card */}
                    <div id="connection-required" className="p-6 rounded-2xl bg-surface-100 dark:bg-surface-100/5 border border-surface-200/60 flex flex-col gap-3 scroll-mt-32">
                        <h3 className="text-subheadline font-semibold text-surface-900">{t('connectionRequired.title')}</h3>
                        <p className="text-footnote text-surface-600 leading-relaxed">{t('connectionRequired.description')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
