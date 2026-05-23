import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { getAccountType } from "@/api/user-api"
import { useAuth } from "@/Context/AuthContext"
import { Skeleton } from "@/components/ui/skeleton"

export default function RequireAdmin({
  children,
}: {
  children: React.ReactNode
}) {
  const { session } = useAuth()
  const location = useLocation()
  const [accountType, setAccountType] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (session === undefined) return

    if (!session?.user?.id) {
      setAccountType(null)
      setChecking(false)
      return
    }

    setChecking(true)
    getAccountType(
      session.user.id,
      session.user.user_metadata?.account_type
    ).then((type) => {
      setAccountType(type)
      setChecking(false)
    })
  }, [session])

  if (session === undefined || checking) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background p-8">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (accountType !== "admin") {
    return <Navigate to="/" replace />
  }

  return children
}
