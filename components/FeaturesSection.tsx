"use client"

import React, { useState } from "react"
import { ThumbsUp, ThumbsDown, Check, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

// --- Types ---
interface FeatureDetail {
    title: string
    description: string
}

interface FeatureItemCardProps {
    feature: FeatureDetail
    isRequest?: boolean
    onClick: () => void
}

interface FeatureColumnProps {
    title: string
    features: FeatureDetail[]
    isRequestColumn?: boolean
    onFeatureClick: (feature: FeatureDetail) => void
}

// --- Components ---

function FeatureItemCard({ feature, isRequest, onClick }: FeatureItemCardProps) {
    // Mock initial counts
    const [likes, setLikes] = useState(() => Math.floor(Math.random() * 50) + 5)
    const [dislikes, setDislikes] = useState(() => Math.floor(Math.random() * 20))
    const [vote, setVote] = useState<'liked' | 'disliked' | null>(null)

    const handleVote = (e: React.MouseEvent, type: 'liked' | 'disliked') => {
        e.stopPropagation() // Prevent modal opening

        if (vote === type) {
            // Toggle off
            setVote(null)
            if (type === 'liked') setLikes(prev => prev - 1)
            else setDislikes(prev => prev - 1)
        } else {
            // Switch vote or new vote
            if (vote === 'liked') setLikes(prev => prev - 1)
            if (vote === 'disliked') setDislikes(prev => prev - 1)

            setVote(type)
            if (type === 'liked') setLikes(prev => prev + 1)
            else setDislikes(prev => prev + 1)
        }
    }

    return (
        <div
            onClick={onClick}
            className="bg-white border border-[rgba(55,50,47,0.12)]  p-3  group cursor-pointer active:scale-[0.98]"
        >
            <div className="flex items-start gap-3 mb-3">
                {/* Icon indicator */}
                <div className={cn(
                    "mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 border",
                    isRequest
                        ? "border-dashed border-blue-300 text-blue-500 bg-blue-50"
                        : "border-gray-200 text-green-600 bg-green-50"
                )}>
                    {isRequest ? <Plus className="w-2.5 h-2.5" /> : <Check className="w-2.5 h-2.5" />}
                </div>
                <span className="text-[#605A57] text-sm font-medium leading-tight font-sans">
                    {feature.title}
                </span>
            </div>

            <div className="flex items-center gap-3 pl-7">
                <button
                    onClick={(e) => handleVote(e, 'liked')}
                    className={cn(
                        "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded hover:bg-gray-50 transition-colors",
                        vote === 'liked' ? "text-green-600 bg-green-50" : "text-gray-400"
                    )}
                >
                    <ThumbsUp className={cn("w-3.5 h-3.5", vote === 'liked' && "fill-current")} />
                    <span>{likes}</span>
                </button>
                <button
                    onClick={(e) => handleVote(e, 'disliked')}
                    className={cn(
                        "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded hover:bg-gray-50 transition-colors",
                        vote === 'disliked' ? "text-red-500 bg-red-50" : "text-gray-400"
                    )}
                >
                    <ThumbsDown className={cn("w-3.5 h-3.5", vote === 'disliked' && "fill-current")} />
                    <span>{dislikes}</span>
                </button>
            </div>
        </div>
    )
}

function FeatureColumn({ title, features, isRequestColumn = false, onFeatureClick }: FeatureColumnProps) {
    return (
        <div className="flex flex-col h-full border-b border-[rgba(55,50,47,0.12)] md:border-b-0 p-4 sm:p-6">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-[#37322F] text-lg font-semibold leading-tight font-sans mb-1">
                    {title}
                </h3>
            </div>

            {/* Features List as Cards */}
            <div className="flex flex-col gap-3">
                {features.map((feature, index) => (
                    <FeatureItemCard
                        key={index}
                        feature={feature}
                        isRequest={isRequestColumn}
                        onClick={() => onFeatureClick(feature)}
                    />
                ))}
            </div>
        </div>
    )
}

function FeatureDetailModal({ feature, onClose }: { feature: FeatureDetail | null, onClose: () => void }) {
    if (!feature) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={onClose}
                ></div>

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative bg-white rounded-none shadow-2xl w-full max-w-md p-6 md:p-8 z-10 overflow-hidden"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                                Feature Details
                            </span>
                            <h3 className="text-[#37322F] text-2xl font-bold leading-tight font-sans">
                                {feature.title}
                            </h3>
                        </div>

                        <div className="h-px w-full bg-gray-100"></div>

                        <p className="text-[#605A57] text-base leading-relaxed font-sans">
                            {feature.description}
                        </p>

                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 bg-[#37322F] text-white text-sm font-medium rounded-md hover:bg-[#2A2520] transition-colors"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// --- Data & Main Component ---

const requestFeatures = [
    { title: "Custom muscle heatmaps", description: "Visualize muscle recovery with personalized heatmaps based on your unique anatomy and training frequency." },
    { title: "AI Voice coaching", description: "Real-time audio feedback during your sets to correct form and keep you motivated without looking at the screen." },
    { title: "Team leaderboards", description: "Compete with friends or your gym team on weekly volume, PRs, and consistency leaderboards." },
    { title: "Nutrition scanner integration", description: "Instantly log macro-nutrients by scanning barcodes or meal photos directly within the app." },
    { title: "Wearable haptic feedback", description: "Receive gentle wrist vibrations from your watch to signal optimal rest intervals and pacing." }
]

const smartTrackingFeatures = [
    { title: "Auto-RPE calculation", description: "Automatically calculate Rate of Perceived Exertion based on your bar speed and previous performance." },
    { title: "Superset & Dropset support", description: "Seamlessly log supersets, dropsets, and giant sets without cluttering your workout/activity feed." },
    { title: "Previous history lookup", description: "Quickly view past performance on any exercise while you stick to your current session flow." },
    { title: "Rest timer auto-start", description: "Rest timer starts automatically the moment you check off a set, keeping your intensity high." },
    { title: "Plate calculator", description: "Never do gym math again. Visual plate breakdown tells you exactly what to load on the bar." }
]

const analyticsFeatures = [
    { title: "Volume per muscle group", description: "Track weekly volume per muscle group to ensure balanced hypertrophy and prevent overtraining." },
    { title: "1RM Projections", description: "Estimate your one-rep max for major lifts based on sub-maximal efforts and trend lines." },
    { title: "Strength balance charts", description: "Identify left/right asymmetries and agonist/antagonist muscle imbalances to reduce injury risk." },
    { title: "Consistency heatmaps", description: "GitHub-style contribution graphs for your workouts. Keep the streak alive and stay consistent." },
    { title: "Personal Record timeline", description: "Visual timeline of your personal records. See how far you've come over months and years." }
]

const communityFeatures = [
    { title: "Join monthly challenges", description: "Participate in global community challenges like 'Squattember' or 'Push-up Pro' to win badges." },
    { title: "Share workout templates", description: "Create and share your favorite workout routines with the community or download pro templates." },
    { title: "Friend activity feed", description: "See when your friends hit a PR or finish a workout. Give kudos and stay connected." },
    { title: "Comparison leaderboards", description: "Compare your strength standards against user benchmarks age, weight, and experience level." },
    { title: "Achievement badges", description: "Unlock achievements for milestones like '1000lb Club', 'Early Bird', or 'Consistency King'." }
]

export default function FeaturesSection() {
    const [selectedFeature, setSelectedFeature] = useState<FeatureDetail | null>(null);

    return (
        <div className="w-full flex flex-col justify-center items-center bg-[#F7F5F3] border-b border-[rgba(55,50,47,0.12)] relative">

            {/* Modal Layer */}
            {selectedFeature && (
                <FeatureDetailModal
                    feature={selectedFeature}
                    onClose={() => setSelectedFeature(null)}
                />
            )}

            <div className="w-full max-w-[1060px] border-l border-r border-[rgba(55,50,47,0.12)] ">

                {/* Header Section */}
                <div className="w-full relative border-b border-[rgba(55,50,47,0.12)] py-12 px-6 sm:px-12 flex flex-col items-center text-center">
                    <h2 className="text-[#37322F] text-3xl md:text-5xl font-semibold leading-tight font-sans tracking-tight mb-2">
                        Powerful capabilities
                    </h2>
                    <p className="text-[#605A57] text-lg font-medium font-sans max-w-2xl">
                        Everything you need to build your dream physique, track your progress, and stay consistent.
                    </p>
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                        <div className="w-full h-full relative">
                            {Array.from({ length: 300 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute h-4 w-full rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
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

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    <FeatureColumn
                        title="Request Features"
                        features={requestFeatures}
                        isRequestColumn={true}
                        onFeatureClick={setSelectedFeature}
                    />
                    <FeatureColumn
                        title="Smart Tracking"
                        features={smartTrackingFeatures}
                        onFeatureClick={setSelectedFeature}
                    />
                    <FeatureColumn
                        title="Analytics"
                        features={analyticsFeatures}
                        onFeatureClick={setSelectedFeature}
                    />
                    <FeatureColumn
                        title="Community"
                        features={communityFeatures}
                        onFeatureClick={setSelectedFeature}
                    />
                </div>
            </div>
        </div>
    )
}
