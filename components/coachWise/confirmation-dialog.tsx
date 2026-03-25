"use client"

import * as React from "react"
import { IconAlertTriangle, IconTrash } from "@tabler/icons-react"
import { X } from "lucide-react"

import { overflowActionsMenuSurfaceClassName } from "@/components/coachWise/overflow-actions-menu"
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

type CoachWiseConfirmationDialogProps = {
  title: string
  description: string
  trigger: React.ReactNode
  onConfirm: () => void | Promise<void>
  confirmLabel?: string
  cancelLabel?: string
  variant?: "default" | "destructive"
}

export function CoachWiseConfirmationDialog({
  title,
  description,
  trigger,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
}: CoachWiseConfirmationDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)
  const isDestructive = variant === "destructive"
  const AccentIcon = isDestructive ? IconTrash : IconAlertTriangle

  const handleOverlayClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()

      if (!isPending) {
        setOpen(false)
      }
    },
    [isPending]
  )

  const handleConfirm = React.useCallback(async () => {
    setIsPending(true)

    try {
      await onConfirm()
      setOpen(false)
    } finally {
      setIsPending(false)
    }
  }, [onConfirm])

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !isPending && setOpen(nextOpen)}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
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
        onPointerDownOutside={(event) => {
          event.preventDefault()
        }}
        onInteractOutside={(event) => {
          event.preventDefault()
        }}
        className={cn(
          overflowActionsMenuSurfaceClassName,
          "w-full max-w-[calc(100%-2rem)] gap-0 overflow-hidden border-white/70 p-0 pt-2 sm:max-w-[360px]",
          isDestructive
            ? "bg-white shadow-[0_24px_80px_rgba(244,63,94,0.16)]"
            : "bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]"
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
        <DialogHeader className="items-center gap-0 px-6 pt-7 pb-3 text-center">
          <div className="relative mb-4 flex items-center justify-center">
            <div
              className={cn(
                "absolute size-16 rounded-full blur-xl",
                isDestructive ? "bg-rose-200/75" : "bg-neutral-200/70"
              )}
            />
            <div
              className={cn(
                "relative z-10 flex size-14 items-center justify-center rounded-full border",
                isDestructive
                  ? "border-rose-200/80 bg-rose-50/90"
                  : "border-neutral-200/80 bg-neutral-50/90"
              )}
            >
              <AccentIcon
                className={cn(
                  "size-8",
                  isDestructive ? "text-rose-500" : "text-neutral-600"
                )}
              />
            </div>
            {isDestructive ? (
              <>
                <span className="absolute -top-1 left-1 h-1 w-1 rounded-full bg-rose-300" />
                <span className="absolute top-2 -right-2 h-1.5 w-1.5 rounded-full bg-rose-400" />
                <span className="absolute bottom-1 -left-2 h-1 w-1 rounded-full bg-rose-300" />
                <span className="absolute -right-1 bottom-0 h-1 w-1 rounded-full bg-rose-200" />
              </>
            ) : null}
          </div>
          <DialogTitle className="text-[22px] font-semibold text-center text-neutral-950">
            {title}
          </DialogTitle>
          <DialogDescription className="mt-1 max-w-[260px] text-center text-[13px] leading-5 text-neutral-500">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-2 gap-3 px-6 pb-4 pt-2 sm:grid-cols-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              className={cn(
                "h-11 w-full cursor-pointer rounded-sm border shadow-none",
                isDestructive
                  ? "border-neutral-300/80 bg-neutral-100/80 text-neutral-700 hover:bg-neutral-200/80"
                  : "border-neutral-200/80 bg-neutral-50/70 text-neutral-700 hover:bg-neutral-100/80"
              )}
            >
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={isPending}
            onClick={() => void handleConfirm()}
            className={cn(
              "h-11 w-full cursor-pointer rounded-sm border shadow-none transition-colors",
              isDestructive
                ? "border-rose-500 bg-rose-500 text-white hover:border-rose-600 hover:bg-rose-600"
                : "border-brand-600 bg-brand-600 text-white hover:border-brand-700 hover:bg-brand-700"
            )}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
