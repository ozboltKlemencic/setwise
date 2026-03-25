"use client"

import * as React from "react"
import type { ReactNode } from "react"
import { CheckSquare, FileText, Maximize2, Pencil, X } from "lucide-react"

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
import { cn } from "@/lib/utils"

export type ClientNoteItem = {
  id: string
  title: string
  body: string[]
  date: string
  private: boolean
}

function useDialogCloseOnXOnly() {
  const handleOverlayClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
    },
    []
  )

  return {
    overlayProps: {
      onClick: handleOverlayClick,
      onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
      },
      onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => {
        event.stopPropagation()
      },
    },
    onClick: (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation()
    },
    onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation()
    },
    onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => {
      event.stopPropagation()
    },
    onPointerDownOutside: (event: Event) => {
      event.preventDefault()
    },
    onInteractOutside: (event: Event) => {
      event.preventDefault()
    },
    onEscapeKeyDown: (event: KeyboardEvent) => {
      event.preventDefault()
    },
  }
}

function NotesDialogCard({ note }: { note: ClientNoteItem }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-100/75">
      <div className="px-3.5 pt-3.5">
        <h3 className="text-[15px] font-semibold text-neutral-950">{note.title}</h3>
      </div>
      <div className="space-y-1.5 px-3.5 pb-3.5 pt-2 text-[13.5px] leading-6 text-neutral-700">
        {note.body.length > 1 ? (
          note.body.map((line) => (
            <p key={line} className="pl-4 -indent-4">
              - {line}
            </p>
          ))
        ) : (
          <p>{note.body[0]}</p>
        )}
      </div>
      <div className="rounded-b-xl border-t border-neutral-200 px-3.5 py-2.5 text-[12.5px] text-neutral-500">
        <span>{note.date}</span>
      </div>
    </div>
  )
}

