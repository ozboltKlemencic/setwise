"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Dumbbell,
  Scale,
  TrendingDown,
  TrendingUp,
} from "lucide-react"

import {
  type HabitPeriod,
  getMonthEnd,
  getMonthStart,
} from "@/components/coachWise/clients/habits/habit-period-picker"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type MetricAverageRow = {
  label: string
  value: string
  delta: string
  tone: "up" | "down"
}

type CompletedWorkoutTrend = "up" | "down" | "steady"

type CompletedWorkoutRow = {
  id: string
  title: string
  dateLabel: string
  duration: string
  volume: string
  trend: CompletedWorkoutTrend
  changeLabel: string
  monthLabel: string
}

type ClientGeneralMetricsPanelProps = {
  metrics: MetricAverageRow[]
  completedWorkouts: CompletedWorkoutRow[]
}

type MetricKey = "weight" | "fat"

const metricChartData = [
  { date: "2026-01-05", weight: 79.1, fat: 19.4 },
  { date: "2026-01-12", weight: 78.6, fat: 19.0 },
  { date: "2026-01-19", weight: 78.1, fat: 18.7 },
  { date: "2026-01-26", weight: 77.9, fat: 18.4 },
  { date: "2026-02-02", weight: 77.3, fat: 18.0 },
  { date: "2026-02-09", weight: 76.9, fat: 17.6 },
  { date: "2026-02-16", weight: 76.4, fat: 17.2 },
  { date: "2026-02-23", weight: 75.9, fat: 16.9 },
  { date: "2026-03-02", weight: 75.5, fat: 16.6 },
  { date: "2026-03-09", weight: 75.0, fat: 16.3 },
  { date: "2026-03-16", weight: 74.6, fat: 16.1 },
  { date: "2026-03-18", weight: 74.0, fat: 16.0 },
]

const metricChartConfig = {
  weight: {
    label: "Weight",
    color: "var(--chart-1)",
  },
  fat: {
    label: "Body Fat",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

function parseMetricDate(value: string) {
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1)
}

function getYearEnd(date: Date) {
  return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999)
}

function formatMetricDateLabel(date: Date, period: HabitPeriod) {
  if (period === "year") {
    return date.toLocaleDateString("sl-SI", { month: "short" })
  }

  return date.toLocaleDateString("sl-SI", {
    day: "2-digit",
    month: "short",
  })
}

function getWorkoutTrendBadgeClassName(trend: CompletedWorkoutTrend) {
  if (trend === "up") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
  }

  if (trend === "down") {
    return "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-50"
  }

  return "border-neutral-200 bg-neutral-100 text-neutral-600 hover:bg-neutral-100"
}

function CompletedWorkoutPreviewCard({
  workout,
}: {
  workout: CompletedWorkoutRow
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(17,24,39,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[16px] font-semibold text-neutral-950">
            {workout.title}
          </div>
          <div className="mt-2 text-[13px] text-neutral-500">{workout.dateLabel}</div>
        </div>
        <ChevronRight className="size-4 text-neutral-300" />
      </div>

      <div className="mt-4 grid grid-cols-[1fr_1fr_auto] items-end gap-3">
        <div className="border-r border-neutral-200 pr-3">
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400">
            Duration
          </div>
          <div className="mt-1 text-[14px] font-semibold text-neutral-950">
            {workout.duration}
          </div>
        </div>
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400">
            Volume
          </div>
          <div className="mt-1 text-[14px] font-semibold text-neutral-950">
            {workout.volume}
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "rounded-md px-2.5 py-1 text-[12px] font-medium shadow-none",
            getWorkoutTrendBadgeClassName(workout.trend)
          )}
        >
          {workout.trend === "up" ? (
            <TrendingUp className="mr-1 size-3.5" />
          ) : workout.trend === "down" ? (
            <TrendingDown className="mr-1 size-3.5" />
          ) : null}
          {workout.changeLabel}
        </Badge>
      </div>
    </div>
  )
}

