const { toDisplayE164 } = require("./phone");

function safe(v) {
  const s = String(v ?? "").trim();
  return s ? s : "-";
}

function formatWhen(d) {
  if (!d) return "-";
  try {
    return new Date(d).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return safe(d);
  }
}

function formatInternalQuoteMessage(quote) {
  const lines = [
    "📩 *NEW QUOTE REQUEST (BMPL)*",
    "━━━━━━━━━━━━━━━━━━━━",
    `*Name:* ${safe(quote.name)}`,
    `*Email:* ${safe(quote.email)}`,
    `*Phone:* ${quote.phone ? safe(toDisplayE164(quote.phone)) : "-"}`,
    "━━━━━━━━━━━━━━━━━━━━",
    `*Product:* ${safe(quote.product)}`,
    `*Quantity:* ${safe(quote.quantity)}`,
    `*Location:* ${safe(quote.location)}`,
  ];

  // Notes block (optional, but still structured)
  const notes = String(quote.notes ?? "").trim();
  lines.push("━━━━━━━━━━━━━━━━━━━━");
  lines.push(`*Notes:* ${notes ? notes : "-"}`);

  lines.push("━━━━━━━━━━━━━━━━━━━━");
  lines.push(`*Consent:* ${quote.consent ? "Yes" : "No"}`);
  lines.push(`*Status:* ${safe(quote.status || "new")}`);
  lines.push(`*Quote ID:* ${safe(quote._id)}`);
  lines.push(`*Time:* ${formatWhen(quote.createdAt)}`);

  return lines.join("\n");
}

function formatCustomerConfirmationMessage(quote) {
  const name = safe(quote.name);

  const lines = [
    `Hello ${name},`,
    "",
    "✅ We received your quote request. Here are the details:",
    "━━━━━━━━━━━━━━━━━━━━",
    `*Product:* ${safe(quote.product)}`,
    `*Quantity:* ${safe(quote.quantity)}`,
    `*Delivery Location:* ${safe(quote.location)}`,
  ];

  // Only include these if present (keeps message clean)
  if (String(quote.email ?? "").trim()) lines.push(`*Email:* ${safe(quote.email)}`);
  if (String(quote.phone ?? "").trim())
    lines.push(`*Phone:* ${safe(toDisplayE164(quote.phone))}`);

  const notes = String(quote.notes ?? "").trim();
  if (notes) lines.push(`*Notes:* ${notes}`);

  lines.push("━━━━━━━━━━━━━━━━━━━━");
  lines.push("BMPL team will respond with pricing & dispatch timelines within 24 hours.");
  lines.push(`*Reference ID:* ${safe(quote._id)}`);
  lines.push("Thank you.");

  return lines.join("\n");
}

module.exports = { formatInternalQuoteMessage, formatCustomerConfirmationMessage };
