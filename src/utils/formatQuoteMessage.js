const { toDisplayE164 } = require("./phone");

function formatInternalQuoteMessage(quote) {
  const lines = [
    "📩 *New Quote Request (BMPL)*",
    "",
    `*Name:* ${quote.name}`,
    `*Phone:* ${quote.phone ? toDisplayE164(quote.phone) : "-"}`,
    `*Product:* ${quote.product}`,
    `*Quantity:* ${quote.quantity}`,
    `*Location:* ${quote.location}`,
  ];

  if (quote.notes) lines.push(`*Notes:* ${quote.notes}`);

  lines.push("");
  lines.push(`*Quote ID:* ${quote._id}`);
  lines.push(`*Time:* ${new Date(quote.createdAt).toLocaleString("en-IN")}`);

  return lines.join("\n");
}

function formatCustomerConfirmationMessage(quote) {
  return [
    `Hello ${quote.name},`,
    "",
    `We received your quotation request for *${quote.product}* (Qty: ${quote.quantity}).`,
    `Delivery location: ${quote.location}.`,
    "",
    "BMPL team will respond with pricing & dispatch timelines within 24 hours.",
    "Thank you.",
  ].join("\n");
}

module.exports = { formatInternalQuoteMessage, formatCustomerConfirmationMessage };
