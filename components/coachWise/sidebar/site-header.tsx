"use client"

import {
  IconApple,
  IconClipboardList,
  IconInfoCircle,
  IconPencil,
  IconPill,
  IconPlus,
  IconSettings,
  IconUserCheck,
  IconUsersGroup,
  type Icon,
} from "@tabler/icons-react"
import { usePathname, useSearchParams } from "next/navigation"

import { PrimaryActionButton } from "@/components/coachWise/primary-action-button"
import { AddClientDialog } from "@/components/coachWise/clients/shared/add-client-dialog"
import { ClientEditDialog } from "@/components/coachWise/clients/shared/client-edit-dialog"
import clientData from "@/app/[locale]/beta-coach-wise/data.json"
import { isPathActive } from "@/i18n/navigation"
import { normalizeCoachWisePathname } from "@/components/coachWise/sidebar/route-utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const coachWiseRoutes = [
  {
    title: "Forms",
    href: "/beta-coach-wise/forms",
    icon: IconUserCheck,
    exact: true,
  },
  {
    title: "Programi",
    href: "/beta-coach-wise/programi",
    icon: IconClipboardList,
    exact: true,
  },
  {
    title: "Nutrition",
    href: "/beta-coach-wise/nutrition",
    icon: IconApple,
    exact: false,
  },
  {
    title: "Suplementi",
    href: "/beta-coach-wise/suplementi",
    icon: IconPill,
    exact: true,
  },
  {
    title: "Settings",
    href: "/beta-coach-wise/settings",
    icon: IconSettings,
    exact: true,
  },
  {
    title: "Kako deluje?",
    href: "/beta-coach-wise/how-it-works",
    icon: IconInfoCircle,
    exact: true,
  },
  {
    title: "Clients",
    href: "/beta-coach-wise/clients",
    icon: IconUsersGroup,
    exact: false,
  },
] satisfies {
  title: string
  href: string
  icon: Icon
  exact: boolean
}[]

const coachWiseHeaderActions: Record<
  string,
  { label: string; icon: Icon }
> = {
  "/beta-coach-wise/clients": {
    label: "Add Client",
    icon: IconPlus,
  },
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function SiteHeader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const normalizedPathname = normalizeCoachWisePathname(pathname)
  const normalizedBackToPathname = normalizeCoachWisePathname(
    searchParams.get("backTo") ?? ""
  )
  const clientDetailMatch = normalizedPathname.match(
    /^\/beta-coach-wise\/clients\/(\d+)(?:\/.*)?$/
  )
  const backToClientMatch = normalizedBackToPathname.match(
    /^\/beta-coach-wise\/clients\/(\d+)(?:\/.*)?$/
  )
  const resolvedClientId = clientDetailMatch?.[1] ?? backToClientMatch?.[1]
  const activeClient = clientDetailMatch
    ? clientData.find((item) => item.id === Number(clientDetailMatch[1]))
    : resolvedClientId
      ? clientData.find((item) => item.id === Number(resolvedClientId))
    : undefined
  const activeRoute =
    coachWiseRoutes.find((route) =>
      isPathActive(normalizedPathname, route.href, { exact: route.exact })
    ) ?? null
  const ActiveIcon = activeClient ? IconUsersGroup : activeRoute?.icon
  const headerAction = coachWiseHeaderActions[normalizedPathname]
  const isClientInfoPage = /^\/beta-coach-wise\/clients\/\d+\/info$/.test(
    normalizedPathname
  )
  const clientNameParts = activeClient
    ? activeClient.header.split(" ")
    : []
  const clientFirstName = clientNameParts[0] ?? ""
  const clientLastName = clientNameParts.slice(1).join(" ")

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-(--header-height) w-full shrink-0 items-center border-b border-neutral-200 transition-[height] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)",
        activeClient ? "bg-neutral-50" : "bg-neutral-50"
      )}
    >
      <div className="flex w-full items-center justify-between gap-4 px-4 ">
        <div className="flex min-w-0 items-center gap-2.5">
          {activeClient ? (
            <Avatar className="size-7 shrink-0">
              <AvatarImage src={activeClient.avatar} alt={activeClient.header} />
              <AvatarFallback className="text-[11px]">
                {getInitials(activeClient.header)}
              </AvatarFallback>
            </Avatar>
          ) : ActiveIcon ? (
            <ActiveIcon className="size-4 ml-1.5 shrink-0 text-neutral-500" />
          ) : null}
          {activeClient ? (
            <h1 className="truncate text-sm font-semibold text-neutral-900">
              {activeClient.header}
            </h1>
          ) : (
            <h1 className="text-sm font-semibold text-neutral-900">
              {activeRoute?.title ?? "Coach Wise"}
            </h1>
          )}
        </div>
        {isClientInfoPage && activeClient ? (
          <ClientEditDialog
            firstName={clientFirstName}
            lastName={clientLastName}
            email={activeClient.email}
            phone={activeClient.phone}
            status={activeClient.type}
            phase={activeClient.phase}
            trigger={
              <PrimaryActionButton
                label="Edit Client"
                icon={IconPencil}
              />
            }
          />
        ) : headerAction ? (
          normalizedPathname === "/beta-coach-wise/clients" ? (
            <AddClientDialog
              trigger={
                <PrimaryActionButton
                  label={headerAction.label}
                  icon={headerAction.icon}
                />
              }
            />
          ) : (
            <PrimaryActionButton
              label={headerAction.label}
              icon={headerAction.icon}
            />
          )
        ) : null}
      </div>
    </header>
  )
}
