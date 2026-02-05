"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Iphone } from "./ui/mobileDevices/Phone"

interface FeatureProps {
    isReverse?: boolean
    title?: string
    description?: React.ReactNode
    buttonText?: string
    imageSrc?: string
}

export default function Feature({
    isReverse = true,
    title = "Ready to transform your business?",
    description = (
        <>
            Join thousands of businesses streamlining their operations,
            <br />
            managing schedules, and growing with data-driven insights.
        </>
    ),
    buttonText = "Start for free",
    imageSrc = "https://framerusercontent.com/images/pZ55dJGHumRqj3rs95ckc0clqk.png?width=1290&height=2796"
}: FeatureProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, margin: "-0px" })
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div className="w-full relative  group flex flex-col  justify-center items-center gap-2 overflow-hidden">
            {/* Content */}
            <div className={`self-stretch ${isReverse ? 'flex-row-reverse' : 'flex-row'} border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center  relative z-10 h-[530px] max-h-[580px]`}>

                <div className=" max-w-[586px] w-1/2 h-full   px-16 py-5 md:py-8 overflow-hidden rounded-lg flex flex-col justify-center items-center gap-6 relative z-20">
                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                        <div className="self-stretch text-left flex justify-center flex-col text-[#49423D] text-3xl md:text-5xl font-semibold leading-tight md:leading-[56px] font-sans tracking-tight">
                            {title}
                        </div>
                        <div className="self-stretch text-left text-[#605A57] text-sm leading-7 font-sans font-medium">
                            {description}
                        </div>
                    </div>
                    <div className="w-full max-w-[497px] flex flex-col justify-start items-start gap-12">
                        <div className="flex justify-start items-center gap-4">
                            <div className="h-10 px-12 py-[6px] relative bg-[#37322F] shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-[#2A2520] transition-colors">
                                <div className="w-44 h-[41px] absolute left-0 top-0 bg-linear-to-b from-[rgba(255,255,255,0)] to-[rgba(0,0,0,0.10)] mix-blend-multiply"></div>
                                <div className="flex flex-col justify-center text-white text-[13px] font-medium leading-5 font-sans">
                                    {buttonText}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-1/2 h-full p-4">
                    <div
                        ref={containerRef}
                        className="w-full relative h-full bg-blue-500 shadow-lg rounded-2xl overflow-hidden group/phone"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div className="absolute inset-0 w-full h-full">
                            {/* Background Pattern */}
                            <div className="w-full h-full relative  [mask-image:radial-gradient(300px_circle_at_center,white,transparent)]">
                                {Array.from({ length: 300 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute h-4 w-full -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.4)] outline-offset-[-0.25px]"
                                        style={{
                                            top: `${i * 16 - 120}px`,
                                            left: "-100%",
                                            width: "300%",
                                        }}
                                    ></div>
                                ))}
                            </div>
                        </div>

                        <div className="absolute top-0 right-0 w-3/5 -translate-y-1/2 translate-x-1/2 h-full bg-white/15 blur-3xl rounded-full"></div>
                        <div className="absolute bottom-0 left-0 w-3/5 translate-y-1/2 -translate-x-1/2 h-full bg-white/10 blur-3xl rounded-full"></div>

                        {/* iPhone Container */}
                        <motion.div
                            initial={{ y: "70%" }}
                            animate={{ y: isHovered ? "15%" : isInView ? "-25%" : "-5%" }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="absolute top-0 left-1/5 w-[300px] transform-gpu will-change-transform"
                        >
                            <Iphone src={imageSrc} />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
