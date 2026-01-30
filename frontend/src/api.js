// Debug: Check if env is loading
console.log("🔥 Loaded raw API URL:", import.meta.env.VITE_API_BASE);

// Ensure base URL is valid
let API_BASE = import.meta.env.VITE_API_BASE?.trim();

// If missing https:// then add it
if (API_BASE && !API_BASE.startsWith("http")) {
  API_BASE = "https://" + API_BASE;
}

console.log("✅ Final API Base:", API_BASE);

// 🔐 LOGIN API
export async function loginUser(username, password) {
  const url = `${API_BASE}/login`;
  console.log("➡️ Calling:", url);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Login failed");
  }

  return res.json();
}

// 🤖 CHATBOT / ASK API
export async function askAI(payload) {
  const url = `${API_BASE}/ask`;
  console.log("➡️ Calling:", url);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("AI request failed");
  }

  return res.json();
}
