"use client"

import * as React from "react"
import { UserRound, X } from "lucide-react"

import { overflowActionsMenuSurfaceClassName } from "@/components/coachWise/overflow-actions-menu"
import { PrimaryActionButton } from "@/components/coachWise/primary-action-button"
import { SecondaryActionButton } from "@/components/coachWise/secondary-action-button"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type ClientEditFormValues = {
  firstName: string
  lastName: string
  email: string
  phone: string
  status: string
  phase: string
}

type ClientEditDialogProps = {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  status: string
  phase: string
  trigger?: React.ReactNode
  onSave?: (values: ClientEditFormValues) => void | Promise<void>
}

function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label className="text-[13px] font-medium text-neutral-800">
      {children}
      {required ? <span className="ml-1 text-rose-500">*</span> : null}
    </label>
  )
}

export function ClientEditDialog({
  firstName,
  lastName,
  email,
  phone,
  status,
  phase,
  trigger,
  onSave,
}: ClientEditDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)
  const [contentElement, setContentElement] = React.useState<HTMLDivElement | null>(null)
  const showEmailField = email !== undefined
  const showPhoneField = phone !== undefined
  const [form, setForm] = React.useState({
    firstName,
    lastName,
    email: email ?? "",
    phone: phone ?? "",
    status,
    phase,
  })

  const handleOverlayClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      if (!isPending) {
        setOpen(false)
      }
    },
    [isPending]
  )

  React.useEffect(() => {
    if (open) {
      setForm({
        firstName,
        lastName,
        email: email ?? "",
        phone: phone ?? "",
        status,
        phase,
      })
    }
  }, [email, firstName, lastName, open, phone, phase, status])

  const canSubmit =
    form.firstName.trim().length > 0 &&
    form.lastName.trim().length > 0 &&
    (!showEmailField || form.email.trim().length > 0)

  const handleSubmit = React.useCallback(async () => {
    if (!canSubmit) {
      return
    }

    setIsPending(true)

    try {
      await onSave?.(form)
      setOpen(false)
    } finally {
      setIsPending(false)
    }
  }, [canSubmit, form, onSave])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" className="border-transparent bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700">
            Edit client
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        ref={setContentElement}
        showCloseButton={false}
        overlayProps={{
          onClick: handleOverlayClick,
          onMouseDown: (event) => {
            event.stopPropagation()
          },
          onPointerDown: (event) => {
            event.stopPropagation()
          },
        }}
        onClick={(event) => {
          event.stopPropagation()
        }}
        onMouseDown={(event) => {
          event.stopPropagation()
        }}
        onPointerDown={(event) => {
          event.stopPropagation()
        }}
        onPointerDownOutside={(event) => {
          event.preventDefault()
        }}
        onInteractOutside={(event) => {
          event.preventDefault()
        }}
        className={cn(
          overflowActionsMenuSurfaceClassName,
          "w-full max-w-[calc(100%-2rem)] gap-0 overflow-hidden border-white/70 bg-white p-0 shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:max-w-[520px]"
        )}
      >
        <DialogClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={isPending}
            className="absolute top-3 right-3 z-20 size-8 cursor-pointer rounded-md text-neutral-400 shadow-none hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="size-4" />
            <span className="sr-only">Close dialog</span>
          </Button>
        </DialogClose>

        <DialogHeader className="gap-0 border-b border-neutral-200/80 px-5 pt-5 pb-4 text-left">
          <div className="flex items-start gap-3 pr-10">
            <div className="flex size-10 items-center justify-center rounded-md border border-neutral-200/80 bg-neutral-50/90 text-neutral-600">
              <UserRound className="size-[18px]" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-[16px] font-semibold text-neutral-950">
                Edit client
              </DialogTitle>
              <DialogDescription className="text-[13px] leading-5 text-neutral-500">
                Update client details, status, and phase.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-4 px-5 py-4 md:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel required>First name</FieldLabel>
            <Input
              value={form.firstName}
              onChange={(event) =>
                setForm((current) => ({ ...current, firstName: event.target.value }))
              }
              className="h-10 rounded-sm border-neutral-200/80 bg-white text-[14px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2">
            <FieldLabel required>Last name</FieldLabel>
            <Input
              value={form.lastName}
              onChange={(event) =>
                setForm((current) => ({ ...current, lastName: event.target.value }))
              }
              className="h-10 rounded-sm border-neutral-200/80 bg-white text-[14px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
            />
          </div>

          {showEmailField ? (
            <div className="space-y-2 md:col-span-2">
              <FieldLabel required>Email</FieldLabel>
              <Input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
                className="h-10 rounded-sm border-neutral-200/80 bg-white text-[14px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
              />
            </div>
          ) : null}

          {showPhoneField ? (
            <div className="space-y-2">
              <FieldLabel>Phone</FieldLabel>
              <Input
                value={form.phone}
                onChange={(event) =>
                  setForm((current) => ({ ...current, phone: event.target.value }))
                }
                placeholder="+386 40 000 000"
                className="h-10 rounded-sm border-neutral-200/80 bg-white text-[14px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
              />
            </div>
          ) : null}

          <div className={cn("space-y-2", !showPhoneField && "md:col-span-1")}>
            <FieldLabel>Status</FieldLabel>
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm((current) => ({ ...current, status: value }))
              }
            >
              <SelectTrigger className="h-10 rounded-sm border-neutral-200/80 bg-white text-[14px] shadow-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                container={contentElement}
                className="rounded-sm border-neutral-200/80 shadow-lg shadow-black/5"
              >
                <SelectItem value="Aktiven">Active</SelectItem>
                <SelectItem value="Onboarding">Onboarding</SelectItem>
                <SelectItem value="Na pavzi">Paused</SelectItem>
                <SelectItem value="Zakljucen">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={cn("space-y-2", showPhoneField ? "md:col-span-2" : "md:col-span-1")}>
            <FieldLabel>Phase</FieldLabel>
            <Select
              value={form.phase}
              onValueChange={(value) =>
                setForm((current) => ({ ...current, phase: value }))
              }
            >
              <SelectTrigger className="h-10 rounded-sm border-neutral-200/80 bg-white text-[14px] shadow-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                container={contentElement}
                className="rounded-sm border-neutral-200/80 shadow-lg shadow-black/5"
              >
                <SelectItem value="Bulk">Bulk</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Cut">Cut</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="border-t border-neutral-200/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <DialogClose asChild>
            <SecondaryActionButton
              label="Cancel"
              disabled={isPending}
            />
          </DialogClose>
          <PrimaryActionButton
            type="button"
            label="Save changes"
            disabled={!canSubmit || isPending}
            onClick={() => void handleSubmit()}
            className="cursor-pointer rounded-sm border border-brand-600 bg-brand-600 hover:border-brand-700 hover:bg-brand-700 disabled:opacity-45"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
