import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type ClientSectionHeaderProps = {
  icon: ReactNode
  title: ReactNode
  actions?: ReactNode
  className?: string
}

export function ClientSectionHeader({
  icon,
  title,
  actions,
  className,
}: ClientSectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex min-h-11 items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-100/70 px-3.5 py-2",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2 text-[14px] font-medium text-neutral-900">
        <span className="shrink-0 text-neutral-500 [&_svg]:size-3.5">{icon}</span>
        <span className="truncate">{title}</span>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}
