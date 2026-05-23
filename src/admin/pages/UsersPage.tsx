import { useCallback, useEffect, useState } from "react"
import { getAllProfiles, updateUserAccountType } from "@/api/user-api"
import { useAuth } from "@/Context/AuthContext"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { AccountType } from "@/type/admin.type"
import type { UserProfile } from "@/type/user.type"

const accountTypes: AccountType[] = ["user", "admin"]

export default function UsersPage() {
  const { session } = useAuth()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    const data = await getAllProfiles()
    setUsers(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleAccountTypeChange = async (
    userId: string,
    accountType: AccountType
  ) => {
    setUpdatingId(userId)
    const result = await updateUserAccountType(userId, accountType)
    setUpdatingId(null)

    if (!result.success) {
      alert(result.message)
      return
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? result.data : u))
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">
          Manage account roles stored in profiles. Admin access updates immediately.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All users</CardTitle>
          <CardDescription>
            {loading
              ? "Loading..."
              : `${users.length} registered user${users.length === 1 ? "" : "s"}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No users found in the profiles table.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="border-b text-left">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Account type</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const isCurrentUser = user.id === session?.user?.id
                    const isUpdating = updatingId === user.id

                    return (
                      <tr key={user.id} className="border-b last:border-0">
                        <td className="px-4 py-3">
                          <div className="font-medium">
                            {user.full_name ?? "—"}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                (you)
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-xs text-muted-foreground">
                            {user.id.slice(0, 8)}…
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {user.phone ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={user.account_type}
                            disabled={isUpdating}
                            onChange={(e) =>
                              handleAccountTypeChange(
                                user.id,
                                e.target.value as AccountType
                              )
                            }
                            className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
                          >
                            {accountTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
