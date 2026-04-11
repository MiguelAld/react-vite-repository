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

              //sección MEETINGS
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

              //sección USERS
export async function getUsers() {
  const res = await fetch(`${API_URL}/users`);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error cargando usuarios");
  }

  return data;
}

              //sección INCIDENTS
export async function getIncidents() {
  const res = await fetch(`${API_URL}/incidents`);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error cargando incidencias");
  }

  return data;
}


export async function updateIncidentStatus(id, status) {
  const res = await fetch(`${API_URL}/incidents/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error actualizando incidencia");
  }

  return data;
}