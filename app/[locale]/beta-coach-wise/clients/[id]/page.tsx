import type { ReactNode } from "react"
import {
  IconArrowLeft,
  IconCalendarEvent,
  IconChartBar,
  IconChefHat,
  IconChevronDown,
  IconClipboardCheck,
  IconClipboardList,
  IconInfoCircle,
  IconLayoutColumns,
  IconPill,
  IconPlus,
  IconRepeat,
  IconSearch,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

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

function getPhaseFocus(phase?: string) {
  switch (phase) {
    case "Bulk":
      return "Fokus je na progresivnem overloadu, visji energiji in rednem spremljanju regeneracije."
    case "Cut":
      return "Fokus je na doslednosti, kontroli vnosa in ohranjanju performansa med deficitom."
    default:
      return "Fokus je na stabilni rutini, kvalitetnem recoveryju in dolgorochnem napredku."
  }
}

function getNutritionFocus(phase?: string) {
  switch (phase) {
    case "Bulk":
      return {
        calories: "2850 kcal",
        macros: "190P / 330C / 75F",
        note: "Rahlo povisan vnos za podporo treningu in napredku v moci.",
      }
    case "Cut":
      return {
        calories: "2150 kcal",
        macros: "185P / 190C / 65F",
        note: "Deficit je nastavljen tako, da ostane energija za trening in check-in ritem.",
      }
    default:
      return {
        calories: "2450 kcal",
        macros: "180P / 250C / 70F",
        note: "Vzdrzevalni vnos za stabilno formo, dober recovery in enakomeren tempo.",
      }
  }
}

function getProgramFocus(phase?: string) {
  switch (phase) {
    case "Bulk":
      return "Upper / Lower split s poudarkom na volumenu in progresiji."
    case "Cut":
      return "Full-body in conditioning blok za ohranjanje moci in porabe."
    default:
      return "Balanced split za stabilen napredek, tehniko in recovery."
  }
}

function SectionSubHeader({
  items,
  actions,
}: {
  items: {
    icon: ReactNode
    label: string
    active?: boolean
  }[]
  actions?: ReactNode
}) {
  return (
    <div className="border-b border-neutral-200 bg-neutral-50">
      <div className="flex min-h-11 flex-col gap-3 px-4 py-2 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="min-w-0 overflow-x-auto">
          <div className="flex w-max min-w-max items-center gap-5">
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                className={cn(
                  "inline-flex items-center gap-1.5 text-sm font-normal text-neutral-500 transition-colors hover:text-neutral-700",
                  item.active && "font-medium text-neutral-900"
                )}
              >
                <span
                  className={cn(
                    "text-neutral-400",
                    item.active && "text-indigo-600"
                  )}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  )
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

  const nutrition = getNutritionFocus(client.phase)
  const habits = [
    {
      title: "Spanje",
      value: client.status === "Done" ? "7h 45m" : "7h 10m",
      description: "Stabilen vecerni ritem in dober recovery po treningu.",
    },
    {
      title: "Hidracija",
      value: "2.6L / dan",
      description: "Vnos vode je enakomeren, prostor je se za malo vec ob treningih.",
    },
    {
      title: "Koraki",
      value: client.phase === "Cut" ? "10.2k / dan" : "8.4k / dan",
      description: "Dnevno gibanje podpira trenutno fazo in splosno kondicijo.",
    },
  ]
  const supplements = [
    {
      title: "Kreatin",
      timing: "Vsak dan z zajtrkom",
      description: "Podpora performansu in ponovljivosti v treningu.",
    },
    {
      title: "Omega 3",
      timing: "Kosilo",
      description: "Podpora splosnemu zdravju in regeneraciji.",
    },
    {
      title: "Magnezij",
      timing: "Pred spanjem",
      description: "Podpora vecernemu ritualu in boljsemu recoveryju.",
    },
  ]
  const programBlocks = [
    "Dan 1: Upper strength + accessory work",
    "Dan 2: Lower strength + core",
    "Dan 3: Upper hypertrophy",
    "Dan 4: Lower hypertrophy + conditioning",
  ]

  return (
    <section className="min-w-0 bg-neutral-50">
      <Tabs defaultValue="info" className="min-w-0 w-full gap-0">
        <div className="border-b border-neutral-200 bg-neutral-50">
          <div className="flex min-w-0 items-center justify-between gap-4 px-4 lg:px-6">
            <div className="min-w-0 flex-1 overflow-x-auto">
              <TabsList
                variant="line"
                className="h-16 w-max min-w-max justify-start gap-0 rounded-none bg-transparent p-0"
              >
                <TabsTrigger
                  value="info"
                  className="h-11 flex-none gap-1.5 rounded-none border-0 border-b-2 border-transparent px-4 first:pl-0 text-sm font-normal text-neutral-500 after:hidden hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-neutral-900 data-[state=active]:shadow-none data-[state=active]:[&_svg]:text-indigo-600 [&_svg]:size-4 [&_svg]:text-neutral-400"
                >
                  <IconInfoCircle className="size-4" />
                  Info
                </TabsTrigger>
                <TabsTrigger
                  value="habbits"
                  className="h-11 flex-none gap-1.5 rounded-none border-0 border-b-2 border-transparent px-4 text-sm font-normal text-neutral-500 after:hidden hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-neutral-900 data-[state=active]:shadow-none data-[state=active]:[&_svg]:text-indigo-600 [&_svg]:size-4 [&_svg]:text-neutral-400"
                >
                  <IconRepeat className="size-4" />
                  Habbits
                </TabsTrigger>
                <TabsTrigger
                  value="checkins"
                  className="h-11 flex-none gap-1.5 rounded-none border-0 border-b-2 border-transparent px-4 text-sm font-normal text-neutral-500 after:hidden hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-neutral-900 data-[state=active]:shadow-none data-[state=active]:[&_svg]:text-indigo-600 [&_svg]:size-4 [&_svg]:text-neutral-400"
                >
                  <IconClipboardCheck className="size-4" />
                  Check-ins
                </TabsTrigger>
                <TabsTrigger
                  value="nutrition"
                  className="h-11 flex-none gap-1.5 rounded-none border-0 border-b-2 border-transparent px-4 text-sm font-normal text-neutral-500 after:hidden hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-neutral-900 data-[state=active]:shadow-none data-[state=active]:[&_svg]:text-indigo-600 [&_svg]:size-4 [&_svg]:text-neutral-400"
                >
                  <IconChefHat className="size-4" />
                  Nutrition
                </TabsTrigger>
                <TabsTrigger
                  value="supplements"
                  className="h-11 flex-none gap-1.5 rounded-none border-0 border-b-2 border-transparent px-4 text-sm font-normal text-neutral-500 after:hidden hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-neutral-900 data-[state=active]:shadow-none data-[state=active]:[&_svg]:text-indigo-600 [&_svg]:size-4 [&_svg]:text-neutral-400"
                >
                  <IconPill className="size-4" />
                  Supplements
                </TabsTrigger>
                <TabsTrigger
                  value="programs"
                  className="h-11 flex-none gap-1.5 rounded-none border-0 border-b-2 border-transparent px-4 pr-6 text-sm font-normal text-neutral-500 after:hidden hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-neutral-900 data-[state=active]:shadow-none data-[state=active]:[&_svg]:text-indigo-600 [&_svg]:size-4 [&_svg]:text-neutral-400"
                >
                  <IconClipboardList className="size-4" />
                  Programs
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                aria-label="Search workspace"
                className="shrink-0 inline-flex size-8 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-700"
              >
                <IconSearch className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Open layout tools"
                className="shrink-0 inline-flex size-8 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-700"
              >
                <IconLayoutColumns className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <TabsContent value="info" className="mt-0 space-y-0">
          <SectionSubHeader
            items={[
              {
                icon: <IconInfoCircle className="size-4" />,
                label: "General",
                active: true,
              },
              {
                icon: <IconChartBar className="size-4" />,
                label: "Progress",
              },
              {
                icon: <IconClipboardCheck className="size-4" />,
                label: "Notes",
              },
            ]}
            actions={
              <>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-neutral-200 text-neutral-700"
                >
                  <Link href="/beta-coach-wise/clients">
                    <IconArrowLeft className="size-4" />
                    Nazaj
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Edit client
                </Button>
              </>
            }
          />
          <div className="space-y-4 bg-neutral-50 px-4 py-4 lg:px-6">
            <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-none">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
                      <Badge variant="secondary">
                        {client.phase ?? "Brez faze"}
                      </Badge>
                    </div>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                      Profil stranke z osnovnim pregledom sodelovanja, faze in
                      kratkih operativnih opomb za naslednje korake.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconClipboardCheck className="size-4" />
                    Check in
                  </div>
                  <CardTitle>{client.status}</CardTitle>
                  <CardDescription>
                    Trenutni status zadnjega pregleda.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconChartBar className="size-4" />
                    Faza
                  </div>
                  <CardTitle>{client.phase ?? "Brez faze"}</CardTitle>
                  <CardDescription>
                    Aktualna faza sodelovanja s stranko.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconCalendarEvent className="size-4" />
                    Pridruzil
                  </div>
                  <CardTitle>{client.target}</CardTitle>
                  <CardDescription>
                    Datum vstopa v coach-wise proces.
                  </CardDescription>
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
                    <div className="text-sm text-muted-foreground">
                      Ime stranke
                    </div>
                    <div className="mt-2 font-medium">{client.header}</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div className="mt-2 font-medium">{client.type}</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">
                      Check in
                    </div>
                    <div className="mt-2 font-medium">{client.status}</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">Faza</div>
                    <div className="mt-2 font-medium">
                      {client.phase ?? "-"}
                    </div>
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
                    Preglej zadnji check-in in preveri, ali je potreben
                    follow-up.
                  </div>
                  <div className="rounded-lg border p-4">
                    Posodobi fazo sodelovanja glede na napredek in cilje
                    stranke.
                  </div>
                  <div className="rounded-lg border p-4">
                    {getPhaseFocus(client.phase)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="habbits" className="mt-0 space-y-0">
          <SectionSubHeader
            items={[
              {
                icon: <IconRepeat className="size-4" />,
                label: "Daily habits",
                active: true,
              },
              {
                icon: <IconChartBar className="size-4" />,
                label: "Streaks",
              },
              {
                icon: <IconClipboardCheck className="size-4" />,
                label: "Weekly score",
              },
            ]}
            actions={
              <Button
                size="sm"
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <IconPlus className="size-4" />
                Add habit
              </Button>
            }
          />
          <div className="space-y-4 bg-neutral-50 px-4 py-4 lg:px-6">
            <div className="grid gap-4 md:grid-cols-3">
              {habits.map((habit) => (
                <Card key={habit.title}>
                  <CardHeader>
                    <CardDescription>{habit.title}</CardDescription>
                    <CardTitle>{habit.value}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {habit.description}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Rutina tedna</CardTitle>
                <CardDescription>
                  Kratek pregled navad, ki jih je smiselno spremljati vsak
                  teden.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                  Jutranji check: voda, kratka mobilnost, 10 minut hoje.
                </div>
                <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                  Vecerni check: spanje, magnezij, priprava obrokov za naslednji
                  dan.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="checkins" className="mt-0 space-y-0">
          <SectionSubHeader
            items={[
              {
                icon: <IconClipboardCheck className="size-4" />,
                label: "Overview",
                active: true,
              },
              {
                icon: <IconChartBar className="size-4" />,
                label: "History",
              },
              {
                icon: <IconInfoCircle className="size-4" />,
                label: "Pending",
              },
            ]}
            actions={
              <>
                <Button variant="outline" size="sm" className="border-neutral-200 text-neutral-700">
                  Last 30 days
                  <IconChevronDown className="size-4" />
                </Button>
                <Button
                  size="sm"
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  <IconPlus className="size-4" />
                  New check-in
                </Button>
              </>
            }
          />
          <div className="space-y-4 bg-neutral-50 px-4 py-4 lg:px-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardDescription>Status</CardDescription>
                  <CardTitle>{client.status}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Zadnji check-in je trenutno oznacen kot {client.status}.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Ritem</CardDescription>
                  <CardTitle>1x tedensko</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Priporocen termin je vsak ponedeljek dopoldne.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Glavni fokus</CardDescription>
                  <CardTitle>{client.phase ?? "Maintenance"}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Spremljaj energijo, izvedbo treninga in doslednost prehrane.
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Zadnje opombe</CardTitle>
                <CardDescription>
                  Povzetek zadnjih coaching signalov in follow-up tock.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                  Napredek je stabilen, potrebno je samo malo vec konsistence
                  pri spanju in hidraciji.
                </div>
                <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                  Naslednji check-in naj potrdi odziv na trenutni trening blok in
                  prehranski setup.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="nutrition" className="mt-0 space-y-0">
          <SectionSubHeader
            items={[
              {
                icon: <IconChefHat className="size-4" />,
                label: "Meal Plans",
                active: true,
              },
              {
                icon: <IconClipboardCheck className="size-4" />,
                label: "Nutrition Logger",
              },
            ]}
            actions={
              <Button
                size="sm"
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <IconPlus className="size-4" />
                Add Meal Plan
              </Button>
            }
          />
          <div className="space-y-4 bg-neutral-50 px-4 py-4 lg:px-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardDescription>Dnevni cilj</CardDescription>
                  <CardTitle>{nutrition.calories}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Nastavljeno glede na trenutno fazo in tempo napredka.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Makroji</CardDescription>
                  <CardTitle>{nutrition.macros}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Razmerje podpira trening, recovery in dober apetit.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Meal flow</CardDescription>
                  <CardTitle>4 obroki / dan</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  2 vecja obroka, 1 pre-workout in 1 vecerni recovery meal.
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Nutrition note</CardTitle>
                <CardDescription>
                  Trenutni prehranski fokus za to fazo.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {nutrition.note}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="supplements" className="mt-0 space-y-0">
          <SectionSubHeader
            items={[
              {
                icon: <IconPill className="size-4" />,
                label: "Stack",
                active: true,
              },
              {
                icon: <IconCalendarEvent className="size-4" />,
                label: "Schedule",
              },
            ]}
            actions={
              <Button
                size="sm"
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <IconPlus className="size-4" />
                Add Supplement
              </Button>
            }
          />
          <div className="space-y-4 bg-neutral-50 px-4 py-4 lg:px-6">
            <div className="grid gap-4 md:grid-cols-3">
              {supplements.map((item) => (
                <Card key={item.title}>
                  <CardHeader>
                    <CardDescription>{item.timing}</CardDescription>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {item.description}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Opomba</CardTitle>
                <CardDescription>
                  Suplementacija naj ostane preprosta in dosledna.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Prioriteta je rutina, ne kompleksnost. Dodaj samo stvari, ki jih
                stranka res redno uporablja.
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="programs" className="mt-0 space-y-0">
          <SectionSubHeader
            items={[
              {
                icon: <IconCalendarEvent className="size-4" />,
                label: "Calendar",
                active: true,
              },
              {
                icon: <IconChartBar className="size-4" />,
                label: "Exercise History",
              },
              {
                icon: <IconClipboardCheck className="size-4" />,
                label: "Completed Workouts",
              },
            ]}
            actions={
              <>
                <Button variant="outline" size="sm" className="border-neutral-200 text-neutral-700">
                  Periodise Planner
                </Button>
                <Button
                  size="sm"
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  <IconPlus className="size-4" />
                  Import Calendar
                </Button>
              </>
            }
          />
          <div className="space-y-4 bg-neutral-50 px-4 py-4 lg:px-6">
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Aktivni program</CardTitle>
                  <CardDescription>{getProgramFocus(client.phase)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {programBlocks.map((block) => (
                    <div
                      key={block}
                      className="rounded-lg border p-4 text-sm text-muted-foreground"
                    >
                      {block}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Coaching note</CardTitle>
                  <CardDescription>
                    Kaj spremljati v naslednjem programskem bloku.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="rounded-lg border p-4">
                    Fokus ostane na tehniki, doslednosti in recoveryju med
                    trening dnevi.
                  </div>
                  <div className="rounded-lg border p-4">
                    Naslednja posodobitev programa je smiselna po naslednjem
                    check-in ciklu.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