export function ClientNotesOverviewDialog({
  notes,
  trigger,
}: {
  notes: ClientNoteItem[]
  trigger?: ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const closeOnlyOnXDialogProps = useDialogCloseOnXOnly()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <SecondaryActionButton
            label={<span className="sr-only">Open notes overview</span>}
            icon={Maximize2}
            aria-label="Open notes overview"
            className="size-7 px-0"
            iconClassName="size-3.5"
          />
        )}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        {...closeOnlyOnXDialogProps}
        className={cn(
          overflowActionsMenuSurfaceClassName,
          "w-full max-w-[calc(100%-2rem)] gap-0 overflow-hidden border-white/70 bg-white p-0 shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:max-w-[720px]"
        )}
      >
        <DialogClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute top-3 right-3 z-20 size-8 cursor-pointer rounded-md text-neutral-400 shadow-none hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="size-4" />
            <span className="sr-only">Close dialog</span>
          </Button>
        </DialogClose>

        <DialogHeader className="gap-0 border-b border-neutral-200/80 px-5 pt-5 pb-4 text-left">
          <div className="flex items-start gap-3 pr-10">
            <div className="flex size-10 items-center justify-center rounded-md border border-neutral-200/80 bg-neutral-50/90 text-neutral-600">
              <FileText className="size-[18px]" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-[16px] font-semibold text-neutral-950">
                Client notes
              </DialogTitle>
              <DialogDescription className="text-[13px] leading-5 text-neutral-500">
                Review all saved notes and coaching context for this client.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-4 [scrollbar-width:thin]">
          {notes.map((note) => (
            <NotesDialogCard key={`${note.title}-${note.date}`} note={note} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ClientAddNoteDialog({
  trigger,
  onAdd,
}: {
  trigger?: ReactNode
  onAdd?: (values: { title: string; description: string }) => void | Promise<void>
}) {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [isPending, setIsPending] = React.useState(false)
  const closeOnlyOnXDialogProps = useDialogCloseOnXOnly()

  const resetForm = React.useCallback(() => {
    setTitle("")
    setDescription("")
  }, [])

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen)

      if (!nextOpen) {
        resetForm()
      }
    },
    [resetForm]
  )

  const canSubmit = title.trim().length > 0 && description.trim().length > 0
  const handleCancel = React.useCallback(() => {
    resetForm()
  }, [resetForm])
  const handleSubmit = React.useCallback(async () => {
    if (!canSubmit) {
      return
    }

    setIsPending(true)

    try {
      await onAdd?.({
        title: title.trim(),
        description: description.trim(),
      })
      handleOpenChange(false)
    } finally {
      setIsPending(false)
    }
  }, [canSubmit, description, handleOpenChange, onAdd, title])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <SecondaryActionButton
            label="Add Note"
            icon={CheckSquare}
            className="h-8"
            iconClassName="size-3.5"
          />
        )}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        {...closeOnlyOnXDialogProps}
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
            className="absolute top-3 right-3 z-20 size-8 cursor-pointer rounded-md text-neutral-400 shadow-none hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="size-4" />
            <span className="sr-only">Close dialog</span>
          </Button>
        </DialogClose>

        <DialogHeader className="gap-0 border-b border-neutral-200/80 px-5 pt-5 pb-4 text-left">
          <div className="flex items-start gap-3 pr-10">
            <div className="flex size-10 items-center justify-center rounded-md border border-neutral-200/80 bg-neutral-50/90 text-neutral-600">
              <CheckSquare className="size-[18px]" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-[16px] font-semibold text-neutral-950">
                Add note
              </DialogTitle>
              <DialogDescription className="text-[13px] leading-5 text-neutral-500">
                Add a new internal note with the context you want to keep for this client.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          className="space-y-5 px-5 py-4"
          onSubmit={(event) => {
            event.preventDefault()
            void handleSubmit()
          }}
        >
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-neutral-800">
              Title <span className="text-rose-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter title e.g. Weekly Progress"
              className="h-10 rounded-sm border-neutral-200 bg-white text-[14px] shadow-none focus-visible:border-brand-500 focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-neutral-800">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter description"
              className="min-h-[112px] w-full rounded-sm border border-neutral-200 bg-white px-3 py-2.5 text-[14px] text-neutral-900 shadow-none outline-none placeholder:text-neutral-400 focus:border-brand-500"
            />
          </div>

          <DialogFooter className="border-t border-neutral-200/80 px-0 pt-4 sm:flex-row sm:items-center sm:justify-end">
            <SecondaryActionButton
              label="Cancel"
              onClick={handleCancel}
              disabled={isPending}
            />
            <PrimaryActionButton
              type="submit"
              label="Add Note"
              disabled={!canSubmit || isPending}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function ClientUpdateNoteDialog({
  note,
  trigger,
  triggerLabel,
  showTriggerOnHover = false,
  onUpdate,
}: {
  note: ClientNoteItem
  trigger?: ReactNode
  triggerLabel?: string
  showTriggerOnHover?: boolean
  onUpdate?: (values: { title: string; description: string }) => void | Promise<void>
}) {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState(note.title)
  const [description, setDescription] = React.useState(note.body.join("\n"))
  const [isPending, setIsPending] = React.useState(false)
  const closeOnlyOnXDialogProps = useDialogCloseOnXOnly()

  React.useEffect(() => {
    if (open) {
      setTitle(note.title)
      setDescription(note.body.join("\n"))
    }
  }, [note, open])

  const canSubmit = title.trim().length > 0 && description.trim().length > 0
  const handleCancel = React.useCallback(() => {
    setTitle(note.title)
    setDescription(note.body.join("\n"))
  }, [note.body, note.title])
  const handleSubmit = React.useCallback(async () => {
    if (!canSubmit) {
      return
    }

    setIsPending(true)

    try {
      await onUpdate?.({
        title: title.trim(),
        description: description.trim(),
      })
      setOpen(false)
    } finally {
      setIsPending(false)
    }
  }, [canSubmit, description, onUpdate, title])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <SecondaryActionButton
            label={<span className="sr-only">{triggerLabel ?? "Edit note"}</span>}
            icon={Pencil}
            aria-label={triggerLabel ?? "Edit note"}
            className={cn(
              "size-7 px-0",
              showTriggerOnHover &&
                "pointer-events-none opacity-0 transition-opacity group-hover/note:pointer-events-auto group-hover/note:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100"
            )}
            iconClassName="size-3"
          />
        )}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        {...closeOnlyOnXDialogProps}
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
            className="absolute top-3 right-3 z-20 size-8 cursor-pointer rounded-md text-neutral-400 shadow-none hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="size-4" />
            <span className="sr-only">Close dialog</span>
          </Button>
        </DialogClose>

        <DialogHeader className="gap-0 border-b border-neutral-200/80 px-5 pt-5 pb-4 text-left">
          <div className="flex items-start gap-3 pr-10">
            <div className="flex size-10 items-center justify-center rounded-md border border-neutral-200/80 bg-neutral-50/90 text-neutral-600">
              <Pencil className="size-[18px]" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-[16px] font-semibold text-neutral-950">
                Edit note
              </DialogTitle>
              <DialogDescription className="text-[13px] leading-5 text-neutral-500">
                Update the title and note content for this saved client note.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 px-5 py-4">
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-neutral-800">
              Title <span className="text-rose-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-10 rounded-sm border-neutral-200 bg-white text-[14px] shadow-none focus-visible:border-brand-500 focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-neutral-800">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-[112px] w-full rounded-sm border border-neutral-200 bg-white px-3 py-2.5 text-[14px] text-neutral-900 shadow-none outline-none placeholder:text-neutral-400 focus:border-brand-500"
            />
          </div>

        </div>

        <DialogFooter className="border-t border-neutral-200/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex items-center gap-2">
            <SecondaryActionButton
              label="Cancel"
              onClick={handleCancel}
              disabled={isPending}
            />
            <PrimaryActionButton
              type="button"
              label="Update Note"
              disabled={!canSubmit || isPending}
              onClick={() => void handleSubmit()}
              className="border border-brand-600 bg-brand-600 hover:border-brand-700 hover:bg-brand-700 disabled:opacity-45"
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
