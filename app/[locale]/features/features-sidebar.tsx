"use client"

import { useMemo } from "react"
import {
    Zap,
    LayoutTemplate,
    History,
    TrendingUp,
    Gauge,
    Flame,
    GitCompare,
    WifiOff,
    Info
} from "lucide-react"
import { useTranslations } from "next-intl"
import { Sidebar, MobileSidebar, type SidebarItem } from "@/components/sidebar"
import ButtonRotatingGradient from "@/components/ui/buttons/ButtonRotatingGradient"
import BetaSignupDialog from "@/components/beta-signup-dialog"
import { ParticleText } from "@/components/ui/particle-text"

export function FeaturesSidebar() {
    const t = useTranslations('FeaturesSidebar')

    const featuresSidebarItems: SidebarItem[] = useMemo(() => [
        {
            title: t('intro.title'),
            href: "/features",
            icon: Info,
            subItems: [
                { title: t('intro.overview'), href: "/features#overview" },
                { title: t('intro.keyFeatures'), href: "/features#key-features" },
                { title: t('intro.getStarted'), href: "/features#get-started" },
                { title: t('intro.security'), href: "/features#security" },
            ]
        },
        {
            title: t('quickLogging.title'),
            href: "/features/quick-logging",
            icon: Zap,
            subItems: [
                { title: t('quickLogging.liveSession'), href: "/features/quick-logging#live-session" },
                { title: t('quickLogging.quickWorkout'), href: "/features/quick-logging#quick-workout" },
                { title: t('quickLogging.setNotes'), href: "/features/quick-logging#set-notes" },
                { title: t('quickLogging.workoutDuration'), href: "/features/quick-logging#workout-duration" },
            ]
        },
        {
            title: t('templates.title'),
            href: "/features/templates-programs",
            icon: LayoutTemplate,
            subItems: [
                { title: t('templates.importPlan.title'), href: "/features/templates-programs#import-plan" },
                { title: t('templates.createNew.title'), href: "/features/templates-programs#create-new" },
            ]
        },
        {
            title: t('progressAnalytics.title'),
            href: "/features/progress-analytics",
            icon: TrendingUp,
            subItems: [
                { title: t('progressAnalytics.progress.title'), href: "/features/progress-analytics#progress" },
                { title: t('progressAnalytics.workoutDetails.title'), href: "/features/progress-analytics#workout-details" },
                { title: t('progressAnalytics.analytics.title'), href: "/features/progress-analytics#analytics" },
            ]
        },
        {
            title: t('advancedMetrics.title'),
            href: "/features/advanced-metrics",
            icon: Gauge,
            subItems: [
                { title: t('advancedMetrics.rpeRir.title'), href: "/features/advanced-metrics#rpe-rir" },
                { title: t('advancedMetrics.tempoRom.title'), href: "/features/advanced-metrics#tempo-rom" },
                { title: t('advancedMetrics.intensifiers.title'), href: "/features/advanced-metrics#intensifiers" },
            ]
        },
        {
            title: t('offlineSync.title'),
            href: "/features/offline-sync",
            icon: WifiOff,
            subItems: [
                { title: t('offlineSync.worksOffline.title'), href: "/features/offline-sync#works-offline" },
                { title: t('offlineSync.sync.title'), href: "/features/offline-sync#sync" },
                { title: t('offlineSync.connectionRequired.title'), href: "/features/offline-sync#connection-required" },
            ]
        },
    ], [t])

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden min-[1152px]:block w-64 shrink-0 border-r border-border/40 relative">
                <div className="sticky top-[4.5rem] h-[calc(100vh_-_theme(spacing.20))] overflow-y-auto no-scrollbar">
                    <Sidebar items={featuresSidebarItems}>
                        {/* Beta CTA Card */}
                        <div className="relative overflow-hidden rounded-2xl border border-border/60 dark:border-border/40 bg-backgorund ">
                            <div className="absolute inset-0 z-0 pointer-events-none">
                                <ParticleText text=" " backgroundBrightness={{ dark: 190, light: 100 }} className="h-full w-full" />
                            </div>

                            <div className="relative z-10 p-5 flex flex-col items-start gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-surface-700 tracking-tight">
                                        {t('betaTitle')}
                                    </h3>
                                    <p className="text-sm text-surface-600 dark:text-surface-600 leading-relaxed font-sans">
                                        {t('betaDescription')}
                                    </p>
                                </div>

                                <BetaSignupDialog
                                    trigger={
                                        <ButtonRotatingGradient className="w-full text-base font-semibold">
                                            {t('betaButton')}
                                        </ButtonRotatingGradient>
                                    }
                                />
                            </div>
                        </div>
                    </Sidebar>
                </div>
            </aside>

            {/* Mobile sidebar (floating button + bottom sheet) */}
            <MobileSidebar items={featuresSidebarItems} title={t('mobileTitle')} />
        </>
    )
}
