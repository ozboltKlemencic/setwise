import { CoachWiseClientsTable } from "@/components/coach-wise-clients-table"

import data from "../data.json"

export default function ClientsPage() {
  return (
    <section className="min-h-full ">
      <CoachWiseClientsTable data={data} />
    </section>
  )
}
