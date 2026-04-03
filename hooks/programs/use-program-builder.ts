"use client"

import * as React from "react"

import {
  cloneProgramBuilderDay,
  cloneProgramBuilderExercise,
  createProgramBuilderDefaultTemplates,
  createProgramBuilderExerciseEntry,
  createProgramBuilderId,
  createProgramBuilderInitialDays,
  createProgramBuilderLibraryExercise,
  formatProgramBuilderRepRange,
  formatProgramBuilderTempo,
  parseProgramBuilderRepRange,
  parseProgramBuilderTempo,
  PROGRAM_BUILDER_ALL_REP_RANGES,
  PROGRAM_BUILDER_ALL_TEMPOS,
  PROGRAM_BUILDER_DEFAULT_REP_RANGES,
  PROGRAM_BUILDER_DEFAULT_TEMPOS,
  PROGRAM_BUILDER_EXERCISES,
  PROGRAM_BUILDER_INTENSIFIERS,
  PROGRAM_BUILDER_MUSCLE_FILTERS,
  PROGRAM_BUILDER_RIR_OPTIONS,
  PROGRAM_BUILDER_RPE_OPTIONS,
} from "@/lib/programs/program-builder-data"
import type {
  FixedProgramEditorProgram,
  ProgramBuilderDayTemplate,
  ProgramBuilderExerciseEquipment,
  ProgramBuilderExercise,
  ProgramBuilderExerciseLibraryItem,
  ProgramBuilderExerciseSet,
  ProgramBuilderExerciseLevel,
  ProgramBuilderIntensifierType,
  ProgramBuilderMuscleFilter,
  ProgramBuilderSetEditTarget,
} from "@/types"

type LeftTab = "exercises" | "templates"

function moveArrayItem<T>(items: T[], fromIndex: number, toIndex: number) {
  const nextItems = [...items]
  const [movedItem] = nextItems.splice(fromIndex, 1)
  nextItems.splice(toIndex, 0, movedItem)
  return nextItems
}

