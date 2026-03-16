"use client"

import { usePathname } from "next/navigation"

import clientData from "@/app/[locale]/beta-coach-wise/data.json"
import { isPathActive } from "@/i18n/navigation"
import { normalizeCoachWisePathname } from "@/components/coachWise/sidebar/route-utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const coachWiseRoutes = [
  {
    title: "Habbits",
    href: "/beta-coach-wise/habbits",
    exact: true,
  },
  {
    title: "Onboarding",
    href: "/beta-coach-wise/onboarding",
    exact: true,
  },
  {
    title: "Check in",
    href: "/beta-coach-wise/check-in",
    exact: true,
  },
  {
    title: "Programi",
    href: "/beta-coach-wise/programi",
    exact: true,
  },
  {
    title: "Meal plani",
    href: "/beta-coach-wise/meal-plani",
    exact: true,
  },
  {
    title: "Suplementi",
    href: "/beta-coach-wise/suplementi",
    exact: true,
  },
  {
    title: "Settings",
    href: "/beta-coach-wise/settings",
    exact: true,
  },
  {
    title: "Kako deluje?",
    href: "/beta-coach-wise/how-it-works",
    exact: true,
  },
  {
    title: "Stranke",
    href: "/beta-coach-wise/clients",
    exact: false,
  },
]

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
    )?.title ?? "Coach Wise"

  return (
    <header className="sticky top-0 z-20 flex h-(--header-height) w-full shrink-0 items-center border-b border-neutral-200 bg-white transition-[height] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center px-4 lg:px-6">
        {activeClient ? (
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="size-8">
              <AvatarImage src={activeClient.avatar} alt={activeClient.header} />
              <AvatarFallback>{getInitials(activeClient.header)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-neutral-900">
                {activeClient.header}
              </div>
              <div className="truncate text-xs text-neutral-500">
                Client workspace
              </div>
            </div>
          </div>
        ) : (
          <h1 className="text-sm font-semibold text-neutral-900">{activeRoute}</h1>
        )}
      </div>
    </header>
  )
}
