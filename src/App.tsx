import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageLayOut from "./pages/PageLayOut";
import AddToCartPage from "./pages/AddToCartPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageLayOut />}>
          <Route index element={<HomePage />} />
          <Route path="cart" element={<AddToCartPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
