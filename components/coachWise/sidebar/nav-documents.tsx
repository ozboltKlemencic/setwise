"use client"

import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
  type Icon,
} from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { isPathActive } from "@/i18n/navigation"
import {
  buildCoachWiseHref,
  normalizeCoachWisePathname,
} from "@/components/coachWise/sidebar/route-utils"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: Icon
    exact?: boolean
  }[]
}) {
  const { isMobile, state } = useSidebar()
  const pathname = usePathname()
  const normalizedPathname = normalizeCoachWisePathname(pathname)
  const isCollapsed = state === "collapsed"

  return (
    <SidebarGroup className="transition-[padding] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)]">
      <SidebarGroupLabel className="group-data-[transition=closing]:mt-0 group-data-[transition=closing]:max-h-8 group-data-[transition=closing]:-translate-x-1 group-data-[transition=closing]:px-2 group-data-[transition=closing]:opacity-0 group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:max-h-8 group-data-[collapsible=icon]:-translate-x-1 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:opacity-0">
        Orodja
      </SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col ">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                isActive={isPathActive(normalizedPathname, item.url, { exact: item.exact })}
                tooltip={item.name}
              >
                <Link href={buildCoachWiseHref(pathname, item.url)}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
              {!isCollapsed && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction
                      showOnHover
                      className="rounded-sm data-[state=open]:bg-accent"
                    >
                      <IconDots />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-24 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem>
                      <IconFolder />
                      <span>Open</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconShare3 />
                      <span>Share</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      <IconTrash />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
