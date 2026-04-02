"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import type { NutritionMealPlan } from "@/types"

const mealPlanDonutConfig = {
  protein: { label: "Protein", color: "#22c55e" },
  carbs: { label: "Carbs", color: "#3b82f6" },
  fats: { label: "Fats", color: "#f59e0b" },
} satisfies ChartConfig

function NutritionCaloriesDonutComponent({ plan }: { plan: NutritionMealPlan }) {
  return (
    <ChartContainer config={mealPlanDonutConfig} className="mx-auto aspect-square size-[48px]">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie data={plan.segments} dataKey="value" nameKey="macro" innerRadius={14} outerRadius={20} strokeWidth={2}>
          <Label
            content={({ viewBox }) =>
              viewBox && "cx" in viewBox && "cy" in viewBox ? (
                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                  <tspan x={viewBox.cx} y={viewBox.cy} className="fill-neutral-950 text-[9px] font-semibold">
                    {plan.calories}
                  </tspan>
                </text>
              ) : null
            }
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

export const NutritionCaloriesDonut = React.memo(NutritionCaloriesDonutComponent)
