import type { DashboardStat } from "@/type/admin.type"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function DashboardStatCard({ stat }: { stat: DashboardStat }) {
  const Icon = stat.icon

  return (
    <Card className="gap-4 py-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-0">
        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
        <div className="flex size-9 items-center justify-center rounded-lg bg-[#0c381b]/10 text-[#0c381b]">
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent className="px-4">
        <div className="text-2xl font-bold">{stat.value}</div>
        <CardDescription className="mt-1">{stat.description}</CardDescription>
      </CardContent>
    </Card>
  )
}
