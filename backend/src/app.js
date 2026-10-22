const express = require("express");
const cors = require("cors");
const env = require("../config/env");
const authRoutes = require("./modules/auth/auth.routes");
const productRoutes = require("./modules/products/products.routes");
const orderRoutes = require("./modules/orders/orders.routes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: env.clientUrl === "*" ? true : env.clientUrl,
    credentials: true,
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ success: true, status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api", orderRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
