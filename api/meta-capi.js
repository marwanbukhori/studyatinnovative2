/**
 * Meta Conversions API (CAPI) — Vercel Function
 *
 * Receives tracking events from the client and forwards them to Meta's
 * Graph API server-side. Uses `event_id` for deduplication with the
 * browser Pixel (same event_id = counted once in Events Manager).
 *
 * Env vars (set in Vercel → Project → Settings → Environment Variables):
 *   META_PIXEL_ID           — numeric pixel/dataset ID
 *   META_CAPI_TOKEN         — long-lived access token (Events Manager → Settings)
 *   META_CAPI_TEST_CODE     — optional, e.g. "TEST12345" for test events
 */

import crypto from "node:crypto";

const GRAPH_API_VERSION = "v21.0";

function sha256(value) {
  if (!value) return undefined;
  return crypto
    .createHash("sha256")
    .update(String(value).trim().toLowerCase())
    .digest("hex");
}

function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length) return xff.split(",")[0].trim();
  if (Array.isArray(xff) && xff.length) return xff[0];
  return req.headers["x-real-ip"] || req.socket?.remoteAddress || undefined;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const pixelId = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  const testCode = process.env.META_CAPI_TEST_CODE;

  if (!pixelId || !token) {
    return res.status(200).json({ skipped: "missing_env" });
  }

  const body = req.body || {};
  const {
    event_name,
    event_id,
    event_source_url,
    fbp,
    fbc,
    external_id,
    email,
    phone,
    custom_data,
  } = body;

  if (!event_name || !event_id) {
    return res.status(400).json({ error: "event_name_and_event_id_required" });
  }

  const userData = {
    client_ip_address: getClientIp(req),
    client_user_agent: req.headers["user-agent"],
  };
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  if (external_id) userData.external_id = sha256(external_id);
  if (email) userData.em = sha256(email);
  if (phone) userData.ph = sha256(phone.replace(/[^\d]/g, ""));

  const payload = {
    data: [
      {
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id,
        event_source_url,
        action_source: "website",
        user_data: userData,
        custom_data: custom_data || {},
      },
    ],
    access_token: token,
  };
  if (testCode) payload.test_event_code = testCode;

  try {
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(502).json({ error: "meta_api_error", detail: data });
    }
    return res.status(200).json({ ok: true, fb: data });
  } catch (err) {
    return res.status(500).json({ error: "capi_failed", message: err.message });
  }
}
