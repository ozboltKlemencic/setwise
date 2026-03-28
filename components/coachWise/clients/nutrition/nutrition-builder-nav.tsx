"use client"

import * as React from "react"
import { ChevronLeft, Pencil, Save } from "lucide-react"

import { PrimaryActionButton } from "@/components/coachWise/primary-action-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type NutritionBuilderNavProps = {
  title: string
  isEditingTitle: boolean
  inputValue: string
  inputRef?: React.Ref<HTMLInputElement>
  onBack: () => void
  onStartEditing: () => void
  onTitleChange: (nextValue: string) => void
  onTitleBlur: () => void
  onTitleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onSave: () => void
  saveLabel: string
  saveDisabled?: boolean
}

export function NutritionBuilderNav({
  title,
  isEditingTitle,
  inputValue,
  inputRef,
  onBack,
  onStartEditing,
  onTitleChange,
  onTitleBlur,
  onTitleKeyDown,
  onSave,
  saveLabel,
  saveDisabled,
}: NutritionBuilderNavProps) {
  return (
    <div className="bg-neutral-50">
      <div className="flex h-12 items-center justify-between gap-x-3 border-b border-neutral-200 px-2">
        <div className="flex h-full min-w-0 items-center gap-x-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onBack}
            className="size-7 self-center rounded-sm text-neutral-600 shadow-none hover:bg-neutral-100 hover:text-neutral-900"
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Back</span>
          </Button>

          <div className="flex h-full min-w-0 items-center">
            {isEditingTitle ? (
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(event) => onTitleChange(event.target.value)}
                onBlur={onTitleBlur}
                onKeyDown={onTitleKeyDown}
                className="h-8 min-w-[240px] rounded-sm border-neutral-200 bg-white text-[15px] font-semibold leading-none shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
              />
            ) : (
              <button
                type="button"
                onClick={onStartEditing}
                className="inline-flex h-8 max-w-full items-center gap-2 text-left text-[15px] leading-none font-semibold text-neutral-950"
              >
                <span className="truncate">{title}</span>
                <Pencil className="size-3.5 text-neutral-400" />
              </button>
            )}
          </div>
        </div>

        <PrimaryActionButton
          label={saveLabel}
          icon={Save}
          onClick={onSave}
          disabled={saveDisabled}
          className="h-8 self-center leading-none"
        />
      </div>
    </div>
  )
}
