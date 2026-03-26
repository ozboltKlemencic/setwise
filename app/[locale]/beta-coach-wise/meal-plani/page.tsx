import { redirect } from "next/navigation"

import { routing } from "@/i18n/routing"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`

  redirect(`${localePrefix}/beta-coach-wise/nutrition`)
}
