"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { NutritionBuilderNav } from "@/components/coachWise/clients/nutrition/nutrition-builder-nav"
import {
  FixedProgramEditorBuilder,
} from "@/components/coachWise/programs/exercise-history-panel"
import type { FixedProgramEditorProgram } from "@/types"

type ProgramBuilderPageViewProps = {
  initialProgram: FixedProgramEditorProgram
  backHref: string
}

export function ProgramBuilderPageView({
  initialProgram,
  backHref,
}: ProgramBuilderPageViewProps) {
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [title, setTitle] = React.useState(initialProgram.title)
  const [isEditingTitle, setIsEditingTitle] = React.useState(false)

  React.useEffect(() => {
    if (isEditingTitle) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditingTitle])

  const resolvedProgram = React.useMemo(
    () => ({
      ...initialProgram,
      title: title.trim() || initialProgram.title,
    }),
    [initialProgram, title]
  )

  const handleTitleBlur = React.useCallback(() => {
    setTitle((currentTitle) => currentTitle.trim() || initialProgram.title)
    setIsEditingTitle(false)
  }, [initialProgram.title])

  const handleTitleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault()
        handleTitleBlur()
      }

      if (event.key === "Escape") {
        event.preventDefault()
        setTitle(initialProgram.title)
        setIsEditingTitle(false)
      }
    },
    [handleTitleBlur, initialProgram.title]
  )

  const handleSave = React.useCallback(() => {
    toast.success("Program builder ready", {
      description: "Save logic is the next step, but the full-page builder is now in place.",
    })
  }, [])

  return (
    <div className="min-h-0 bg-neutral-50">
      <NutritionBuilderNav
        title={resolvedProgram.title}
        isEditingTitle={isEditingTitle}
        inputValue={title}
        inputRef={inputRef}
        onBack={() => router.push(backHref)}
        onStartEditing={() => setIsEditingTitle(true)}
        onTitleChange={setTitle}
        onTitleBlur={handleTitleBlur}
        onTitleKeyDown={handleTitleKeyDown}
        onSave={handleSave}
        saveLabel="Save Program"
      />

      <div className="min-h-[calc(100vh-var(--header-height)-3rem)] bg-neutral-50">
        <FixedProgramEditorBuilder program={resolvedProgram} />
      </div>
    </div>
  )
}
