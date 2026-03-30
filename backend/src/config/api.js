export async function getMeetings() {

  const res = await fetch(`${API_URL}/meetings`);

  if (!res.ok) throw new Error("Error cargando reuniones");

  return res.json();
}


export async function createMeeting(data) {

  const res = await fetch(`${API_URL}/meetings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Error creando reunión");

  return res.json();
}