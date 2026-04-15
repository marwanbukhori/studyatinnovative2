/**
 * Unified tracking: Meta Pixel (browser) + Meta CAPI (server).
 * Every event carries a UUID `event_id` so Pixel and CAPI deduplicate in Meta.
 */

const CAPI_ENDPOINT = "/api/meta-capi";

export function captureUTM() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const utm = {};
  let hasUTM = false;
  utmKeys.forEach((key) => {
    const val = params.get(key);
    if (val) {
      utm[key] = val;
      hasUTM = true;
    }
  });
  if (hasUTM) {
    utm.timestamp = Date.now();
    localStorage.setItem("utm_data", JSON.stringify(utm));
  }
}

export function getUTM() {
  try {
    const data = localStorage.getItem("utm_data");
    if (!data) return {};
    const utm = JSON.parse(data);
    if (Date.now() - utm.timestamp > 30 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem("utm_data");
      return {};
    }
    return utm;
  } catch {
    return {};
  }
}

/**
 * Append compact UTM footer to a WhatsApp prefilled message so the
 * admissions team can see which ad/campaign produced the lead.
 */
export function appendUTMToMessage(message) {
  const utm = getUTM();
  if (!utm.utm_source) return message;
  const parts = [];
  if (utm.utm_source) parts.push(`src=${utm.utm_source}`);
  if (utm.utm_medium) parts.push(`med=${utm.utm_medium}`);
  if (utm.utm_campaign) parts.push(`cmp=${utm.utm_campaign}`);
  if (utm.utm_content) parts.push(`ct=${utm.utm_content}`);
  return `${message}\n\n---\n[${parts.join(" · ")}]`;
}

function readCookie(name) {
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

function newEventId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "evt_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
}

function sendCAPI(eventName, eventId, customData, userIdentifiers = {}) {
  try {
    const payload = {
      event_name: eventName,
      event_id: eventId,
      event_source_url: window.location.href,
      fbp: readCookie("_fbp"),
      fbc: readCookie("_fbc"),
      custom_data: customData,
      ...userIdentifiers,
    };
    fetch(CAPI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* never break UX for tracking */
  }
}

export function trackEvent(eventName, params = {}, userIdentifiers = {}) {
  if (typeof window === "undefined") return;
  if (window.__IS_PRERENDER__) return;
  const utm = getUTM();
  const { utm_source, utm_medium, utm_campaign, utm_content, utm_term } = utm;
  const enriched = {
    ...params,
    ...(utm_source && { utm_source }),
    ...(utm_medium && { utm_medium }),
    ...(utm_campaign && { utm_campaign }),
    ...(utm_content && { utm_content }),
    ...(utm_term && { utm_term }),
  };
  const eventId = newEventId();

  if (typeof window.fbq === "function") {
    window.fbq("track", eventName, enriched, { eventID: eventId });
  }
  sendCAPI(eventName, eventId, enriched, userIdentifiers);
}

export function trackWhatsAppClick(context = "general") {
  trackEvent("Lead", {
    content_name: "WhatsApp_DBA_ODL",
    channel: "whatsapp",
    context,
  });
}

export function trackQuizStarted() {
  trackEvent("QuizStarted", { content_name: "DPI_Eligibility_Quiz" });
}

export function trackQuizAnswered(step, answer) {
  trackEvent("QuizAnswered", { step, answer });
}

export function trackQuizQualified(qualified) {
  trackEvent("QuizQualified", { qualified });
}

export function trackQuizSubmit({ name, phone, qualified }) {
  // Primary optimization event. value+currency signals to Meta's algorithm
  // to optimize for qualified diploma leads.
  trackEvent(
    "Lead",
    {
      content_name: "DPI_Quiz_Submit",
      content_category: qualified ? "qualified" : "unqualified",
      value: 5000,
      currency: "MYR",
    },
    { phone, external_id: phone } // hashed server-side in api/meta-capi.js
  );
}

export function setupViewContentTimer(delayMs = 30000) {
  if (typeof window === "undefined" || window.__IS_PRERENDER__) return;
  let fired = false;
  const fire = () => {
    if (fired) return;
    fired = true;
    trackEvent("ViewContent", {
      content_name: "DBA_ODL_Landing",
      engagement: "30s_on_page",
    });
  };
  setTimeout(fire, delayMs);
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.visibilityState === "hidden") fire();
    },
    { once: true }
  );
}

if (typeof window !== "undefined") {
  captureUTM();
  window.addEventListener("load", () => setupViewContentTimer(30000), { once: true });
}
