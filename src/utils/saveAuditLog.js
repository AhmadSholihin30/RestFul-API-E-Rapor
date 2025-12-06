const db = require('../db');

function safeJson(value) {
  try {
    if (value === null || value === undefined) return null;
    return JSON.stringify(value);
  } catch (err) {
    console.error("safeJson error:", err);
    return null;
  }
}

function safeString(value) {
  if (value === null || value === undefined) return null;
  return String(value).replace(/\u0000/g, '').trim();
}

async function saveAuditLog({
  user_id = null,
  role = null,
  action,
  method = 'POST',
  endpoint = '/login',
  description = '',
  ip_address = null,
  user_agent = null,
  status_code = null,
  before_data = null,
  after_data = null,
}) {

  // 🚀 Description dijadikan JSON otomatis
  const descriptionJson = {
    message: description,
    params: {},
    time: new Date().toISOString(),
  };

  try {
    const q = `
      INSERT INTO audit_log (
        user_id, role, action, method, endpoint,
        ip_address, user_agent, status_code,
        description, before_data, after_data
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING id
    `;

    const params = [
      user_id,
      role,
      safeString(action),
      safeString(method),
      safeString(endpoint),
      safeString(ip_address),
      safeString(user_agent),
      status_code,
      safeJson(descriptionJson),     // 👈 sudah JSON valid!
      safeJson(before_data),         // 👈 JSON valid
      safeJson(after_data)           // 👈 JSON valid
    ];

    const result = await db.query(q, params);

  } catch (err) {
    console.error("saveAuditLog error:", err?.message || err);
  }
}

module.exports = { saveAuditLog };
