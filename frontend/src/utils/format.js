export function formatPrice(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value) || 0);
}

export function categoryLabel(category) {
  if (category === "fashion") return "Thời trang";
  if (category === "cosmetics") return "Mỹ phẩm";
  return category || "Khác";
}
