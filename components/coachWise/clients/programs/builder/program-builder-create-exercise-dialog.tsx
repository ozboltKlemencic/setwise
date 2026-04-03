"use client"

import * as React from "react"
import { Clapperboard, Dumbbell, Link2, Upload } from "lucide-react"

import { PrimaryActionButton } from "@/components/coachWise/primary-action-button"
import { SecondaryActionButton } from "@/components/coachWise/secondary-action-button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  PROGRAM_BUILDER_EXERCISE_EQUIPMENT_OPTIONS,
  PROGRAM_BUILDER_EXERCISE_LEVEL_OPTIONS,
  PROGRAM_BUILDER_EXERCISE_TYPE_OPTIONS,
  PROGRAM_BUILDER_MUSCLE_FILTERS,
} from "@/lib/programs/program-builder-data"
import type {
  ProgramBuilderExerciseEquipment,
  ProgramBuilderExerciseLibraryItem,
  ProgramBuilderExerciseLevel,
  ProgramBuilderExerciseType,
  ProgramBuilderMuscle,
} from "@/types"

type ProgramBuilderCreateExerciseDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialName: string
  onCreate: (
    input: Pick<ProgramBuilderExerciseLibraryItem, "name" | "muscle" | "type"> & {
      instructions?: string | null
      equipment?: ProgramBuilderExerciseEquipment | null
      level?: ProgramBuilderExerciseLevel | null
      youtubeUrl?: string | null
      mediaFileName?: string | null
    }
  ) => void
}

const muscleOptions = PROGRAM_BUILDER_MUSCLE_FILTERS.filter(
  (muscle): muscle is ProgramBuilderMuscle => muscle !== "All"
)

function ProgramBuilderFieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label className="text-[12px] font-medium text-neutral-700">
      {children}
      {required ? <span className="ml-1 text-rose-500">*</span> : null}
    </label>
  )
}

