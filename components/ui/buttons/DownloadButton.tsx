"use client"

import BetaSignupDialog from "@/components/beta-signup-dialog"
import { forwardRef, useState } from "react"

interface DownloadButtonProps {
    text?: string
    openBetaDialog?: boolean
    className?: string
    onClick?: () => void
}

const DownloadButton = forwardRef<HTMLButtonElement, DownloadButtonProps>(
    ({ text = "Download for free", openBetaDialog = false, className = "", onClick }, ref) => {
        const [isDialogOpen, setIsDialogOpen] = useState(false)

        const handleClick = () => {
            if (openBetaDialog) {
                setIsDialogOpen(true)
            }
            onClick?.()
        }

        const buttonContent = (
            <button
                ref={ref}
                type="button"
                onClick={handleClick}
                className={`
                    relative min-h-11 px-(--space-6) py-(--space-1\.5) overflow-hidden rounded-full
                    inline-flex justify-center items-center cursor-pointer
                    bg-surface-900 hover:bg-surface-950 active:scale-[0.97]
                    shadow-[inset_0_0_0_2.5px_rgba(255,255,255,0.08)]
                    dark:shadow-[inset_0_0_0_2.5px_rgba(0,0,0,0.06)]
                    transition-all duration-(--duration-fast) ease-(--ease-apple)
                    focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:outline-none
                    ${className}
                `}
            >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/10 dark:to-white/5 mix-blend-multiply dark:mix-blend-screen pointer-events-none" />

                {/* Label — Apple HIG footnote (13px) + semibold */}
                <span className="relative z-(--z-raised) text-footnote font-semibold text-surface-50 font-sans antialiased">
                    {text}
                </span>
            </button>
        )

        if (openBetaDialog) {
            return (
                <>
                    {buttonContent}
                    <BetaSignupDialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                    />
                </>
            )
        }

        return buttonContent
    }
)

DownloadButton.displayName = "DownloadButton"

export default DownloadButton
