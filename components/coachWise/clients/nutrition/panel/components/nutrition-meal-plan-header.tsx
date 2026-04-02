"use client"

import * as React from "react"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

type NutritionMealPlanHeaderProps = {
  title: string
  backHref: string
  actions?: React.ReactNode
}

function NutritionMealPlanHeaderComponent({
  title,
  backHref,
  actions,
}: NutritionMealPlanHeaderProps) {
  const router = useRouter()

  return (
    <div className="border-b border-neutral-200 bg-neutral-50">
      <div className="flex min-h-10 flex-col gap-2 px-4 py-1.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-2.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-8 rounded-sm text-neutral-600 shadow-none hover:bg-neutral-100 hover:text-neutral-900"
            onClick={() => router.push(backHref)}
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Back to nutrition</span>
          </Button>
          <div className="min-w-0">
            <div className="truncate text-[17px] font-semibold text-neutral-950">{title}</div>
          </div>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  )
}

export const NutritionMealPlanHeader = React.memo(NutritionMealPlanHeaderComponent)
