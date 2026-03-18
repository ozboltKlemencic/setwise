"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import {
  BarChart3,
  CheckCircle2,
  Droplets,
  Flame,
  Footprints,
  MoonStar,
  Pencil,
  Plus,
  Rocket,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type HabitPoint = {
  date: string
  label: string
  value: number
}

type HabitEntry = {
  id: string
  date: string
  value: number
  memo: string
}

type HabitDefinition = {
  id: string
  title: string
  target: string
  icon: LucideIcon
  iconClassName: string
  iconWrapClassName: string
  chartColor: string
  streak: number
  stats: {
    currentStreak: string
    longestStreak: string
    completed: string
    completionRate: string
  }
  chartData: HabitPoint[]
  entries: HabitEntry[]
}

const habitsTabTriggerClassName =
  "h-8 rounded-md border-0 px-3 text-[13px] font-medium text-neutral-500 shadow-none after:hidden hover:text-neutral-700 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm"

const habitDefinitions: HabitDefinition[] = [
  {
    id: "steps",
    title: "Daily Steps",
    target: "10000 steps/day",
    icon: Footprints,
    iconClassName: "text-violet-600",
    iconWrapClassName: "bg-violet-50 border-violet-200",
    chartColor: "var(--brand-500)",
    streak: 15,
    stats: {
      currentStreak: "15 dni",
      longestStreak: "15 dni",
      completed: "15",
      completionRate: "100%",
    },
    chartData: [
      { date: "2026-03-04", label: "04 Mar", value: 13680 },
      { date: "2026-03-05", label: "05 Mar", value: 10190 },
      { date: "2026-03-06", label: "06 Mar", value: 14810 },
      { date: "2026-03-07", label: "07 Mar", value: 12340 },
      { date: "2026-03-08", label: "08 Mar", value: 11520 },
      { date: "2026-03-09", label: "09 Mar", value: 10060 },
      { date: "2026-03-10", label: "10 Mar", value: 13980 },
      { date: "2026-03-11", label: "11 Mar", value: 13260 },
      { date: "2026-03-12", label: "12 Mar", value: 10870 },
      { date: "2026-03-13", label: "13 Mar", value: 14390 },
      { date: "2026-03-14", label: "14 Mar", value: 13420 },
      { date: "2026-03-15", label: "15 Mar", value: 13690 },
      { date: "2026-03-16", label: "16 Mar", value: 14407 },
      { date: "2026-03-17", label: "17 Mar", value: 12293 },
      { date: "2026-03-18", label: "18 Mar", value: 14045 },
    ],
    entries: [
      { id: "steps-18", date: "2026-03-18", value: 14045, memo: "Dober ritem" },
      { id: "steps-17", date: "2026-03-17", value: 12293, memo: "Lahka hoja" },
      { id: "steps-16", date: "2026-03-16", value: 14407, memo: "Aktiven dan" },
      { id: "steps-15", date: "2026-03-15", value: 13690, memo: "Nedeljski sprehod" },
      { id: "steps-14", date: "2026-03-14", value: 13420, memo: "Brez opomb" },
    ],
  },
  {
    id: "water",
    title: "Water Intake",
    target: "2.5 liters/day",
    icon: Droplets,
    iconClassName: "text-sky-600",
    iconWrapClassName: "bg-sky-50 border-sky-200",
    chartColor: "#0ea5e9",
    streak: 9,
    stats: {
      currentStreak: "9 dni",
      longestStreak: "12 dni",
      completed: "11",
      completionRate: "73%",
    },
    chartData: [
      { date: "2026-03-04", label: "04 Mar", value: 2.1 },
      { date: "2026-03-05", label: "05 Mar", value: 1.8 },
      { date: "2026-03-06", label: "06 Mar", value: 2.7 },
      { date: "2026-03-07", label: "07 Mar", value: 2.4 },
      { date: "2026-03-08", label: "08 Mar", value: 2.2 },
      { date: "2026-03-09", label: "09 Mar", value: 1.9 },
      { date: "2026-03-10", label: "10 Mar", value: 2.8 },
      { date: "2026-03-11", label: "11 Mar", value: 2.6 },
      { date: "2026-03-12", label: "12 Mar", value: 2.0 },
      { date: "2026-03-13", label: "13 Mar", value: 2.9 },
      { date: "2026-03-14", label: "14 Mar", value: 2.5 },
      { date: "2026-03-15", label: "15 Mar", value: 2.6 },
      { date: "2026-03-16", label: "16 Mar", value: 2.7 },
      { date: "2026-03-17", label: "17 Mar", value: 2.3 },
      { date: "2026-03-18", label: "18 Mar", value: 2.8 },
    ],
    entries: [
      { id: "water-18", date: "2026-03-18", value: 2.8, memo: "Cilj dosezen" },
      { id: "water-17", date: "2026-03-17", value: 2.3, memo: "Malo pod planom" },
      { id: "water-16", date: "2026-03-16", value: 2.7, memo: "Brez opomb" },
      { id: "water-15", date: "2026-03-15", value: 2.6, memo: "Odlicno" },
      { id: "water-14", date: "2026-03-14", value: 2.5, memo: "Stabilno" },
    ],
  },
  {
    id: "sleep",
    title: "Sleep Duration",
    target: "8 hours/day",
    icon: MoonStar,
    iconClassName: "text-orange-600",
    iconWrapClassName: "bg-orange-50 border-orange-200",
    chartColor: "#f59e0b",
    streak: 7,
    stats: {
      currentStreak: "7 dni",
      longestStreak: "10 dni",
      completed: "10",
      completionRate: "67%",
    },
    chartData: [
      { date: "2026-03-04", label: "04 Mar", value: 7.2 },
      { date: "2026-03-05", label: "05 Mar", value: 6.7 },
      { date: "2026-03-06", label: "06 Mar", value: 8.1 },
      { date: "2026-03-07", label: "07 Mar", value: 7.8 },
      { date: "2026-03-08", label: "08 Mar", value: 7.4 },
      { date: "2026-03-09", label: "09 Mar", value: 6.9 },
      { date: "2026-03-10", label: "10 Mar", value: 8.0 },
      { date: "2026-03-11", label: "11 Mar", value: 7.7 },
      { date: "2026-03-12", label: "12 Mar", value: 7.1 },
      { date: "2026-03-13", label: "13 Mar", value: 8.2 },
      { date: "2026-03-14", label: "14 Mar", value: 7.9 },
      { date: "2026-03-15", label: "15 Mar", value: 7.6 },
      { date: "2026-03-16", label: "16 Mar", value: 8.0 },
      { date: "2026-03-17", label: "17 Mar", value: 7.3 },
      { date: "2026-03-18", label: "18 Mar", value: 7.8 },
    ],
    entries: [
      { id: "sleep-18", date: "2026-03-18", value: 7.8, memo: "Dober spanec" },
      { id: "sleep-17", date: "2026-03-17", value: 7.3, memo: "Pozna vecerja" },
      { id: "sleep-16", date: "2026-03-16", value: 8.0, memo: "Brez opomb" },
      { id: "sleep-15", date: "2026-03-15", value: 7.6, memo: "Soliden reset" },
      { id: "sleep-14", date: "2026-03-14", value: 7.9, memo: "Odlicno" },
    ],
  },
]

