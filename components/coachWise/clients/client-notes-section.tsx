"use client"

import * as React from "react"
import { FileText } from "lucide-react"

import {
  ClientAddNoteDialog,
  ClientNotesOverviewDialog,
  type ClientNoteItem,
} from "@/components/coachWise/clients/client-notes-overview-dialog"
import { ClientNoteCardActions } from "@/components/coachWise/clients/client-note-card-actions"
import { ClientNoteCard } from "@/components/coachWise/clients/client-note-card"
import { ClientSectionHeader } from "@/components/coachWise/clients/client-section-header"

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
      <ClientSectionHeader
        icon={<FileText />}
        title="Notes"
        actions={
          <>
          <ClientNotesOverviewDialog notes={notes} />
          <ClientAddNoteDialog onAdd={handleAddNote} />
          </>
        }
        className="border-b"
      />

      <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3 pr-2.5 [scrollbar-color:rgba(212,212,216,0.65)_transparent] [scrollbar-width:thin]">
        {notes.map((note) => (
          <ClientNoteCard
            key={note.id}
            note={note}
            className="group/note"
            footerActions={
              <div className="pointer-events-none opacity-0 transition-opacity group-hover/note:pointer-events-auto group-hover/note:opacity-100">
                <ClientNoteCardActions
                  note={note}
                  onUpdate={(values) => handleUpdateNote(note.id, values)}
                  onDelete={() => handleDeleteNote(note.id)}
                />
              </div>
            }
          />
        ))}
      </div>
    </div>
  )
}
