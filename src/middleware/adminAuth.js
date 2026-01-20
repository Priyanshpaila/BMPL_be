function adminAuth(req, res, next) {
  const key = req.header("x-api-key");
  const expected = process.env.ADMIN_API_KEY;

  if (!expected) {
    return res.status(500).json({ ok: false, error: "ADMIN_API_KEY is not configured" });
  }

  if (!key || key !== expected) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  next();
}

module.exports = { adminAuth };
