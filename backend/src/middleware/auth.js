const jwt = require("jsonwebtoken");
const env = require("../../config/env");
const { query } = require("../../config/db");
const HttpError = require("../utils/httpError");

function getToken(req) {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) {
    return header.slice(7);
  }
  return null;
}

async function authenticate(req, res, next) {
  try {
    const token = getToken(req);
    if (!token) {
      throw new HttpError(401, "Missing access token");
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const { rows } = await query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [payload.id]
    );

    if (!rows[0]) {
      throw new HttpError(401, "User not found");
    }

    req.user = rows[0];
    next();
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(new HttpError(401, "Invalid or expired token"));
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new HttpError(403, "Forbidden"));
    }
    next();
  };
}

module.exports = { authenticate, requireRole };
