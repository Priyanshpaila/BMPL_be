const express = require("express");
const Quote = require("../models/Quote");
const { adminAuth } = require("../middleware/adminAuth");
const { validateCreateQuote } = require("../validators/quote.validator");
const { toWhatsAppTo } = require("../utils/phone");
const { sendWhatsAppText } = require("../services/whatsapp.service");
const {
  formatInternalQuoteMessage,
  formatCustomerConfirmationMessage,
} = require("../utils/formatQuoteMessage");
const {
  sendCustomerQuoteConfirmationEmail,
} = require("../services/email.service");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { ok, errors, value } = validateCreateQuote(req.body);
    if (!ok) return res.status(400).json({ ok: false, errors });

    const quote = await Quote.create({
      name: value.name,
      email: value.email, // ✅ NEW
      phone: value.phone,
      product: value.product,
      quantity: value.quantity,
      location: value.location,
      notes: value.notes,
      consent: value.consent,
    });

    let notifySent = false;
    let customerMsgSent = false;
    let customerEmailSent = false; // ✅ NEW
    let lastError = "";

    // 1) Internal WhatsApp notify to BMPL
    try {
      const notifyTo = toWhatsAppTo(process.env.WHATSAPP_NOTIFY_TO);
      if (notifyTo) {
        await sendWhatsAppText(notifyTo, formatInternalQuoteMessage(quote));
        notifySent = true;
      }
    } catch (err) {
      lastError = `Internal WhatsApp notify failed: ${err?.response?.data?.error?.message || err.message || String(err)}`;
    }

    // 2) Optional customer WhatsApp confirmation
    try {
      const enabled =
        String(
          process.env.SEND_CUSTOMER_CONFIRMATION || "false",
        ).toLowerCase() === "true";
      if (enabled && quote.consent) {
        const customerTo = toWhatsAppTo(quote.phone);
        if (customerTo) {
          await sendWhatsAppText(
            customerTo,
            formatCustomerConfirmationMessage(quote),
          );
          customerMsgSent = true;
        }
      }
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message || err.message || String(err);
      lastError = lastError
        ? `${lastError} | Customer WhatsApp notify failed: ${msg}`
        : `Customer WhatsApp notify failed: ${msg}`;
    }

    // 3) ✅ Customer email confirmation (recommended)
    try {
      const enabledEmail =
        String(
          process.env.SEND_CUSTOMER_EMAIL_CONFIRMATION || "true",
        ).toLowerCase() === "true";
      if (enabledEmail && quote.consent && quote.email) {
        await sendCustomerQuoteConfirmationEmail(quote);
        customerEmailSent = true;
      }
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message || err.message || String(err);
      lastError = lastError
        ? `${lastError} | Customer email failed: ${msg}`
        : `Customer email failed: ${msg}`;
    }

    quote.notifySent = notifySent;
    quote.customerMsgSent = customerMsgSent;
    quote.customerEmailSent = customerEmailSent; // ✅ NEW
    quote.lastError = lastError;
    await quote.save();

    return res.status(201).json({
      ok: true,
      quoteId: quote._id,
      notifySent,
      customerMsgSent,
      customerEmailSent,
      lastError,
    });
  } catch (err) {
    next(err);
  }
});

// Admin: list
router.get("/", adminAuth, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(req.query.pageSize || "20", 10)),
    );
    const status = String(req.query.status || "").trim();

    const filter = {};
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      Quote.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Quote.countDocuments(filter),
    ]);

    return res.json({
      ok: true,
      meta: {
        page,
        pageSize,
        total,
        returned: items.length,
        hasNextPage: page * pageSize < total,
      },
      items,
    });
  } catch (err) {
    next(err);
  }
});

// Admin: details
router.get("/:id", adminAuth, async (req, res, next) => {
  try {
    const item = await Quote.findById(req.params.id).lean();
    if (!item)
      return res.status(404).json({ ok: false, error: "Quote not found" });
    return res.json({ ok: true, item });
  } catch (err) {
    next(err);
  }
});

// Admin: update status
router.patch("/:id/status", adminAuth, async (req, res, next) => {
  try {
    const status = String(req.body.status || "").trim();
    if (!["new", "contacted", "closed"].includes(status)) {
      return res.status(400).json({ ok: false, error: "Invalid status" });
    }

    const updated = await Quote.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    ).lean();
    if (!updated)
      return res.status(404).json({ ok: false, error: "Quote not found" });

    return res.json({ ok: true, item: updated });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
