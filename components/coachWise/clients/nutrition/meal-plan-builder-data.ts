import type {
  StoredNutritionMacroSegment,
  StoredNutritionMealPlan,
  StoredNutritionMealPlanBuilderSnapshot,
  StoredNutritionMealPlanOption,
  StoredNutritionMealPlanSection,
} from "@/lib/handlers/nutrition-plan-storage"

export type BuilderFood = StoredNutritionMealPlanBuilderSnapshot["foods"][number]
export type BuilderMealItem =
  StoredNutritionMealPlanBuilderSnapshot["meals"][number]["items"][number]
export type BuilderMeal = StoredNutritionMealPlanBuilderSnapshot["meals"][number]
export type BuilderMealPlanGoalSettings =
  StoredNutritionMealPlanBuilderSnapshot["mealPlanGoals"]

export type BuilderMealPlanGoalTargets = {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
}

export type BuilderTemplateItem = {
  foodId: number
  qty: number
}

export type BuilderMealTemplate = {
  id: string
  name: string
  items: BuilderTemplateItem[]
  isCustom?: boolean
}

type BuilderMealPlanSectionLike = {
  label: string
  options: Array<{
    title: string
    calories: number
    carbs: number
    protein: number
    fats: number
    description: string
  }>
}

export const DEFAULT_BUILDER_FOODS: BuilderFood[] = [
  { id: 1, name: "Chicken breast", cal: 165, p: 31, c: 0, f: 3.6, unit: "g", step: 50, defaultQty: 150 },
  { id: 2, name: "Cooked rice", cal: 130, p: 2.7, c: 28, f: 0.3, unit: "g", step: 50, defaultQty: 200 },
  { id: 3, name: "Broccoli", cal: 34, p: 2.8, c: 7, f: 0.4, unit: "g", step: 50, defaultQty: 150 },
  { id: 4, name: "Eggs", cal: 155, p: 13, c: 1.1, f: 11, unit: "piece", step: 1, defaultQty: 3 },
  { id: 5, name: "Oats", cal: 389, p: 17, c: 66, f: 7, unit: "g", step: 10, defaultQty: 80 },
  { id: 6, name: "Banana", cal: 89, p: 1.1, c: 23, f: 0.3, unit: "piece", step: 1, defaultQty: 1 },
  { id: 7, name: "Whey protein", cal: 120, p: 24, c: 3, f: 1.5, unit: "g", step: 5, defaultQty: 30 },
  { id: 8, name: "Tuna", cal: 116, p: 26, c: 0, f: 1, unit: "g", step: 50, defaultQty: 100 },
  { id: 9, name: "Sweet potato", cal: 86, p: 1.6, c: 20, f: 0.1, unit: "g", step: 50, defaultQty: 200 },
  { id: 10, name: "Cottage cheese", cal: 98, p: 11, c: 3.4, f: 4.3, unit: "g", step: 50, defaultQty: 200 },
  { id: 11, name: "Avocado", cal: 160, p: 2, c: 9, f: 15, unit: "piece", step: 1, defaultQty: 1 },
  { id: 12, name: "Almonds", cal: 579, p: 21, c: 22, f: 50, unit: "g", step: 5, defaultQty: 30 },
  { id: 13, name: "Salmon", cal: 208, p: 20, c: 0, f: 13, unit: "g", step: 50, defaultQty: 150 },
  { id: 14, name: "Spinach", cal: 23, p: 2.9, c: 3.6, f: 0.4, unit: "g", step: 50, defaultQty: 100 },
  { id: 15, name: "Greek yogurt", cal: 59, p: 10, c: 3.6, f: 0.7, unit: "g", step: 50, defaultQty: 200 },
  { id: 16, name: "Wholegrain bread", cal: 247, p: 13, c: 41, f: 3.4, unit: "slice", step: 1, defaultQty: 2 },
  { id: 17, name: "Olive oil", cal: 884, p: 0, c: 0, f: 100, unit: "ml", step: 5, defaultQty: 10 },
  { id: 18, name: "Turkey fillet", cal: 135, p: 30, c: 0, f: 1, unit: "g", step: 50, defaultQty: 150 },
  { id: 19, name: "Quinoa", cal: 120, p: 4.4, c: 21, f: 1.9, unit: "g", step: 50, defaultQty: 150 },
  { id: 20, name: "Strawberries", cal: 32, p: 0.7, c: 7.7, f: 0.3, unit: "g", step: 50, defaultQty: 150 },
]

