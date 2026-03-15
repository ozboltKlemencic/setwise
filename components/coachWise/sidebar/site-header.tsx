"use client"

import { isPathActive, usePathname } from "@/i18n/navigation"

const coachWiseRoutes = [
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
    title: "Stranke",
    href: "/beta-coach-wise",
    exact: true,
  },
]

export function SiteHeader() {
  const pathname = usePathname()
  const activeRoute =
    coachWiseRoutes.find((route) =>
      isPathActive(pathname, route.href, { exact: route.exact })
    )?.title ?? "Coach Wise"

  return (
    <header className="flex h-(--header-height) shrink-0 items-center border-b border-neutral-200 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center px-4 lg:px-6">
        <h1 className="text-base font-medium">{activeRoute}</h1>
      </div>
    </header>
  )
}
