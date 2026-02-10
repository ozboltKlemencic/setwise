"use client"

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
import { Sidebar, type SidebarItem } from "@/components/sidebar"
import ButtonRotatingGradient from "@/components/ui/buttons/ButtonRotatingGradient"
import BetaSignupDialog from "@/components/beta-signup-dialog"
import { ParticleText } from "@/components/ui/particle-text"

const featuresSidebarItems: SidebarItem[] = [
    {
        title: "Intro",
        href: "/features",
        icon: Info,
        subItems: [
            { title: "Overview", href: "/features#overview" },
            { title: "Key Features", href: "/features#key-features" },
            { title: "Get Started", href: "/features#get-started" },
        ]
    },
    {
        title: "Quick logging",
        href: "/features/quick-logging",
        icon: Zap,
        subItems: [
            { title: "Live Session", href: "/features/quick-logging#live-session" },
            { title: "Log Manually", href: "/features/quick-logging#log-manually" },
            { title: "Rest Timer", href: "/features/quick-logging#rest-timer" },
        ]
    },
    {
        title: "Templates & Programs",
        href: "/features/templates-programs",
        icon: LayoutTemplate,
        subItems: [
            { title: "My Templates", href: "/features/templates-programs#my-templates" },
            { title: "Public Programs", href: "/features/templates-programs#public-programs" },
            { title: "Create New", href: "/features/templates-programs#create-new" },
        ]
    },
    {
        title: "History",
        href: "/features/history",
        icon: History,
        subItems: [
            { title: "Workout Log", href: "/features/history#workout-log" },
            { title: "Personal Records", href: "/features/history#personal-records" },
            { title: "Calendar", href: "/features/history#calendar" },
        ]
    },
    {
        title: "Progress & Analytics",
        href: "/features/progress-analytics",
        icon: TrendingUp,
        subItems: [
            { title: "Volume Charts", href: "/features/progress-analytics#volume-charts" },
            { title: "Strength Curves", href: "/features/progress-analytics#strength-curves" },
            { title: "Muscle Heatmap", href: "/features/progress-analytics#muscle-heatmap" },
        ]
    },
    {
        title: "RPE/RIR, Tempo/ROM",
        href: "/features/advanced-metrics",
        icon: Gauge,
        subItems: [
            { title: "Exertion Scale", href: "/features/advanced-metrics#exertion-scale" },
            { title: "Rep Quality", href: "/features/advanced-metrics#rep-quality" },
            { title: "Advanced Metrics", href: "/features/advanced-metrics#advanced-metrics" },
        ]
    },
    {
        title: "Intensifiers",
        href: "/features/intensifiers",
        icon: Flame,
        subItems: [
            { title: "Drop Sets", href: "/features/intensifiers#drop-sets" },
            { title: "Supersets", href: "/features/intensifiers#supersets" },
            { title: "Cluster Sets", href: "/features/intensifiers#cluster-sets" },
        ]
    },
    {
        title: "Auto-compare",
        href: "/features/auto-compare",
        icon: GitCompare,
        subItems: [
            { title: "vs Last Session", href: "/features/auto-compare#vs-last-session" },
            { title: "vs Best All-Time", href: "/features/auto-compare#vs-best-all-time" },
        ]
    },
    {
        title: "Offline-first + Sync",
        href: "/features/offline-sync",
        icon: WifiOff,
        subItems: [
            { title: "Offline Mode", href: "/features/offline-sync#offline-mode" },
            { title: "Cloud Sync", href: "/features/offline-sync#cloud-sync" },
            { title: "Data Export", href: "/features/offline-sync#data-export" },
        ]
    },
]

export function FeaturesSidebar() {
    return (
        <Sidebar items={featuresSidebarItems}>
            {/* Beta CTA Card */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 dark:border-border/40 bg-backgorund ">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <ParticleText text=" " backgroundBrightness={{ dark: 190, light: 100 }} className="h-full w-full" />
                </div>

                <div className="relative z-10 p-5 flex flex-col items-start gap-4">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-surface-700 tracking-tight">
                            Get Beta Access
                        </h3>
                        <p className="text-sm text-surface-600 dark:text-surface-600 leading-relaxed font-sans">
                            Download app and track your progress with precision.
                        </p>
                    </div>

                    <BetaSignupDialog
                        trigger={
                            <ButtonRotatingGradient className="w-full text-base font-semibold">
                                Try for Free
                            </ButtonRotatingGradient>
                        }
                    />
                </div>
            </div>
        </Sidebar>
    )
}
