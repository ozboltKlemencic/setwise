import { ClientHabitsPanel } from "@/components/coachWise/clients/client-habits-panel"

import {
  getSingleSearchParam,
  type ClientDetailPageProps,
} from "@/lib/handlers/client-detail.handlers"

type HabitsSearchParams = {
  habitTab?: string | string[]
}

export default async function Page({
  searchParams,
}: ClientDetailPageProps<HabitsSearchParams>) {
  const resolvedSearchParams = await searchParams
  const activeHabitTab = getSingleSearchParam(resolvedSearchParams.habitTab)
  const resolvedHabitTab = activeHabitTab === "overview" ? "overview" : "habits"

  return <ClientHabitsPanel initialSubTab={resolvedHabitTab} />
}
