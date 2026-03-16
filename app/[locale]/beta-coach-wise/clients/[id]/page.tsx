import {
  IconArrowLeft,
  IconCalendarEvent,
  IconChartBar,
  IconClipboardCheck,
} from "@tabler/icons-react"
import { notFound } from "next/navigation"

import { Link } from "@/i18n/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import data from "../../data.json"

type Props = {
  params: Promise<{ locale: string; id: string }>
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export default async function ClientProfilePage({ params }: Props) {
  const { id } = await params
  const clientId = Number(id)

  if (!Number.isInteger(clientId)) {
    notFound()
  }

  const client = data.find((item) => item.id === clientId)

  if (!client) {
    notFound()
  }

  return (
    <section className="px-4 lg:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={client.avatar} alt={client.header} />
              <AvatarFallback>{getInitials(client.header)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {client.header}
                </h1>
                <Badge variant="outline">{client.type}</Badge>
                <Badge variant="secondary">{client.phase ?? "Brez faze"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Profil stranke z osnovnim pregledom sodelovanja, faze in
                check-in statusa.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="w-full md:w-auto">
            <Link href="/beta-coach-wise/clients">
              <IconArrowLeft className="size-4" />
              Nazaj na stranke
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconClipboardCheck className="size-4" />
                Check in
              </div>
              <CardTitle>{client.status}</CardTitle>
              <CardDescription>Trenutni status zadnjega pregleda.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconChartBar className="size-4" />
                Faza
              </div>
              <CardTitle>{client.phase ?? "Brez faze"}</CardTitle>
              <CardDescription>Aktualna faza sodelovanja s stranko.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconCalendarEvent className="size-4" />
                Pridruzil
              </div>
              <CardTitle>{client.target}</CardTitle>
              <CardDescription>Datum vstopa v coach-wise proces.</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Osnovni pregled</CardTitle>
              <CardDescription>
                Najpomembnejse informacije o stranki na enem mestu.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Ime stranke</div>
                <div className="mt-2 font-medium">{client.header}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="mt-2 font-medium">{client.type}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Check in</div>
                <div className="mt-2 font-medium">{client.status}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Faza</div>
                <div className="mt-2 font-medium">{client.phase ?? "-"}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Naslednji koraki</CardTitle>
              <CardDescription>
                Predlog za hiter operativen pregled stranke.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-lg border p-4">
                Preglej zadnji check-in in preveri, ali je potreben follow-up.
              </div>
              <div className="rounded-lg border p-4">
                Posodobi fazo sodelovanja glede na napredek in cilje stranke.
              </div>
              <div className="rounded-lg border p-4">
                Pripravi naslednji program ali prehranski plan iz sidebar
                orodij.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
