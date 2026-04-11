const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function checkDni(dni) {
  const res = await fetch(`${API_URL}/auth/check-dni`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dni }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error comprobando DNI");
  }

  return data;
}

export async function setPassword(dni, password) {
  const res = await fetch(`${API_URL}/auth/set-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dni, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error creando contraseña");
  }

  return data;
}

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

  return data;
}

export async function getMeetings() {
  const res = await fetch(`${API_URL}/meetings`);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error cargando reuniones");
  }

  return data;
}

export async function createMeeting(meetingData) {
  const res = await fetch(`${API_URL}/meetings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meetingData),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error creando reunión");
  }

  return data;
}

export async function getUsers() {
  const res = await fetch(`${API_URL}/users`);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error cargando usuarios");
  }

  return data;
}