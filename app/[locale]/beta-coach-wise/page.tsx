import { DataTable } from "@/components/data-table";
import data from "./data.json"

export default function Page() {
  return (
    <section className="space-y-4 px-4 lg:px-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Stranke
        </h2>
        <p className="text-sm text-muted-foreground">
          Pregled vseh strank in njihovega napredka na enem mestu.
        </p>
      </div>
      <DataTable data={data} />
    </section>
  )
}
