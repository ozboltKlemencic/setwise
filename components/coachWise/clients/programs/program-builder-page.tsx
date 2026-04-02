"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { ProgramBuilderToolbarMenu } from "@/components/coachWise/clients/programs/builder/program-builder-toolbar-menu"
import { NutritionBuilderNav } from "@/components/coachWise/clients/nutrition/nutrition-builder-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProgramBuilder } from "@/hooks/programs/use-program-builder"
import type { FixedProgramEditorProgram } from "@/types"

type ProgramBuilderPageViewProps = {
  initialProgram: FixedProgramEditorProgram
  backHref: string
}

const ProgramBuilderWorkspace = React.lazy(async () => {
  const module = await import("@/components/coachWise/clients/programs/builder")

  return { default: module.ProgramBuilderWorkspace }
})

export function ProgramBuilderPageView({
  initialProgram,
  backHref,
}: ProgramBuilderPageViewProps) {
  const router = useRouter()
  const builder = useProgramBuilder(initialProgram)
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
        leadingActions={
          <>
            <ProgramBuilderToolbarMenu
              label="Ranges"
              open={builder.showMyReps}
              onOpenChange={(open) => {
                builder.setShowMyReps(open)
                if (open) {
                  builder.setShowMyTempos(false)
                }
              }}
              triggerClassName="border-brand-200 bg-brand-50/70 text-brand-700 hover:border-brand-300 hover:bg-brand-50/90 data-[state=open]:border-brand-300 data-[state=open]:bg-brand-50"
            >
              <div className="space-y-3">
                <div className="px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                  Ranges
                </div>
                <div className="border-t border-neutral-200/70" />
                <div className="max-h-64 space-y-1 overflow-y-auto px-1.5">
                  {builder.myReps.map((range, index) => (
                    <div
                      key={`${range}-${index}`}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-[13px] text-neutral-700 transition-colors hover:bg-neutral-50"
                    >
                      <span className="font-mono text-[12px]">{range}</span>
                      <button
                        type="button"
                        onClick={() => builder.removeCustomRepRange(index)}
                        className="text-[12px] text-neutral-400 transition-colors hover:text-neutral-700"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-neutral-200/70" />
                <div className="flex items-center gap-2 px-1.5 pb-1.5">
                  <Input
                    value={builder.newRepRange}
                    onChange={(event) => builder.setNewRepRange(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        builder.addCustomRepRange()
                      }
                    }}
                    placeholder="e.g. 5-8"
                    className="h-8 w-24 rounded-md border-neutral-200 bg-white font-mono text-[12px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={builder.addCustomRepRange}
                    className="h-8 rounded-md border-neutral-200 bg-white px-3 text-[12px] text-neutral-700 shadow-none hover:bg-neutral-50"
                  >
                    Add range
                  </Button>
                </div>
              </div>
            </ProgramBuilderToolbarMenu>

            <ProgramBuilderToolbarMenu
              label="Tempo"
              open={builder.showMyTempos}
              onOpenChange={(open) => {
                builder.setShowMyTempos(open)
                if (open) {
                  builder.setShowMyReps(false)
                }
              }}
              triggerClassName="border-emerald-200 bg-emerald-50/70 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50/90 data-[state=open]:border-emerald-300 data-[state=open]:bg-emerald-50"
            >
              <div className="space-y-3">
                <div className="px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                  Tempo
                </div>
                <div className="border-t border-neutral-200/70" />
                <div className="max-h-64 space-y-1 overflow-y-auto px-1.5">
                  {builder.myTempos.map((tempo, index) => (
                    <div
                      key={`${tempo}-${index}`}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-[13px] text-neutral-700 transition-colors hover:bg-neutral-50"
                    >
                      <span className="font-mono text-[12px]">{tempo}</span>
                      <button
                        type="button"
                        onClick={() => builder.removeCustomTempo(index)}
                        className="text-[12px] text-neutral-400 transition-colors hover:text-neutral-700"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-neutral-200/70" />
                <div className="flex items-center gap-2 px-1.5 pb-1.5">
                  <Input
                    value={builder.newTempo}
                    onChange={(event) => builder.setNewTempo(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        builder.addCustomTempo()
                      }
                    }}
                    placeholder="e.g. 3-1-2-0"
                    className="h-8 w-28 rounded-md border-neutral-200 bg-white font-mono text-[12px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={builder.addCustomTempo}
                    className="h-8 rounded-md border-neutral-200 bg-white px-3 text-[12px] text-neutral-700 shadow-none hover:bg-neutral-50"
                  >
                    Add tempo
                  </Button>
                </div>
              </div>
            </ProgramBuilderToolbarMenu>
          </>
        }
      />

      <div className="min-h-[calc(100vh-var(--header-height)-3rem)] bg-neutral-50">
        <React.Suspense
          fallback={
            <div className="flex min-h-[calc(100vh-var(--header-height)-3rem)] items-center justify-center text-[14px] text-neutral-500">
              Loading program builder...
            </div>
          }
        >
          <ProgramBuilderWorkspace builder={builder} />
        </React.Suspense>
      </div>
    </div>
  )
}
