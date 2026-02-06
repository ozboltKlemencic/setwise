"use client"

import BetaSignupDialog from "@/components/beta-signup-dialog"
import { forwardRef, useState } from "react"


interface WhiteBtnProps {
    text?: string
    openBetaDialog?: boolean
    className?: string
    onClick?: () => void
}

const WhiteBtn = forwardRef<HTMLDivElement, WhiteBtnProps>(
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
                className={`  relative  overflow-hidden  flex justify-center items-center cursor-pointer bg-white text-[#1A62FF] hover:bg-gray-100 transition-colors py-2.5 md:py-3 px-5 md:px-6 rounded-full font-medium   ${className}`}
            >
                <div className="flex flex-col justify-center text-[#1A62FF] text-sm sm:text-base md:text-lg   font-medium leading-5 font-sans">
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

WhiteBtn.displayName = "WhiteBtn"

export default WhiteBtn
