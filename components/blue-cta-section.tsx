"use client"

import React from "react"
import { Iphone } from "./ui/mobileDevices/Phone"
import { Highlighter } from "./ui/highlighter"
import WhiteBtn from "./ui/buttons/WhiteBtn"
import { useTranslations } from "next-intl"

export default function BlueCTASection() {
    const t = useTranslations('BlueCTA')

    return (
        <div className="w-full border-b border-t border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">

            <div className=" w-full h-2 overflow-hidden">
                <div className="w-full h-full relative">
                    {Array.from({ length: 300 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute h-4 w-full -rotate-45 origin-top-left outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                            style={{
                                top: `${i * 16 - 120}px`,
                                left: "-100%",
                                width: "300%",
                            }}
                        ></div>
                    ))}
                </div>
            </div>
            <div className="self-stretch flex justify-center items-start">
                <div className="w-2 self-stretch relative overflow-hidden">
                    {/* Left decorative pattern */}
                    <div className="w-[120px] sm:w-[140px]  left-[-40px]sm:left-[-50px] md:left-[-28px] top-[-120px] absolute flex flex-col justify-start items-start">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <div
                                key={i}
                                className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                            />
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 border-l border-r border-[rgba(55,50,47,0.12)]">
                    <div className="w-full bg-[#1A62FF] group rounded-md overflow-hidden relative flex flex-col justify-center items-center py-12 md:py-20 lg:py-24 px-4 text-center shadow-[0px_0px_3px_3px_rgba(60,60,60,0.2)]">

                        {/* Background Shapes/Glows if needed, for now flat blue as per image */}
                        <div className="absolute inset-0 overflow-hidden">
                            {/* Subtle curve or gradient could go here, keeping it clean for now */}
                            <div className="absolute top-0 right-[10%] w-[50%] h-full bg-gradient-to-bl from-white/20 to-transparent transform skew-x-16 opacity-50 blur-sm"></div>
                            <div className="absolute bottom-0 left-[10%] w-[50%] h-full bg-gradient-to-tr from-white/20 to-transparent transform skew-x-12 opacity-50 blur-sm"></div>
                        </div>

                        <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(300px_circle_at_center,white,transparent)]">

                            {Array.from({ length: 300 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute h-4 w-full rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(255,255,255,0.3)] outline-offset-[-0.25px]"
                                    style={{
                                        top: `${i * 16 - 120}px`,
                                        left: "-100%",
                                        width: "300%",
                                    }}
                                ></div>
                            ))}
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-6 md:gap-4">
                            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl max-w-lg lg:text-6xl font-sans font-semibold tracking-tight leading-tight">
                                {t('headlinePart1')} <br className="hidden sm:block" /><Highlighter action="underline" color="#aec4e8">{t('headlineHighlight')}</Highlighter> <br className="hidden sm:block" />{t('headlinePart2')}
                            </h2>

                            <div className="flex flex-col items-center gap-y-3">
                                <WhiteBtn openBetaDialog={true} text={t('button')} />
                                <p className="text-white/80 text-xs sm:text-sm font-medium">
                                    {t('freeBeta')}
                                </p>
                            </div>
                        </div>




                        {/* iPhones - hidden on mobile */}
                        <div className="absolute right-[-50px] md:right-[-30px] top-[20px] z-20 w-40 md:w-56 lg:w-64 -rotate-15 group-hover:rotate-0 group-hover:-translate-x-14 group-hover:-translate-y-28 transition-transform duration-700 ease-in-out transform-gpu will-change-transform hidden md:block">
                            <Iphone src="/home.png" />
                        </div>
                        <div className="absolute left-[-50px] md:left-[-30px] top-[40px] z-20 w-40 md:w-56 lg:w-64 rotate-15 group-hover:rotate-0 group-hover:translate-x-14 transition-transform duration-700 ease-in-out transform-gpu will-change-transform hidden md:block">
                            <Iphone src="/workout-in-progres.png" />
                        </div>
                    </div>
                </div>

                <div className="w-2 self-stretch relative overflow-hidden">
                    {/* Right decorative pattern */}
                    <div className="w-[120px] sm:w-[140px]  left-[-40px]sm:left-[-50px] md:left-[-28px] top-[-120px] absolute flex flex-col justify-start items-start">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <div
                                key={i}
                                className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className=" w-full h-2 overflow-hidden">
                <div className="w-full h-full relative">
                    {Array.from({ length: 300 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute h-4 w-full -rotate-45 origin-top-left outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                            style={{
                                top: `${i * 16 - 120}px`,
                                left: "-100%",
                                width: "300%",
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    )
}
