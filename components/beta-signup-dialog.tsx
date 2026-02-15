"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { X } from "lucide-react"
import { toast } from "sonner"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import ButtonRotatingGradient from "@/components/ui/buttons/ButtonRotatingGradient"
import { useTranslations } from "next-intl"
import { sendBetaSignupEmail } from "@/app/actions/beta-signup"
import type { FormState } from "@/lib/validations"

// ── Submit button with pending state via useFormStatus ───────────────────────
function SubmitButton({ label, sendingLabel }: { label: string; sendingLabel: string }) {
    const { pending } = useFormStatus()
    return (
        <ButtonRotatingGradient type="submit" className="w-full h-11" disabled={pending}>
            {pending ? sendingLabel : label}
        </ButtonRotatingGradient>
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
    const [state, formAction] = useActionState<FormState, FormData>(sendBetaSignupEmail, null)
    const formRef = useRef<HTMLFormElement>(null)

    // Local state for controlled UI elements (platform buttons + trainer toggle)
    const [platform, setPlatform] = useState<"ios" | "android" | "both" | null>(null)
    const [isTrainer, setIsTrainer] = useState(false)

    // Show toast and reset form when server action returns
    useEffect(() => {
        if (!state) return

        if (state.success) {
            toast.success(state.message ?? t('successMessage'))
            formRef.current?.reset()
            setPlatform(null)
            setIsTrainer(false)
        } else if (state.errors?._form) {
            state.errors._form.forEach((msg) => toast.error(msg))
        }
    }, [state, t])

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
                className="md:min-w-[460px] max-h-[550px] md:max-w-[460px] w-[96vw] md:w-full border border-surface-200 bg-card dark:bg-card rounded-2xl p-0 shadow-(--shadow-xl) overflow-hidden h-fit gap-y-0"
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
                    {/* Title — Apple HIG Title 3 */}
                    <DialogTitle className="text-title-3 font-semibold text-center text-surface-900 mb-(--space-1)">
                        {t('title')}
                    </DialogTitle>

                    {/* Description — Apple HIG footnote */}
                    <p className="text-center text-surface-500 text-footnote mb-(--space-5) leading-relaxed">
                        {t('description')}
                    </p>

                    {/* Form */}
                    <form ref={formRef} action={formAction} className="space-y-(--space-4)">
                        {/* Honeypot — hidden from humans, traps bots */}
                        <div className="absolute opacity-0 -z-10 pointer-events-none" aria-hidden="true">
                            <label htmlFor="website">Website</label>
                            <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
                        </div>

                        {/* Hidden inputs for platform and isTrainer (controlled by buttons) */}
                        <input type="hidden" name="platform" value={platform ?? ""} />
                        <input type="hidden" name="isTrainer" value={isTrainer ? "true" : "false"} />

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-caption-1 font-medium text-surface-600 mb-(--space-1)">
                                {t('emailLabel')}
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder={t('emailPlaceholder')}
                                required
                                className="w-full px-(--space-3) py-(--space-2) rounded-lg border border-surface-200 dark:border-surface-300 bg-card dark:bg-surface-100 text-surface-900 text-subheadline placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors duration-(--duration-fast) ease-(--ease-apple)"
                            />
                            {state?.errors?.email && (
                                <p className="mt-1 text-caption-2 text-red-500">{state.errors.email[0]}</p>
                            )}
                        </div>

                        {/* Platform Selection */}
                        <div>
                            <label className="block text-caption-1 font-medium text-surface-600 mb-(--space-1)">
                                {t('platformLabel')}
                            </label>
                            <div className="grid grid-cols-3 gap-(--space-2)">
                                {[
                                    {
                                        value: "ios", label: t('ios'), icon: (
                                            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                            </svg>
                                        )
                                    },
                                    {
                                        value: "android", label: t('android'), icon: (
                                            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-1.2-.57-2.56-.89-3.97-.89s-2.77.32-3.97.89L6.65 5.67c-.18-.28-.54-.37-.83-.22-.3.16-.42.54-.26.85l1.84 3.18C4.65 11.01 2.77 13.71 2 17h20c-.77-3.29-2.65-5.99-4.4-7.52zm-9.1 4.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm7 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                                            </svg>
                                        )
                                    },
                                    {
                                        value: "both", label: t('both'), icon: (
                                            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                                        className={`flex flex-col items-center gap-(--space-1) px-(--space-2) py-(--space-2) rounded-lg border transition-colors duration-(--duration-fast) ease-(--ease-apple) ${platform === item.value
                                            ? "border-brand-500 bg-brand-50 dark:bg-brand-500/20 text-brand-500"
                                            : "border-surface-200 dark:border-surface-300 bg-card dark:bg-surface-100 text-surface-500 hover:border-surface-300 dark:hover:border-surface-400 hover:text-surface-600"
                                            }`}
                                    >
                                        {item.icon}
                                        <span className="text-caption-1 font-medium">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                            {state?.errors?.platform && (
                                <p className="mt-1 text-caption-2 text-red-500">{state.errors.platform[0]}</p>
                            )}
                        </div>

                        {/* Trainer Checkbox */}
                        <div className="flex items-center gap-(--space-2) py-(--space-1)">
                            <button
                                type="button"
                                onClick={() => setIsTrainer(!isTrainer)}
                                className={`size-4 rounded border flex items-center justify-center transition-colors duration-(--duration-fast) ease-(--ease-apple) shrink-0 ${isTrainer
                                    ? "bg-brand-500 border-brand-500"
                                    : "border-surface-300 dark:border-surface-400 bg-card dark:bg-surface-100 hover:border-surface-400 dark:hover:border-surface-500"
                                    }`}
                            >
                                {isTrainer && (
                                    <svg className="size-2.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M2 6l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                            <label
                                onClick={() => setIsTrainer(!isTrainer)}
                                className="text-subheadline text-surface-600 cursor-pointer select-none"
                            >
                                {t('trainerLabel')}
                            </label>
                        </div>

                        {/* Submit Button — pending state via useFormStatus */}
                        <SubmitButton label={t('submitButton')} sendingLabel={t('sending')} />
                    </form>

                    {/* Privacy Note */}
                    <p className="mt-(--space-3) text-center text-caption-2 text-surface-500">
                        {t('privacyNote')}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
