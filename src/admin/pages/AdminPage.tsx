import { Route, Routes } from "react-router-dom"
import AdminLayout from "@/admin/components/AdminLayout"
import DashboardPage from "@/admin/pages/DashboardPage"
import CategoriesPage from "@/admin/pages/CategoriesPage"
import UsersPage from "@/admin/pages/UsersPage"
import ProductsPage from "@/admin/pages/ProductsPage"
import PlaceholderPage from "@/admin/pages/PlaceholderPage"

export default function AdminPage() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="products" element={<ProductsPage />} />
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
