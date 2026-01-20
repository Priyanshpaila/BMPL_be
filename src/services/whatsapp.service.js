const axios = require("axios");

function assertWhatsAppEnv() {
  const required = ["WHATSAPP_ACCESS_TOKEN", "WHATSAPP_PHONE_NUMBER_ID", "WHATSAPP_GRAPH_VERSION"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    const err = new Error(`WhatsApp env missing: ${missing.join(", ")}`);
    err.statusCode = 500;
    throw err;
  }
}

async function sendWhatsAppText(toDigits, body) {
  assertWhatsAppEnv();

  const graphVersion = process.env.WHATSAPP_GRAPH_VERSION;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  const url = `https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to: toDigits,
    type: "text",
    text: { preview_url: false, body },
  };

  const res = await axios.post(url, payload, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    timeout: 15000,
  });

  return res.data;
}

module.exports = { sendWhatsAppText };
