import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../store/AuthContext";
import { useCart } from "../../store/CartContext";
import { categoryLabel, formatPrice } from "../../utils/format";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { add } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .product(id)
      .then((res) => {
        setProduct(res.data);
        const firstSize = (res.data.size || "").split(",")[0]?.trim();
        setSize(firstSize || "");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-blush">{error}</p>;
  if (!product) return null;

  const sizes = (product.size || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  async function handleAdd() {
    setMessage("");
    setError("");
    if (!user) {
      navigate("/login", { state: { from: `/products/${id}` } });
      return;
    }
    try {
      await add(product.id, quantity);
      setMessage("Đã thêm vào giỏ hàng.");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="overflow-hidden rounded-[2rem] bg-white">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full min-h-[420px] w-full object-cover"
          onError={(event) => {
            event.currentTarget.src =
              "https://images.unsplash.com/photo-1522335783277-87e750815775?w=800";
          }}
        />
      </div>
      <div>
        <p className="text-sm uppercase tracking-wide text-blush">
          {categoryLabel(product.category)}
        </p>
        <h1 className="mt-2 font-display text-4xl">{product.name}</h1>
        <p className="mt-3 text-2xl font-medium">{formatPrice(product.price)}</p>
        <p className="mt-4 leading-relaxed text-ink/70">
          {product.description || "Sản phẩm thuộc bộ sưu tập Lumina."}
        </p>
        <p className="mt-2 text-sm text-ink/50">Còn {product.stock} sản phẩm</p>

        {sizes.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium">Kích thước / dung tích</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSize(item)}
                  className={`rounded-full px-4 py-2 text-sm ${
                    size === item ? "bg-ink text-white" : "bg-white ring-1 ring-sand"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}
            className="w-20 rounded-full border border-sand bg-white px-4 py-2"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-full bg-ink px-6 py-3 text-white hover:bg-blush"
          >
            Thêm vào giỏ
          </button>
        </div>
        {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}
        {error && <p className="mt-3 text-sm text-blush">{error}</p>}
        <Link to="/cart" className="mt-6 inline-block text-sm underline">
          Xem giỏ hàng
        </Link>
      </div>
    </div>
  );
}
