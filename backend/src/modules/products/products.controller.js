const { query } = require("../../../config/db");
const asyncHandler = require("../../utils/asyncHandler");
const HttpError = require("../../utils/httpError");

const listProducts = asyncHandler(async (req, res) => {
  const { category } = req.query;
  let result;

  if (category) {
    result = await query(
      "SELECT * FROM products WHERE category = $1 ORDER BY id DESC",
      [category]
    );
  } else {
    result = await query("SELECT * FROM products ORDER BY id DESC");
  }

  res.json({ success: true, data: result.rows });
});

const getProduct = asyncHandler(async (req, res) => {
  const { rows } = await query("SELECT * FROM products WHERE id = $1", [
    req.params.id,
  ]);

  if (!rows[0]) {
    throw new HttpError(404, "Product not found");
  }

  res.json({ success: true, data: rows[0] });
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, image_url, category, size, stock } =
    req.body || {};

  if (!name || price === undefined || !category) {
    throw new HttpError(400, "name, price and category are required");
  }

  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice) || numericPrice < 0) {
    throw new HttpError(400, "price must be a valid number");
  }

  const { rows } = await query(
    `INSERT INTO products (name, description, price, image_url, category, size, stock)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      String(name).trim(),
      description || null,
      numericPrice,
      image_url || null,
      String(category).trim(),
      size || null,
      Number(stock) || 0,
    ]
  );

  res.status(201).json({ success: true, data: rows[0] });
});

const updateProduct = asyncHandler(async (req, res) => {
  const existing = await query("SELECT * FROM products WHERE id = $1", [
    req.params.id,
  ]);
  if (!existing.rows[0]) {
    throw new HttpError(404, "Product not found");
  }

  const current = existing.rows[0];
  const {
    name = current.name,
    description = current.description,
    price = current.price,
    image_url = current.image_url,
    category = current.category,
    size = current.size,
    stock = current.stock,
  } = req.body || {};

  const { rows } = await query(
    `UPDATE products
     SET name = $1, description = $2, price = $3, image_url = $4, category = $5, size = $6, stock = $7
     WHERE id = $8
     RETURNING *`,
    [name, description, price, image_url, category, size, stock, req.params.id]
  );

  res.json({ success: true, data: rows[0] });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { rows } = await query(
    "DELETE FROM products WHERE id = $1 RETURNING id",
    [req.params.id]
  );

  if (!rows[0]) {
    throw new HttpError(404, "Product not found");
  }

  res.json({ success: true, message: "Product deleted" });
});

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
