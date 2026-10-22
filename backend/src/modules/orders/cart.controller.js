const { query } = require("../../../config/db");
const asyncHandler = require("../../utils/asyncHandler");
const HttpError = require("../../utils/httpError");

const getCart = asyncHandler(async (req, res) => {
  const { rows } = await query(
    `SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image_url, p.stock,
            (c.quantity * p.price)::numeric(12,2) AS line_total
     FROM cart_items c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = $1
     ORDER BY c.id DESC`,
    [req.user.id]
  );

  const total = rows.reduce((sum, item) => sum + Number(item.line_total), 0);

  res.json({ success: true, data: rows, total });
});

const addToCart = asyncHandler(async (req, res) => {
  const { product_id, quantity } = req.body || {};
  const qty = Number(quantity) || 1;

  if (!product_id || qty < 1) {
    throw new HttpError(400, "product_id and a valid quantity are required");
  }

  const product = await query("SELECT id, stock FROM products WHERE id = $1", [
    product_id,
  ]);
  if (!product.rows[0]) {
    throw new HttpError(404, "Product not found");
  }

  await query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
    [req.user.id, product_id, qty]
  );

  const { rows } = await query(
    `SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image_url
     FROM cart_items c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = $1
     ORDER BY c.id DESC`,
    [req.user.id]
  );

  res.status(201).json({ success: true, data: rows });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const qty = Number(req.body?.quantity);
  if (!qty || qty < 1) {
    throw new HttpError(400, "quantity must be at least 1");
  }

  const { rows } = await query(
    `UPDATE cart_items
     SET quantity = $1
     WHERE id = $2 AND user_id = $3
     RETURNING *`,
    [qty, req.params.itemId, req.user.id]
  );

  if (!rows[0]) {
    throw new HttpError(404, "Cart item not found");
  }

  res.json({ success: true, data: rows[0] });
});

const removeCartItem = asyncHandler(async (req, res) => {
  const { rows } = await query(
    "DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id",
    [req.params.itemId, req.user.id]
  );

  if (!rows[0]) {
    throw new HttpError(404, "Cart item not found");
  }

  res.json({ success: true, message: "Item removed from cart" });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
