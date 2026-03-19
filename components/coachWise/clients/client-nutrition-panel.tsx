"use client"

import * as React from "react"
import {
  Beef,
  CheckCircle2,
  ChefHat,
  ClipboardList,
  Droplets,
  MoreVertical,
  NotebookPen,
  Plus,
  Sparkles,
  Target,
  UtensilsCrossed,
} from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type NutritionMacroSegment = {
  macro: "protein" | "carbs" | "fats"
  value: number
  fill: string
}

type NutritionMealPlan = {
  id: string
  title: string
  subtitle: string
  type: string
  calories: number
  macros: string
  schedule: string
  segments: NutritionMacroSegment[]
}

type NutritionLogEntry = {
  id: string
  day: string
  calories: string
  protein: string
  hydration: string
  note: string
  status: string
}

type NutritionPreset = {
  dailyTarget: string
  macroTarget: string
  mealCadence: string
  coachNote: string
  planCoverage: string
  loggerStats: {
    loggedDays: string
    proteinTarget: string
    hydrationAverage: string
    consistency: string
  }
  loggerNote: string
  loggerChecklist: string[]
  mealPlans: NutritionMealPlan[]
  loggerEntries: NutritionLogEntry[]
}

const nutritionSubTabTriggerClassName =
  "h-auto flex-none gap-1.5 rounded-none border-0 bg-transparent px-0 py-2.5 text-[13px] font-normal text-neutral-500 shadow-none after:hidden hover:text-neutral-700 data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none [&_svg]:size-3.5 [&_svg]:text-neutral-400 data-[state=active]:[&_svg]:text-brand-600"

const primaryActionButtonClassName =
  "border-transparent bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700"

const mealPlanDonutConfig = {
  protein: {
    label: "Protein",
    color: "#8b5cf6",
  },
  carbs: {
    label: "Carbs",
    color: "#3b82f6",
  },
  fats: {
    label: "Fats",
    color: "#22c55e",
  },
} satisfies ChartConfig

