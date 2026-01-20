function validateCreateQuote(body) {
  const errors = {};

  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const product = (body.product || "").trim();
  const quantity = (body.quantity || "").trim();
  const location = (body.location || "").trim();
  const phone = (body.phone || "").trim();
  const notes = (body.notes || "").trim();
  const consent = typeof body.consent === "boolean" ? body.consent : true;

  if (!name) errors.name = "Name is required";

  if (!email) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)) errors.email = "Please enter a valid email address";

  if (!product) errors.product = "Product is required";
  if (!quantity) errors.quantity = "Quantity is required";
  if (!location) errors.location = "Location is required";

  if (phone) {
    const onlyDigits = phone.replace(/\D/g, "");
    if (onlyDigits.length < 10) errors.phone = "Please enter a valid phone number";
  }

  if (consent !== true) errors.consent = "Consent is required to proceed";

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    value: { name, email, phone, product, quantity, location, notes, consent },
  };
}

module.exports = { validateCreateQuote };
