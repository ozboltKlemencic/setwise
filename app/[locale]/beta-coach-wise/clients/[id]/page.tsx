import type { ReactNode } from "react"
import {
  IconCalendarEvent,
  IconChartBar,
  IconChefHat,
  IconChevronDown,
  IconClipboardCheck,
  IconClipboardList,
  IconInfoCircle,
  IconPill,
  IconPlus,
  IconRepeat,
  IconSettings,
} from "@tabler/icons-react"
import { notFound } from "next/navigation"

import { WorkoutCalendar } from "@/components/coachWise/programs/workout-calendar"
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

const profileTabs = [
  {
    label: "Info",
    value: "info",
    icon: <IconInfoCircle className="size-4" />,
  },
  {
    label: "Habbits",
    value: "habbits",
    icon: <IconRepeat className="size-4" />,
  },
  {
    label: "Check-ins",
    value: "checkins",
    icon: <IconClipboardCheck className="size-4" />,
  },
  {
    label: "Nutrition",
    value: "nutrition",
    icon: <IconChefHat className="size-4" />,
  },
  {
    label: "Supplements",
    value: "supplements",
    icon: <IconPill className="size-4" />,
  },
  {
    label: "Programs",
    value: "programs",
    icon: <IconClipboardList className="size-4" />,
  },
] as const

const profileTabTriggerClassName =
  "h-full flex-none gap-1.5 rounded-none border-0 border-b-2 border-transparent bg-transparent px-3.5 py-2 text-[13.5px] font-normal text-neutral-500 after:hidden hover:text-neutral-700 data-[state=active]:border-(--brand-500) data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none [&_svg]:size-3.5 [&_svg]:text-neutral-400 data-[state=active]:[&_svg]:text-(--brand-600)"

const primaryActionButtonClassName =
  "border-transparent bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700"

const sectionSubTabTriggerClassName =
  "h-auto flex-none gap-1.5 rounded-none border-0 bg-transparent px-0 py-2.5 text-[13px] font-normal text-neutral-500 after:hidden hover:text-neutral-700 data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none [&_svg]:size-3.5 [&_svg]:text-neutral-400 data-[state=active]:[&_svg]:text-brand-600"

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

function SectionSubHeader({
  items,
  actions,
}: {
  items: {
    icon: ReactNode
    label: string
    value: string
  }[]
  actions?: ReactNode
}) {
  return (
    <div className="border-b border-neutral-200 bg-neutral-50">
      <div className="flex min-h-10 flex-col gap-2.5 px-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <TabsList
            variant="line"
            className="h-auto w-max min-w-max justify-start gap-4 rounded-none bg-transparent p-0"
          >
            {items.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className={sectionSubTabTriggerClassName}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-1.5">{actions}</div>
        ) : null}
      </div>
    </div>
  )
}