export function ClientGeneralMetricsPanel({
  metrics,
  completedWorkouts,
}: ClientGeneralMetricsPanelProps) {
  const latestMetricDate = React.useMemo(
    () => parseMetricDate(metricChartData.at(-1)?.date ?? "2026-03-18"),
    []
  )
  const [selectedMetric, setSelectedMetric] = React.useState<MetricKey>("weight")
  const confirmedSelection = React.useMemo(
    () => ({
      period: "month" as HabitPeriod,
      value: getMonthStart(latestMetricDate),
      range: {
        from: getMonthStart(latestMetricDate),
        to: getMonthEnd(latestMetricDate),
      },
    }),
    [latestMetricDate]
  )

  const filteredChartData = React.useMemo(() => {
    const from = confirmedSelection.range.from
    const to = confirmedSelection.range.to

    if (!from || !to) {
      return metricChartData
    }

    return metricChartData.filter((entry) => {
      const date = parseMetricDate(entry.date)

      return date >= from && date <= to
    })
  }, [confirmedSelection])

  const selectedMetricSummary = React.useMemo(() => {
    if (selectedMetric === "fat") {
      return metrics.find((metric) => metric.label === "Body Fat") ?? metrics[0]
    }

    return metrics.find((metric) => metric.label === "Weight") ?? metrics[0]
  }, [metrics, selectedMetric])

  const currentMetricValue = React.useMemo(() => {
    const latestPoint = filteredChartData.at(-1) ?? metricChartData.at(-1)

    if (!latestPoint) {
      return selectedMetric === "fat" ? "0 %" : "0 kg"
    }

    return selectedMetric === "fat"
      ? `${latestPoint.fat.toFixed(1)} %`
      : `${latestPoint.weight.toFixed(1)} kg`
  }, [filteredChartData, selectedMetric])

  const metricValues = React.useMemo(
    () =>
      filteredChartData
        .map((entry) => entry[selectedMetric])
        .filter((value): value is number => typeof value === "number"),
    [filteredChartData, selectedMetric]
  )

  const metricDomain = React.useMemo<[number, number]>(() => {
    if (!metricValues.length) {
      return selectedMetric === "fat" ? [15, 18] : [70, 80]
    }

    const min = Math.min(...metricValues)
    const max = Math.max(...metricValues)
    const padding = selectedMetric === "fat" ? 0.45 : 1.5

    return [
      Number((min - padding).toFixed(2)),
      Number((max + padding).toFixed(2)),
    ]
  }, [metricValues, selectedMetric])

  const groupedCompletedWorkouts = React.useMemo(() => {
    return completedWorkouts.reduce<Record<string, CompletedWorkoutRow[]>>(
      (groups, workout) => {
        const currentGroup = groups[workout.monthLabel] ?? []
        currentGroup.push(workout)
        groups[workout.monthLabel] = currentGroup

        return groups
      },
      {}
    )
  }, [completedWorkouts])

  return (
    <div className="grid gap-4 xl:h-[calc(100vh-11.5rem)] xl:grid-rows-[minmax(0,1fr)_minmax(0,1fr)]">
      <Card className="flex h-full min-h-0 flex-col overflow-hidden gap-0! border-neutral-200 bg-white shadow-none">
        <CardHeader className="border-b border-neutral-200 px-3.5 py-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[14px] font-medium text-neutral-900">
              <Scale className="size-3.5 text-neutral-500" />
              <span>Metrics Avg</span>
            </div>
            <Tabs
              value={selectedMetric}
              onValueChange={(value) => setSelectedMetric(value as MetricKey)}
            >
              <TabsList className="h-7 gap-1 rounded-md border border-neutral-200 bg-neutral-50 p-0.5">
                <TabsTrigger
                  value="weight"
                  className="h-5.5 rounded-sm px-2 text-[11.5px] font-medium data-[state=active]:bg-white data-[state=active]:shadow-none"
                >
                  Weight
                </TabsTrigger>
                <TabsTrigger
                  value="fat"
                  className="h-5.5 rounded-sm px-2 text-[11.5px] font-medium data-[state=active]:bg-white data-[state=active]:shadow-none"
                >
                  Fat
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col gap-2 p-3.5">
          <div className="flex flex-row gap-2">
            <div className="gap-x-1.5 flex flex-row">
              <div className="text-[22px] leading-none font-semibold text-neutral-950">
                {currentMetricValue}
              </div>
              <div className="flex items-center gap-1.5">
                <Badge
                  className={cn(
                    "rounded-md border px-2 py-0.5 text-[11.5px] font-medium shadow-none",
                    selectedMetricSummary?.tone === "up"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                      : "border-red-200 bg-red-50 text-red-700 hover:bg-red-50"
                  )}
                >
                  {selectedMetricSummary?.tone === "up" ? (
                    <ArrowUp className="mr-1 size-3" />
                  ) : (
                    <ArrowDown className="mr-1 size-3" />
                  )}
                  {selectedMetricSummary?.delta}
                </Badge>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 rounded-xl border border-neutral-200 bg-neutral-50/60 p-2.5">
            <ChartContainer
              config={metricChartConfig}
              className="h-full max-h-none min-h-[10.5rem] w-full"
            >
              <AreaChart
                accessibilityLayer
                data={filteredChartData}
                margin={{
                  left: 0,
                  right: 8,
                  top: 6,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id={`fill-${selectedMetric}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={`var(--color-${selectedMetric})`}
                      stopOpacity={0.55}
                    />
                    <stop
                      offset="95%"
                      stopColor={`var(--color-${selectedMetric})`}
                      stopOpacity={0.06}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={6}
                  minTickGap={28}
                  tickFormatter={(value) =>
                    formatMetricDateLabel(parseMetricDate(value), confirmedSelection.period)
                  }
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={34}
                  tickCount={4}
                  domain={metricDomain}
                  tickFormatter={(value) =>
                    selectedMetric === "fat"
                      ? `${Number(value).toFixed(1)}%`
                      : `${Math.round(Number(value))}`
                  }
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) =>
                    parseMetricDate(String(value)).toLocaleDateString("sl-SI", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  }
                  formatter={(value) => [
                    selectedMetric === "fat" ? `${value}%` : `${value} kg`,
                    selectedMetric === "fat" ? "Body Fat" : "Weight",
                  ]}
                />
                <Area
                  dataKey={selectedMetric}
                  type="natural"
                  stroke={`var(--color-${selectedMetric})`}
                  strokeWidth={2.25}
                  fill={`url(#fill-${selectedMetric})`}
                  fillOpacity={1}
                  dot={false}
                  activeDot={{
                    r: 4,
                    strokeWidth: 0,
                    fill: `var(--color-${selectedMetric})`,
                  }}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="flex h-full min-h-0 flex-col overflow-hidden border-neutral-200 bg-white shadow-none">
        <CardHeader className="border-b border-neutral-200 px-4 py-3">
          <div className="flex items-center gap-2 text-[15px] font-medium text-neutral-900">
            <Dumbbell className="size-4 text-neutral-500" />
            <span>Completed Workouts</span>
          </div>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 overflow-y-auto p-4 pr-3 [scrollbar-width:thin]">
          <div className="space-y-5">
            {Object.entries(groupedCompletedWorkouts).map(([monthLabel, workouts]) => (
              <div key={monthLabel} className="space-y-2.5">
                <div className="px-1 text-[12px] font-medium text-neutral-500">
                  {monthLabel}
                </div>
                <div className="space-y-3">
                  {workouts.map((workout) => (
                    <CompletedWorkoutPreviewCard key={workout.id} workout={workout} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
