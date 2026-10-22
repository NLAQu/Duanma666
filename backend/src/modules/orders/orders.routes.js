const express = require("express");
const {
  createOrder,
  listMyOrders,
  listAllOrders,
  getOrder,
} = require("./orders.controller");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} = require("./cart.controller");
const { authenticate, requireRole } = require("../../middleware/auth");

const router = express.Router();

router.get("/cart", authenticate, getCart);
router.post("/cart", authenticate, addToCart);
router.patch("/cart/:itemId", authenticate, updateCartItem);
router.delete("/cart/:itemId", authenticate, removeCartItem);

router.post("/orders", authenticate, createOrder);
router.get("/orders", authenticate, listMyOrders);
router.get(
  "/admin/orders",
  authenticate,
  requireRole("admin", "seller"),
  listAllOrders
);
router.get("/orders/:id", authenticate, getOrder);

module.exports = router;
