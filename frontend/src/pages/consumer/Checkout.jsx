import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../store/AuthContext";
import { useCart } from "../../store/CartContext";
import { formatPrice } from "../../utils/format";

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, refresh } = useCart();
  const [form, setForm] = useState({
    customer_name: user?.name || "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return <Navigate to="/login" state={{ from: "/checkout" }} replace />;
  }

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.createOrder(form);
      setOrder(res.data);
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (order) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 text-center">
        <p className="text-sm uppercase tracking-wide text-blush">Đặt hàng thành công</p>
        <h1 className="mt-2 font-display text-3xl">Đơn #{order.id}</h1>
        <p className="mt-3 text-ink/70">
          Trạng thái <b>{order.status}</b>. Tổng {formatPrice(order.total)}.
        </p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-ink px-5 py-2 text-white">
          Về cửa hàng
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-8">
        <h1 className="font-display text-3xl">Checkout</h1>
        <p className="mt-3">Giỏ hàng trống, chưa thể đặt hàng.</p>
        <Link to="/" className="mt-4 inline-block text-blush underline">
          Chọn sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl bg-white p-6">
        <h1 className="font-display text-3xl">Thông tin giao hàng</h1>
        <input
          name="customer_name"
          required
          placeholder="Họ tên"
          value={form.customer_name}
          onChange={updateField}
          className="w-full rounded-2xl border border-sand px-4 py-3"
        />
        <input
          name="phone"
          required
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={updateField}
          className="w-full rounded-2xl border border-sand px-4 py-3"
        />
        <textarea
          name="address"
          required
          rows="4"
          placeholder="Địa chỉ nhận hàng"
          value={form.address}
          onChange={updateField}
          className="w-full rounded-2xl border border-sand px-4 py-3"
        />
        {error && <p className="text-sm text-blush">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-ink py-3 text-white disabled:opacity-60"
        >
          {submitting ? "Đang gửi..." : "Xác nhận đặt hàng"}
        </button>
      </form>
      <aside className="rounded-3xl bg-sand/50 p-6">
        <h2 className="font-display text-2xl">Đơn của bạn</h2>
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.line_total || item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xl font-medium">Tổng {formatPrice(total)}</p>
      </aside>
    </div>
  );
}