export function useProgramBuilder(initialProgram: FixedProgramEditorProgram) {
  const skipBlurRef = React.useRef(false)
  const [description, setDescription] = React.useState(initialProgram.description)
  const [days, setDays] = React.useState(() => createProgramBuilderInitialDays(initialProgram))
  const [activeDayIndex, setActiveDayIndex] = React.useState(0)
  const [leftTab, setLeftTab] = React.useState<LeftTab>("exercises")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [templateQuery, setTemplateQuery] = React.useState("")
  const [muscleFilter, setMuscleFilter] = React.useState<ProgramBuilderMuscleFilter>("All")
  const [exerciseLibrary, setExerciseLibrary] =
    React.useState<ProgramBuilderExerciseLibraryItem[]>(PROGRAM_BUILDER_EXERCISES)
  const [editTarget, setEditTarget] = React.useState<ProgramBuilderSetEditTarget | null>(null)
  const [editValue, setEditValue] = React.useState("")
  const [intensifierEditor, setIntensifierEditor] =
    React.useState<ProgramBuilderSetEditTarget | null>(null)
  const [renamingDayIndex, setRenamingDayIndex] = React.useState<number | null>(null)
  const [draggedLibraryExercise, setDraggedLibraryExercise] =
    React.useState<ProgramBuilderExerciseLibraryItem | null>(null)
  const [reorderExerciseIndex, setReorderExerciseIndex] = React.useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null)
  const [draggedDayIndex, setDraggedDayIndex] = React.useState<number | null>(null)
  const [dragDayOverIndex, setDragDayOverIndex] = React.useState<number | null>(null)
  const [dayTemplates, setDayTemplates] = React.useState<ProgramBuilderDayTemplate[]>(
    () => createProgramBuilderDefaultTemplates()
  )
  const [showMyReps, setShowMyReps] = React.useState(false)
  const [myReps, setMyReps] = React.useState(PROGRAM_BUILDER_DEFAULT_REP_RANGES)
  const [newRepRange, setNewRepRange] = React.useState("")
  const [showMyTempos, setShowMyTempos] = React.useState(false)
  const [myTempos, setMyTempos] = React.useState(PROGRAM_BUILDER_DEFAULT_TEMPOS)
  const [newTempo, setNewTempo] = React.useState("")
  const [showAdvancedSetOptions, setShowAdvancedSetOptions] = React.useState(false)
  const [useIntensifiers, setUseIntensifiers] = React.useState(true)
  const [useTempo, setUseTempo] = React.useState(true)
  const [useRpe, setUseRpe] = React.useState(true)
  const [useRir, setUseRir] = React.useState(true)

  React.useEffect(() => {
    setDescription(initialProgram.description)
    setDays(createProgramBuilderInitialDays(initialProgram))
    setActiveDayIndex(0)
    setEditTarget(null)
    setEditValue("")
    setIntensifierEditor(null)
    setSearchQuery("")
    setTemplateQuery("")
    setMuscleFilter("All")
    setDraggedLibraryExercise(null)
    setReorderExerciseIndex(null)
    setDragOverIndex(null)
    setDraggedDayIndex(null)
    setDragDayOverIndex(null)
    setRenamingDayIndex(null)
  }, [initialProgram.id, initialProgram.description])

  const activeDay = days[activeDayIndex]
  const dayExerciseIds = React.useMemo(
    () => new Set(activeDay?.exercises.map((exercise) => exercise.exerciseId) ?? []),
    [activeDay]
  )
  const totalSets = React.useMemo(
    () => activeDay?.exercises.reduce((count, exercise) => count + exercise.sets.length, 0) ?? 0,
    [activeDay]
  )
  const filteredExercises = React.useMemo(
    () =>
      exerciseLibrary.filter((exercise) => {
        if (muscleFilter !== "All" && exercise.muscle !== muscleFilter) {
          return false
        }

        if (!searchQuery.trim()) {
          return true
        }

        const normalizedQuery = searchQuery.toLowerCase()
        return (
          exercise.name.toLowerCase().includes(normalizedQuery) ||
          exercise.muscle.toLowerCase().includes(normalizedQuery)
        )
      }),
    [exerciseLibrary, muscleFilter, searchQuery]
  )
  const filteredTemplates = React.useMemo(
    () =>
      dayTemplates.filter((template) => {
        if (!templateQuery.trim()) {
          return true
        }

        const normalizedQuery = templateQuery.toLowerCase()
        return (
          template.name.toLowerCase().includes(normalizedQuery) ||
          template.exercises.some((exercise) =>
            exercise.name.toLowerCase().includes(normalizedQuery)
          )
        )
      }),
    [dayTemplates, templateQuery]
  )
  const otherRepRanges = React.useMemo(
    () => PROGRAM_BUILDER_ALL_REP_RANGES.filter((range) => !myReps.includes(range)),
    [myReps]
  )
  const otherTempos = React.useMemo(
    () => PROGRAM_BUILDER_ALL_TEMPOS.filter((tempo) => !myTempos.includes(tempo)),
    [myTempos]
  )

  const updateActiveDay = React.useCallback(
    (updater: (exercises: ProgramBuilderExercise[]) => ProgramBuilderExercise[]) => {
      setDays((currentDays) =>
        currentDays.map((day, dayIndex) =>
          dayIndex === activeDayIndex ? { ...day, exercises: updater(day.exercises) } : day
        )
      )
    },
    [activeDayIndex]
  )

  const addExercise = React.useCallback(
    (exercise: ProgramBuilderExerciseLibraryItem, atIndex?: number) => {
      if (!activeDay || activeDay.isRest || dayExerciseIds.has(exercise.id)) {
        return
      }

      const nextExercise = createProgramBuilderExerciseEntry(exercise)
      updateActiveDay((currentExercises) => {
        const nextExercises = [...currentExercises]
        if (typeof atIndex === "number") {
          nextExercises.splice(atIndex, 0, nextExercise)
        } else {
          nextExercises.push(nextExercise)
        }
        return nextExercises
      })
    },
    [activeDay, dayExerciseIds, updateActiveDay]
  )

  const createExercise = React.useCallback(
    (
      input: Pick<ProgramBuilderExerciseLibraryItem, "name" | "muscle" | "type"> & {
        instructions?: string | null
        equipment?: ProgramBuilderExerciseEquipment[] | null
        level?: ProgramBuilderExerciseLevel | null
        youtubeUrl?: string | null
        mediaFileName?: string | null
      }
    ) => {
      const nextExercise = createProgramBuilderLibraryExercise(exerciseLibrary, input)

      setExerciseLibrary((currentExercises) => [nextExercise, ...currentExercises])
      setLeftTab("exercises")
      setMuscleFilter("All")
      setSearchQuery(nextExercise.name)
    },
    [exerciseLibrary]
  )

  const removeExercise = React.useCallback(
    (exerciseUid: string) => {
      updateActiveDay((currentExercises) =>
        currentExercises.filter((exercise) => exercise.uid !== exerciseUid)
      )

      if (editTarget?.uid === exerciseUid) {
        setEditTarget(null)
        setEditValue("")
      }

      if (intensifierEditor?.uid === exerciseUid) {
        setIntensifierEditor(null)
      }
    },
    [editTarget?.uid, intensifierEditor?.uid, updateActiveDay]
  )

  const commitRange = React.useCallback(
    (exerciseUid: string, setIndex: number, nextRange: ProgramBuilderExerciseSet) => {
      updateActiveDay((currentExercises) =>
        currentExercises.map((exercise) =>
          exercise.uid === exerciseUid
            ? {
                ...exercise,
                sets: exercise.sets.map((set, index) =>
                  index === setIndex ? { ...set, ...nextRange } : set
                ),
              }
            : exercise
        )
      )
    },
    [updateActiveDay]
  )

  const openSetEditor = React.useCallback(
    (exerciseUid: string, setIndex: number) => {
      const exercise = activeDay?.exercises.find((item) => item.uid === exerciseUid)
      const nextSet = exercise?.sets[setIndex]
      if (!nextSet) {
        return
      }

      setEditTarget({ uid: exerciseUid, si: setIndex })
      setEditValue(formatProgramBuilderRepRange(nextSet))
    },
    [activeDay]
  )

  const applyQuickRepRange = React.useCallback(
    (value: string) => {
      if (!editTarget) {
        return
      }

      const parsedValue = parseProgramBuilderRepRange(value)
      if (!parsedValue) {
        return
      }

      commitRange(editTarget.uid, editTarget.si, parsedValue)
      setEditValue(formatProgramBuilderRepRange(parsedValue))
    },
    [commitRange, editTarget]
  )

  const closeSetEditor = React.useCallback(() => {
    if (!editTarget) {
      return
    }

    const parsedValue = parseProgramBuilderRepRange(editValue)
    if (parsedValue) {
      commitRange(editTarget.uid, editTarget.si, parsedValue)
    }

    setEditTarget(null)
    setEditValue("")
    setIntensifierEditor(null)
  }, [commitRange, editTarget, editValue])

  const handleSetInputBlur = React.useCallback(() => {
    if (skipBlurRef.current) {
      skipBlurRef.current = false
      return
    }

    if (!editTarget) {
      return
    }

    const parsedValue = parseProgramBuilderRepRange(editValue)
    if (parsedValue) {
      commitRange(editTarget.uid, editTarget.si, parsedValue)
    }
  }, [commitRange, editTarget, editValue])

  const handleSetInputKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!editTarget) {
        return
      }

      if (event.key === "Escape") {
        event.preventDefault()
        closeSetEditor()
        return
      }

      if (event.key !== "Enter" && event.key !== "Tab") {
        return
      }

      event.preventDefault()
      skipBlurRef.current = true

      const parsedValue = parseProgramBuilderRepRange(editValue)
      if (parsedValue) {
        commitRange(editTarget.uid, editTarget.si, parsedValue)
      }

      const exercise = activeDay?.exercises.find((item) => item.uid === editTarget.uid)
      const nextSetIndex = editTarget.si + 1
      if (exercise && nextSetIndex < exercise.sets.length) {
        const nextSet = exercise.sets[nextSetIndex]
        setEditTarget({ uid: editTarget.uid, si: nextSetIndex })
        setEditValue(formatProgramBuilderRepRange(nextSet))
      } else {
        closeSetEditor()
      }
    },
    [activeDay, closeSetEditor, commitRange, editTarget, editValue]
  )

  const addSet = React.useCallback(
    (exerciseUid: string) => {
      updateActiveDay((currentExercises) =>
        currentExercises.map((exercise) => {
          if (exercise.uid !== exerciseUid) {
            return exercise
          }

          const lastSet = exercise.sets[exercise.sets.length - 1] ?? { min: 8, max: 12 }
          return { ...exercise, sets: [...exercise.sets, { ...lastSet }] }
        })
      )
    },
    [updateActiveDay]
  )

  const removeSet = React.useCallback(
    (exerciseUid: string) => {
      updateActiveDay((currentExercises) =>
        currentExercises.map((exercise) =>
          exercise.uid === exerciseUid && exercise.sets.length > 1
            ? { ...exercise, sets: exercise.sets.slice(0, -1) }
            : exercise
        )
      )
    },
    [updateActiveDay]
  )

  const setIntensifier = React.useCallback(
    (exerciseUid: string, setIndex: number, type: ProgramBuilderIntensifierType | null) => {
      updateActiveDay((currentExercises) =>
        currentExercises.map((exercise) =>
          exercise.uid === exerciseUid
            ? {
                ...exercise,
                sets: exercise.sets.map((set, index) => {
                  if (index !== setIndex) {
                    return set
                  }

                  if (!type) {
                    return { ...set, int: undefined }
                  }

                  return {
                    ...set,
                    int: {
                      type,
                      params: { ...PROGRAM_BUILDER_INTENSIFIERS[type].defaults },
                    },
                  }
                }),
              }
            : exercise
        )
      )
      setIntensifierEditor(type ? { uid: exerciseUid, si: setIndex } : null)
    },
    [updateActiveDay]
  )

  const updateIntensifierParam = React.useCallback(
    (exerciseUid: string, setIndex: number, key: string, value: number) => {
      updateActiveDay((currentExercises) =>
        currentExercises.map((exercise) =>
          exercise.uid === exerciseUid
            ? {
                ...exercise,
                sets: exercise.sets.map((set, index) =>
                  index === setIndex && set.int
                    ? {
                        ...set,
                        int: {
                          ...set.int,
                          params: { ...set.int.params, [key]: value },
                        },
                      }
                    : set
                ),
              }
            : exercise
        )
      )
    },
    [updateActiveDay]
  )

  const setTempo = React.useCallback(
    (exerciseUid: string, setIndex: number, tempoValue: string | null) => {
      updateActiveDay((currentExercises) =>
        currentExercises.map((exercise) =>
          exercise.uid === exerciseUid
            ? {
                ...exercise,
                sets: exercise.sets.map((set, index) =>
                  index === setIndex
                    ? { ...set, tempo: tempoValue ? parseProgramBuilderTempo(tempoValue) : null }
                    : set
                ),
              }
            : exercise
        )
      )
    },
    [updateActiveDay]
  )

  const setRpe = React.useCallback(
    (exerciseUid: string, setIndex: number, value: number | null) => {
      updateActiveDay((currentExercises) =>
        currentExercises.map((exercise) =>
          exercise.uid === exerciseUid
            ? {
                ...exercise,
                sets: exercise.sets.map((set, index) =>
                  index === setIndex ? { ...set, rpe: value } : set
                ),
              }
            : exercise
        )
      )
    },
    [updateActiveDay]
  )

  const setRir = React.useCallback(
    (exerciseUid: string, setIndex: number, value: number | null) => {
      updateActiveDay((currentExercises) =>
        currentExercises.map((exercise) =>
          exercise.uid === exerciseUid
            ? {
                ...exercise,
                sets: exercise.sets.map((set, index) =>
                  index === setIndex ? { ...set, rir: value } : set
                ),
              }
            : exercise
        )
      )
    },
    [updateActiveDay]
  )

  const addDay = React.useCallback(() => {
    setDays((currentDays) => [
      ...currentDays,
      {
        id: createProgramBuilderId("program-day"),
        name: `Workout ${currentDays.length + 1}`,
        isRest: false,
        exercises: [],
      },
    ])
    setActiveDayIndex(days.length)
  }, [days.length])

  const addRestDay = React.useCallback(() => {
    setDays((currentDays) => [
      ...currentDays,
      {
        id: createProgramBuilderId("program-rest-day"),
        name: "Rest Day",
        isRest: true,
        exercises: [],
      },
    ])
  }, [])

  const duplicateDay = React.useCallback((dayIndex: number) => {
    const sourceDay = days[dayIndex]
    if (!sourceDay) {
      return
    }

    const nextDay = cloneProgramBuilderDay(sourceDay)
    nextDay.id = createProgramBuilderId("program-day")
    nextDay.name = `${sourceDay.name} B`
    nextDay.exercises = nextDay.exercises.map((exercise) => ({
      ...exercise,
      uid: createProgramBuilderId("program-exercise"),
    }))

    setDays((currentDays) => {
      const nextDays = [...currentDays]
      nextDays.splice(dayIndex + 1, 0, nextDay)
      return nextDays
    })
    setActiveDayIndex(dayIndex + 1)
  }, [days])

  const deleteDay = React.useCallback((dayIndex: number) => {
    if (days.length <= 1) {
      return
    }

    setDays((currentDays) => currentDays.filter((_, index) => index !== dayIndex))
    setActiveDayIndex((currentIndex) => {
      if (currentIndex === dayIndex) {
        return Math.max(0, currentIndex - 1)
      }
      if (dayIndex < currentIndex) {
        return currentIndex - 1
      }
      return currentIndex
    })
  }, [days.length])

  const saveDayAsTemplate = React.useCallback((dayIndex: number, templateName?: string) => {
    const sourceDay = days[dayIndex]
    if (!sourceDay || sourceDay.isRest || sourceDay.exercises.length === 0) {
      return
    }

    setDayTemplates((currentTemplates) => [
      {
        id: createProgramBuilderId("program-template"),
        name: templateName?.trim() || sourceDay.name,
        exercises: sourceDay.exercises.map(cloneProgramBuilderExercise),
      },
      ...currentTemplates,
    ])
  }, [days])

  const duplicateActiveDay = React.useCallback(() => {
    if (!activeDay) {
      return
    }
    duplicateDay(activeDayIndex)
  }, [activeDay, activeDayIndex, duplicateDay])

  const deleteActiveDay = React.useCallback(() => {
    deleteDay(activeDayIndex)
  }, [activeDayIndex, deleteDay])

  const saveActiveDayAsTemplate = React.useCallback((templateName?: string) => {
    if (!activeDay) {
      return
    }
    saveDayAsTemplate(activeDayIndex, templateName)
  }, [activeDay, activeDayIndex, saveDayAsTemplate])

  const applyTemplate = React.useCallback(
    (template: ProgramBuilderDayTemplate) => {
      if (!activeDay || activeDay.isRest) {
        return
      }

      updateActiveDay((currentExercises) => [
        ...currentExercises,
        ...template.exercises.map((exercise) => ({
          ...exercise,
          uid: createProgramBuilderId("program-exercise"),
        })),
      ])
    },
    [activeDay, updateActiveDay]
  )

  const replaceWithTemplate = React.useCallback(
    (template: ProgramBuilderDayTemplate) => {
      setDays((currentDays) =>
        currentDays.map((day, dayIndex) =>
          dayIndex === activeDayIndex
            ? {
                ...day,
                name: template.name,
                isRest: false,
                exercises: template.exercises.map((exercise) => ({
                  ...exercise,
                  uid: createProgramBuilderId("program-exercise"),
                })),
              }
            : day
        )
      )
    },
    [activeDayIndex]
  )

  const removeTemplate = React.useCallback((templateId: string) => {
    setDayTemplates((currentTemplates) =>
      currentTemplates.filter((template) => template.id !== templateId)
    )
  }, [])

  const addCustomRepRange = React.useCallback(() => {
    const parsedValue = parseProgramBuilderRepRange(newRepRange)
    if (!parsedValue) {
      return
    }

    const formattedValue = formatProgramBuilderRepRange(parsedValue)
    setMyReps((currentRanges) =>
      currentRanges.includes(formattedValue) ? currentRanges : [...currentRanges, formattedValue]
    )
    setNewRepRange("")
  }, [newRepRange])

  const addCustomTempo = React.useCallback(() => {
    const parsedValue = parseProgramBuilderTempo(newTempo)
    if (!parsedValue) {
      return
    }

    const formattedValue = formatProgramBuilderTempo(parsedValue)
    setMyTempos((currentTempos) =>
      currentTempos.includes(formattedValue) ? currentTempos : [...currentTempos, formattedValue]
    )
    setNewTempo("")
  }, [newTempo])

  const handleCanvasDrop = React.useCallback(
    (index: number) => {
      if (draggedLibraryExercise) {
        addExercise(draggedLibraryExercise, index)
      } else if (
        reorderExerciseIndex !== null &&
        activeDay &&
        reorderExerciseIndex !== index
      ) {
        updateActiveDay((currentExercises) =>
          moveArrayItem(
            currentExercises,
            reorderExerciseIndex,
            reorderExerciseIndex < index ? index - 1 : index
          )
        )
      }

      setDraggedLibraryExercise(null)
      setReorderExerciseIndex(null)
      setDragOverIndex(null)
    },
    [activeDay, addExercise, draggedLibraryExercise, reorderExerciseIndex, updateActiveDay]
  )

  const handleDayDrop = React.useCallback(
    (index: number) => {
      if (draggedDayIndex === null || draggedDayIndex === index) {
        setDraggedDayIndex(null)
        setDragDayOverIndex(null)
        return
      }

      setDays((currentDays) => moveArrayItem(currentDays, draggedDayIndex, index))

      if (activeDayIndex === draggedDayIndex) {
        setActiveDayIndex(index)
      } else if (draggedDayIndex < activeDayIndex && index >= activeDayIndex) {
        setActiveDayIndex((currentIndex) => currentIndex - 1)
      } else if (draggedDayIndex > activeDayIndex && index <= activeDayIndex) {
        setActiveDayIndex((currentIndex) => currentIndex + 1)
      }

      setDraggedDayIndex(null)
      setDragDayOverIndex(null)
    },
    [activeDayIndex, draggedDayIndex]
  )

  return {
    description,
    setDescription,
    days,
    activeDay,
    activeDayIndex,
    setActiveDayIndex,
    totalSets,
    exerciseLibrary,
    dayExerciseIds,
    leftTab,
    setLeftTab,
    searchQuery,
    setSearchQuery,
    templateQuery,
    setTemplateQuery,
    muscleFilter,
    setMuscleFilter,
    filteredExercises,
    filteredTemplates,
    dayTemplates,
    editTarget,
    editValue,
    setEditValue,
    intensifierEditor,
    renamingDayIndex,
    setRenamingDayIndex,
    draggedLibraryExercise,
    reorderExerciseIndex,
    dragOverIndex,
    setDragOverIndex,
    draggedDayIndex,
    dragDayOverIndex,
    setDragDayOverIndex,
    myReps,
    showMyReps,
    setShowMyReps,
    newRepRange,
    setNewRepRange,
    otherRepRanges,
    myTempos,
    showMyTempos,
    setShowMyTempos,
    newTempo,
    setNewTempo,
    showAdvancedSetOptions,
    setShowAdvancedSetOptions,
    otherTempos,
    useIntensifiers,
    setUseIntensifiers,
    useTempo,
    setUseTempo,
    useRpe,
    setUseRpe,
    useRir,
    setUseRir,
    rpeOptions: PROGRAM_BUILDER_RPE_OPTIONS,
    rirOptions: PROGRAM_BUILDER_RIR_OPTIONS,
    addExercise,
    createExercise,
    removeExercise,
    openSetEditor,
    closeSetEditor,
    handleSetInputBlur,
    handleSetInputKeyDown,
    applyQuickRepRange,
    addSet,
    removeSet,
    setIntensifier,
    updateIntensifierParam,
    setTempo,
    setRpe,
    setRir,
    addDay,
    addRestDay,
    duplicateDay,
    deleteDay,
    saveDayAsTemplate,
    duplicateActiveDay,
    deleteActiveDay,
    saveActiveDayAsTemplate,
    applyTemplate,
    replaceWithTemplate,
    removeTemplate,
    addCustomRepRange,
    addCustomTempo,
    removeCustomRepRange: (index: number) =>
      setMyReps((currentRanges) => currentRanges.filter((_, currentIndex) => currentIndex !== index)),
    removeCustomTempo: (index: number) =>
      setMyTempos((currentTempos) => currentTempos.filter((_, currentIndex) => currentIndex !== index)),
    setDayName: (index: number, value: string) =>
      setDays((currentDays) =>
        currentDays.map((day, dayIndex) => (dayIndex === index ? { ...day, name: value } : day))
      ),
    setDraggedLibraryExercise,
    setReorderExerciseIndex,
    setDraggedDayIndex,
    handleCanvasDrop,
    handleDayDrop,
    muscleFilters: PROGRAM_BUILDER_MUSCLE_FILTERS,
  }
}