export const DEFAULT_BUILDER_MEAL_TEMPLATES: BuilderMealTemplate[] = [
  { id: "t1", name: "Breakfast A - Oat Bowl", items: [{ foodId: 5, qty: 80 }, { foodId: 7, qty: 30 }, { foodId: 6, qty: 1 }, { foodId: 12, qty: 20 }] },
  { id: "t2", name: "Lunch - Chicken & Rice", items: [{ foodId: 1, qty: 200 }, { foodId: 2, qty: 250 }, { foodId: 3, qty: 150 }, { foodId: 17, qty: 10 }] },
  { id: "t3", name: "Breakfast B - Eggs & Toast", items: [{ foodId: 4, qty: 3 }, { foodId: 16, qty: 2 }, { foodId: 11, qty: 1 }, { foodId: 14, qty: 50 }] },
  { id: "t4", name: "Dinner - Salmon", items: [{ foodId: 13, qty: 180 }, { foodId: 9, qty: 200 }, { foodId: 14, qty: 100 }, { foodId: 17, qty: 10 }] },
]

export const RECENT_BUILDER_FOOD_IDS = [1, 2, 5, 4, 7, 3, 15, 8, 13, 6]

const fallbackMealImages = [
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80",
]

function cloneFoods(foods: BuilderFood[]) {
  return foods.map((food) => ({ ...food }))
}

function cloneMeals(meals: BuilderMeal[]) {
  return meals.map((meal) => ({
    ...meal,
    items: meal.items.map((item) => ({ ...item })),
  }))
}

function createDefaultMealPlanGoalSettingsSnapshot(): BuilderMealPlanGoalSettings {
  return {
    presetId: null,
    calories: { enabled: false, value: 2500 },
    protein: { enabled: false, value: 180 },
    carbs: { enabled: false, value: 250 },
    fat: { enabled: false, value: 80 },
  }
}

export function createMealPlanGoalSettingsFromTargets(
  targets?: BuilderMealPlanGoalTargets
): BuilderMealPlanGoalSettings {
  const nextSettings = createDefaultMealPlanGoalSettingsSnapshot()

  if (!targets) {
    return nextSettings
  }

  if (typeof targets.calories === "number" && targets.calories > 0) {
    nextSettings.calories = {
      enabled: true,
      value: Math.round(targets.calories),
    }
  }

  if (typeof targets.protein === "number" && targets.protein > 0) {
    nextSettings.protein = {
      enabled: true,
      value: Math.round(targets.protein),
    }
  }

  if (typeof targets.carbs === "number" && targets.carbs > 0) {
    nextSettings.carbs = {
      enabled: true,
      value: Math.round(targets.carbs),
    }
  }

  if (typeof targets.fat === "number" && targets.fat > 0) {
    nextSettings.fat = {
      enabled: true,
      value: Math.round(targets.fat),
    }
  }

  return nextSettings
}

export function formatBuilderDate() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date())
}

export function createDefaultMealPlanBuilderSnapshot(
  planName = `Meal Plan - ${formatBuilderDate()}`,
  goalTargets?: BuilderMealPlanGoalTargets
): StoredNutritionMealPlanBuilderSnapshot {
  return {
    planName,
    foods: cloneFoods(DEFAULT_BUILDER_FOODS),
    meals: [{ id: 1, name: "Meal 1", items: [] }],
    mealPlanGoals: createMealPlanGoalSettingsFromTargets(goalTargets),
  }
}

export function formatFoodUnitLabel(unit: BuilderFood["unit"]) {
  switch (unit) {
    case "piece":
      return "pc"
    case "slice":
      return "sl"
    default:
      return unit
  }
}

export function calcBuilderNutrition(
  foods: BuilderFood[],
  foodId: number,
  qty: number
) {
  const food = foods.find((item) => item.id === foodId)

  if (!food) {
    return { cal: 0, p: 0, c: 0, f: 0 }
  }

  const isCountable = food.unit === "piece" || food.unit === "slice"
  const multiplier = isCountable ? qty : qty / 100

  return {
    cal: Math.round(food.cal * multiplier),
    p: +(food.p * multiplier).toFixed(1),
    c: +(food.c * multiplier).toFixed(1),
    f: +(food.f * multiplier).toFixed(1),
  }
}

export function getBuilderMealTotals(foods: BuilderFood[], meal: BuilderMeal) {
  return meal.items.reduce(
    (accumulator, item) => {
      const nutrition = calcBuilderNutrition(foods, item.foodId, item.qty)
      return {
        cal: accumulator.cal + nutrition.cal,
        p: accumulator.p + nutrition.p,
        c: accumulator.c + nutrition.c,
        f: accumulator.f + nutrition.f,
      }
    },
    { cal: 0, p: 0, c: 0, f: 0 }
  )
}