export const ProgramBuilderCreateExerciseDialog = React.memo(
  function ProgramBuilderCreateExerciseDialog({
    open,
    onOpenChange,
    initialName,
    onCreate,
  }: ProgramBuilderCreateExerciseDialogProps) {
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const [name, setName] = React.useState(initialName)
    const [instructions, setInstructions] = React.useState("")
    const [equipment, setEquipment] = React.useState<ProgramBuilderExerciseEquipment | "">("")
    const [level, setLevel] = React.useState<ProgramBuilderExerciseLevel | "">("")
    const [muscle, setMuscle] = React.useState<ProgramBuilderMuscle>("Chest")
    const [type, setType] = React.useState<ProgramBuilderExerciseType>("compound_medium")
    const [youtubeUrl, setYoutubeUrl] = React.useState("")
    const [mediaFileName, setMediaFileName] = React.useState("")

    React.useEffect(() => {
      if (!open) {
        return
      }

      setName(initialName)
      setInstructions("")
      setEquipment("")
      setLevel("")
      setMuscle("Chest")
      setType("compound_medium")
      setYoutubeUrl("")
      setMediaFileName("")
    }, [initialName, open])

    const handleCreate = React.useCallback(() => {
      const trimmedName = name.trim()
      if (!trimmedName) {
        return
      }

      onCreate({
        name: trimmedName,
        instructions: instructions.trim() || null,
        equipment: equipment || null,
        level: level || null,
        muscle,
        type,
        youtubeUrl: youtubeUrl.trim() || null,
        mediaFileName: mediaFileName || null,
      })
      onOpenChange(false)
    }, [
      equipment,
      instructions,
      level,
      mediaFileName,
      muscle,
      name,
      onCreate,
      onOpenChange,
      type,
      youtubeUrl,
    ])

    const handleUploadClick = React.useCallback(() => {
      fileInputRef.current?.click()
    }, [])

    const handleFileChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        setMediaFileName(file?.name ?? "")
      },
      []
    )

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-[860px]">
          <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_300px]">
            <div className="border-b border-neutral-200 md:border-r md:border-b-0">
              <DialogHeader className="border-b border-neutral-200 px-5 py-4 text-left">
                <DialogTitle className="flex items-center gap-2 text-[18px] font-semibold text-neutral-950">
                  <Dumbbell className="size-4 text-neutral-500" />
                  Add Exercise
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 px-5 py-4">
                <div className="space-y-2">
                  <ProgramBuilderFieldLabel required>Name</ProgramBuilderFieldLabel>
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Name of the exercise e.g. Squat"
                    className="h-10 rounded-sm border-neutral-200 bg-white shadow-none focus-visible:border-brand-500 focus-visible:ring-0"
                  />
                </div>

                <div className="space-y-2">
                  <ProgramBuilderFieldLabel>Instructions</ProgramBuilderFieldLabel>
                  <textarea
                    value={instructions}
                    onChange={(event) => setInstructions(event.target.value)}
                    placeholder="Enter any additional info"
                    className="min-h-[88px] w-full resize-none rounded-sm border border-neutral-200 bg-white px-3 py-2.5 text-[13px] text-neutral-950 outline-none transition-colors placeholder:text-neutral-400 focus:border-brand-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-[12px] font-medium text-neutral-700">Filters</div>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={equipment}
                      onChange={(event) =>
                        setEquipment(event.target.value as ProgramBuilderExerciseEquipment | "")
                      }
                      className="h-10 rounded-sm border border-neutral-200 bg-white px-3 text-[13px] text-neutral-700 outline-none transition-colors focus:border-brand-500"
                    >
                      <option value="">Select Equipment</option>
                      {PROGRAM_BUILDER_EXERCISE_EQUIPMENT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={level}
                      onChange={(event) =>
                        setLevel(event.target.value as ProgramBuilderExerciseLevel | "")
                      }
                      className="h-10 rounded-sm border border-neutral-200 bg-white px-3 text-[13px] text-neutral-700 outline-none transition-colors focus:border-brand-500"
                    >
                      <option value="">Select Level</option>
                      {PROGRAM_BUILDER_EXERCISE_LEVEL_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={muscle}
                      onChange={(event) =>
                        setMuscle(event.target.value as ProgramBuilderMuscle)
                      }
                      className="h-10 rounded-sm border border-neutral-200 bg-white px-3 text-[13px] text-neutral-700 outline-none transition-colors focus:border-brand-500"
                    >
                      <option value="" disabled>
                        Select Main Muscle
                      </option>
                      {muscleOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <select
                      value={type}
                      onChange={(event) =>
                        setType(event.target.value as ProgramBuilderExerciseType)
                      }
                      className="h-10 rounded-sm border border-neutral-200 bg-white px-3 text-[13px] text-neutral-700 outline-none transition-colors focus:border-brand-500"
                    >
                      {PROGRAM_BUILDER_EXERCISE_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="border-b border-neutral-200 px-5 py-4">
                <div className="flex items-center gap-2 text-[15px] font-semibold text-neutral-950">
                  <Clapperboard className="size-4 text-neutral-500" />
                  Media
                </div>
              </div>

              <div className="space-y-4 px-5 py-4">
                <div className="space-y-2">
                  <ProgramBuilderFieldLabel>YouTube Link</ProgramBuilderFieldLabel>
                  <div className="relative">
                    <Link2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                      value={youtubeUrl}
                      onChange={(event) => setYoutubeUrl(event.target.value)}
                      placeholder="Enter YouTube link"
                      className="h-10 rounded-sm border-neutral-200 bg-white pl-9 shadow-none focus-visible:border-brand-500 focus-visible:ring-0"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-neutral-200" />
                  <span className="text-[11px] font-medium tracking-[0.12em] text-neutral-400 uppercase">
                    Or
                  </span>
                  <div className="h-px flex-1 bg-neutral-200" />
                </div>

                <div className="space-y-2">
                  <ProgramBuilderFieldLabel>Custom Video</ProgramBuilderFieldLabel>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*,image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className={cn(
                      "flex min-h-[124px] w-full flex-col items-center justify-center rounded-sm border border-dashed px-4 text-center transition-colors",
                      mediaFileName
                        ? "border-brand-300 bg-brand-50/35"
                        : "border-neutral-200 bg-neutral-50 hover:border-brand-300 hover:bg-brand-50/20"
                    )}
                  >
                    <div className="mb-2 flex size-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500">
                      <Upload className="size-4" />
                    </div>
                    <div className="text-[12px] text-neutral-600">
                      {mediaFileName ? mediaFileName : "Click or drag file to this area to upload"}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-neutral-200 px-5 py-4">
            <div className="grid w-full grid-cols-2 gap-3">
              <SecondaryActionButton
                label="Close"
                onClick={() => onOpenChange(false)}
                className="h-10 w-full justify-center rounded-sm"
              />
              <PrimaryActionButton
                label="Add Exercise"
                onClick={handleCreate}
                disabled={!name.trim()}
                className="h-10 w-full justify-center rounded-sm disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
)