function SectionBody({ children }: { children: ReactNode }) {
  return <div className="space-y-4 bg-neutral-50">{children}</div>
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
  return (
    <section className="min-w-0 bg-neutral-50">
      <Tabs defaultValue="info" className="min-w-0 w-full gap-0">
        <div className="border-b border-neutral-200 bg-neutral-50">
          <div className="flex min-w-0 items-center">
            <div className="min-w-0 flex-1 overflow-x-auto">
              <TabsList
                variant="line"
                className="w-max min-w-full justify-start gap-0 rounded-none bg-transparent p-0"
              >
                {profileTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={profileTabTriggerClassName}
                  >
                    {tab.icon}
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>
        </div>

        <TabsContent value="info" className="mt-0 space-y-0">
          <Tabs defaultValue="general" className="gap-0">
            <SectionSubHeader
              items={[
                {
                  icon: <IconInfoCircle className="size-4" />,
                  label: "General",
                  value: "general",
                },
                {
                  icon: <IconChartBar className="size-4" />,
                  label: "Progress",
                  value: "progress",
                },
                {
                  icon: <IconClipboardCheck className="size-4" />,
                  label: "Notes",
                  value: "notes",
                },
              ]}
              actions={
                <Button size="sm" className={primaryActionButtonClassName}>
                  Edit client
                </Button>
              }
            />

            <TabsContent value="general" className="mt-0 space-y-0">
              <SectionBody>
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
              </SectionBody>
            </TabsContent>

            <TabsContent value="progress" className="mt-0 space-y-0">
              <SectionBody>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardDescription>Momentum</CardDescription>
                      <CardTitle>Stabilen</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Zadnja dva cikla kažeta dober odziv na trenutni plan.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Recovery</CardDescription>
                      <CardTitle>7.3 / 10</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Spanje in hidracija ostajata glavni ročici za naslednji korak.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Adherence</CardDescription>
                      <CardTitle>86%</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Dobra konsistenca pri treningu, manj nihanja pri vikend rutini.
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Fazni napredek</CardTitle>
                    <CardDescription>
                      Kratek povzetek stanja glede na trenutno fazo sodelovanja.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                      {getPhaseFocus(client.phase)}
                    </div>
                    <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                      Naslednja smiselna točka je primerjava zadnjega check-ina s
                      trening logom in energijo čez teden.
                    </div>
                  </CardContent>
                </Card>
              </SectionBody>
            </TabsContent>

            <TabsContent value="notes" className="mt-0 space-y-0">
              <SectionBody>
                <Card>
                  <CardHeader>
                    <CardTitle>Coach notes</CardTitle>
                    <CardDescription>
                      Operativne opombe za naslednji stik s stranko.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div className="rounded-lg border p-4">
                      Stranka dobro reagira na jasen tedenski ritem in kratke
                      actionable korake.
                    </div>
                    <div className="rounded-lg border p-4">
                      Pri naslednjem klicu preveri spanec, stres in izvedbo obrokov
                      v bolj napornih dneh.
                    </div>
                    <div className="rounded-lg border p-4">
                      Če ostane ritem stabilen, lahko naslednji blok dobi malo več
                      volumna ali višji prehranski target.
                    </div>
                  </CardContent>
                </Card>
              </SectionBody>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="habbits" className="mt-0 space-y-0">
          <Tabs defaultValue="daily-habits" className="gap-0">
            <SectionSubHeader
              items={[
                {
                  icon: <IconRepeat className="size-4" />,
                  label: "Daily habits",
                  value: "daily-habits",
                },
                {
                  icon: <IconChartBar className="size-4" />,
                  label: "Streaks",
                  value: "streaks",
                },
                {
                  icon: <IconClipboardCheck className="size-4" />,
                  label: "Weekly score",
                  value: "weekly-score",
                },
              ]}
              actions={
                <Button size="sm" className={primaryActionButtonClassName}>
                  <IconPlus className="size-4" />
                  Add habit
                </Button>
              }
            />

            <TabsContent value="daily-habits" className="mt-0 space-y-0">
              <SectionBody>
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
              </SectionBody>
            </TabsContent>

            <TabsContent value="streaks" className="mt-0 space-y-0">
              <SectionBody>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardDescription>Sleep streak</CardDescription>
                      <CardTitle>12 dni</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Več kot 7 ur spanja v zadnjih dveh tednih.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Hydration streak</CardDescription>
                      <CardTitle>9 dni</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Dnevni cilj tekočine je dosežen skoraj vsak dan.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Steps streak</CardDescription>
                      <CardTitle>6 dni</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Gibanje je najboljše na trening dneve, vikendi še nihajo.
                    </CardContent>
                  </Card>
                </div>
              </SectionBody>
            </TabsContent>

            <TabsContent value="weekly-score" className="mt-0 space-y-0">
              <SectionBody>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardDescription>Overall score</CardDescription>
                      <CardTitle>8.4 / 10</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Consistency</CardDescription>
                      <CardTitle>84%</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Next focus</CardDescription>
                      <CardTitle>Weekend rhythm</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Tedenski povzetek</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Navade so dobre med delovnikom. Največ rezerve je v sobotnem in
                    nedeljskem ritmu prehrane, spanja in korakov.
                  </CardContent>
                </Card>
              </SectionBody>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="checkins" className="mt-0 space-y-0">
          <Tabs defaultValue="overview" className="gap-0">
            <SectionSubHeader
              items={[
                {
                  icon: <IconClipboardCheck className="size-4" />,
                  label: "Overview",
                  value: "overview",
                },
                {
                  icon: <IconChartBar className="size-4" />,
                  label: "History",
                  value: "history",
                },
                {
                  icon: <IconInfoCircle className="size-4" />,
                  label: "Pending",
                  value: "pending",
                },
              ]}
              actions={
                <>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    className="border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
                  >
                    <IconSettings className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-neutral-200 text-neutral-700"
                  >
                    Last 30 days
                    <IconChevronDown className="size-4" />
                  </Button>
                  <Button size="sm" className={primaryActionButtonClassName}>
                    <IconPlus className="size-4" />
                    New check-in
                  </Button>
                </>
              }
            />

            <TabsContent value="overview" className="mt-0 space-y-0">
              <SectionBody>
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
              </SectionBody>
            </TabsContent>

            <TabsContent value="history" className="mt-0 space-y-0">
              <SectionBody>
                <Card>
                  <CardHeader>
                    <CardTitle>Check-in history</CardTitle>
                    <CardDescription>
                      Zadnji trije vnosi in ključni poudarki.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                      11 Mar: energija bolj stabilna, spanec izboljšan, trening dober.
                    </div>
                    <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                      04 Mar: prehrana konsistentna, hidracija nekoliko pod planom.
                    </div>
                    <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                      26 Feb: dober začetek cikla, potreben manjši popravek vikend rutine.
                    </div>
                  </CardContent>
                </Card>
              </SectionBody>
            </TabsContent>

            <TabsContent value="pending" className="mt-0 space-y-0">
              <SectionBody>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardDescription>Naslednji rok</CardDescription>
                      <CardTitle>Ponedeljek</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Open items</CardDescription>
                      <CardTitle>3</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Priority</CardDescription>
                      <CardTitle>Sleep + nutrition</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
              </SectionBody>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="nutrition" className="mt-0 space-y-0">
          <Tabs defaultValue="meal-plans" className="gap-0">
            <SectionSubHeader
              items={[
                {
                  icon: <IconChefHat className="size-4" />,
                  label: "Meal Plans",
                  value: "meal-plans",
                },
                {
                  icon: <IconClipboardCheck className="size-4" />,
                  label: "Nutrition Logger",
                  value: "nutrition-logger",
                },
              ]}
              actions={
                <Button size="sm" className={primaryActionButtonClassName}>
                  <IconPlus className="size-4" />
                  Add Meal Plan
                </Button>
              }
            />

            <TabsContent value="meal-plans" className="mt-0 space-y-0">
              <SectionBody>
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
              </SectionBody>
            </TabsContent>

            <TabsContent value="nutrition-logger" className="mt-0 space-y-0">
              <SectionBody>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardDescription>Logged days</CardDescription>
                      <CardTitle>11 / 14</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Protein target</CardDescription>
                      <CardTitle>92%</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Hydration</CardDescription>
                      <CardTitle>2.4L avg</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Logger note</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Logging je dovolj dober za coaching odločitve. Največ odstopanja
                    nastane pri vikend obrokih in večernih snackih.
                  </CardContent>
                </Card>
              </SectionBody>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="supplements" className="mt-0 space-y-0">
          <Tabs defaultValue="stack" className="gap-0">
            <SectionSubHeader
              items={[
                {
                  icon: <IconPill className="size-4" />,
                  label: "Stack",
                  value: "stack",
                },
                {
                  icon: <IconCalendarEvent className="size-4" />,
                  label: "Schedule",
                  value: "schedule",
                },
              ]}
              actions={
                <Button size="sm" className={primaryActionButtonClassName}>
                  <IconPlus className="size-4" />
                  Add Supplement
                </Button>
              }
            />

            <TabsContent value="stack" className="mt-0 space-y-0">
              <SectionBody>
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
              </SectionBody>
            </TabsContent>

            <TabsContent value="schedule" className="mt-0 space-y-0">
              <SectionBody>
                <Card>
                  <CardHeader>
                    <CardTitle>Dnevni razpored</CardTitle>
                    <CardDescription>
                      Enostaven timing za boljšo doslednost.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                      Jutro: kreatin + omega 3
                    </div>
                    <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                      Kosilo: omega 3 in obrok z dovolj beljakovin
                    </div>
                    <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                      Večer: magnezij in priprava na spanec
                    </div>
                  </CardContent>
                </Card>
              </SectionBody>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="programs" className="mt-0 space-y-0">
          <Tabs defaultValue="calendar" className="gap-0">
            <SectionSubHeader
              items={[
                {
                  icon: <IconCalendarEvent className="size-4" />,
                  label: "Calendar",
                  value: "calendar",
                },
                {
                  icon: <IconChartBar className="size-4" />,
                  label: "Exercise History",
                  value: "exercise-history",
                },
                {
                  icon: <IconClipboardCheck className="size-4" />,
                  label: "Completed Workouts",
                  value: "completed-workouts",
                },
              ]}
              actions={
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-neutral-200 text-neutral-700"
                  >
                    Periodise Planner
                  </Button>
                  <Button size="sm" className={primaryActionButtonClassName}>
                    <IconPlus className="size-4" />
                    Import Calendar
                  </Button>
                </>
              }
            />

            <TabsContent value="calendar" className="mt-0 space-y-0">
              <SectionBody>
                <WorkoutCalendar />
              </SectionBody>
            </TabsContent>

            <TabsContent value="exercise-history" className="mt-0 space-y-0">
              <SectionBody>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardDescription>Top lift</CardDescription>
                      <CardTitle>Bench press</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Zadnji cikel je pokazal lepo tehnično stabilnost in napredek.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Most repeated</CardDescription>
                      <CardTitle>RDL</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Focus block</CardDescription>
                      <CardTitle>Upper strength</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
              </SectionBody>
            </TabsContent>

            <TabsContent value="completed-workouts" className="mt-0 space-y-0">
              <SectionBody>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardDescription>Completed</CardDescription>
                      <CardTitle>14 workouts</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Completion rate</CardDescription>
                      <CardTitle>88%</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Missed sessions</CardDescription>
                      <CardTitle>2</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
              </SectionBody>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </section>
  )
}
