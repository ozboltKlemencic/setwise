"use client"

import * as React from "react"
import { CheckSquare, FileText, Maximize2, Pencil, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export type ClientNoteItem = {
  title: string
  body: string[]
  date: string
  private: boolean
}

function NotesDialogCard({ note }: { note: ClientNoteItem }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white">
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
      <div className="flex items-center justify-between rounded-b-xl border-t border-neutral-200 px-3.5 py-2.5 text-[12.5px] text-neutral-500">
        <span>{note.date}</span>
        {note.private ? (
          <Badge className="rounded-md border border-neutral-300 bg-neutral-800 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase shadow-none hover:bg-neutral-800">
            Private
          </Badge>
        ) : null}
      </div>
    </div>
  )
}

export function ClientNotesOverviewDialog({
  notes,
}: {
  notes: ClientNoteItem[]
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-7 rounded-md border-neutral-200 text-neutral-500 shadow-none"
        >
          <Maximize2 className="size-3" />
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden rounded-xl border-neutral-200 p-0 shadow-xl sm:max-w-[780px]"
      >
        <DialogHeader className="border-b border-neutral-200 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="flex items-center gap-2 text-[15px] font-medium text-neutral-950">
              <FileText className="size-4 text-neutral-500" />
              <span>Note</span>
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-md text-neutral-500 shadow-none hover:bg-neutral-100 hover:text-neutral-900"
              >
                <X className="size-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto px-4 py-4 [scrollbar-width:thin]">
          {notes.map((note) => (
            <NotesDialogCard key={`${note.title}-${note.date}`} note={note} />
          ))}
        </div>

        <DialogFooter className="border-t border-neutral-200 px-4 py-3 sm:justify-start">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="rounded-sm px-2 text-neutral-600 shadow-none hover:bg-neutral-100 hover:text-neutral-900"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ClientAddNoteDialog() {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [isPrivate, setIsPrivate] = React.useState(false)

  const resetForm = React.useCallback(() => {
    setTitle("")
    setDescription("")
    setIsPrivate(false)
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-md border-neutral-200 px-2.5 text-[13px] shadow-none"
        >
          <CheckSquare className="size-3.5" />
          Add Note
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden rounded-xl border-neutral-200 p-0 shadow-xl sm:max-w-[700px]"
      >
        <DialogHeader className="border-b border-neutral-200 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="flex items-center gap-2 text-[15px] font-medium text-neutral-950">
              <CheckSquare className="size-4 text-neutral-500" />
              <span>Add Note</span>
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-md text-neutral-500 shadow-none hover:bg-neutral-100 hover:text-neutral-900"
              >
                <X className="size-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="space-y-5 px-4 py-4">
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

          <label className="flex items-center gap-2.5 text-[14px] text-neutral-900">
            <Checkbox
              checked={isPrivate}
              onCheckedChange={(checked) => setIsPrivate(checked === true)}
              className="rounded-[4px] border-neutral-300 data-[state=checked]:border-brand-600 data-[state=checked]:bg-brand-600"
            />
            <span>
              Private Note <span className="text-neutral-500">(only visible to you)</span>
            </span>
          </label>
        </div>

        <DialogFooter className="border-t border-neutral-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="rounded-sm px-2 text-neutral-600 shadow-none hover:bg-neutral-100 hover:text-neutral-900"
            >
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={!canSubmit}
            onClick={() => handleOpenChange(false)}
            className="rounded-sm bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700 disabled:opacity-45"
          >
            Add Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ClientUpdateNoteDialog({
  note,
}: {
  note: ClientNoteItem
}) {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState(note.title)
  const [description, setDescription] = React.useState(note.body.join("\n"))
  const [isPrivate, setIsPrivate] = React.useState(note.private)

  React.useEffect(() => {
    if (open) {
      setTitle(note.title)
      setDescription(note.body.join("\n"))
      setIsPrivate(note.private)
    }
  }, [note, open])

  const canSubmit = title.trim().length > 0 && description.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-7 rounded-md border-neutral-200 text-neutral-500 shadow-none"
        >
          <Pencil className="size-3" />
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden rounded-xl border-neutral-200 p-0 shadow-xl sm:max-w-[700px]"
      >
        <DialogHeader className="border-b border-neutral-200 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="flex items-center gap-2 text-[15px] font-medium text-neutral-950">
              <CheckSquare className="size-4 text-neutral-500" />
              <span>Update Note</span>
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-md text-neutral-500 shadow-none hover:bg-neutral-100 hover:text-neutral-900"
              >
                <X className="size-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="space-y-5 px-4 py-4">
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

          <label className="flex items-center gap-2.5 text-[14px] text-neutral-900">
            <Checkbox
              checked={isPrivate}
              onCheckedChange={(checked) => setIsPrivate(checked === true)}
              className="rounded-[4px] border-neutral-300 data-[state=checked]:border-brand-600 data-[state=checked]:bg-brand-600"
            />
            <span>
              Private Note <span className="text-neutral-500">(only visible to you)</span>
            </span>
          </label>
        </div>

        <DialogFooter className="border-t border-neutral-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="rounded-sm px-2 text-neutral-600 shadow-none hover:bg-neutral-100 hover:text-neutral-900"
            >
              Close
            </Button>
          </DialogClose>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              className="rounded-sm border-transparent bg-rose-500 text-white shadow-none hover:bg-rose-600"
            >
              Delete
            </Button>
            <Button
              type="button"
              disabled={!canSubmit}
              onClick={() => setOpen(false)}
              className="rounded-sm bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700 disabled:opacity-45"
            >
              Update Note
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
