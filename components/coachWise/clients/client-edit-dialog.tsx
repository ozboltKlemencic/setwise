"use client"

import * as React from "react"
import { UserRound, X } from "lucide-react"
import { toast } from "sonner"

import {
  ClientFormFields,
  type ClientFormValues,
} from "@/components/coachWise/clients/client-form-fields"
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
import { cn } from "@/lib/utils"

export type ClientEditFormValues = ClientFormValues

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
  const [portalContainerElement, setPortalContainerElement] =
    React.useState<HTMLDivElement | null>(null)
  const [form, setForm] = React.useState<ClientEditFormValues>({
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
    form.email.trim().length > 0

  const handleFieldChange = React.useCallback(
    <K extends keyof ClientFormValues>(field: K, value: ClientFormValues[K]) => {
      setForm((current) => ({ ...current, [field]: value }))
    },
    []
  )

  const handleSubmit = React.useCallback(async () => {
    if (!canSubmit) {
      return
    }

    setIsPending(true)

    try {
      await onSave?.(form)
      toast.success("Client details were updated.", {
        description: `For ${`${form.firstName} ${form.lastName}`.trim()}.`,
      })
      setOpen(false)
    } finally {
      setIsPending(false)
    }
  }, [canSubmit, form, onSave])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <PrimaryActionButton label="Edit client" />}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        portalContainerRef={setPortalContainerElement}
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

        <ClientFormFields
          values={form}
          onFieldChange={handleFieldChange}
          container={portalContainerElement}
          className="px-5 py-4"
        />

        <DialogFooter className="border-t border-neutral-200/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-end">
          <DialogClose asChild>
            <SecondaryActionButton label="Cancel" disabled={isPending} />
          </DialogClose>
          <PrimaryActionButton
            type="button"
            label="Save changes"
            disabled={!canSubmit || isPending}
            onClick={() => void handleSubmit()}
            className="border border-brand-600 bg-brand-600 hover:border-brand-700 hover:bg-brand-700 disabled:opacity-45"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
