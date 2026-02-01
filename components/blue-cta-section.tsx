"use client"

import React from "react"
import { Iphone } from "./ui/mobileDevices/Phone"

export default function BlueCTASection() {
    return (
        <div className="w-full border-b border-t border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
            {/* Decorative Lines Container - Matching other sections if needed, but for now simple container */}
            {/* Decorative Lines Container - Top */}
            {/* Decorative Lines Container - Top */}
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
                <div className="flex-1  border-l border-r border-[rgba(55,50,47,0.12)]  ">
                    <div className="w-full bg-[#1A62FF] group rounded-md overflow-hidden relative flex flex-col justify-center items-center py-16 sm:py-20 md:py-24 px-4 text-center shadow-[0px_0px_3px_3px_rgba(60,60,60,0.2)]">

                        {/* Background Shapes/Glows if needed, for now flat blue as per image */}
                        <div className="absolute inset-0 overflow-hidden">
                            {/* Subtle curve or gradient could go here, keeping it clean for now */}
                            <div className="absolute top-0 right-[10%] w-[50%] h-full bg-gradient-to-bl from-white/20 to-transparent transform skew-x-16 opacity-50 blur-sm"></div>
                            <div className="absolute bottom-0 left-[10%] w-[50%] h-full bg-gradient-to-tr from-white/20 to-transparent transform skew-x-12 opacity-50 blur-sm"></div>
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-8">
                            <h2 className="text-white text-4xl sm:text-5xl md:text-6xl font-sans font-semibold tracking-tight leading-tight">
                                Automate.<br />
                                Simplify. Thrive
                            </h2>

                            <div className="flex flex-col items-center gap-3">
                                <button className="bg-white text-[#1A62FF] hover:bg-gray-100 transition-colors px-6 py-3 rounded-full font-medium text-base sm:text-lg shadow-lg">
                                    Start Your 30-Day Free Trial Today
                                </button>
                                <p className="text-white/80 text-sm font-medium">
                                    Cancel anytime, no questions asked
                                </p>
                            </div>
                        </div>

                        <div className="absolute right-[-50px] top-[20px] z-20 w-64 -rotate-15 group-hover:rotate-0 group-hover:-translate-x-14 group-hover:-translate-y-28 transition-transform duration-700 ease-in-out transform-gpu will-change-transform">
                            <Iphone src="/demo-phone-pic.avif" />
                        </div>
                        <div className="absolute left-[-50px] top-[40px] z-20 w-64 rotate-15 group-hover:rotate-0 group-hover:translate-x-14 transition-transform duration-700 ease-in-out transform-gpu will-change-transform">
                            <Iphone src="/demo-phone-pic.avif" />
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
