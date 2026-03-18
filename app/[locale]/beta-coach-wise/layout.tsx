"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { AppSidebar } from "@/components/coachWise/sidebar/sidebar"
import { normalizeCoachWisePathname } from "@/components/coachWise/sidebar/route-utils"
import { SiteHeader } from "@/components/coachWise/sidebar/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export default function BetaCoachWiseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const normalizedPathname = normalizeCoachWisePathname(pathname)
  const isClientDetailPage =
    /^\/beta-coach-wise\/clients\/[^/]+$/.test(normalizedPathname)

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div
              className={cn(
                "flex flex-col gap-4 py-4 md:gap-6 md:py-6",
                isClientDetailPage && "pt-0 md:pt-0"
              )}
            >
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