function getNutritionPreset(phase?: string): NutritionPreset {
  switch (phase) {
    case "Bulk":
      return {
        dailyTarget: "3150 kcal",
        macroTarget: "190P / 390C / 80F",
        mealCadence: "5 obrokov / dan",
        coachNote:
          "Fokus je na visjem vnosu okrog treninga, dovolj beljakovin in stabilnem apetitu skozi teden.",
        planCoverage: "2 aktivna plana",
        loggerStats: {
          loggedDays: "12 / 14",
          proteinTarget: "95%",
          hydrationAverage: "2.9 L",
          consistency: "Zelo dobra",
        },
        loggerNote:
          "Logging je dovolj dosleden za coaching odlocitve. Najvec odstopanj je pri vikend snackih.",
        loggerChecklist: [
          "povecaj zelenjavo v zadnjem obroku",
          "ohrani ogljikove hidrate pred treningom",
          "vikend obroke zadrzi v istem ritmu",
        ],
        mealPlans: [
          {
            id: "training-day",
            title: "Training Day Meal",
            subtitle: "Vec carbs okoli treninga in 1 recovery meal po vadbi.",
            type: "Meal Plan",
            calories: 2100,
            macros: "185P / 250C / 50F",
            schedule: "4 meals",
            segments: [
              { macro: "protein", value: 32, fill: "var(--color-protein)" },
              { macro: "carbs", value: 48, fill: "var(--color-carbs)" },
              { macro: "fats", value: 20, fill: "var(--color-fats)" },
            ],
          },
          {
            id: "rest-day",
            title: "Rest Day Meal",
            subtitle: "Malo manj carbs, vec sitosti in stabilna energija.",
            type: "Meal Plan",
            calories: 1640,
            macros: "190P / 145C / 52F",
            schedule: "4 meals",
            segments: [
              { macro: "protein", value: 39, fill: "var(--color-protein)" },
              { macro: "carbs", value: 31, fill: "var(--color-carbs)" },
              { macro: "fats", value: 30, fill: "var(--color-fats)" },
            ],
          },
        ],
        loggerEntries: [
          {
            id: "bulk-18",
            day: "Tor, 18 Mar",
            calories: "3020 kcal",
            protein: "188 g",
            hydration: "3.0 L",
            note: "Dober trening dan, appetite steady.",
            status: "On target",
          },
          {
            id: "bulk-17",
            day: "Pon, 17 Mar",
            calories: "2870 kcal",
            protein: "180 g",
            hydration: "2.7 L",
            note: "Malo manj carbs zvecer.",
            status: "Slightly low",
          },
          {
            id: "bulk-16",
            day: "Ned, 16 Mar",
            calories: "3190 kcal",
            protein: "195 g",
            hydration: "3.1 L",
            note: "Vikend ritem ostal pod kontrolo.",
            status: "On target",
          },
        ],
      }
    case "Cut":
      return {
        dailyTarget: "2150 kcal",
        macroTarget: "185P / 190C / 65F",
        mealCadence: "4 obroki / dan",
        coachNote:
          "Deficit ostaja zmeren. Prioriteta je sitost, visoke beljakovine in dober trening output.",
        planCoverage: "2 aktivna plana",
        loggerStats: {
          loggedDays: "11 / 14",
          proteinTarget: "92%",
          hydrationAverage: "2.4 L",
          consistency: "Dobra",
        },
        loggerNote:
          "Logger je dovolj dober za odlocitve. Najvec odstopanj je pri vecernih snackih in vikendih.",
        loggerChecklist: [
          "drzi protein nad 180 g",
          "ob vikendih pripravi 1 anchor meal vnaprej",
          "dvigni vodo na 2.7 L ob tezjih treningih",
        ],
        mealPlans: [
          {
            id: "training-day",
            title: "Training Day Meal",
            subtitle: "Vec hrane okoli treninga, deficit pa ostane pod kontrolo.",
            type: "Meal Plan",
            calories: 1600,
            macros: "180P / 145C / 42F",
            schedule: "4 meals",
            segments: [
              { macro: "protein", value: 40, fill: "var(--color-protein)" },
              { macro: "carbs", value: 37, fill: "var(--color-carbs)" },
              { macro: "fats", value: 23, fill: "var(--color-fats)" },
            ],
          },
          {
            id: "rest-day",
            title: "Rest Day Meal",
            subtitle: "Nizji carbs, vec sitosti in dober recovery med deficitom.",
            type: "Meal Plan",
            calories: 1004,
            macros: "155P / 68C / 36F",
            schedule: "3 meals",
            segments: [
              { macro: "protein", value: 46, fill: "var(--color-protein)" },
              { macro: "carbs", value: 24, fill: "var(--color-carbs)" },
              { macro: "fats", value: 30, fill: "var(--color-fats)" },
            ],
          },
        ],
        loggerEntries: [
          {
            id: "cut-18",
            day: "Tor, 18 Mar",
            calories: "2115 kcal",
            protein: "186 g",
            hydration: "2.5 L",
            note: "Dober dan, brez vecjih odstopanj.",
            status: "On target",
          },
          {
            id: "cut-17",
            day: "Pon, 17 Mar",
            calories: "2260 kcal",
            protein: "174 g",
            hydration: "2.2 L",
            note: "Vecerni snack je dvignil vnos.",
            status: "Above target",
          },
          {
            id: "cut-16",
            day: "Ned, 16 Mar",
            calories: "2050 kcal",
            protein: "182 g",
            hydration: "2.6 L",
            note: "Vikend je bil bolj stabilen kot prej.",
            status: "On target",
          },
        ],
      }
    default:
      return {
        dailyTarget: "2450 kcal",
        macroTarget: "180P / 250C / 70F",
        mealCadence: "4 obroki / dan",
        coachNote:
          "Vzdrzevalni plan drzi formo stabilno. Fokus je na rutini, hidraciji in dobrem recoveryju.",
        planCoverage: "2 aktivna plana",
        loggerStats: {
          loggedDays: "10 / 14",
          proteinTarget: "89%",
          hydrationAverage: "2.6 L",
          consistency: "Stabilna",
        },
        loggerNote:
          "Najvec koristi pride iz bolj doslednega zajtrka in manj improvizacije v zadnjem obroku.",
        loggerChecklist: [
          "zajtrk naj bo bolj predvidljiv",
          "obdrzi 4 anchor obroke skozi teden",
          "vnos vode dvigni ob bolj aktivnih dnevih",
        ],
        mealPlans: [
          {
            id: "training-day",
            title: "Training Day Meal",
            subtitle: "Uravnotezen plan za performans in dober recovery.",
            type: "Meal Plan",
            calories: 1840,
            macros: "175P / 185C / 52F",
            schedule: "4 meals",
            segments: [
              { macro: "protein", value: 38, fill: "var(--color-protein)" },
              { macro: "carbs", value: 39, fill: "var(--color-carbs)" },
              { macro: "fats", value: 23, fill: "var(--color-fats)" },
            ],
          },
          {
            id: "rest-day",
            title: "Rest Day Meal",
            subtitle: "Malo bolj sitostno naravnan plan za manj aktivne dni.",
            type: "Meal Plan",
            calories: 1260,
            macros: "165P / 102C / 40F",
            schedule: "3 meals",
            segments: [
              { macro: "protein", value: 44, fill: "var(--color-protein)" },
              { macro: "carbs", value: 28, fill: "var(--color-carbs)" },
              { macro: "fats", value: 28, fill: "var(--color-fats)" },
            ],
          },
        ],
        loggerEntries: [
          {
            id: "maint-18",
            day: "Tor, 18 Mar",
            calories: "2420 kcal",
            protein: "178 g",
            hydration: "2.7 L",
            note: "Ritem je stabilen, energija dobra.",
            status: "On target",
          },
          {
            id: "maint-17",
            day: "Pon, 17 Mar",
            calories: "2360 kcal",
            protein: "171 g",
            hydration: "2.5 L",
            note: "Manj apetita v drugem delu dneva.",
            status: "Slightly low",
          },
          {
            id: "maint-16",
            day: "Ned, 16 Mar",
            calories: "2510 kcal",
            protein: "183 g",
            hydration: "2.6 L",
            note: "Dober vikend brez vecjih nihanj.",
            status: "On target",
          },
        ],
      }
  }
}

