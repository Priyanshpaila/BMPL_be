const nodemailer = require("nodemailer");

function assertSmtpEnv() {
  const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    const err = new Error(`SMTP env missing: ${missing.join(", ")}`);
    err.statusCode = 500;
    throw err;
  }
}

function getTransporter() {
  assertSmtpEnv();

  const port = parseInt(process.env.SMTP_PORT, 10);
  const secure = String(process.env.SMTP_SECURE || "true").toLowerCase() === "true";

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function escapeHtml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildCustomerConfirmationEmailHtml(q) {
  const notes = (q.notes || "").trim();
  const createdAt = q.createdAt ? new Date(q.createdAt) : new Date();

  const rows = [
    ["Name", q.name],
    ["Email", q.email],
    ["Phone", q.phone || "-"],
    ["Product", q.product],
    ["Quantity", q.quantity],
    ["Delivery Location", q.location],
    ...(notes ? [["Notes", notes]] : []),
    ["Submitted", createdAt.toLocaleString("en-IN")],
  ];

  const rowsHtml = rows
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:12px 14px;border:1px solid #E6EAF2;background:#F7F9FC;color:#0B1220;font-weight:600;width:34%;">${escapeHtml(k)}</td>
        <td style="padding:12px 14px;border:1px solid #E6EAF2;background:#FFFFFF;color:#0B1220;">${escapeHtml(v)}</td>
      </tr>`
    )
    .join("");

  return `
  <div style="margin:0;padding:0;background:#F3F6FB;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;">
    <div style="max-width:640px;margin:0 auto;padding:28px 16px;">
      <div style="background:#FFFFFF;border:1px solid #E6EAF2;border-radius:16px;overflow:hidden;">
        <div style="padding:18px 22px;background:linear-gradient(90deg,#2E3690, #00A2FF);">
          <div style="color:#FFFFFF;font-size:18px;font-weight:700;letter-spacing:0.2px;">BMPL — Quote Request Received</div>
          <div style="color:rgba(255,255,255,0.9);font-size:13px;margin-top:4px;">Confirmation of your enquiry</div>
        </div>

        <div style="padding:22px;">
          <div style="color:#0B1220;font-size:16px;font-weight:700;">Hello ${escapeHtml(q.name)},</div>
          <div style="margin-top:10px;color:#334155;font-size:14px;line-height:1.6;">
            We have received your quotation request. Our team will review the details below and respond with pricing and dispatch timelines within <b>24 hours</b>.
          </div>

          <div style="margin-top:18px;border-radius:12px;overflow:hidden;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>

          <div style="margin-top:18px;padding:14px 14px;background:#F7F9FC;border:1px solid #E6EAF2;border-radius:12px;color:#334155;font-size:13px;line-height:1.6;">
            If you need to add sizes/grade/dispatch location, simply reply to this email and we’ll update the quotation.
          </div>

          <div style="margin-top:20px;border-top:1px solid #E6EAF2;padding-top:16px;color:#64748B;font-size:12px;line-height:1.6;">
            <div style="font-weight:700;color:#0B1220;">BMPL Sales Team</div>
            <div>We respect your privacy. This message is sent only for quote-related communication.</div>
          </div>
        </div>
      </div>

      <div style="text-align:center;margin-top:14px;color:#94A3B8;font-size:12px;">
        © ${new Date().getFullYear()} BMPL. All rights reserved.
      </div>
    </div>
  </div>
  `;
}

async function sendCustomerQuoteConfirmationEmail(q) {
  if (!q.email) return;

  const transporter = getTransporter();

  const subject = `BMPL: Quote request received — ${q.product}`;
  const html = buildCustomerConfirmationEmailHtml(q);

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: q.email,
    subject,
    html,
  });
}

module.exports = { sendCustomerQuoteConfirmationEmail };
