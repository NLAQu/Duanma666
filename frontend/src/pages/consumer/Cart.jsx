import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import { useCart } from "../../store/CartContext";
import { formatPrice } from "../../utils/format";

export default function Cart() {
  const { user } = useAuth();
  const { items, total, loading, update, remove } = useCart();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center">
        <h1 className="font-display text-3xl">Giỏ hàng</h1>
        <p className="mt-3 text-ink/70">Đăng nhập để thêm và quản lý giỏ hàng.</p>
        <Link
          to="/login"
          state={{ from: "/cart" }}
          className="mt-6 inline-block rounded-full bg-ink px-5 py-2 text-white"
        >
          Đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-4xl">Giỏ hàng</h1>
      {loading && <p>Đang tải giỏ hàng...</p>}
      {!loading && items.length === 0 && (
        <div className="rounded-3xl bg-white p-8">
          <p>Giỏ hàng đang trống.</p>
          <Link to="/" className="mt-4 inline-block text-blush underline">
            Tiếp tục mua sắm
          </Link>
        </div>
      )}
      {items.length > 0 && (
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-3xl bg-white p-4 ring-1 ring-sand"
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-24 w-20 rounded-2xl object-cover"
                />
                <div className="flex flex-1 items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-ink/60">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) =>
                        update(item.id, Math.max(1, Number(event.target.value)))
                      }
                      className="w-16 rounded-full border border-sand px-3 py-1"
                    />
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="text-sm text-blush"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-3xl bg-ink p-6 text-cream">
            <p className="text-sm uppercase tracking-wide text-sand">Tạm tính</p>
            <p className="mt-2 font-display text-3xl">{formatPrice(total)}</p>
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="mt-6 w-full rounded-full bg-blush py-3 text-white"
            >
              Đặt hàng
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
