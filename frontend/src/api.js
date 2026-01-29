// Debug: Check if env is loading
console.log("🔥 Loaded API URL from .env:", import.meta.env.VITE_API_BASE);

const API_BASE = import.meta.env.VITE_API_BASE;

// 🔐 LOGIN API
export async function loginUser(username, password) {
  const res = await fetch(`${API_BASE}/login`, {
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
  const res = await fetch(`${API_BASE}/ask`, {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("AI request failed");
  }

  return res.json();
}
