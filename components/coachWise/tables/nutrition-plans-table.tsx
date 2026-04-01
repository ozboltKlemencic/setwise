"use client"

import * as React from "react"
import { Beef, Copy, Pencil, Trash2, UtensilsCrossed } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import { CoachWiseConfirmationDialog } from "@/components/coachWise/confirmation-dialog"
import { Badge } from "@/components/ui/badge"
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
import { cn } from "@/lib/utils"

export type NutritionPlansTableSegment = {
  macro: "protein" | "carbs" | "fats"
  value: number
  fill: string
}

export type NutritionPlansTableRow = {
  id: string
  title: string
  subtitle: string
  type: string
  calories: number
  segments: NutritionPlansTableSegment[]
}

type NutritionPlansTableProps = {
  rows: NutritionPlansTableRow[]
  emptyMessage?: string
  onOpenRow?: (row: NutritionPlansTableRow) => void
  onEditRow?: (row: NutritionPlansTableRow) => void
  onDuplicateRow?: (row: NutritionPlansTableRow) => void | Promise<void>
  onDeleteRow?: (row: NutritionPlansTableRow) => void | Promise<void>
}

const mealPlanDonutConfig = {
  protein: {
    label: "Protein",
    color: "#22c55e",
  },
  carbs: {
    label: "Carbs",
    color: "#3b82f6",
  },
  fats: {
    label: "Fats",
    color: "#f59e0b",
  },
} satisfies ChartConfig

const nutritionRowActionButtonClassName =
  "size-6 cursor-pointer rounded-md border-neutral-200/60 bg-neutral-100/85 text-muted-foreground shadow-none transition-colors hover:border-neutral-300/80 hover:bg-neutral-200/60 hover:text-foreground"

const nutritionRowDeleteActionButtonClassName =
  "border-rose-200/70 bg-rose-50/70 text-rose-500 hover:border-rose-300/80 hover:bg-rose-100/70 hover:text-rose-600"

export function NutritionCaloriesDonut({
  row,
}: {
  row: NutritionPlansTableRow
}) {
  return (
    <ChartContainer
      config={mealPlanDonutConfig}
      className="mx-auto aspect-square size-[48px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={row.segments}
          dataKey="value"
          nameKey="macro"
          innerRadius={14}
          outerRadius={20}
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
                      className="fill-neutral-950 text-[9px] font-semibold"
                    >
                      {row.calories}
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

export function buildNutritionPlanSegments(values: {
  protein: number
  carbs: number
  fats: number
}): NutritionPlansTableSegment[] {
  return [
    {
      macro: "protein",
      value: values.protein,
      fill: mealPlanDonutConfig.protein.color,
    },
    {
      macro: "carbs",
      value: values.carbs,
      fill: mealPlanDonutConfig.carbs.color,
    },
    {
      macro: "fats",
      value: values.fats,
      fill: mealPlanDonutConfig.fats.color,
    },
  ]
}

export function NutritionPlansTable({
  rows,
  emptyMessage = "No meal plans available.",
  onOpenRow,
  onEditRow,
  onDuplicateRow,
  onDeleteRow,
}: NutritionPlansTableProps) {
  const isNutritionRowActionTarget = React.useCallback(
    (target: EventTarget | null) =>
      target instanceof Element &&
      Boolean(target.closest("[data-nutrition-row-action='true']")),
    []
  )

  const isNutritionRowOpenTarget = React.useCallback(
    (target: EventTarget | null) =>
      target instanceof Element &&
      Boolean(target.closest("[data-nutrition-row-open='true']")),
    []
  )

  return (
    <div className="overflow-hidden rounded-sm border border-neutral-200 bg-neutral-50">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-4 text-[13px] font-medium lg:pl-5">
              Plan
            </TableHead>
            <TableHead className="w-[152px] px-3.5 text-[13px] font-medium">
              Type
            </TableHead>
            <TableHead className="w-[128px] px-3 text-center text-[13px] font-medium">
              Calories
            </TableHead>
            <TableHead className="w-[9rem] px-3 pr-5 text-center text-[13px] font-medium">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((row) => {
              const isMacroPlan = row.type.toLowerCase().includes("macro")

              return (
                <TableRow
                  key={row.id}
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    if (
                      !onOpenRow ||
                      event.defaultPrevented ||
                      isNutritionRowActionTarget(event.target) ||
                      !isNutritionRowOpenTarget(event.target)
                    ) {
                      return
                    }

                    onOpenRow(row)
                  }}
                  onKeyDown={(event) => {
                    if (!onOpenRow || isNutritionRowActionTarget(event.target)) {
                      return
                    }

                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      onOpenRow(row)
                    }
                  }}
                  className={cn(
                    "bg-white hover:bg-neutral-50/60",
                    onOpenRow && "cursor-pointer"
                  )}
                >
                  <TableCell
                    className="py-3 pl-4 whitespace-normal lg:pl-5"
                    data-nutrition-row-open="true"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="text-[14px] font-medium text-neutral-950">
                        {row.title}
                      </div>
                      <div className="text-[12.5px] leading-5 text-neutral-500">
                        {row.subtitle}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell
                    className="px-3.5 py-3"
                    data-nutrition-row-open="true"
                  >
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[11.5px] font-normal",
                        isMacroPlan
                          ? "border-sky-100 bg-sky-50/45 text-neutral-700"
                          : "border-emerald-100 bg-emerald-50/45 text-neutral-700"
                      )}
                    >
                      {isMacroPlan ? (
                        <Beef className="mr-1 size-3 text-neutral-600" />
                      ) : (
                        <UtensilsCrossed className="mr-1 size-3 text-neutral-600" />
                      )}
                      {row.type}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className="px-3 py-3 text-center"
                    data-nutrition-row-open="true"
                  >
                    <NutritionCaloriesDonut row={row} />
                  </TableCell>
                  <TableCell
                    className="px-3 py-3 pr-5"
                    data-nutrition-row-action="true"
                  >
                    <div
                      className="flex w-[9rem] justify-center gap-3"
                      data-nutrition-row-action="true"
                    >
                      {onDuplicateRow ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          onClick={(event) => {
                            event.stopPropagation()
                            void onDuplicateRow(row)
                          }}
                          className={nutritionRowActionButtonClassName}
                        >
                          <Copy className="size-3.5" />
                          <span className="sr-only">Duplicate meal plan</span>
                        </Button>
                      ) : null}
                      {onEditRow ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          onClick={(event) => {
                            event.stopPropagation()
                            onEditRow(row)
                          }}
                          className={nutritionRowActionButtonClassName}
                        >
                          <Pencil className="size-3.5" />
                          <span className="sr-only">Edit meal plan</span>
                        </Button>
                      ) : null}
                      {onDeleteRow ? (
                        <CoachWiseConfirmationDialog
                          title="Are you sure you want to delete this meal plan?"
                          description={`${row.title} will be removed from the current nutrition list. This action can't be undone.`}
                          confirmLabel="Delete plan"
                          variant="destructive"
                          onConfirm={() => onDeleteRow(row)}
                          trigger={
                            <Button
                              type="button"
                              variant="outline"
                              size="icon-sm"
                              onClick={(event) => {
                                event.stopPropagation()
                              }}
                              className={cn(
                                nutritionRowActionButtonClassName,
                                nutritionRowDeleteActionButtonClassName
                              )}
                            >
                              <Trash2 className="size-3.5" />
                              <span className="sr-only">Delete meal plan</span>
                            </Button>
                          }
                        />
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={4}
                className="py-8 text-center text-[13px] text-neutral-500"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
