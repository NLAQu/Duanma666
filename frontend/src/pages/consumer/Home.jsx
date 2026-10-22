import { useEffect, useState } from "react";
import ProductCard from "../../components/product/ProductCard";
import { api } from "../../services/api";

const FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "fashion", label: "Thời trang" },
  { id: "cosmetics", label: "Mỹ phẩm" },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .products(category === "all" ? undefined : category)
      .then((res) => setProducts(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div>
      <section className="mb-10 overflow-hidden rounded-[2rem] bg-ink px-8 py-14 text-cream">
        <p className="text-sm uppercase tracking-[0.3em] text-sand">Lumina Atelier</p>
        <h1 className="mt-3 max-w-xl font-display text-4xl leading-tight sm:text-5xl">
          Thời trang và mỹ phẩm cho nhịp sống tối giản.
        </h1>
        <p className="mt-4 max-w-lg text-sand">
          Chọn sản phẩm, thêm vào giỏ và đặt hàng trong vài bước.
        </p>
      </section>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setCategory(filter.id)}
            className={`rounded-full px-4 py-2 text-sm ${
              category === filter.id ? "bg-ink text-white" : "bg-white ring-1 ring-sand"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-ink/60">Đang tải sản phẩm...</p>}
      {error && (
        <p className="rounded-2xl bg-blush/10 p-4 text-blush">
          {error}. Kiểm tra backend và biến `VITE_API_URL`.
        </p>
      )}
      {!loading && !error && products.length === 0 && (
        <p className="text-ink/60">Chưa có sản phẩm nào.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
