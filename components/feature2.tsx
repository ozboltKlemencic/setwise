"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Iphone } from "./ui/mobileDevices/Phone"

interface FeatureProps {
    isReverse?: boolean
    title?: React.ReactNode
    description?: React.ReactNode
    buttonText?: string
    imageSrc?: string
}

export default function Feature2({
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
    imageSrc = "/workout.png"
}: FeatureProps) {
    const phoneRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(phoneRef, { once: true, margin: "-100px" })
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div className="w-full relative  group flex flex-col justify-center items-center   overflow-hidden">


            {/* Content */}
            <div className={`self-stretch ${isReverse ? 'flex-row-reverse' : 'flex-row'}   flex justify-start items-center relative z-10 h-[600px] max-h-[600px]`}>

                <div className=" max-w-[586px] py-12 w-1/2 md:pl-12 pr-16 border-r md:py-8 overflow-hidden rgounded-br-lg flex flex-col justify-center items-center gap-6 relative z-20 h-full border-b border-[rgba(55,50,47,0.12)]">
                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                        <div className="self-stretch text-left flex justify-center flex-col text-[#49423D] text-3xl md:text-5xl font-semibold leading-tight md:leading-[56px] font-sans tracking-tight ">
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

                <div
                    className="w-1/2 relative h-full   overflow-hidden group/phone border-b border-[rgba(55,50,47,0.12)]"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="w-full h-full relative opacity-80">
                        {Array.from({ length: 300 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute h-4 w-full -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                                style={{
                                    top: `${i * 16 - 120}px`,
                                    left: "-100%",
                                    width: "300%",
                                }}
                            ></div>
                        ))}
                    </div>
                    <div className="absolute top-2 left-2 right-2 bottom-2  overflow-hidden bg-blue-500  rounded-lg shadow-[0px_0px_3px_3px_rgba(60,60,60,0.2)] ">
                        {/* Background Pattern */}
                        {/* iPhone Container */}

                        <motion.div
                            ref={phoneRef}
                            initial={{ y: "-80%" }}
                            animate={{ y: isHovered ? "-35%" : isInView ? "25%" : "-50%" }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="absolute top-0 left-0 translate-x-1/2 w-[300px] transform-gpu will-change-transform"
                        >
                            <Iphone src={imageSrc} />
                        </motion.div>
                        <div className="absolute top-0 right-0 w-3/5 -translate-y-1/2 translate-x-1/2 h-full bg-white/20 blur-2xl rounded-full"></div>
                        <div className="absolute bottom-0 left-0 w-2/5 translate-y-1/2 -translate-x-1/2 h-3/4 bg-white/10 blur-xl rounded-full"></div>
                    </div>


                </div>
            </div>

        </div>
    )
}
