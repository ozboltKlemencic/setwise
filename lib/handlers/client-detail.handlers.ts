import "server-only"

import { notFound } from "next/navigation"

import { getClientProfileBasePath } from "@/components/coachWise/clients/client-profile-routes"
import { getCoachWiseClientById } from "@/lib/handlers/clients.handlers"

export type ClientDetailSearchParams = Record<
  string,
  string | string[] | undefined
>

export type ClientDetailParams = Promise<{ locale: string; id: string }>

export type ClientDetailParamsProps = {
  params: ClientDetailParams
}

export type ClientDetailPageProps<
  TSearchParams extends ClientDetailSearchParams = ClientDetailSearchParams,
> = {
  params: ClientDetailParams
  searchParams: Promise<TSearchParams>
}

export async function resolveClientDetailContext(params: ClientDetailParams) {
  const { locale, id } = await params
  const clientId = Number(id)

  if (!Number.isInteger(clientId)) {
    notFound()
  }

  const client = getCoachWiseClientById(clientId)

  if (!client) {
    notFound()
  }

  return {
    locale,
    clientId,
    client,
    clientBasePath: getClientProfileBasePath(locale, clientId),
  }
}

export function getSingleSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}
