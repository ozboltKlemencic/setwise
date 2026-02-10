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
            ]
        },
        {
            title: t('quickLogging.title'),
            href: "/features/quick-logging",
            icon: Zap,
            subItems: [
                { title: t('quickLogging.liveSession'), href: "/features/quick-logging#live-session" },
                { title: t('quickLogging.logManually'), href: "/features/quick-logging#log-manually" },
                { title: t('quickLogging.restTimer'), href: "/features/quick-logging#rest-timer" },
            ]
        },
        {
            title: t('templates.title'),
            href: "/features/templates-programs",
            icon: LayoutTemplate,
            subItems: [
                { title: t('templates.myTemplates'), href: "/features/templates-programs#my-templates" },
                { title: t('templates.publicPrograms'), href: "/features/templates-programs#public-programs" },
                { title: t('templates.createNew'), href: "/features/templates-programs#create-new" },
            ]
        },
        {
            title: t('history.title'),
            href: "/features/history",
            icon: History,
            subItems: [
                { title: t('history.workoutLog'), href: "/features/history#workout-log" },
                { title: t('history.personalRecords'), href: "/features/history#personal-records" },
                { title: t('history.calendar'), href: "/features/history#calendar" },
            ]
        },
        {
            title: t('progressAnalytics.title'),
            href: "/features/progress-analytics",
            icon: TrendingUp,
            subItems: [
                { title: t('progressAnalytics.volumeCharts'), href: "/features/progress-analytics#volume-charts" },
                { title: t('progressAnalytics.strengthCurves'), href: "/features/progress-analytics#strength-curves" },
                { title: t('progressAnalytics.muscleHeatmap'), href: "/features/progress-analytics#muscle-heatmap" },
            ]
        },
        {
            title: t('advancedMetrics.title'),
            href: "/features/advanced-metrics",
            icon: Gauge,
            subItems: [
                { title: t('advancedMetrics.exertionScale'), href: "/features/advanced-metrics#exertion-scale" },
                { title: t('advancedMetrics.repQuality'), href: "/features/advanced-metrics#rep-quality" },
                { title: t('advancedMetrics.advancedMetrics'), href: "/features/advanced-metrics#advanced-metrics" },
            ]
        },
        {
            title: t('intensifiers.title'),
            href: "/features/intensifiers",
            icon: Flame,
            subItems: [
                { title: t('intensifiers.dropSets'), href: "/features/intensifiers#drop-sets" },
                { title: t('intensifiers.supersets'), href: "/features/intensifiers#supersets" },
                { title: t('intensifiers.clusterSets'), href: "/features/intensifiers#cluster-sets" },
            ]
        },
        {
            title: t('autoCompare.title'),
            href: "/features/auto-compare",
            icon: GitCompare,
            subItems: [
                { title: t('autoCompare.vsLastSession'), href: "/features/auto-compare#vs-last-session" },
                { title: t('autoCompare.vsBestAllTime'), href: "/features/auto-compare#vs-best-all-time" },
            ]
        },
        {
            title: t('offlineSync.title'),
            href: "/features/offline-sync",
            icon: WifiOff,
            subItems: [
                { title: t('offlineSync.offlineMode'), href: "/features/offline-sync#offline-mode" },
                { title: t('offlineSync.cloudSync'), href: "/features/offline-sync#cloud-sync" },
                { title: t('offlineSync.dataExport'), href: "/features/offline-sync#data-export" },
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
