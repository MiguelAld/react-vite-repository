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

              // sección ZONES
export async function getZones() {
  const res = await fetch(`${API_URL}/zones`);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error cargando zonas");
  }

  return data;
}

              // sección INCIDENTS - USUARIOS
export async function createIncident(incidentData) {
  const res = await fetch(`${API_URL}/incidents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(incidentData),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error creando incidencia");
  }

  return data;
}

              // sección INCIDENTS - USUARIOS
export async function getUserIncidents(userId) {
  const res = await fetch(`${API_URL}/incidents/user/${userId}`);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error cargando incidencias del usuario");
  }

  return data;
}

export async function createUser(userData) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error creando usuario");
  }

  return data;
}

export async function updateUserActive(id, is_active) {
  const res = await fetch(`${API_URL}/users/${id}/active`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_active }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error actualizando usuario");
  }

  return data;
}

export async function updateUser(id, userData) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error editando usuario");
  }

  return data;
}

export async function deleteIncident(id) {
  const res = await fetch(`${API_URL}/incidents/${id}`, {
    method: "DELETE",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error eliminando incidencia");
  }

  return data;
}

export async function getCommunityIncidents() {
  const res = await fetch(`${API_URL}/incidents`);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error cargando incidencias de la comunidad");
  }

  return data;
}

export async function getAllZones() {
  const res = await fetch(`${API_URL}/zones/all`);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error cargando todas las zonas");
  }

  return data;
}

export async function createZone(zoneData) {
  const res = await fetch(`${API_URL}/zones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(zoneData),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error creando zona");
  }

  return data;
}

export async function updateZoneActive(id, is_active) {
  const res = await fetch(`${API_URL}/zones/${id}/active`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_active }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error actualizando zona");
  }

  return data;
}

export async function updateZoneOrder(id, direction) {
  const res = await fetch(`${API_URL}/zones/${id}/order`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ direction }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error actualizando orden");
  }

  return data;
}

export async function getBuildings() {
  const res = await fetch(`${API_URL}/buildings`);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error cargando bloques");
  }

  return data;
}

export async function getAllBuildings() {
  const res = await fetch(`${API_URL}/buildings/all`);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error cargando bloques");
  }

  return data;
}

export async function createBuilding(buildingData) {
  const res = await fetch(`${API_URL}/buildings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildingData),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error creando bloque");
  }

  return data;
}

export async function updateBuildingActive(id, is_active) {
  const res = await fetch(`${API_URL}/buildings/${id}/active`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_active }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error actualizando bloque");
  }

  return data;
}