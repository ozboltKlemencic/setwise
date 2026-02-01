import React, { useRef, useEffect } from "react"
import ReviewCard from "./ui/cards/ReviewCard"
import { motion, useMotionValue, useAnimationFrame, useAnimate, type AnimationPlaybackControls } from "framer-motion"

const reviews = [
    {
        name: "Sarah Jenkins",
        role: "COO",
        company: "LogisticsPlus",
        reviewText: "SetWise streamlined our entire workflow. We used to spend hours on manual entry, now it's all automated. Highly recommended!",
        rating: 5,
        avatarUrl: "/jernej.png"
    },
    {
        name: "Mark Thompson",
        role: "Founder",
        company: "GrowthX",
        reviewText: "The insights we get from SetWise are game-changing. It really helps us make data-driven decisions that impact our bottom line.",
        rating: 5,
        avatarUrl: "/jernej.png"
    },
    {
        name: "Elena Rodriguez",
        role: "Product Manager",
        company: "TechFlow",
        reviewText: "Incredible user experience and support. The team at SetWise really cares about their customers' success.",
        rating: 5,
        avatarUrl: "/jernej.png"
    }
];

function ScaledCard({ children, containerRef }: { children: React.ReactNode, containerRef: React.RefObject<HTMLDivElement | null> }) {
    const cardRef = useRef<HTMLDivElement>(null)
    const scale = useMotionValue(1)
    const opacity = useMotionValue(1)

    useAnimationFrame(() => {
        if (!cardRef.current || !containerRef.current) return

        const containerRect = containerRef.current.getBoundingClientRect()
        const cardRect = cardRef.current.getBoundingClientRect()

        const containerCenter = containerRect.top + containerRect.height / 2
        const cardCenter = cardRect.top + cardRect.height / 2

        const distanceFromCenter = Math.abs(containerCenter - cardCenter)
        const maxDistance = containerRect.height / 2

        // Calculate scale: 1 at center, smaller at edges
        // Adjust these values to tweak the effect intensity
        let newScale = 1 - (distanceFromCenter / maxDistance) * 0.05
        newScale = Math.max(0.9, Math.min(1, newScale)) // Clamp between 0.9 and 1

        let newOpacity = 1 - (distanceFromCenter / maxDistance) * 0.1
        newOpacity = Math.max(0.8, Math.min(1, newOpacity))

        scale.set(newScale)
        opacity.set(newOpacity)
    })

    return (
        <motion.div
            ref={cardRef}
            style={{
                scale,
                opacity,
                willChange: "transform, opacity", // Hint for GPU acceleration
                transform: "translateZ(0)" // Force 3D
            }}
            className="w-full"
        >
            {children}
        </motion.div>
    )
}

export default function TestimonialsSection() {
    // Duplicate reviews for seamless loop
    const duplicatedReviews = [...reviews, ...reviews];
    const containerRef = useRef<HTMLDivElement>(null)
    const [scope, animate] = useAnimate()
    const animationRef = useRef<AnimationPlaybackControls | null>(null)

    useEffect(() => {
        const animation = animate(scope.current, { y: ["-50%", "0%"] }, {
            duration: 25,
            ease: "linear",
            repeat: Infinity
        })
        animationRef.current = animation
        return () => animation.stop()
    }, [animate])

    return (
        <div className="w-full flex flex-col h-[500px] lg:flex-row justify-center items-center   border-b  border-[rgba(55,50,47,0.12)]  lg:max-w-[1060px] lg:w-[1060px]   ">

            {/* Left Decorative Pattern */}
            <div className="w-6 self-stretch relative overflow-hidden hidden md:block">
                <div className="w-[162px] left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                    {Array.from({ length: 200 }).map((_, i) => (
                        <div
                            key={i}
                            className="self-stretch h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                        ></div>
                    ))}
                </div>
            </div>
            <div className="flex-1 flex flex-col md:flex-row justify-center items-center gap-6 py-12 md:py-0 border-r border-l border-[rgba(55,50,47,0.12)] h-full">
                <div className=" max-w-[586px] w-1/2 px-6 pl-6 py-5 md:py-8 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-6 relative z-20">
                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                        <div className="self-stretch text-left flex justify-center flex-col text-[#49423D] text-3xl md:text-5xl font-semibold leading-tight md:leading-[56px] font-sans tracking-tight">
                            Ready to transform your business?
                        </div>
                        <div className="self-stretch text-left text-[#605A57] text-base leading-7 font-sans font-medium">
                            Join thousands of businesses streamlining their operations,
                            <br />
                            managing schedules, and growing with data-driven insights.
                        </div>
                    </div>
                    <div className="w-full max-w-[497px] flex flex-col justify-start items-start gap-12">
                        <div className="flex justify-start items-center gap-4">
                            <div className="h-10 px-12 py-[6px] relative bg-[#37322F] shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-[#2A2520] transition-colors">
                                <div className="w-44 h-[41px] absolute left-0 top-0 bg-linear-to-b from-[rgba(255,255,255,0)] to-[rgba(0,0,0,0.10)] mix-blend-multiply"></div>
                                <div className="flex flex-col justify-center text-white text-[13px] font-medium leading-5 font-sans">
                                    Start for free
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    ref={containerRef}
                    className="w-1/2 relative overflow-hidden h-full flex flex-col pl-6"
                    onMouseEnter={() => animationRef.current?.pause()}
                    onMouseLeave={() => animationRef.current?.play()}
                >
                    {/* Gradient Overlays */}
                    <div className="absolute top-0 left-0 w-full h-20 bg-linear-to-b from-[#F7F5F3] to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-full h-20 bg-linear-to-t from-[#F7F5F3] to-transparent z-10 pointer-events-none"></div>

                    <motion.div
                        ref={scope}
                        className="flex flex-col pl-8 pr-6"
                        style={{
                            willChange: "transform",
                            transform: "translateZ(0)"
                        }}
                    >
                        {duplicatedReviews.map((review, index) => (
                            <ScaledCard key={index} containerRef={containerRef}>
                                <ReviewCard
                                    name={review.name}
                                    role={review.role}
                                    company={review.company}
                                    reviewText={review.reviewText}
                                    rating={review.rating}
                                    avatarUrl={review.avatarUrl}
                                    className="w-full shrink-0 mb-3"
                                />
                            </ScaledCard>
                        ))}
                    </motion.div>
                </div>
            </div>
            {/* Right Decorative Pattern */}
            <div className="w-6 self-stretch relative overflow-hidden hidden md:block">
                <div className="w-[162px] left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                    {Array.from({ length: 200 }).map((_, i) => (
                        <div
                            key={i}
                            className="self-stretch h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                        ></div>
                    ))}
                </div>
            </div>
        </div >
    );
}
