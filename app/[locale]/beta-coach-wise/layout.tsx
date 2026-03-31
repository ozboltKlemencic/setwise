"use client"

import * as React from "react"
import { Suspense } from "react"
import { usePathname } from "next/navigation"

import { AppSidebar } from "@/components/coachWise/sidebar/sidebar"
import { normalizeCoachWisePathname } from "@/components/coachWise/sidebar/route-utils"
import { SiteHeader } from "@/components/coachWise/sidebar/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

function SiteHeaderFallback() {
  return (
    <div className="sticky top-0 z-20 flex h-(--header-height) w-full shrink-0 items-center border-b border-neutral-200 bg-neutral-50" />
  )
}

export default function BetaCoachWiseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const normalizedPathname = normalizeCoachWisePathname(pathname)
  const isClientDetailPage =
    /^\/beta-coach-wise\/clients\/[^/]+(?:\/.*)?$/.test(normalizedPathname)

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
        {!isClientDetailPage ? (
          <Suspense fallback={<SiteHeaderFallback />}>
            <SiteHeader />
          </Suspense>
        ) : null}
        <div className="flex flex-1 flex-col bg-neutral-50">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div
              className={cn(
                "flex flex-col",
                isClientDetailPage ? "gap-0 py-0" : "gap-2 py-0 md:gap-2"
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
