const mongoose = require("mongoose");

const QuoteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, default: "", trim: true, maxlength: 40 },
    product: { type: String, required: true, trim: true, maxlength: 200 },
    quantity: { type: String, required: true, trim: true, maxlength: 80 },
    location: { type: String, required: true, trim: true, maxlength: 200 },
    notes: { type: String, default: "", trim: true, maxlength: 4000 },
    consent: { type: Boolean, default: true },

    status: { type: String, enum: ["new", "contacted", "closed"], default: "new", index: true },

    notifySent: { type: Boolean, default: false },
    customerMsgSent: { type: Boolean, default: false },
    lastError: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quote", QuoteSchema);
