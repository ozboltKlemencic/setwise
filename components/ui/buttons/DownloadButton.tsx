"use client"

import BetaSignupDialog from "@/components/beta-signup-dialog"
import { forwardRef, useState } from "react"


interface DownloadButtonProps {
    text?: string
    openBetaDialog?: boolean
    className?: string
    onClick?: () => void
}

const DownloadButton = forwardRef<HTMLDivElement, DownloadButtonProps>(
    ({ text = "Download for free", openBetaDialog = false, className = "", onClick }, ref) => {
        const [isDialogOpen, setIsDialogOpen] = useState(false)

        const handleClick = () => {
            if (openBetaDialog) {
                setIsDialogOpen(true)
            }
            onClick?.()
        }

        const buttonContent = (
            <div
                ref={ref}
                onClick={handleClick}
                className={`h-10 px-12 py-[6px] relative bg-[#37322F] shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-[#2A2520] transition-colors ${className}`}
            >
                <div className="w-44 h-[41px] absolute left-0 top-0 bg-linear-to-b from-[rgba(255,255,255,0)] to-[rgba(0,0,0,0.10)] mix-blend-multiply"></div>
                <div className="flex flex-col justify-center text-white text-[13px] font-medium leading-5 font-sans">
                    {text}
                </div>
            </div>
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
