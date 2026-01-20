/**
 * Normalize phone number for WhatsApp Cloud API.
 * Cloud API expects "to" as international format digits (no +), e.g. "919812345678".
 */
function toWhatsAppTo(phoneRaw) {
  if (!phoneRaw) return null;

  const s = String(phoneRaw).trim();
  const onlyDigits = s.replace(/\D/g, "");

  if (onlyDigits.length < 10) return null;
  return onlyDigits;
}

function toDisplayE164(phoneRaw) {
  if (!phoneRaw) return "";
  const onlyDigits = String(phoneRaw).replace(/\D/g, "");
  if (!onlyDigits) return "";
  return `+${onlyDigits}`;
}

module.exports = { toWhatsAppTo, toDisplayE164 };
