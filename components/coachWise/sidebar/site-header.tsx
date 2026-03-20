"use client"

import {
  IconCalendarWeek,
  IconChefHat,
  IconClipboardList,
  IconInfoCircle,
  IconPill,
  IconPlus,
  IconReceipt2,
  IconSettings,
  IconUserCheck,
  IconUsersGroup,
  type Icon,
} from "@tabler/icons-react"
import { usePathname } from "next/navigation"

import { AddClientDialog } from "@/components/coachWise/clients/add-client-dialog"
import clientData from "@/app/[locale]/beta-coach-wise/data.json"
import { isPathActive } from "@/i18n/navigation"
import { normalizeCoachWisePathname } from "@/components/coachWise/sidebar/route-utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const coachWiseRoutes = [
  {
    title: "Forms",
    href: "/beta-coach-wise/forms",
    icon: IconUserCheck,
    exact: true,
  },
  {
    title: "Urnik",
    href: "/beta-coach-wise/urnik",
    icon: IconCalendarWeek,
    exact: true,
  },
  {
    title: "Racuni",
    href: "/beta-coach-wise/racuni",
    icon: IconReceipt2,
    exact: true,
  },
  {
    title: "Programi",
    href: "/beta-coach-wise/programi",
    icon: IconClipboardList,
    exact: true,
  },
  {
    title: "Meal plani",
    href: "/beta-coach-wise/meal-plani",
    icon: IconChefHat,
    exact: true,
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
    title: "Stranke",
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
    label: "Dodaj stranko",
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
  const normalizedPathname = normalizeCoachWisePathname(pathname)
  const clientDetailMatch = normalizedPathname.match(
    /^\/beta-coach-wise\/clients\/(\d+)$/
  )
  const activeClient = clientDetailMatch
    ? clientData.find((item) => item.id === Number(clientDetailMatch[1]))
    : undefined
  const activeRoute =
    coachWiseRoutes.find((route) =>
      isPathActive(normalizedPathname, route.href, { exact: route.exact })
    ) ?? null
  const ActiveIcon = activeClient ? IconUsersGroup : activeRoute?.icon
  const headerAction = coachWiseHeaderActions[normalizedPathname]

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-(--header-height) w-full shrink-0 items-center border-b border-neutral-200 transition-[height] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)",
        activeClient ? "bg-neutral-50" : "bg-white"
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
            <ActiveIcon className="size-4 shrink-0 text-neutral-500" />
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
        {headerAction ? (
          normalizedPathname === "/beta-coach-wise/clients" ? (
            <AddClientDialog
              label={headerAction.label}
              icon={headerAction.icon}
            />
          ) : (
            <Button
              type="button"
              size="sm"
              className="shrink-0 border-transparent bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700"
            >
              <headerAction.icon className="size-4" />
              {headerAction.label}
            </Button>
          )
        ) : null}
      </div>
    </header>
  )
}
