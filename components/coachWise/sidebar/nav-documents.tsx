"use client"

import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
  type Icon,
} from "@tabler/icons-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  }[]
}) {
  const { isMobile, state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <SidebarGroup className="transition-[padding] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)]">
      <SidebarGroupLabel className="group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:max-h-8 group-data-[collapsible=icon]:translate-x-0 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:opacity-0">
        Documents
      </SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild tooltip={item.name}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </a>
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
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70" tooltip="More">
              <IconDots className="text-sidebar-foreground/70" />
              <span>More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