function NutritionSectionHeader({
  items,
  actions,
}: {
  items: {
    icon: React.ReactNode
    label: string
    value: string
  }[]
  actions?: React.ReactNode
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
                className={nutritionSubTabTriggerClassName}
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

function NutritionMetricCard({
  icon: Icon,
  label,
  value,
  hint,
  iconClassName,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  hint: string
  iconClassName: string
}) {
  return (
    <Card className="rounded-xl border-neutral-200 shadow-none">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
        <div className="space-y-1">
          <CardDescription className="text-[12px] text-neutral-500">
            {label}
          </CardDescription>
          <CardTitle className="text-[26px] font-semibold text-neutral-950">
            {value}
          </CardTitle>
        </div>
        <div className="rounded-full bg-neutral-50 p-2">
          <Icon className={iconClassName} />
        </div>
      </CardHeader>
      <CardContent className="pt-0 text-[13px] text-neutral-500">
        {hint}
      </CardContent>
    </Card>
  )
}

function NutritionCaloriesDonut({ plan }: { plan: NutritionMealPlan }) {
  return (
    <ChartContainer
      config={mealPlanDonutConfig}
      className="mx-auto aspect-square size-[68px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={plan.segments}
          dataKey="value"
          nameKey="macro"
          innerRadius={20}
          outerRadius={27}
          strokeWidth={2}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-neutral-950 text-[11px] font-semibold"
                    >
                      {plan.calories}
                    </tspan>
                  </text>
                )
              }

              return null
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

function NutritionLoggerStatusBadge({ status }: { status: string }) {
  const isPositive = status === "On target"

  return (
    <Badge
      variant="outline"
      className={
        isPositive
          ? "rounded-full border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[12px] font-normal text-emerald-700"
          : "rounded-full border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[12px] font-normal text-amber-700"
      }
    >
      {status}
    </Badge>
  )
}

export function ClientNutritionPanel({ phase }: { phase?: string }) {
  const [activeTab, setActiveTab] = React.useState<
    "meal-plans" | "nutrition-logger"
  >("meal-plans")
  const preset = React.useMemo(() => getNutritionPreset(phase), [phase])

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) =>
        setActiveTab(value as "meal-plans" | "nutrition-logger")
      }
      className="gap-0"
    >
      <NutritionSectionHeader
        items={[
          {
            icon: <UtensilsCrossed className="size-4" />,
            label: "Meal Plans",
            value: "meal-plans",
          },
          {
            icon: <NotebookPen className="size-4" />,
            label: "Nutrition Logger",
            value: "nutrition-logger",
          },
        ]}
        actions={
          activeTab === "meal-plans" ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="rounded-sm border-neutral-200 text-neutral-700 shadow-none hover:bg-neutral-50"
              >
                <Sparkles className="size-4 text-brand-600" />
                Smart Meal Planner
                <Badge className="ml-1 rounded-full border-0 bg-violet-100 px-1.5 py-0 text-[10px] font-semibold tracking-wide text-violet-700 shadow-none">
                  NEW
                </Badge>
              </Button>
              <Button size="sm" className={primaryActionButtonClassName}>
                <Plus className="size-4" />
                Add Meal Plan
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="rounded-sm border-neutral-200 text-neutral-700 shadow-none hover:bg-neutral-50"
              >
                <ClipboardList className="size-4" />
                Export Summary
              </Button>
              <Button size="sm" className={primaryActionButtonClassName}>
                <Plus className="size-4" />
                Add Log
              </Button>
            </>
          )
        }
      />

      <TabsContent value="meal-plans" className="mt-0 space-y-0">
        <div className="space-y-4 bg-neutral-50 px-4 py-4">
          <div className="grid gap-3 xl:grid-cols-4">
            <NutritionMetricCard
              icon={Target}
              label="Dnevni cilj"
              value={preset.dailyTarget}
              hint="Aktualni cilj za trenutno fazo."
              iconClassName="size-4 text-cyan-500"
            />
            <NutritionMetricCard
              icon={Beef}
              label="Makro target"
              value={preset.macroTarget}
              hint="Beljakovine ostajajo prioriteta."
              iconClassName="size-4 text-violet-500"
            />
            <NutritionMetricCard
              icon={ChefHat}
              label="Meal cadence"
              value={preset.mealCadence}
              hint="Anchor obroki drzijo ritem tedna."
              iconClassName="size-4 text-orange-500"
            />
            <NutritionMetricCard
              icon={CheckCircle2}
              label="Plan coverage"
              value={preset.planCoverage}
              hint="Training in rest day plan sta aktivna."
              iconClassName="size-4 text-emerald-500"
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4 lg:pl-5">
                    <div className="w-[20rem] min-w-[20rem]">Plan</div>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-[140px] text-center">
                    Calories
                  </TableHead>
                  <TableHead className="px-1 pr-2 lg:pr-3">
                    <div className="w-6" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preset.mealPlans.map((plan) => (
                  <TableRow key={plan.id} className="bg-white hover:bg-neutral-50/60">
                    <TableCell className="pl-4 lg:pl-5">
                      <div className="space-y-1">
                        <div className="text-[15px] font-medium text-neutral-950">
                          {plan.title}
                        </div>
                        <div className="text-[13px] text-neutral-500">
                          {plan.subtitle}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="rounded-md border-neutral-200 bg-white px-2.5 py-1 text-[12px] font-normal text-neutral-700"
                      >
                        <UtensilsCrossed className="mr-1 size-3.5 text-neutral-500" />
                        {plan.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <NutritionCaloriesDonut plan={plan} />
                    </TableCell>
                    <TableCell className="px-1 pr-2 lg:pr-3">
                      <div className="flex w-6 justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon-sm"
                              className="size-6 cursor-pointer rounded-md border-neutral-200/45 bg-transparent text-muted-foreground shadow-none transition-colors hover:border-neutral-200/70 hover:bg-neutral-50/70 hover:text-foreground data-[state=open]:border-neutral-200/70 data-[state=open]:bg-neutral-50/80"
                            >
                              <MoreVertical className="size-3" />
                              <span className="sr-only">Odpri meni plana</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            sideOffset={8}
                            className="w-44 rounded-lg border-neutral-200/60 bg-white/95 p-1.5 shadow-lg shadow-black/5 backdrop-blur-sm"
                          >
                            <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-[13px] focus:bg-neutral-50">
                              Uredi plan
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-[13px] focus:bg-neutral-50">
                              Podvoji plan
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-[13px] text-rose-600 focus:bg-rose-50 focus:text-rose-600">
                              Arhiviraj
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-3 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <Card className="rounded-xl border-neutral-200 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-[16px] font-semibold text-neutral-950">
                  Nutrition focus
                </CardTitle>
                <CardDescription className="text-[13px] text-neutral-500">
                  Trenutna strategija prehrane za to fazo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-[14px] leading-6 text-neutral-600">
                  {preset.coachNote}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {preset.mealPlans.map((plan) => (
                    <div
                      key={`${plan.id}-meta`}
                      className="rounded-lg border border-neutral-200 bg-white p-4"
                    >
                      <div className="text-[13px] font-medium text-neutral-900">
                        {plan.title}
                      </div>
                      <div className="mt-2 text-[13px] text-neutral-500">
                        {plan.macros}
                      </div>
                      <div className="mt-1 text-[13px] text-neutral-500">
                        {plan.schedule}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-neutral-200 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-[16px] font-semibold text-neutral-950">
                  Meal plan notes
                </CardTitle>
                <CardDescription className="text-[13px] text-neutral-500">
                  Kaj naj ostane dosledno cez teden.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-[14px] text-neutral-600">
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
                  Protein naj ostane enakomerno razporejen v vseh glavnih obrokih.
                </div>
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
                  Vecji del ogljikovih hidratov naj bo pred in po treningu.
                </div>
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
                  Zadnji obrok naj bo sitosten, da vikend ne razbije ritma.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="nutrition-logger" className="mt-0 space-y-0">
        <div className="space-y-4 bg-neutral-50 px-4 py-4">
          <div className="grid gap-3 xl:grid-cols-4">
            <NutritionMetricCard
              icon={ClipboardList}
              label="Logged days"
              value={preset.loggerStats.loggedDays}
              hint="Vnos je dovolj reden za coaching review."
              iconClassName="size-4 text-brand-500"
            />
            <NutritionMetricCard
              icon={Beef}
              label="Protein target"
              value={preset.loggerStats.proteinTarget}
              hint="Beljakovine ostajajo najbolj pomemben marker."
              iconClassName="size-4 text-violet-500"
            />
            <NutritionMetricCard
              icon={Droplets}
              label="Hydration avg"
              value={preset.loggerStats.hydrationAverage}
              hint="Vnos vode je blizu zeljenemu ritmu."
              iconClassName="size-4 text-sky-500"
            />
            <NutritionMetricCard
              icon={CheckCircle2}
              label="Consistency"
              value={preset.loggerStats.consistency}
              hint="Najvec odstopanj se zgodi zvecer in cez vikend."
              iconClassName="size-4 text-emerald-500"
            />
          </div>

          <div className="grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-4 lg:pl-5">Dan</TableHead>
                    <TableHead>Kalorije</TableHead>
                    <TableHead>Protein</TableHead>
                    <TableHead>Voda</TableHead>
                    <TableHead>Opomba</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preset.loggerEntries.map((entry) => (
                    <TableRow key={entry.id} className="bg-white hover:bg-neutral-50/60">
                      <TableCell className="pl-4 text-[14px] font-medium text-neutral-900 lg:pl-5">
                        {entry.day}
                      </TableCell>
                      <TableCell className="text-[14px] text-neutral-600">
                        {entry.calories}
                      </TableCell>
                      <TableCell className="text-[14px] text-neutral-600">
                        {entry.protein}
                      </TableCell>
                      <TableCell className="text-[14px] text-neutral-600">
                        {entry.hydration}
                      </TableCell>
                      <TableCell className="max-w-[280px] text-[14px] text-neutral-500">
                        {entry.note}
                      </TableCell>
                      <TableCell>
                        <NutritionLoggerStatusBadge status={entry.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Card className="rounded-xl border-neutral-200 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-[16px] font-semibold text-neutral-950">
                  Logger note
                </CardTitle>
                <CardDescription className="text-[13px] text-neutral-500">
                  Kratek coaching povzetek iz zadnjih vnosov.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-[14px] leading-6 text-neutral-600">
                  {preset.loggerNote}
                </div>
                <div className="space-y-2">
                  {preset.loggerChecklist.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-[13px] text-neutral-600"
                    >
                      <span className="mt-1 size-1.5 rounded-full bg-brand-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