export function getBuilderPlanTotals(foods: BuilderFood[], meals: BuilderMeal[]) {
  return meals.reduce(
    (accumulator, meal) => {
      const totals = getBuilderMealTotals(foods, meal)
      return {
        cal: accumulator.cal + totals.cal,
        p: accumulator.p + totals.p,
        c: accumulator.c + totals.c,
        f: accumulator.f + totals.f,
      }
    },
    { cal: 0, p: 0, c: 0, f: 0 }
  )
}

export function getBuilderTemplateTotals(
  foods: BuilderFood[],
  template: BuilderMealTemplate
) {
  return template.items.reduce(
    (accumulator, item) => {
      const nutrition = calcBuilderNutrition(foods, item.foodId, item.qty)
      return {
        cal: accumulator.cal + nutrition.cal,
        p: accumulator.p + nutrition.p,
        c: accumulator.c + nutrition.c,
        f: accumulator.f + nutrition.f,
      }
    },
    { cal: 0, p: 0, c: 0, f: 0 }
  )
}

function formatStoredFoodQuantity(qty: number, unit: BuilderFood["unit"]) {
  return `${qty} ${formatFoodUnitLabel(unit)}`
}

export function buildStoredNutritionMealPlanSegments(totals: {
  p: number
  c: number
  f: number
}): StoredNutritionMacroSegment[] {
  const proteinCalories = totals.p * 4
  const carbsCalories = totals.c * 4
  const fatsCalories = totals.f * 9
  const totalMacroCalories =
    proteinCalories + carbsCalories + fatsCalories || 1

  const proteinPercent = Math.round((proteinCalories / totalMacroCalories) * 100)
  const carbsPercent = Math.round((carbsCalories / totalMacroCalories) * 100)

  return [
    {
      macro: "protein",
      value: proteinPercent,
      fill: "var(--color-protein)",
    },
    {
      macro: "carbs",
      value: carbsPercent,
      fill: "var(--color-carbs)",
    },
    {
      macro: "fats",
      value: Math.max(0, 100 - proteinPercent - carbsPercent),
      fill: "var(--color-fats)",
    },
  ]
}

export function buildStoredNutritionMealPlanSections(
  meals: BuilderMeal[],
  foods: BuilderFood[]
): StoredNutritionMealPlanSection[] {
  return meals.map((meal, mealIndex) => {
    const mealTotals = getBuilderMealTotals(foods, meal)
    const mealFoodNames = meal.items
      .map((item) => foods.find((food) => food.id === item.foodId)?.name)
      .filter(Boolean) as string[]
    const title =
      mealFoodNames.length > 0
        ? mealFoodNames.join(" + ")
        : `${meal.name} foods`
    const description =
      meal.items.length > 0
        ? meal.items
            .map((item) => {
              const food = foods.find((entry) => entry.id === item.foodId)

              if (!food) {
                return null
              }

              return `${food.name} ${formatStoredFoodQuantity(item.qty, food.unit)}`
            })
            .filter(Boolean)
            .join(", ")
        : "No foods added yet."

    const option: StoredNutritionMealPlanOption = {
      id: `section-${meal.id}-option-1`,
      label: "Option 1",
      title,
      calories: mealTotals.cal,
      carbs: Math.round(mealTotals.c),
      protein: Math.round(mealTotals.p),
      fats: Math.round(mealTotals.f),
      description,
      image: fallbackMealImages[mealIndex % fallbackMealImages.length],
    }

    return {
      id: `section-${meal.id}`,
      label: meal.name,
      options: [option],
    }
  })
}

export function buildStoredNutritionMealPlanFromBuilderState({
  planId,
  planName,
  meals,
  foods,
  mealPlanGoals,
  createdAt,
}: {
  planId?: string
  planName: string
  meals: BuilderMeal[]
  foods: BuilderFood[]
  mealPlanGoals: BuilderMealPlanGoalSettings
  createdAt?: string
}): StoredNutritionMealPlan {
  const planTotals = getBuilderPlanTotals(foods, meals)
  const totalFoodCount = meals.reduce(
    (totalCount, meal) => totalCount + meal.items.length,
    0
  )

  return {
    id: planId ?? `custom-meal-plan-${Date.now()}`,
    title: planName,
    subtitle: `Custom plan with ${meals.length} meals and ${totalFoodCount} foods.`,
    type: "Meal Plan",
    calories: planTotals.cal,
    macros: `${Math.round(planTotals.p)}P / ${Math.round(planTotals.c)}C / ${Math.round(planTotals.f)}F`,
    schedule: `${meals.length} meal${meals.length === 1 ? "" : "s"}`,
    segments: buildStoredNutritionMealPlanSegments(planTotals),
    sections: buildStoredNutritionMealPlanSections(meals, foods),
    createdAt: createdAt ?? new Date().toISOString(),
    builderSnapshot: {
      planName,
      foods: cloneFoods(foods),
      meals: cloneMeals(meals),
      mealPlanGoals: {
        presetId: mealPlanGoals.presetId,
        calories: { ...mealPlanGoals.calories },
        protein: { ...mealPlanGoals.protein },
        carbs: { ...mealPlanGoals.carbs },
        fat: { ...mealPlanGoals.fat },
      },
    },
  }
}

