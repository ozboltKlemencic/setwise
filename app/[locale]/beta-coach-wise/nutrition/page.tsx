"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Pencil, Search, Trash2 } from "lucide-react"
import {
  IconApple,
  IconBottle,
  IconChefHat,
  IconClipboardList,
  IconFilter,
  IconPlus,
  IconTag,
} from "@tabler/icons-react"

import { CoachWiseConfirmationDialog } from "@/components/coachWise/confirmation-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  NutritionCaloriesDonut,
  NutritionPlansTable,
  buildNutritionPlanSegments,
} from "@/components/coachWise/tables/nutrition-plans-table"
import { cn } from "@/lib/utils"

type MealPlanTab = "plans" | "meals" | "food"

type PlanType = "Meal Plan" | "Macros Plan"

type MealPlanRow = {
  id: string
  title: string
  subtitle: string
  type: PlanType
  calories: number
  protein: number
  carbs: number
  fats: number
}

type MealRow = {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  tags: string[]
  color: string
}

type FoodRow = {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  category: string
  custom: boolean
}

const mealPlanTabs: Array<{
  value: MealPlanTab
  label: string
  icon: React.ComponentType<{ className?: string }>
}> = [
  { value: "plans", label: "Plans", icon: IconClipboardList },
  { value: "meals", label: "Meals", icon: IconChefHat },
  { value: "food", label: "Food", icon: IconApple },
]

const mealPlanRows: MealPlanRow[] = [
  {
    id: "lean-gain",
    title: "Lean Gain Plan",
    subtitle: "Structured meal plan focused on a steady calorie surplus.",
    type: "Meal Plan",
    calories: 2100,
    protein: 190,
    carbs: 230,
    fats: 55,
  },
  {
    id: "recomp",
    title: "Recomp Plan",
    subtitle: "Macro targets set to support body recomposition.",
    type: "Macros Plan",
    calories: 2000,
    protein: 170,
    carbs: 165,
    fats: 73,
  },
  {
    id: "cut-phase",
    title: "Cut Phase Spring",
    subtitle: "Slightly lower calories with tighter food structure.",
    type: "Meal Plan",
    calories: 1640,
    protein: 155,
    carbs: 110,
    fats: 48,
  },
  {
    id: "maintenance",
    title: "Maintenance Template",
    subtitle: "Balanced macro targets for stable energy and recovery.",
    type: "Macros Plan",
    calories: 2000,
    protein: 165,
    carbs: 205,
    fats: 62,
  },
]

const mealRows: MealRow[] = [
  {
    id: "oats-breakfast",
    name: "Protein Oats Breakfast",
    calories: 520,
    protein: 42,
    carbs: 55,
    fats: 12,
    tags: ["Breakfast", "High Protein"],
    color: "from-orange-200 via-amber-100 to-white",
  },
  {
    id: "chicken-bowl",
    name: "Chicken Rice Bowl",
    calories: 690,
    protein: 48,
    carbs: 79,
    fats: 18,
    tags: ["Lunch", "Post Workout"],
    color: "from-sky-200 via-cyan-100 to-white",
  },
  {
    id: "salmon-dinner",
    name: "Salmon & Potatoes",
    calories: 740,
    protein: 45,
    carbs: 58,
    fats: 31,
    tags: ["Dinner", "Omega 3"],
    color: "from-violet-200 via-fuchsia-100 to-white",
  },
  {
    id: "smoothie",
    name: "Blueberry Recovery Smoothie",
    calories: 330,
    protein: 27,
    carbs: 36,
    fats: 8,
    tags: ["Snack", "Recovery"],
    color: "from-emerald-200 via-lime-100 to-white",
  },
]

const foodRows: FoodRow[] = [
  { id: "chicken-breast", name: "Chicken breast", calories: 165, protein: 31, carbs: 0, fats: 3.6, category: "Protein", custom: false },
  { id: "white-rice", name: "White rice", calories: 130, protein: 2.7, carbs: 28, fats: 0.3, category: "Carbs", custom: false },
  { id: "olive-oil", name: "Olive oil", calories: 884, protein: 0, carbs: 0, fats: 100, category: "Fats", custom: false },
  { id: "banana", name: "Banana", calories: 89, protein: 1.1, carbs: 23, fats: 0.3, category: "Fruit", custom: false },
  { id: "whey-isolate", name: "Whey isolate", calories: 120, protein: 24, carbs: 3, fats: 1.5, category: "Supplements", custom: true },
  { id: "rice-cream", name: "Cream of rice", calories: 366, protein: 6, carbs: 81, fats: 1.2, category: "Carbs", custom: true },
]

