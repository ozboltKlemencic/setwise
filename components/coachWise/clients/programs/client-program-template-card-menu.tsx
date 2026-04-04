"use client"

import * as React from "react"
import { Pencil, Trash2 } from "lucide-react"

import { CoachWiseConfirmationDialog } from "@/components/coachWise/confirmation-dialog"
import {
  OverflowActionsMenu,
  type OverflowActionsMenuItem,
} from "@/components/coachWise/overflow-actions-menu"

type ClientProgramTemplateCardMenuProps = {
  title: string
  editHref: string
  onDelete?: () => void
}

export function ClientProgramTemplateCardMenu({
  title,
  editHref,
  onDelete,
}: ClientProgramTemplateCardMenuProps) {
  const deleteTriggerRef = React.useRef<HTMLButtonElement>(null)

  const items = React.useMemo<OverflowActionsMenuItem[]>(
    () => [
      {
        id: "edit",
        label: "Edit",
        icon: Pencil,
        href: editHref,
      },
      {
        id: "delete",
        label: "Delete",
        icon: Trash2,
        variant: "destructive",
        disabled: !onDelete,
        onSelect: () => {
          if (!onDelete) {
            return
          }

          deleteTriggerRef.current?.click()
        },
      },
    ],
    [editHref, onDelete]
  )

  return (
    <>
      {onDelete ? (
        <CoachWiseConfirmationDialog
          title="Are you sure you want to delete this template?"
          description={`${title} will be removed from saved templates. This action can't be undone.`}
          confirmLabel="Delete template"
          variant="destructive"
          onConfirm={onDelete}
          trigger={
            <button
              ref={deleteTriggerRef}
              type="button"
              className="hidden"
              aria-hidden="true"
              tabIndex={-1}
            />
          }
        />
      ) : null}

      <OverflowActionsMenu items={items} triggerLabel={`Open actions for ${title}`} />
    </>
  )
}
