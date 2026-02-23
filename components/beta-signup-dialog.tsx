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
import { useTranslations } from "next-intl"

interface InstallCardProps {
    href: string
    icon: React.ReactNode
    title: string
    linkText: string
}

function InstallCard({ href, icon, title, linkText }: InstallCardProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-(--space-3) px-(--space-4) py-(--space-3) rounded-xl bg-surface-50 dark:bg-surface-100 border   border-surface-300 dark:border-surface-400  duration-300 ease-(--ease-apple) group focus:scale-[98%]  transition-all "
        >
            <div className="size-10 md:size-14 rounded-lg bg-white dark:bg-surface-200 flex items-center justify-center shrink-0 shadow-sm">
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="text-subheadline font-semibold text-surface-900">{title}</span>
                <span className="text-caption-1 text-brand-500 group-hover:underline">{linkText}</span>
            </div>
        </a>
    )
}

interface BetaSignupDialogProps {
    trigger?: React.ReactNode
    onOpen?: () => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export default function BetaSignupDialog({ trigger, onOpen, open, onOpenChange }: BetaSignupDialogProps) {
    const t = useTranslations("BetaSignup")
    const [internalOpen, setInternalOpen] = useState(false)

    const handleOpenChange = (isOpen: boolean) => {
        if (open === undefined) {
            setInternalOpen(isOpen)
        }
        if (isOpen && onOpen) onOpen()
        if (onOpenChange) onOpenChange(isOpen)
    }
    const isControlled = open !== undefined

    const ANDROID_URL = "https://play.google.com/store/apps/details?id=com.jernejpeternel.myfit"
    const IOS_URL = "https://testflight.apple.com/join/k6jPwayN"

    return (
        <Dialog
            open={isControlled ? open : internalOpen}
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
                className="md:min-w-[460px] md:max-w-[460px] w-[96vw] md:w-full border border-surface-200 bg-card dark:bg-card rounded-2xl p-0 shadow-(--shadow-xl) overflow-hidden h-fit gap-y-0"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-(--space-5) py-(--space-2) border-b border-surface-200/60 dark:border-surface-300/60">
                    <div className="flex items-center gap-(--space-2)">
                        <img
                            src="/setwise-logo.png"
                            alt="SetWise"
                            className="size-6 rounded-sm"
                        />
                        <span className="text-subheadline font-semibold text-surface-900">SetWise</span>
                    </div>
                    <DialogClose className="size-7 flex items-center justify-center rounded-full hover:bg-surface-100 dark:hover:bg-surface-300 transition-colors duration-(--duration-fast) ease-(--ease-apple) text-surface-500 hover:text-surface-700">
                        <X className="size-4" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </div>

                {/* Content */}
                <div className="px-(--space-5) py-(--space-6)">
                    {/* Title */}
                    <DialogTitle className="text-title-3 font-semibold text-center text-surface-900 mb-(--space-1)">
                        {t('title')}
                    </DialogTitle>

                    {/* Description */}
                    <p className="text-center text-surface-500 text-footnote mb-(--space-5) leading-relaxed">
                        {t('description')}
                    </p>

                    {/* Install Cards */}
                    <div className="flex flex-col mt-(--space-6) gap-(--space-3)">
                        <InstallCard
                            href={ANDROID_URL}
                            icon={
                                <svg className="size-6" viewBox="0 0 24 24" fill="#3DDC84">
                                    <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-1.2-.57-2.56-.89-3.97-.89s-2.77.32-3.97.89L6.65 5.67c-.18-.28-.54-.37-.83-.22-.3.16-.42.54-.26.85l1.84 3.18C4.65 11.01 2.77 13.71 2 17h20c-.77-3.29-2.65-5.99-4.4-7.52zm-9.1 4.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm7 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                                </svg>
                            }
                            title={t('androidInstallTitle')}
                            linkText={t('androidInstallLink')}
                        />
                        <InstallCard
                            href={IOS_URL}
                            icon={
                                <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                </svg>
                            }
                            title={t('iosInstallTitle')}
                            linkText={t('iosInstallLink')}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

