export type NutritionMacroSegment = {
  macro: "protein" | "carbs" | "fats"
  value: number
  fill: string
}

export type NutritionMealPlan = {
  id: string
  title: string
  subtitle: string
  type: string
  calories: number
  macros: string
  schedule: string
  segments: NutritionMacroSegment[]
}

export type NutritionLogEntry = {
  id: string
  day: string
  calories: string
  protein: string
  hydration: string
  note: string
  status: string
}

export type NutritionIifymTargets = {
  calories: number
  protein: number
  carbs: number
  fats: number
  fiber: number
}

export type NutritionIifymEntry = {
  id: string
  date: string
  dayShort: string
  dayNumber: string
  loggedMeals: number
  calories: number
  protein: number
  carbs: number
  fats: number
  fiber: number
  sugar: number
  sodium: number
  potassium: number
  saturatedFat: number
  polyunsaturatedFat: number
  monounsaturatedFat: number
}

export type NutritionPreset = {
  dailyTarget: string
  macroTarget: string
  mealCadence: string
  coachNote: string
  planCoverage: string
  loggerStats: {
    loggedDays: string
    proteinTarget: string
    hydrationAverage: string
    consistency: string
  }
  loggerNote: string
  loggerChecklist: string[]
  mealPlans: NutritionMealPlan[]
  loggerEntries: NutritionLogEntry[]
  iifymTargets: NutritionIifymTargets
  iifymEntries: NutritionIifymEntry[]
}

export type NutritionPlanType = "meal" | "macros"

export type NutritionMealPlanOption = {
  id: string
  label: string
  title: string
  calories: number
  carbs: number
  protein: number
  fats: number
  description: string
  image: string
}

export type NutritionMealPlanSection = {
  id: string
  label: string
  options: NutritionMealPlanOption[]
}

export type NutritionRecipeLibraryItem = {
  id: string
  title: string
  mealType: string
  calories: number
  carbs: number
  protein: number
  fats: number
  image: string
}

export type NutritionPlanMacros = {
  protein: number
  carbs: number
  fats: number
}

export type NutritionPanelSubTab = "nutrition" | "nutrition-logger"

export type ClientNutritionMealPlansViewProps = {
  phase?: string
}

export type MealPlanDetailViewProps = {
  mealPlanId: string
  phase?: string
  backHref?: string
}

export type MealPlanEditPageViewProps = {
  mealPlanId: string
  phase?: string
  backHref: string
}

export type ClientNutritionPanelProps = {
  phase?: string
  initialSubTab?: NutritionPanelSubTab
}
