"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { PrimaryActionButton } from "@/components/coachWise/primary-action-button"
import { Button } from "@/components/ui/button"
import { PROGRAM_BUILDER_MUSCLE_CLASSES } from "@/lib/programs/program-builder-data"
import { cn } from "@/lib/utils"
import type { ProgramBuilderExerciseLibraryItem } from "@/types"

function ProgramExerciseDetailNav({
  title,
  backHref,
  editAction,
}: {
  title: string
  backHref: string
  editAction?: React.ReactNode
}) {
  const router = useRouter()

  return (
    <div className="sticky top-(--header-height) z-10 bg-neutral-50">
      <div className="flex h-12 items-center justify-between gap-x-3 border-b border-neutral-200 px-2">
        <div className="flex min-w-0 items-center gap-x-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => router.push(backHref)}
            className="size-7 rounded-sm text-neutral-600 shadow-none hover:bg-neutral-100 hover:text-neutral-900"
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Back</span>
          </Button>

          <div className="inline-flex h-8 min-w-0 items-center text-left text-[15px] leading-none font-semibold text-neutral-950">
            <span className="truncate">{title}</span>
          </div>
        </div>

        {editAction}
      </div>
    </div>
  )
}

function ProgramExerciseDetailRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400">
        {label}
      </div>
      <div className="mt-1.5 text-[14px] text-neutral-800">{children}</div>
    </div>
  )
}

function formatEquipmentValue(equipment?: ProgramBuilderExerciseLibraryItem["equipment"]) {
  if (!equipment?.length) {
    return "-"
  }

  return equipment.join(", ")
}

function formatTypeValue(type: ProgramBuilderExerciseLibraryItem["type"]) {
  return type
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")
}

type ProgramExerciseDetailPageProps = {
  exercise: ProgramBuilderExerciseLibraryItem
  backHref: string
  onEdit?: () => void
}

export function ProgramExerciseDetailPage({
  exercise,
  backHref,
  onEdit,
}: ProgramExerciseDetailPageProps) {
  return (
    <>
      <ProgramExerciseDetailNav
        title={exercise.name}
        backHref={backHref}
        editAction={
          onEdit ? (
            <PrimaryActionButton
              label="Edit Exercise"
              className="h-8 self-center leading-none"
              onClick={onEdit}
            />
          ) : undefined
        }
      />

      <div className="px-4 py-4">
        <div className="mx-auto max-w-md">
          <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 bg-neutral-50/70 px-4 py-3.5">
              <div className="text-[15px] font-semibold text-neutral-950">
                {exercise.name}
              </div>
            </div>

            <div className="space-y-4 px-4 py-4">
              <ProgramExerciseDetailRow label="Primary muscle group">
                <span
                  className={cn(
                    "inline-flex h-auto rounded-md border px-2.5 py-1 text-[12px] font-medium",
                    PROGRAM_BUILDER_MUSCLE_CLASSES[exercise.muscle]
                  )}
                >
                  {exercise.muscle}
                </span>
              </ProgramExerciseDetailRow>

              <ProgramExerciseDetailRow label="Technical clues">
                <div className="whitespace-pre-line text-neutral-700">
                  {exercise.instructions?.trim() || "-"}
                </div>
              </ProgramExerciseDetailRow>

              <ProgramExerciseDetailRow label="Equipment">
                {formatEquipmentValue(exercise.equipment)}
              </ProgramExerciseDetailRow>

              <ProgramExerciseDetailRow label="Type">
                {formatTypeValue(exercise.type)}
              </ProgramExerciseDetailRow>

              <ProgramExerciseDetailRow label="Level">
                {exercise.level || "-"}
              </ProgramExerciseDetailRow>

              <ProgramExerciseDetailRow label="Media file">
                {exercise.mediaFileName || "-"}
              </ProgramExerciseDetailRow>

              <ProgramExerciseDetailRow label="YouTube link">
                {exercise.youtubeUrl ? (
                  <a
                    href={exercise.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-brand-700 hover:underline"
                  >
                    {exercise.youtubeUrl}
                  </a>
                ) : (
                  "-"
                )}
              </ProgramExerciseDetailRow>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
