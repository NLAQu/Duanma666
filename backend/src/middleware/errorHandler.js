function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message =
    status === 500 ? "Internal server error" : err.message || "Request failed";

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({
    success: false,
    message,
  });
}

module.exports = { notFound, errorHandler };