function parseBuilderUnit(
  value: string
): BuilderFood["unit"] | null {
  if (value === "g" || value === "ml") {
    return value
  }

  if (value === "pc") {
    return "piece"
  }

  if (value === "sl") {
    return "slice"
  }

  return null
}

function createSyntheticMealFood({
  foods,
  nextFoodId,
  name,
  calories,
  protein,
  carbs,
  fats,
}: {
  foods: BuilderFood[]
  nextFoodId: number
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
}) {
  const nextFood: BuilderFood = {
    id: nextFoodId,
    name,
    cal: calories,
    p: protein,
    c: carbs,
    f: fats,
    unit: "piece",
    step: 1,
    defaultQty: 1,
  }

  foods.push(nextFood)
  return nextFood
}

function parseMealItemsFromDescription({
  description,
  foods,
  nextItemId,
}: {
  description: string
  foods: BuilderFood[]
  nextItemId: { current: number }
}) {
  const descriptionParts = description
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)

  const nextItems: BuilderMealItem[] = []

  descriptionParts.forEach((part) => {
    const match = part.match(/^(.*)\s+(\d+(?:\.\d+)?)\s+(g|ml|pc|sl)$/i)

    if (!match) {
      return
    }

    const [, rawName, rawQty, rawUnit] = match
    const normalizedName = rawName.trim().toLowerCase()
    const unit = parseBuilderUnit(rawUnit.toLowerCase())
    const qty = Number(rawQty)

    if (!unit || !Number.isFinite(qty)) {
      return
    }

    const food = foods.find(
      (entry) =>
        entry.name.trim().toLowerCase() === normalizedName &&
        entry.unit === unit
    )

    if (!food) {
      return
    }

    nextItems.push({
      id: nextItemId.current++,
      foodId: food.id,
      qty,
    })
  })

  return nextItems
}

export function buildMealPlanBuilderSnapshotFromSections({
  planName,
  sections,
  builderSnapshot,
}: {
  planName: string
  sections: BuilderMealPlanSectionLike[]
  builderSnapshot?: StoredNutritionMealPlanBuilderSnapshot | null
}): StoredNutritionMealPlanBuilderSnapshot {
  if (builderSnapshot) {
    return {
      planName: builderSnapshot.planName || planName,
      foods: cloneFoods(builderSnapshot.foods),
      meals: cloneMeals(builderSnapshot.meals),
      mealPlanGoals: {
        presetId: builderSnapshot.mealPlanGoals.presetId,
        calories: { ...builderSnapshot.mealPlanGoals.calories },
        protein: { ...builderSnapshot.mealPlanGoals.protein },
        carbs: { ...builderSnapshot.mealPlanGoals.carbs },
        fat: { ...builderSnapshot.mealPlanGoals.fat },
      },
    }
  }

  const foods = cloneFoods(DEFAULT_BUILDER_FOODS)
  const nextFoodId = {
    current: Math.max(0, ...foods.map((food) => food.id)) + 1,
  }
  const nextItemId = { current: 1 }
  const meals =
    sections.length > 0
      ? sections.map((section, sectionIndex) => {
          const primaryOption = section.options[0]
          const parsedItems = primaryOption
            ? parseMealItemsFromDescription({
                description: primaryOption.description,
                foods,
                nextItemId,
              })
            : []

          if (!parsedItems.length && primaryOption) {
            const syntheticFood = createSyntheticMealFood({
              foods,
              nextFoodId: nextFoodId.current++,
              name: primaryOption.title,
              calories: primaryOption.calories,
              protein: primaryOption.protein,
              carbs: primaryOption.carbs,
              fats: primaryOption.fats,
            })

            parsedItems.push({
              id: nextItemId.current++,
              foodId: syntheticFood.id,
              qty: 1,
            })
          }

          return {
            id: sectionIndex + 1,
            name: section.label || `Meal ${sectionIndex + 1}`,
            items: parsedItems,
          }
        })
      : [{ id: 1, name: "Meal 1", items: [] }]

  return {
    planName,
    foods,
    meals,
    mealPlanGoals: createDefaultMealPlanGoalSettingsSnapshot(),
  }
}
