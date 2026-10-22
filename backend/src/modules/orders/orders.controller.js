const { pool, query } = require("../../../config/db");
const asyncHandler = require("../../utils/asyncHandler");
const HttpError = require("../../utils/httpError");

const createOrder = asyncHandler(async (req, res) => {
  const { customer_name, phone, address, items } = req.body || {};

  if (!customer_name || !phone || !address) {
    throw new HttpError(400, "customer_name, phone and address are required");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let orderItems = Array.isArray(items) ? items : [];
    if (orderItems.length === 0) {
      const cart = await client.query(
        `SELECT c.product_id, c.quantity, p.name, p.price, p.stock
         FROM cart_items c
         JOIN products p ON p.id = c.product_id
         WHERE c.user_id = $1
         FOR UPDATE OF p`,
        [req.user.id]
      );
      orderItems = cart.rows.map((row) => ({
        product_id: row.product_id,
        quantity: row.quantity,
        name: row.name,
        price: row.price,
        stock: row.stock,
      }));
    } else {
      const detailed = [];
      for (const item of orderItems) {
        const product = await client.query(
          "SELECT id, name, price, stock FROM products WHERE id = $1 FOR UPDATE",
          [item.product_id]
        );
        if (!product.rows[0]) {
          throw new HttpError(404, `Product ${item.product_id} not found`);
        }
        detailed.push({
          product_id: product.rows[0].id,
          quantity: Number(item.quantity) || 1,
          name: product.rows[0].name,
          price: product.rows[0].price,
          stock: product.rows[0].stock,
        });
      }
      orderItems = detailed;
    }

    if (orderItems.length === 0) {
      throw new HttpError(400, "Cart is empty");
    }

    let total = 0;
    for (const item of orderItems) {
      if (item.quantity < 1) {
        throw new HttpError(400, "Invalid item quantity");
      }
      if (item.stock < item.quantity) {
        throw new HttpError(400, `Insufficient stock for ${item.name}`);
      }
      total += Number(item.price) * item.quantity;
    }

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, customer_name, phone, address, status, total)
       VALUES ($1, $2, $3, $4, 'Pending', $5)
       RETURNING *`,
      [req.user.id, customer_name.trim(), phone.trim(), address.trim(), total]
    );
    const order = orderResult.rows[0];

    for (const item of orderItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.product_id, item.name, item.price, item.quantity]
      );
      await client.query(
        "UPDATE products SET stock = stock - $1 WHERE id = $2",
        [item.quantity, item.product_id]
      );
    }

    await client.query("DELETE FROM cart_items WHERE user_id = $1", [
      req.user.id,
    ]);
    await client.query("COMMIT");

    const itemsResult = await query(
      "SELECT * FROM order_items WHERE order_id = $1",
      [order.id]
    );

    res.status(201).json({
      success: true,
      data: { ...order, items: itemsResult.rows },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
});

const listMyOrders = asyncHandler(async (req, res) => {
  const { rows } = await query(
    "SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC",
    [req.user.id]
  );
  res.json({ success: true, data: rows });
});

const listAllOrders = asyncHandler(async (req, res) => {
  const { rows } = await query(
    `SELECT o.*, u.email AS user_email
     FROM orders o
     LEFT JOIN users u ON u.id = o.user_id
     ORDER BY o.id DESC`
  );
  res.json({ success: true, data: rows });
});

const getOrder = asyncHandler(async (req, res) => {
  const { rows } = await query("SELECT * FROM orders WHERE id = $1", [
    req.params.id,
  ]);
  const order = rows[0];
  if (!order) {
    throw new HttpError(404, "Order not found");
  }

  if (req.user.role === "customer" && order.user_id !== req.user.id) {
    throw new HttpError(403, "Forbidden");
  }

  const items = await query(
    "SELECT * FROM order_items WHERE order_id = $1",
    [order.id]
  );

  res.json({ success: true, data: { ...order, items: items.rows } });
});

module.exports = { createOrder, listMyOrders, listAllOrders, getOrder };
