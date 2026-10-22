import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../store/AuthContext";
import { categoryLabel, formatPrice } from "../../utils/format";

const emptyForm = {
  name: "",
  price: "",
  image_url: "",
  category: "fashion",
  description: "",
  size: "",
  stock: 10,
};

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const [productRes, orderRes] = await Promise.all([api.products(), api.adminOrders()]);
    setProducts(productRes.data || []);
    setOrders(orderRes.data || []);
  }

  useEffect(() => {
    if (!isAdmin) return;
    load().catch((err) => setError(err.message));
  }, [isAdmin]);

  if (loading) return <p>Đang tải...</p>;
  if (!user) return <Navigate to="/login" state={{ from: "/admin" }} replace />;
  if (!isAdmin) {
    return (
      <div className="rounded-3xl bg-white p-8">
        <h1 className="font-display text-3xl">Không có quyền</h1>
        <p className="mt-2">Tài khoản này không phải Admin/Seller.</p>
      </div>
    );
  }

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleCreate(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.createProduct({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
      });
      setForm(emptyForm);
      setMessage("Đã thêm sản phẩm.");
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Xóa sản phẩm này?")) return;
    try {
      await api.deleteProduct(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm uppercase tracking-wide text-blush">Seller Center</p>
        <h1 className="font-display text-4xl">Quản trị</h1>
      </div>

      <section className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <form onSubmit={handleCreate} className="space-y-3 rounded-3xl bg-white p-6">
          <h2 className="font-display text-2xl">Thêm sản phẩm</h2>
          <input
            name="name"
            required
            placeholder="Tên sản phẩm"
            value={form.name}
            onChange={updateField}
            className="w-full rounded-2xl border border-sand px-4 py-3"
          />
          <input
            name="price"
            type="number"
            required
            placeholder="Giá"
            value={form.price}
            onChange={updateField}
            className="w-full rounded-2xl border border-sand px-4 py-3"
          />
          <input
            name="image_url"
            placeholder="URL ảnh"
            value={form.image_url}
            onChange={updateField}
            className="w-full rounded-2xl border border-sand px-4 py-3"
          />
          <select
            name="category"
            value={form.category}
            onChange={updateField}
            className="w-full rounded-2xl border border-sand px-4 py-3"
          >
            <option value="fashion">Thời trang</option>
            <option value="cosmetics">Mỹ phẩm</option>
          </select>
          <input
            name="size"
            placeholder="Size / dung tích (S,M,L hoặc 30ml)"
            value={form.size}
            onChange={updateField}
            className="w-full rounded-2xl border border-sand px-4 py-3"
          />
          <input
            name="stock"
            type="number"
            placeholder="Tồn kho"
            value={form.stock}
            onChange={updateField}
            className="w-full rounded-2xl border border-sand px-4 py-3"
          />
          <textarea
            name="description"
            rows="3"
            placeholder="Mô tả"
            value={form.description}
            onChange={updateField}
            className="w-full rounded-2xl border border-sand px-4 py-3"
          />
          {message && <p className="text-sm text-emerald-700">{message}</p>}
          {error && <p className="text-sm text-blush">{error}</p>}
          <button type="submit" className="w-full rounded-full bg-ink py-3 text-white">
            Lưu sản phẩm
          </button>
        </form>

        <div className="rounded-3xl bg-white p-6">
          <h2 className="font-display text-2xl">Sản phẩm</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-ink/50">
                <tr>
                  <th className="pb-2">Tên</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-sand">
                    <td className="py-3">{product.name}</td>
                    <td>{categoryLabel(product.category)}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="text-blush"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6">
        <h2 className="font-display text-2xl">Đơn hàng mới</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-ink/50">
              <tr>
                <th className="pb-2">Mã</th>
                <th>Khách</th>
                <th>SĐT</th>
                <th>Địa chỉ</th>
                <th>Tổng</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-4 text-ink/50">
                    Chưa có đơn hàng.
                  </td>
                </tr>
              )}
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-sand align-top">
                  <td className="py-3">#{order.id}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.phone}</td>
                  <td className="max-w-xs">{order.address}</td>
                  <td>{formatPrice(order.total)}</td>
                  <td>
                    <span className="rounded-full bg-sand px-2 py-1">{order.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
