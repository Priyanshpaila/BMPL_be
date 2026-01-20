function errorHandler(err, req, res, next) {
  console.error("❌ Error:", err);

  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({ ok: false, error: message });
}

module.exports = { errorHandler };
