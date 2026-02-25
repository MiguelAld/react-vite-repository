// src/pages/CreateIncident.jsx
import { useEffect, useState } from "react";
import "./CreateIncident.css";

export default function CreateIncident() {
  const [open, setOpen] = useState(false);

  const [zones, setZones] = useState([]);
  const [zoneId, setZoneId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/zones")
      .then((r) => r.json())
      .then(setZones)
      .catch((e) => {
        console.error(e);
        setError("No se pudieron cargar las zonas.");
      });
  }, []);

  const resetForm = () => {
    setZoneId("");
    setTitle("");
    setDescription("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    // DEMO: vecino fijo. Luego esto vendrá del login (token).
    const created_by = 1;

    try {
      const res = await fetch("http://localhost:4000/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zone_id: Number(zoneId),
          title: title.trim(),
          description: description.trim(),
          created_by,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "Error al enviar incidencia.");
        return;
      }

      setMsg("✅ Incidencia enviada correctamente");
      resetForm();
      setOpen(false);
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="ci-page">
      <header className="ci-header">
        <div>
          <h1 className="ci-title">Incidencias</h1>
          <p className="ci-subtitle">
            Reporta una incidencia para que el administrador la gestione.
          </p>
        </div>

        <button className="ci-btn" onClick={() => setOpen((v) => !v)}>
          {open ? "Cerrar" : "+ Nueva incidencia"}
        </button>
      </header>

      {(msg || error) && (
        <div className={`ci-alert ${error ? "is-error" : "is-ok"}`}>
          {error || msg}
        </div>
      )}

      {!open && (
        <div className="ci-empty">
          <div className="ci-empty-card">
            <h2>¿Has detectado una incidencia?</h2>
            <p>
              Pulsa <strong>“Nueva incidencia”</strong> para abrir el formulario
              y rellenar zona, título y descripción.
            </p>
            <button
              className="ci-btn ci-btn-primary"
              onClick={() => setOpen(true)}
            >
              + Nueva incidencia
            </button>
          </div>
        </div>
      )}

      {open && (
        <section className="ci-card">
          <h2 className="ci-card-title">Reportar incidencia</h2>

          <form onSubmit={submit} className="ci-form">
            <div className="ci-field">
              <label className="ci-label" htmlFor="zone">
                Zona
              </label>
              <select
                id="zone"
                className="ci-input"
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                required
              >
                <option value="">Selecciona una zona</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
              <p className="ci-help">
                Si falta alguna zona, el administrador podrá añadirla.
              </p>
            </div>

            <div className="ci-field">
              <label className="ci-label" htmlFor="title">
                Título
              </label>
              <input
                id="title"
                className="ci-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Luz fundida en el garaje"
                maxLength={150}
                required
              />
            </div>

            <div className="ci-field">
              <label className="ci-label" htmlFor="desc">
                Descripción
              </label>
              <textarea
                id="desc"
                className="ci-input ci-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe brevemente la incidencia..."
                rows={6}
                required
              />
            </div>

            <div className="ci-actions">
              <button
                type="button"
                className="ci-btn"
                onClick={() => {
                  resetForm();
                  setOpen(false);
                  setMsg("");
                  setError("");
                }}
              >
                Cancelar
              </button>

              <button type="submit" className="ci-btn ci-btn-primary">
                Enviar incidencia
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}