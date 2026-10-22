const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { query } = require("../../config/db");

async function initDb() {
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  const statements = schema
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await query(statement);
  }

  const passwordHash = await bcrypt.hash("123456", 10);

  await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO NOTHING`,
    ["Admin", "admin@gmail.com", passwordHash, "admin"]
  );

  await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO NOTHING`,
    ["Khach Hang", "user@gmail.com", passwordHash, "customer"]
  );

  const { rows } = await query("SELECT COUNT(*)::int AS count FROM products");
  if (rows[0].count === 0) {
    await query(
      `INSERT INTO products (name, description, price, image_url, category, size, stock)
       VALUES
         ($1, $2, $3, $4, $5, $6, $7),
         ($8, $9, $10, $11, $12, $13, $14),
         ($15, $16, $17, $18, $19, $20, $21),
         ($22, $23, $24, $25, $26, $27, $28)`,
      [
        "Ao thun cotton",
        "Ao thun cotton thoang mat, phu hop mac hang ngay.",
        199000,
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        "fashion",
        "S,M,L,XL",
        50,
        "Quan jean slim",
        "Quan jean form slim, chat denim mem.",
        399000,
        "https://images.unsplash.com/photo-1542272604-787c59506cb2",
        "fashion",
        "28,29,30,31,32",
        40,
        "Serum Vitamin C",
        "Serum lam sang da, ho tro giam tham.",
        259000,
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be",
        "cosmetics",
        "30ml",
        80,
        "Kem duong am",
        "Kem duong am nhe, phu hop da kho va da hon hop.",
        189000,
        "https://images.unsplash.com/photo-1556228720-195a672e8a03",
        "cosmetics",
        "50ml",
        70,
      ]
    );
  }
}

module.exports = { initDb };
