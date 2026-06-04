const HEALTH_URL = process.env.RENDER_EXTERNAL_URL
  ? `${process.env.RENDER_EXTERNAL_URL}/health`
  : 'https://zenvoice-api.onrender.com/health';

const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

// Only ping during IST working hours (2:30–16:30 UTC = 8am–10pm IST)
function isWorkingHours() {
  const hour = new Date().getUTCHours();
  return hour >= 2 && hour <= 16;
}

async function ping() {
  if (!isWorkingHours()) return;
  try {
    const res = await fetch(HEALTH_URL);
    const data = await res.json();
    console.log(`[keep-alive] ${new Date().toISOString()} — status: ${data.status}`);
  } catch (err) {
    console.error(`[keep-alive] ping failed: ${err.message}`);
  }
}

setInterval(ping, PING_INTERVAL_MS);
console.log(`[keep-alive] Started — pinging ${HEALTH_URL} every 14 min during IST working hours`);