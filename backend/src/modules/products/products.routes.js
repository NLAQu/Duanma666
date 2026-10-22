const express = require("express");
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("./products.controller");
const { authenticate, requireRole } = require("../../middleware/auth");

const router = express.Router();

router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", authenticate, requireRole("admin", "seller"), createProduct);
router.put("/:id", authenticate, requireRole("admin", "seller"), updateProduct);
router.delete("/:id", authenticate, requireRole("admin", "seller"), deleteProduct);

module.exports = router;
