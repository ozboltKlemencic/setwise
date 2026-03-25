import type { ReactNode } from "react"

import type { ClientNoteItem } from "@/components/coachWise/clients/client-notes-overview-dialog"
import { cn } from "@/lib/utils"

type ClientNoteCardProps = {
  note: ClientNoteItem
  footerActions?: ReactNode
  className?: string
}

export function ClientNoteCard({
  note,
  footerActions,
  className,
}: ClientNoteCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-neutral-200 bg-neutral-100/75",
        className
      )}
    >
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
      <div className="flex items-center justify-between rounded-b-xl border-t border-neutral-200 bg-neutral-200/55 px-3.5 py-2.5 text-[12.5px] text-neutral-500">
        <span>{note.date}</span>
        {footerActions ? <div className="flex items-center gap-2">{footerActions}</div> : null}
      </div>
    </div>
  )
}
