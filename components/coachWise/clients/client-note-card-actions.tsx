"use client"

import { IconPencil, IconTrash } from "@tabler/icons-react"

import { CoachWiseConfirmationDialog } from "@/components/coachWise/confirmation-dialog"
import {
  ClientUpdateNoteDialog,
  type ClientNoteItem,
} from "@/components/coachWise/clients/client-notes-overview-dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const noteActionButtonClassName =
  "size-6 cursor-pointer rounded-md border-neutral-200/60 bg-neutral-100/85 text-muted-foreground shadow-none transition-colors hover:border-neutral-300/80 hover:bg-neutral-200/60 hover:text-foreground"

const noteDeleteActionButtonClassName =
  "border-rose-200/70 bg-rose-50/70 text-rose-500 hover:border-rose-300/80 hover:bg-rose-100/70 hover:text-rose-600"

type ClientNoteCardActionsProps = {
  note: ClientNoteItem
  onUpdate: (values: { title: string; description: string }) => void | Promise<void>
  onDelete: () => void | Promise<void>
}

export function ClientNoteCardActions({
  note,
  onUpdate,
  onDelete,
}: ClientNoteCardActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <ClientUpdateNoteDialog
        note={note}
        triggerLabel={`Edit ${note.title}`}
        onUpdate={onUpdate}
        trigger={
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className={noteActionButtonClassName}
          >
            <IconPencil className="size-3.5" />
            <span className="sr-only">{`Edit ${note.title}`}</span>
          </Button>
        }
      />
      <CoachWiseConfirmationDialog
        title="Are you sure you want to delete this note?"
        description={`${note.title} will be removed from this client. This action can't be undone.`}
        confirmLabel="Delete note"
        variant="destructive"
        onConfirm={onDelete}
        trigger={
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className={cn(
              noteActionButtonClassName,
              noteDeleteActionButtonClassName
            )}
          >
            <IconTrash className="size-3.5" />
            <span className="sr-only">{`Delete ${note.title}`}</span>
          </Button>
        }
      />
    </div>
  )
}
