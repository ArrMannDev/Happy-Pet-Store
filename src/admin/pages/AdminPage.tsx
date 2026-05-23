import { Route, Routes } from "react-router-dom"
import AdminLayout from "@/admin/components/AdminLayout"
import DashboardPage from "@/admin/pages/DashboardPage"
import CategoriesPage from "@/admin/pages/CategoriesPage"
import UsersPage from "@/admin/pages/UsersPage"
import PlaceholderPage from "@/admin/pages/PlaceholderPage"

export default function AdminPage() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route
          path="products"
          element={
            <PlaceholderPage
              title="Products"
              description="Add and edit products for your store."
            />
          }
        />
        <Route
          path="orders"
          element={
            <PlaceholderPage
              title="Orders"
              description="Track and manage customer orders."
            />
          }
        />
      </Route>
    </Routes>
  )
}
