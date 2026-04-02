"use client"

import * as React from "react"

type NutritionSectionTitleProps = {
  title: string
}

function NutritionSectionTitleComponent({
  title,
}: NutritionSectionTitleProps) {
  return <div className="mb-3 text-[13px] font-medium text-neutral-500">{title}</div>
}

export const NutritionSectionTitle = React.memo(NutritionSectionTitleComponent)
