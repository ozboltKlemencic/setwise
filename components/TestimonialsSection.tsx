import React, { useRef, useEffect } from "react"
import ReviewCard from "./ui/cards/ReviewCard"
import { motion, useMotionValue, useAnimationFrame, useAnimate, type AnimationPlaybackControls } from "framer-motion"
import { SparklesText } from "./ui/sparkles-text";

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
        <div>
            <div className="w-full md:h-6 h-2 relative opacity-80 border-b border-[rgba(55,50,47,0.12)] overflow-hidden">
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
            <div className="w-full flex flex-col md:h-[640px] lg:flex-row justify-center items-center border-[rgba(55,50,47,0.12)] relative">

                {/* Left Decorative Pattern - Absolute positioned */}
                <div className="absolute left-0 top-0 w-2 md:w-6 h-full overflow-hidden z-10 border-r border-[rgba(55,50,47,0.12)]">
                    <div className="w-[162px] left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start ">
                        {Array.from({ length: 200 }).map((_, i) => (
                            <div
                                key={i}
                                className="self-stretch h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Right Decorative Pattern - Absolute positioned */}
                <div className="absolute right-0 top-0 w-2 md:w-6 h-full overflow-hidden z-10 border-l border-[rgba(55,50,47,0.12)]">
                    <div className="w-[162px] left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                        {Array.from({ length: 200 }).map((_, i) => (
                            <div
                                key={i}
                                className="self-stretch h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                            ></div>
                        ))}
                    </div>
                </div>

                {/* content */}
                <div className="flex-1 flex flex-col shadow-[0px_0px_3px_3px_rgba(60,60,60,0.00)] md:flex-row justify-center items-center md:py-12   h-full gap-y-6 px-4 md:px-0 pb-6 md:pb-0">
                    <div className="md:max-w-[586px] md:ml-6  w-full md:w-1/2 md:px-10 md:pl-12 md:py-8 overflow-hidden rounded-lg flex flex-col justify-start items-center h-full relative z-20 p-6 gap-y-4 py-8">
                        <div className="w-full h-full flex flex-col justify-start items-start gap-3">
                            <h2 className="self-stretch text-center md:text-left flex justify-center flex-col text-[#49423D] text-3xl md:text-5xl font-semibold leading-tight md:leading-[56px] font-sans tracking-tight">
                                <SparklesText shapes={['heart', 'star']} colors={{ first: "#FFD700", second: "#EAB308" }}>Loved by</SparklesText> serious lifters. Proven in real training.
                            </h2>
                            <p className="self-stretch text-center md:text-left text-[#605A57] text-base leading-7 font-sans font-medium">
                                Used daily by coaches, athletes, and serious gym-goers. No fluff, no hype - just a powerful tool that helps you get stronger, smarter, and more consistent.
                            </p>
                        </div>
                        <div className="w-full md:max-w-[497px] flex flex-col md:justify-start justify-center md:items-start items-center md:gap-12 gap-6">
                            <div className="flex justify-start items-center gap-4">
                                <div className="h-10 px-12 py-[6px] relative bg-[#37322F] shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-[#2A2520] transition-colors">
                                    <div className="w-44 h-[41px] absolute left-0 top-0 bg-linear-to-b from-[rgba(255,255,255,0)] to-[rgba(0,0,0,0.10)] mix-blend-multiply"></div>
                                    <div className="flex flex-col justify-center text-white text-[13px] font-medium leading-5 font-sans">
                                        Download for free
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        ref={containerRef}
                        className="md:w-1/2 w-[calc(100%-2rem)] md:mr-6  relative overflow-hidden md:h-full h-[400px]  flex flex-col md:pl-6 md:my-6 py-4"
                        onMouseEnter={() => animationRef.current?.pause()}
                        onMouseLeave={() => animationRef.current?.play()}
                    >
                        {/* Gradient Overlays */}
                        <div className="absolute top-0 left-0 w-full h-20 bg-linear-to-b from-[#F7F5F3] to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-full h-20 bg-linear-to-t from-[#F7F5F3] to-transparent z-10 pointer-events-none"></div>

                        <motion.div
                            ref={scope}
                            className="flex flex-col px-2 md:pl-8 md:pr-6 pointer-events-none md:pointer-events-auto"
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
                                        className="w-full shrink-0 md:my-3"
                                    />
                                </ScaledCard>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div >
            <div className="w-full md:h-6 h-2 relative opacity-80 border-t border-b border-[rgba(55,50,47,0.12)] overflow-hidden">
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
        </div>
    );
}
