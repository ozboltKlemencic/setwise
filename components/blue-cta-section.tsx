"use client"

import React from "react"
import { Iphone } from "./ui/mobileDevices/Phone"
import { Highlighter } from "./ui/highlighter"
import WhiteBtn from "./ui/buttons/WhiteBtn"
import Blur from "./ui/Blur"
import { useTranslations } from "next-intl"

export default function BlueCTASection() {
    const t = useTranslations('BlueCTA')

    return (
        <div className="w-full border-b border-t border-surface-200 flex flex-col justify-center items-center">

            {/* Top decorative hatching */}
            <div className="w-full h-2 overflow-hidden">
                <div className="w-full h-full relative">
                    {Array.from({ length: 300 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute h-(--space-4) w-full -rotate-45 origin-top-left outline-[0.5px] outline-surface-200/50 outline-offset-[-0.25px]"
                            style={{
                                top: `${i * 16 - 120}px`,
                                left: "-100%",
                                width: "300%",
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="self-stretch flex justify-center items-start">
                {/* Left decorative column */}
                <div className="w-2 self-stretch relative overflow-hidden">
                    <div className="w-[120px] sm:w-[140px] left-[-40px] sm:left-[-50px] md:left-[-28px] top-[-120px] absolute flex flex-col justify-start items-start">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <div
                                key={i}
                                className="self-stretch h-3 sm:h-(--space-4) -rotate-45 origin-top-left outline-[0.5px] outline-surface-200/50 outline-offset-[-0.25px]"
                            />
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 border-l border-r border-surface-200">
                    <div className="w-full bg-brand-500 dark:bg-brand-500/80 group rounded-md overflow-hidden relative flex flex-col justify-center items-center py-(--space-12) md:py-(--space-20) lg:py-(--space-24) px-(--space-4) text-center shadow-(--shadow-md)">

                        {/* Background blur decorations */}
                        <div className="absolute inset-0 overflow-hidden">
                            <Blur className="top-0 right-[10%] w-[50%] h-full bg-white/20 skew-x-12 blur-(--blur-heavy)" />
                            <Blur className="bottom-0 left-[10%] w-[50%] h-full bg-white/20 -skew-x-12 blur-(--blur-heavy)" />
                        </div>

                        {/* Center hatching pattern with radial mask */}
                        <div className="absolute inset-0 w-full h-full mask-[radial-gradient(300px_circle_at_center,white,transparent)]">
                            {Array.from({ length: 300 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute h-(--space-4) w-full -rotate-45 origin-top-left outline-[0.5px] outline-white/30 outline-offset-[-0.25px]"
                                    style={{
                                        top: `${i * 16 - 120}px`,
                                        left: "-100%",
                                        width: "300%",
                                    }}
                                />
                            ))}
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center gap-(--space-6) md:gap-(--space-4)">
                            {/* Title — Apple HIG responsive typography */}
                            <h2 className="text-white text-title-1 sm:text-large-title md:text-display-sm lg:text-display max-w-lg font-sans font-semibold">
                                {t('headlinePart1')} <br className="hidden sm:block" />
                                <Highlighter action="underline" color="#aec4e8">{t('headlineHighlight')}</Highlighter> <br className="hidden sm:block" />
                                {t('headlinePart2')}
                            </h2>

                            {/* CTA button and helper text */}
                            <div className="flex flex-col items-center gap-y-(--space-3)">
                                <WhiteBtn openBetaDialog={true} text={t('button')} />
                                <p className="text-white/80 text-caption-1 sm:text-footnote font-medium">
                                    {t('freeBeta')}
                                </p>
                            </div>
                        </div>

                        {/* iPhones — hidden on mobile, with Apple-style animations */}
                        <div className="absolute right-[-50px] md:right-[-20px] lg:right-[-30px] top-[20px] z-20 w-40 md:w-40 lg:w-64 -rotate-15 group-hover:rotate-0 group-hover:-translate-x-14 group-hover:-translate-y-28 transition-transform duration-(--duration-slow) ease-(--ease-apple) transform-gpu will-change-transform hidden md:block">
                            <Iphone src="/app-screens/light/workout-summary.png" darkSrc="/app-screens/dark/workout-summary.png" />
                        </div>
                        <div className="absolute left-[-50px] md:left-[-20px] lg:left-[-30px] top-[40px] z-20 w-40 md:w-40 lg:w-64 rotate-15 group-hover:rotate-0 group-hover:translate-x-14 transition-transform duration-(--duration-slow) ease-(--ease-apple) transform-gpu will-change-transform hidden md:block">
                            <Iphone src="/app-screens/light/analyze.png" darkSrc="/app-screens/dark/analyze.png" />
                        </div>
                    </div>
                </div>

                {/* Right decorative column */}
                <div className="w-2 self-stretch relative overflow-hidden">
                    <div className="w-[120px] sm:w-[140px] left-[-40px] sm:left-[-50px] md:left-[-28px] top-[-120px] absolute flex flex-col justify-start items-start">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <div
                                key={i}
                                className="self-stretch h-3 sm:h-(--space-4) -rotate-45 origin-top-left outline-[0.5px] outline-surface-200/50 outline-offset-[-0.25px]"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom decorative hatching */}
            <div className="w-full h-2 overflow-hidden">
                <div className="w-full h-full relative">
                    {Array.from({ length: 300 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute h-(--space-4) w-full -rotate-45 origin-top-left outline-[0.5px] outline-surface-200/50 outline-offset-[-0.25px]"
                            style={{
                                top: `${i * 16 - 120}px`,
                                left: "-100%",
                                width: "300%",
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
