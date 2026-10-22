const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../../../config/db");
const env = require("../../../config/env");
const asyncHandler = require("../../utils/asyncHandler");
const HttpError = require("../../utils/httpError");

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    throw new HttpError(400, "name, email and password are required");
  }

  if (String(password).length < 6) {
    throw new HttpError(400, "Password must be at least 6 characters");
  }

  const existing = await query("SELECT id FROM users WHERE email = $1", [
    String(email).toLowerCase().trim(),
  ]);
  if (existing.rows[0]) {
    throw new HttpError(409, "Email already registered");
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  const { rows } = await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'customer')
     RETURNING id, name, email, role`,
    [String(name).trim(), String(email).toLowerCase().trim(), passwordHash]
  );

  const user = rows[0];
  res.status(201).json({
    success: true,
    token: signToken(user),
    user: publicUser(user),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    throw new HttpError(400, "email and password are required");
  }

  const { rows } = await query(
    "SELECT id, name, email, role, password_hash FROM users WHERE email = $1",
    [String(email).toLowerCase().trim()]
  );
  const user = rows[0];
  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const matched = await bcrypt.compare(String(password), user.password_hash);
  if (!matched) {
    throw new HttpError(401, "Invalid email or password");
  }

  res.json({
    success: true,
    token: signToken(user),
    user: publicUser(user),
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: publicUser(req.user) });
});

module.exports = { register, login, me };
