"use client"

import { useState } from "react"
import { X } from "lucide-react"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"

interface BetaSignupDialogProps {
    trigger?: React.ReactNode
    onOpen?: () => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export default function BetaSignupDialog({ trigger, onOpen, open, onOpenChange }: BetaSignupDialogProps) {
    const [email, setEmail] = useState("")
    const [platform, setPlatform] = useState<"ios" | "android" | "both" | null>(null)
    const [isTrainer, setIsTrainer] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log({
            email,
            platform,
            isTrainer
        })
    }

    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen && onOpen) onOpen()
        if (onOpenChange) onOpenChange(isOpen)
    }
    // If open prop is provided, use controlled mode; otherwise uncontrolled
    const isControlled = open !== undefined

    return (
        <Dialog
            open={isControlled ? open : undefined}
            onOpenChange={handleOpenChange}
        >
            {trigger && (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            )}
            <DialogContent
                showCloseButton={false}
                onOpenAutoFocus={(e) => e.preventDefault()}
                className="md:min-w-[460px] md:max-w-[460px] w-[96vw] md:w-full border border-neutral-200/80 bg-white rounded-2xl p-0 shadow-xl shadow-black/5 overflow-hidden h-fit gap-y-0"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-2.5 border-b border-neutral-100">
                    <div className="flex items-center gap-2">
                        <img
                            src="/setwise-logo.png"
                            alt="SetWise"
                            className="size-6 rounded-sm "
                        />
                        <span className="text-sm font-semibold text-neutral-900">SetWise</span>
                    </div>
                    <DialogClose className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-neutral-600">
                        <X className="w-4 h-4" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </div>

                {/* Content */}
                <div className="px-5 py-6 ">
                    {/* Title */}
                    <DialogTitle className="text-xl font-semibold text-center text-neutral-900 mb-1.5">
                        Get Early Access
                    </DialogTitle>

                    {/* Description */}
                    <p className="text-center text-neutral-500 text-sm mb-5 leading-relaxed">
                        Join our exclusive beta program and be among the first to experience the future of workout tracking. Get early access to features, provide feedback, and help shape the app.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-xs font-medium text-neutral-600 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 bg-white text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>

                        {/* Platform Selection */}
                        <div>
                            <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                                Platform
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    {
                                        value: "ios", label: "iOS", icon: (
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                            </svg>
                                        )
                                    },
                                    {
                                        value: "android", label: "Android", icon: (
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-1.2-.57-2.56-.89-3.97-.89s-2.77.32-3.97.89L6.65 5.67c-.18-.28-.54-.37-.83-.22-.3.16-.42.54-.26.85l1.84 3.18C4.65 11.01 2.77 13.71 2 17h20c-.77-3.29-2.65-5.99-4.4-7.52zm-9.1 4.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm7 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                                            </svg>
                                        )
                                    },
                                    {
                                        value: "both", label: "Both", icon: (
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                                                <line x1="12" y1="18" x2="12.01" y2="18" />
                                            </svg>
                                        )
                                    }
                                ].map((item) => (
                                    <button
                                        key={item.value}
                                        type="button"
                                        onClick={() => setPlatform(item.value as "ios" | "android" | "both")}
                                        className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg border transition-all ${platform === item.value
                                            ? "border-blue-500 bg-blue-50/50 text-blue-600"
                                            : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:text-neutral-600"
                                            }`}
                                    >
                                        {item.icon}
                                        <span className="text-xs font-medium">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Trainer Checkbox */}
                        <div className="flex items-center gap-2.5 py-1">
                            <button
                                type="button"
                                onClick={() => setIsTrainer(!isTrainer)}
                                className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${isTrainer
                                    ? "bg-blue-600 border-blue-600"
                                    : "border-neutral-300 bg-white hover:border-neutral-400"
                                    }`}
                            >
                                {isTrainer && (
                                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M2 6l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                            <label
                                onClick={() => setIsTrainer(!isTrainer)}
                                className="text-sm text-neutral-600 cursor-pointer select-none"
                            >
                                I&apos;m a trainer or coach
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full relative inline-flex h-11 overflow-hidden rounded-full p-[2px]"
                        >
                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ccdbfc_0%,#155dfc_60%,#ccdbfc_100%)]" />
                            <span className="relative inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-blue-600 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                                Get Beta Access
                            </span>
                        </button>
                    </form>

                    {/* Privacy Note */}
                    <p className="mt-3 text-center text-[11px] text-neutral-400">
                        We&apos;ll notify you when your spot is ready. No spam.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
