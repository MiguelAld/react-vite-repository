const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function apiLogin(dni, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dni, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error de login");
  }

  return data; // { token, user }
}