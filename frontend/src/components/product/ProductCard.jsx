import { Link } from "react-router-dom";
import { categoryLabel, formatPrice } from "../../utils/format";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-sand transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="aspect-[4/5] overflow-hidden bg-sand">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.src =
              "https://images.unsplash.com/photo-1522335783277-87e750815775?w=800";
          }}
        />
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs uppercase tracking-wide text-blush">
          {categoryLabel(product.category)}
        </p>
        <h3 className="font-display text-lg">{product.name}</h3>
        <p className="font-medium">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