function formatHabitValue(habit: HabitDefinition, value: number) {
  if (habit.id === "steps") {
    return value.toLocaleString()
  }

  if (habit.id === "water") {
    return `${value.toFixed(1)} L`
  }

  return `${value.toFixed(1)} h`
}

function formatAxisValue(habit: HabitDefinition, value: number) {
  if (habit.id === "steps") {
    return value.toLocaleString()
  }

  return value.toFixed(1)
}

function HabitStatCard({
  icon: Icon,
  label,
  value,
  iconClassName,
}: {
  icon: LucideIcon
  label: string
  value: string
  iconClassName: string
}) {
  return (
    <div className="rounded-sm border border-neutral-200 bg-white px-4 py-3">
      <div className="flex items-start gap-3">
        <div className={cn("mt-0.5", iconClassName)}>
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[13px] text-neutral-500">{label}</div>
          <div className="mt-1 text-[28px] leading-none font-semibold text-neutral-950">
            {value}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ClientHabitsPanel() {
  const [selectedHabitId, setSelectedHabitId] = React.useState(
    habitDefinitions[0]?.id ?? ""
  )

  const selectedHabit =
    habitDefinitions.find((habit) => habit.id === selectedHabitId) ??
    habitDefinitions[0]
  const SelectedHabitIcon = selectedHabit.icon

  const chartConfig: ChartConfig = {
    value: {
      label: selectedHabit.title,
      color: selectedHabit.chartColor,
    },
  }

  return (
    <Tabs defaultValue="habits" className="gap-0">
      <div className="border-b border-neutral-200 bg-neutral-50">
        <div className="flex min-h-12 flex-col gap-2 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <TabsList className="rounded-md border border-neutral-200 bg-neutral-100/80 p-1">
            <TabsTrigger value="habits" className={habitsTabTriggerClassName}>
              Habits
            </TabsTrigger>
            <TabsTrigger value="overview" className={habitsTabTriggerClassName}>
              Overview
            </TabsTrigger>
          </TabsList>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-sm border-neutral-200 bg-white text-neutral-700 shadow-none hover:bg-neutral-50"
          >
            <Plus className="size-4" />
            New Habit
          </Button>
        </div>
      </div>

      <TabsContent value="habits" className="mt-0 space-y-0">
        <div className="grid gap-0 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="border-b border-neutral-200 bg-white lg:border-r lg:border-b-0">
            {habitDefinitions.map((habit) => {
              const Icon = habit.icon
              const isActive = habit.id === selectedHabit.id

              return (
                <button
                  key={habit.id}
                  type="button"
                  onClick={() => setSelectedHabitId(habit.id)}
                  className={cn(
                    "flex w-full items-center justify-between border-b border-neutral-200 px-5 py-4 text-left transition-colors last:border-b-0",
                    isActive
                      ? "bg-brand-50/50"
                      : "bg-white hover:bg-neutral-50"
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-sm border",
                        habit.iconWrapClassName
                      )}
                    >
                      <Icon className={cn("size-5", habit.iconClassName)} />
                    </div>
                    <div className="min-w-0">
                      <div
                        className={cn(
                          "truncate text-[14px] font-medium",
                          isActive ? "text-brand-700" : "text-neutral-900"
                        )}
                      >
                        {habit.title}
                      </div>
                      <div className="mt-0.5 text-[13px] text-neutral-500">
                        {habit.target}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[13px] font-medium text-neutral-700">
                    <Flame className="size-4 text-sky-500" />
                    {habit.streak}
                  </div>
                </button>
              )
            })}
          </aside>

          <div className="min-w-0 bg-neutral-50">
            <div className="space-y-4 px-4 py-4">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-sm border",
                      selectedHabit.iconWrapClassName
                    )}
                  >
                    <SelectedHabitIcon
                      className={cn("size-5", selectedHabit.iconClassName)}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[28px] leading-none font-semibold text-neutral-950">
                      {selectedHabit.title}
                    </div>
                    <div className="mt-1 text-[13px] text-neutral-500">
                      {selectedHabit.target}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-sm border-neutral-200 bg-white text-neutral-700 shadow-none hover:bg-neutral-50"
                  >
                    <Plus className="size-4" />
                    Log Habit
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="rounded-sm bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700"
                  >
                    <Pencil className="size-4" />
                    Edit Habit
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 xl:grid-cols-4">
                <HabitStatCard
                  icon={Flame}
                  label="Current Streak"
                  value={selectedHabit.stats.currentStreak}
                  iconClassName="text-sky-500"
                />
                <HabitStatCard
                  icon={Rocket}
                  label="Longest Streak"
                  value={selectedHabit.stats.longestStreak}
                  iconClassName="text-blue-500"
                />
                <HabitStatCard
                  icon={CheckCircle2}
                  label="Habit Completed"
                  value={selectedHabit.stats.completed}
                  iconClassName="text-cyan-500"
                />
                <HabitStatCard
                  icon={BarChart3}
                  label="Completion Rate"
                  value={selectedHabit.stats.completionRate}
                  iconClassName="text-sky-500"
                />
              </div>

              <div className="rounded-sm border border-neutral-200 bg-white p-4">
                <ChartContainer
                  config={chartConfig}
                  className="h-[360px] w-full aspect-auto"
                >
                  <AreaChart
                    accessibilityLayer
                    data={selectedHabit.chartData}
                    margin={{ left: 12, right: 12, top: 8, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      width={54}
                      tickMargin={8}
                      tickFormatter={(value) =>
                        formatAxisValue(selectedHabit, Number(value))
                      }
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          indicator="line"
                          labelFormatter={(_, payload) =>
                            payload?.[0]?.payload?.date ?? ""
                          }
                          formatter={(value) =>
                            formatHabitValue(selectedHabit, Number(value))
                          }
                        />
                      }
                    />
                    <defs>
                      <linearGradient id="fillHabitValue" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--color-value)"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-value)"
                          stopOpacity={0.04}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      dataKey="value"
                      type="natural"
                      fill="url(#fillHabitValue)"
                      fillOpacity={1}
                      stroke="var(--color-value)"
                      strokeWidth={2.5}
                    />
                  </AreaChart>
                </ChartContainer>
              </div>

              <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-4">Value</TableHead>
                      <TableHead>Memo</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-14 pr-4">
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedHabit.entries.map((entry) => (
                      <TableRow key={entry.id} className="bg-white">
                        <TableCell className="pl-4 text-[14px] font-medium text-neutral-900">
                          {formatHabitValue(selectedHabit, entry.value)}
                        </TableCell>
                        <TableCell className="text-[14px] text-neutral-500">
                          {entry.memo}
                        </TableCell>
                        <TableCell className="text-[14px] text-neutral-700">
                          {entry.date}
                        </TableCell>
                        <TableCell className="pr-4 text-right">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-xs"
                            className="size-8 rounded-sm border-neutral-200 bg-white text-neutral-600 shadow-none hover:bg-neutral-50 hover:text-neutral-900"
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="overview" className="mt-0 space-y-0">
        <div className="space-y-4 px-4 py-4">
          <div className="grid gap-4 xl:grid-cols-3">
            {habitDefinitions.map((habit) => {
              const Icon = habit.icon

              return (
                <div
                  key={habit.id}
                  className="rounded-sm border border-neutral-200 bg-white p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex size-10 items-center justify-center rounded-sm border",
                        habit.iconWrapClassName
                      )}
                    >
                      <Icon className={cn("size-5", habit.iconClassName)} />
                    </div>
                    <div>
                      <div className="text-[15px] font-medium text-neutral-900">
                        {habit.title}
                      </div>
                      <div className="text-[13px] text-neutral-500">
                        {habit.target}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-sm border border-neutral-200 bg-neutral-50 px-3 py-2">
                      <div className="text-[12px] text-neutral-500">Streak</div>
                      <div className="mt-1 text-[18px] font-semibold text-neutral-950">
                        {habit.stats.currentStreak}
                      </div>
                    </div>
                    <div className="rounded-sm border border-neutral-200 bg-neutral-50 px-3 py-2">
                      <div className="text-[12px] text-neutral-500">Rate</div>
                      <div className="mt-1 text-[18px] font-semibold text-neutral-950">
                        {habit.stats.completionRate}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
