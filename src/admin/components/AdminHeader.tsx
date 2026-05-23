import { Link } from "react-router-dom"
import { ExternalLink } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export default function AdminHeader({ title }: { title: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="ml-auto">
        <Link to="/">
          <Button variant="outline" size="sm">
            <ExternalLink />
            View store
          </Button>
        </Link>
      </div>
    </header>
  )
}
