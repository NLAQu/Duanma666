const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(
  /\/$/,
  ""
);

async function request(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Không thể kết nối máy chủ");
  }
  return data;
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: () => request("/auth/me"),
  products: (category) =>
    request(category ? `/products?category=${encodeURIComponent(category)}` : "/products"),
  product: (id) => request(`/products/${id}`),
  createProduct: (payload) => request("/products", { method: "POST", body: payload }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),
  cart: () => request("/cart"),
  addToCart: (payload) => request("/cart", { method: "POST", body: payload }),
  updateCart: (itemId, quantity) =>
    request(`/cart/${itemId}`, { method: "PATCH", body: { quantity } }),
  removeCart: (itemId) => request(`/cart/${itemId}`, { method: "DELETE" }),
  createOrder: (payload) => request("/orders", { method: "POST", body: payload }),
  myOrders: () => request("/orders"),
  adminOrders: () => request("/admin/orders"),
};

export { API_URL };
