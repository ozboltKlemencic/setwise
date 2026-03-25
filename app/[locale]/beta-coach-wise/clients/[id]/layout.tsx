import type { ReactNode } from "react"
import { MessageSquareText } from "lucide-react"
import { notFound } from "next/navigation"

import { TabsNav } from "@/components/coachWise/clients/tabs-nav"
import { SiteHeader } from "@/components/coachWise/sidebar/site-header"
import { Button } from "@/components/ui/button"

import {
  getClientWhatsappLink,
  getCoachWiseClientById,
} from "./client-profile-data"

type Props = {
  children: ReactNode
  params: Promise<{ locale: string; id: string }>
}

export default async function ClientDetailLayout({ children, params }: Props) {
  const { locale, id } = await params
  const clientId = Number(id)

  if (!Number.isInteger(clientId)) {
    notFound()
  }

  const client = getCoachWiseClientById(clientId)

  if (!client) {
    notFound()
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <SiteHeader />
      <TabsNav
        locale={locale}
        clientId={clientId}
        actions={
          <Button
            asChild
            variant="outline"
            size="icon-sm"
            className="rounded-sm border-neutral-200 bg-white px-2.5 py-2 text-neutral-600 shadow-none hover:bg-neutral-50 hover:text-neutral-900"
          >
            <a
              href={getClientWhatsappLink(client.header)}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open WhatsApp for ${client.header}`}
            >
              <MessageSquareText className="size-4" />
            </a>
          </Button>
        }
      />
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  )
}
