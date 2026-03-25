"use client"

import * as React from "react"
import { IconPencil, IconTrash } from "@tabler/icons-react"
import { FileText } from "lucide-react"

import { CoachWiseConfirmationDialog } from "@/components/coachWise/confirmation-dialog"
import {
  ClientAddNoteDialog,
  ClientNotesOverviewDialog,
  ClientUpdateNoteDialog,
  type ClientNoteItem,
} from "@/components/coachWise/clients/client-notes-overview-dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const noteActionButtonClassName =
  "size-6 cursor-pointer rounded-md border-neutral-200/60 bg-neutral-100/85 text-muted-foreground shadow-none transition-colors hover:border-neutral-300/80 hover:bg-neutral-200/60 hover:text-foreground"

const noteDeleteActionButtonClassName =
  "border-rose-200/70 bg-rose-50/70 text-rose-500 hover:border-rose-300/80 hover:bg-rose-100/70 hover:text-rose-600"

function formatNoteBody(description: string) {
  return description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

function formatNoteDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

export function ClientNotesSection({
  initialNotes,
}: {
  initialNotes: ClientNoteItem[]
}) {
  const [notes, setNotes] = React.useState<ClientNoteItem[]>(initialNotes)

  const handleAddNote = React.useCallback(
    async (values: { title: string; description: string }) => {
      setNotes((current) => [
        {
          id:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `${Date.now()}`,
          title: values.title,
          body: formatNoteBody(values.description),
          date: formatNoteDate(new Date()),
          private: false,
        },
        ...current,
      ])
    },
    []
  )

  const handleUpdateNote = React.useCallback(
    async (noteId: string, values: { title: string; description: string }) => {
      setNotes((current) =>
        current.map((item) =>
          item.id === noteId
            ? {
                ...item,
                title: values.title,
                body: formatNoteBody(values.description),
              }
            : item
        )
      )
    },
    []
  )

  const handleDeleteNote = React.useCallback(async (noteId: string) => {
    setNotes((current) => current.filter((item) => item.id !== noteId))
  }, [])

  return (
    <div className="flex min-h-0 flex-1 flex-col border-t border-neutral-200">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-100/70 px-3.5 py-2.5">
        <div className="flex items-center gap-2 text-[14px] font-medium text-neutral-900">
          <FileText className="size-3.5 text-neutral-500" />
          <span>Notes</span>
        </div>
        <div className="flex items-center gap-2">
          <ClientNotesOverviewDialog notes={notes} />
          <ClientAddNoteDialog onAdd={handleAddNote} />
        </div>
      </div>

      <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3 pr-2.5 [scrollbar-color:rgba(212,212,216,0.65)_transparent] [scrollbar-width:thin]">
        {notes.map((note) => (
          <div
            key={note.id}
            className="group/note rounded-xl border border-neutral-200 bg-neutral-100/75"
          >
            <div className="flex items-start justify-between gap-3 px-3.5 pt-3.5">
              <h3 className="text-[15px] font-semibold text-neutral-950">
                {note.title}
              </h3>
              <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover/note:opacity-100">
                <ClientUpdateNoteDialog
                  note={note}
                  triggerLabel={`Edit ${note.title}`}
                  onUpdate={(values) => handleUpdateNote(note.id, values)}
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
                  onConfirm={() => handleDeleteNote(note.id)}
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
        ))}
      </div>
    </div>
  )
}