const profileTabTriggerClassName =
  "h-full flex-none gap-1.5 rounded-none border-0 border-b-2 border-transparent bg-transparent px-3.5 py-2 text-[13.5px] font-normal text-neutral-500 after:hidden hover:text-neutral-700 data-[state=active]:border-(--brand-500) data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none [&_svg]:size-3.5 [&_svg]:text-neutral-400 data-[state=active]:[&_svg]:text-(--brand-600)"

const nutritionPageTableWrapperClassName =
  "overflow-hidden rounded-sm border border-neutral-200 bg-neutral-50"

const nutritionPageRowActionButtonClassName =
  "size-6 cursor-pointer rounded-md border-neutral-200/60 bg-neutral-100/85 text-muted-foreground shadow-none transition-colors hover:border-neutral-300/80 hover:bg-neutral-200/60 hover:text-foreground"

const nutritionPageRowDeleteActionButtonClassName =
  "border-rose-200/70 bg-rose-50/70 text-rose-500 hover:border-rose-300/80 hover:bg-rose-100/70 hover:text-rose-600"

function NutritionPageTableActionButtons({
  itemLabel,
}: {
  itemLabel: string
}) {
  return (
    <div className="flex w-[9rem] justify-center gap-3">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className={nutritionPageRowActionButtonClassName}
      >
        <Pencil className="size-3.5" />
        <span className="sr-only">Edit {itemLabel}</span>
      </Button>
      <CoachWiseConfirmationDialog
        title={`Are you sure you want to delete this ${itemLabel}?`}
        description={`This ${itemLabel} will be removed from the current list. This action can't be undone.`}
        confirmLabel={`Delete ${itemLabel}`}
        variant="destructive"
        onConfirm={() => {}}
        trigger={
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className={cn(
              nutritionPageRowActionButtonClassName,
              nutritionPageRowDeleteActionButtonClassName
            )}
          >
            <Trash2 className="size-3.5" />
            <span className="sr-only">Delete {itemLabel}</span>
          </Button>
        }
      />
    </div>
  )
}

function MealPlannerSearchBar({
  placeholder,
  action,
  inputWrapperClassName,
}: {
  placeholder: string
  action?: React.ReactNode
  inputWrapperClassName?: string
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("relative w-full max-w-sm", inputWrapperClassName)}>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
        <Input
          placeholder={placeholder}
          className="h-9 rounded-sm border-neutral-200 bg-white pl-9 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
        />
      </div>
      {action}
    </div>
  )
}

function PlannerTextarea({
  placeholder,
  className,
}: {
  placeholder: string
  className?: string
}) {
  return (
    <textarea
      placeholder={placeholder}
      className={cn(
        "w-full rounded-sm border border-neutral-200 px-3 py-3 text-[14px] text-neutral-900 shadow-none outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-300",
        className,
      )}
    />
  )
}

function AddPlanDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-9 rounded-sm bg-brand-500 px-3 text-[14px] font-medium text-white shadow-none hover:bg-brand-600">
          <IconPlus className="size-4" />+ Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[700px] rounded-sm border border-neutral-200 bg-white p-0 shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-[15px] font-semibold text-neutral-950">
            <IconClipboardList className="size-4.5 text-neutral-700" />
            Add Plan
          </DialogTitle>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="size-8 rounded-sm p-0 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
            >
              <span className="text-lg leading-none">×</span>
            </Button>
          </DialogClose>
        </div>
        <div className="space-y-5 px-6 py-5">
          <div className="space-y-2">
            <label className="text-[14px] font-medium text-neutral-800">
              Plan Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Name of the plan e.g. 2200kcal Recomp"
              className="h-11 rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[14px] font-medium text-neutral-800">
              Plan Description
            </label>
            <PlannerTextarea
              placeholder="Enter any additional info"
              className="min-h-[116px] rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[14px] font-medium text-neutral-800">
              Plan Type <span className="text-red-500">*</span>
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                className="rounded-sm border border-neutral-200 px-4 py-4 text-left transition hover:border-brand-300 hover:bg-brand-50/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[15px] font-semibold text-neutral-950">
                      <IconChefHat className="size-4 text-neutral-600" />
                      Meal Plan
                    </div>
                    <p className="text-[13px] leading-6 text-neutral-600">
                      Build meals with foods, recipes and meal timing structure.
                    </p>
                  </div>
                  <span className="mt-1 size-4 rounded-full border border-neutral-300" />
                </div>
              </button>
              <button
                type="button"
                className="rounded-sm border border-neutral-200 px-4 py-4 text-left transition hover:border-brand-300 hover:bg-brand-50/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[15px] font-semibold text-neutral-950">
                      <IconTag className="size-4 text-neutral-600" />
                      Macros Plan
                    </div>
                    <p className="text-[13px] leading-6 text-neutral-600">
                      Set calorie and macro targets without building meals.
                    </p>
                  </div>
                  <span className="mt-1 size-4 rounded-full border border-neutral-300" />
                </div>
              </button>
            </div>
          </div>
        </div>
        <DialogFooter className="flex items-center justify-between border-t border-neutral-200 px-6 py-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="h-9 rounded-sm px-3 text-[14px] font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Close
            </Button>
          </DialogClose>
          <Button className="h-9 rounded-sm bg-brand-500 px-4 text-[14px] font-medium text-white shadow-none hover:bg-brand-600">
            Add Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AddMealDialog() {
  const [activeTab, setActiveTab] = React.useState<"new" | "ai">("new")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-9 rounded-sm bg-brand-500 px-3 text-[14px] font-medium text-white shadow-none hover:bg-brand-600">
          <IconPlus className="size-4" />+ Meal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[840px] rounded-sm border border-neutral-200 bg-white p-0 shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-[15px] font-semibold text-neutral-950">
            <IconChefHat className="size-4.5 text-neutral-700" />
            Add Meal
          </DialogTitle>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="size-8 rounded-sm p-0 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
            >
              <span className="text-lg leading-none">×</span>
            </Button>
          </DialogClose>
        </div>
        <div className="px-6 pt-4">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "new" | "ai")}
            className="gap-0"
          >
            <TabsList variant="line" className="w-max gap-0 rounded-none bg-transparent p-0">
              <TabsTrigger value="new" className={profileTabTriggerClassName}>
                New Meal
              </TabsTrigger>
              <TabsTrigger value="ai" className={profileTabTriggerClassName}>
                Meal AI
              </TabsTrigger>
            </TabsList>
            <TabsContent value="new" className="mt-0 space-y-5 pb-5">
              <div className="grid gap-5 pt-5 md:grid-cols-[1fr_88px]">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[14px] font-medium text-neutral-800">
                      Meal Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Name of the meal e.g. Chicken Bowl"
                      className="h-11 rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-medium text-neutral-800">
                      Meal Description
                    </label>
                    <PlannerTextarea
                      placeholder="Enter any additional info"
                      className="min-h-[120px] rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                    />
                  </div>
                </div>
                <div className="rounded-sm border border-neutral-200 bg-gradient-to-br from-sky-200 via-cyan-100 to-white" />
              </div>
            </TabsContent>
            <TabsContent value="ai" className="mt-0 pb-5">
              <div className="space-y-5 pt-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[14px] text-neutral-700">
                    Create a new meal or paste an existing one to format.
                  </p>
                  <Button
                    variant="outline"
                    className="h-8 rounded-sm border-neutral-200 px-3 text-[13px] font-medium text-neutral-700 shadow-none hover:bg-neutral-100"
                  >
                    Try Sample
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-medium text-neutral-800">Meal Name</label>
                  <Input
                    placeholder="e.g., High Protein Lunch Bowl"
                    className="h-11 rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-medium text-neutral-800">
                    Meal Description
                  </label>
                  <PlannerTextarea
                    placeholder="Tell me what you want to do with your meal..."
                    className="min-h-[150px] rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                  />
                </div>
                <div className="flex justify-center">
                  <Button
                    className="h-11 rounded-sm bg-neutral-100 px-5 text-[14px] font-medium text-neutral-400 shadow-none"
                    disabled
                  >
                    Create Meal
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter className="flex items-center justify-between border-t border-neutral-200 px-6 py-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="h-9 rounded-sm px-3 text-[14px] font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Close
            </Button>
          </DialogClose>
          {activeTab === "new" ? (
            <Button className="h-9 rounded-sm bg-brand-500 px-4 text-[14px] font-medium text-white shadow-none hover:bg-brand-600">
              Add Meal
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AddFoodDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-9 rounded-sm bg-brand-500 px-3 text-[14px] font-medium text-white shadow-none hover:bg-brand-600">
          <IconPlus className="size-4" />+ Food
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[860px] rounded-sm border border-neutral-200 bg-white p-0 shadow-xl">
        <div className="grid md:grid-cols-[1.5fr_1fr]">
          <div className="border-r border-neutral-200 px-6 py-5">
            <div className="mb-5 flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-[15px] font-semibold text-neutral-950">
                <IconApple className="size-4.5 text-neutral-700" />
                Add Food
              </DialogTitle>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[14px] font-medium text-neutral-800">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Name of the food e.g. Greek Yogurt"
                  className="h-11 rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-medium text-neutral-800">
                  Instructions
                </label>
                <PlannerTextarea
                  placeholder="Enter any additional info"
                  className="min-h-[110px] rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[14px] font-medium text-neutral-800">Filters</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Select>
                    <SelectTrigger className="h-10 rounded-sm border-neutral-200 shadow-none focus:ring-0">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="protein">Protein</SelectItem>
                      <SelectItem value="carbs">Carbs</SelectItem>
                      <SelectItem value="fats">Fats</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="h-10 rounded-sm border-neutral-200 shadow-none focus:ring-0">
                      <SelectValue placeholder="Select Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="generic">Generic</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="h-10 rounded-sm border-neutral-200 shadow-none focus:ring-0">
                      <SelectValue placeholder="Select Main Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="h-10 rounded-sm border-neutral-200 shadow-none focus:ring-0">
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grams">Grams</SelectItem>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[15px] font-semibold text-neutral-950">
                <IconBottle className="size-4.5 text-neutral-700" />
                Media
              </div>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="size-8 rounded-sm p-0 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                >
                  <span className="text-lg leading-none">×</span>
                </Button>
              </DialogClose>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[14px] font-medium text-neutral-800">
                  YouTube Link
                </label>
                <Input
                  placeholder="Enter YouTube link"
                  className="h-11 rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                />
              </div>
              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-neutral-200" />
                <span className="text-[13px] font-medium text-neutral-500">OR</span>
                <div className="h-px flex-1 bg-neutral-200" />
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-medium text-neutral-800">
                  Custom Video
                </label>
                <div className="flex min-h-[160px] flex-col items-center justify-center rounded-sm border border-dashed border-neutral-200 bg-neutral-50 px-6 py-8 text-center">
                  <IconBottle className="mb-3 size-7 text-neutral-400" />
                  <p className="text-[14px] text-neutral-600">
                    Click or drag file to this area to upload
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex items-center justify-between border-t border-neutral-200 px-6 py-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="h-9 rounded-sm px-3 text-[14px] font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Close
            </Button>
          </DialogClose>
          <Button className="h-9 rounded-sm bg-brand-500 px-4 text-[14px] font-medium text-white shadow-none hover:bg-brand-600">
            Add Food
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PlansTable() {
  const rows = React.useMemo(
    () =>
      mealPlanRows.map((row) => ({
        id: row.id,
        title: row.title,
        subtitle: row.subtitle,
        type: row.type,
        calories: row.calories,
        segments: buildNutritionPlanSegments({
          protein: row.protein,
          carbs: row.carbs,
          fats: row.fats,
        }),
      })),
    []
  )

  return (
    <NutritionPlansTable
      rows={rows}
      onOpenRow={() => {}}
      onEditRow={() => {}}
      onDuplicateRow={() => {}}
      onDeleteRow={() => {}}
    />
  )
}

function MealsTable() {
  return (
    <div className="space-y-4">
      <MealPlannerSearchBar placeholder="Isci obroke..." inputWrapperClassName="max-w-[17rem]" />
      <div className={nutritionPageTableWrapperClassName}>
        <Table>
          <TableHeader className="bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4 text-[13px] font-medium lg:pl-5">
                Meal
              </TableHead>
              <TableHead className="w-[152px] px-3.5 text-center text-[13px] font-medium">
                Calories
              </TableHead>
              <TableHead className="w-[9rem] px-3 pr-5 text-center text-[13px] font-medium">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mealRows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer bg-white hover:bg-neutral-50/60"
              >
                <TableCell className="py-3 pl-4 lg:pl-5">
                  <div className="text-[14px] font-medium text-neutral-950">
                      {row.name}
                  </div>
                </TableCell>
                <TableCell className="px-3.5 py-3">
                  <div className="flex justify-center">
                    <NutritionCaloriesDonut
                      row={{
                        id: row.id,
                        title: row.name,
                        subtitle: "",
                        type: "Meal",
                        calories: row.calories,
                        segments: buildNutritionPlanSegments({
                          protein: row.protein,
                          carbs: row.carbs,
                          fats: row.fats,
                        }),
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="px-3 py-3 pr-5">
                  <NutritionPageTableActionButtons itemLabel="meal" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function FoodTable() {
  return (
    <div className="space-y-4">
      <MealPlannerSearchBar
        placeholder="Search food"
        action={
          <Button
            variant="outline"
            className="h-9 rounded-sm border-neutral-200 px-3 text-[14px] font-medium text-neutral-700 shadow-none hover:bg-neutral-100"
          >
            <IconFilter className="size-4" />
          </Button>
        }
      />
      <div className={nutritionPageTableWrapperClassName}>
        <Table>
          <TableHeader className="bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4 text-[13px] font-medium lg:pl-5">
                Food
              </TableHead>
              <TableHead className="w-[220px] px-3.5 text-[13px] font-medium">
                Category
              </TableHead>
              <TableHead className="w-[9rem] px-3 pr-5 text-center text-[13px] font-medium">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {foodRows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer bg-white hover:bg-neutral-50/60"
              >
                <TableCell className="py-3 pl-4 lg:pl-5">
                  <div className="space-y-0.5">
                    <div className="text-[14px] font-medium text-neutral-950">
                      {row.name}
                    </div>
                    <div className="text-[13px] text-neutral-500">
                      <span>{row.calories} kcal</span>
                      <span className="px-1.5 text-neutral-300">-</span>
                      <span className="text-emerald-500">P{row.protein}g</span>
                      <span className="px-1.5 text-neutral-300">-</span>
                      <span className="text-sky-500">C{row.carbs}g</span>
                      <span className="px-1.5 text-neutral-300">-</span>
                      <span className="text-amber-500">F{row.fats}g</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-3.5 py-3 text-[14px] text-neutral-700">
                  {row.category}
                </TableCell>
                <TableCell className="px-3 py-3 pr-5">
                  <NutritionPageTableActionButtons itemLabel="food" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function MealPlaniPageContent() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = (searchParams.get("tab") as MealPlanTab) || "plans"

  const setTab = React.useCallback(
    (value: MealPlanTab) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("tab", value)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  const tabsAction = (() => {
    if (activeTab === "plans") return <AddPlanDialog />
    if (activeTab === "meals") return <AddMealDialog />
    return <AddFoodDialog />
  })()

  return (
    <section className="min-w-0 bg-neutral-50">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setTab(value as MealPlanTab)}
        className="min-w-0 w-full gap-0"
      >
        <div className="border-b border-neutral-200 bg-neutral-50">
          <div className="flex min-w-0 items-center justify-between gap-4 pl-0 pr-4">
            <div className="min-w-0 flex-1 overflow-x-auto">
              <TabsList
                variant="line"
                className="w-max min-w-full justify-start gap-0 rounded-none bg-transparent p-0"
              >
                {mealPlanTabs.map(({ value, label, icon: Icon }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className={profileTabTriggerClassName}
                  >
                    <Icon className="size-4" />
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {tabsAction}
          </div>
        </div>

        <TabsContent value="plans" className="mt-0 p-4">
          <PlansTable />
        </TabsContent>
        <TabsContent value="meals" className="mt-0 p-4">
          <MealsTable />
        </TabsContent>
        <TabsContent value="food" className="mt-0 p-4">
          <FoodTable />
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default function MealPlaniPage() {
  return (
    <React.Suspense fallback={<section className="min-w-0 bg-neutral-50" />}>
      <MealPlaniPageContent />
    </React.Suspense>
  )
}
