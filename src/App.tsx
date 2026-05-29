import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageLayOut from "./pages/PageLayOut";
import AddToCartPage from "./pages/AddToCartPage";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./admin/pages/AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageLayOut />}>
          <Route index element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:categoryId" element={<CategoriesPage />} />
          <Route path="/cart" element={<AddToCartPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
