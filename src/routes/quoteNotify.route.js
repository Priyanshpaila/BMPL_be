const express = require("express");
const { validateCreateQuote } = require("../validators/quote.validator");
const { sendCustomerQuoteConfirmationEmail } = require("../services/email.service");

const router = express.Router();

/**
 * POST /api/quote-notify/email
 * - validates payload
 * - sends customer confirmation email
 * - NO DB writes
 */
router.post("/email", async (req, res, next) => {
  try {
    const { ok, errors, value } = validateCreateQuote(req.body);
    if (!ok) return res.status(400).json({ ok: false, errors });

    // send email confirmation to customer
    await sendCustomerQuoteConfirmationEmail({
      name: value.name,
      email: value.email,
      phone: value.phone,
      product: value.product,
      quantity: value.quantity,
      location: value.location,
      notes: value.notes,
      createdAt: new Date(),
      consent: value.consent,
    });

    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
