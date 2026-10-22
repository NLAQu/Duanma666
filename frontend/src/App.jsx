import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/common/Layout";
import Home from "./pages/consumer/Home";
import ProductDetail from "./pages/consumer/ProductDetail";
import Cart from "./pages/consumer/Cart";
import Checkout from "./pages/consumer/Checkout";
import Login from "./pages/consumer/Login";
import Register from "./pages/consumer/Register";
import Admin from "./pages/admin/Admin";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
