const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

/* AUTH */
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

/* MEETINGS */
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

  export async function updateMeeting(id, meetingData) {
    const res = await fetch(`${API_URL}/meetings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(meetingData),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.error || "Error actualizando reunión");
    }

    return data;
  }

  export async function deleteMeeting(id, created_by) {
    const res = await fetch(`${API_URL}/meetings/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ created_by }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.error || "Error eliminando reunión");
    }

    return data;
  }

/* USERS */
export async function getUsers() {
  const res = await fetch(`${API_URL}/users`);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error cargando usuarios");
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

/* INCIDENTS */
export async function getIncidents() {
  const res = await fetch(`${API_URL}/incidents`);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error cargando incidencias");
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

export async function getUserIncidents(userId) {
  const res = await fetch(`${API_URL}/incidents/user/${userId}`);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error cargando incidencias del usuario");
  }

  return data;
}

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

/* ZONES */
export async function getZones() {
  const res = await fetch(`${API_URL}/zones`);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error cargando zonas");
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

/* ANNOUNCEMENTS */
export async function getAnnouncements(userId = null) {
  const url = new URL(`${API_URL}/announcements`);
  if (userId) {
    url.searchParams.append("userId", userId);
  }

  const res = await fetch(url);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error cargando anuncios");
  }

  return data;
}

export async function createAnnouncement(announcementData) {
  const payload = {
    title: announcementData.title,
    description: announcementData.description || announcementData.content,
    created_by: announcementData.created_by,
  };

  const res = await fetch(`${API_URL}/announcements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error creando anuncio");
  }

  return data;
}

export async function updateAnnouncement(id, announcementData) {
  const payload = {
    title: announcementData.title,
    description: announcementData.description || announcementData.content,
  };

  const res = await fetch(`${API_URL}/announcements/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error editando anuncio");
  }

  return data;
}

export async function deleteAnnouncement(id, created_by) {
  const res = await fetch(`${API_URL}/announcements/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ created_by }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error eliminando anuncio");
  }

  return data;
}

/* NOVEDAD READS */
export async function getNovededCount(userId) {
  const res = await fetch(`${API_URL}/novedad-reads/count/${userId}`);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error cargando conteo de novedades");
  }

  return data;
}

export async function markNovededAsRead(userId, novedad_type, novedad_id) {
  const res = await fetch(`${API_URL}/novedad-reads/mark-read`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, novedad_type, novedad_id }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error marcando como leído");
  }

  return data;
}

export async function markAllNovededAsRead(userId) {
  const res = await fetch(`${API_URL}/novedad-reads/mark-all-read/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Error marcando como leído");
  }

  return data;
}