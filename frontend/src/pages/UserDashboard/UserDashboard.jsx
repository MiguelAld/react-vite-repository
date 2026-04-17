import { useEffect, useState } from "react";
import SidebarUser from "../../components/layout/SidebarUser";
import {
  getMeetings,
  getZones,
  createIncident,
  getUserIncidents,
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "../../assets/dashboard.css";

export default function UserDashboard() {
  const [activeSection, setActiveSection] = useState("inicio");
  const [meetings, setMeetings] = useState([]);
  const [zones, setZones] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loadingIncidents, setLoadingIncidents] = useState(false);
  const [incidentError, setIncidentError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [expandedIncidentId, setExpandedIncidentId] = useState(null);

  const [formData, setFormData] = useState({
    zone_id: "",
    title: "",
    description: "",
  });

  const { user } = useAuth();

  useEffect(() => {
    getMeetings().then(setMeetings).catch(console.error);
    getZones().then(setZones).catch(console.error);
  }, []);

  useEffect(() => {
    if (activeSection === "incidencias" && user?.id) {
      setLoadingIncidents(true);
      setIncidentError("");

      getUserIncidents(user.id)
        .then(setIncidents)
        .catch((err) => {
          console.error(err);
          setIncidentError(err.message || "Error cargando incidencias");
        })
        .finally(() => {
          setLoadingIncidents(false);
        });
    }
  }, [activeSection, user]);

  const userName = user?.name || "USER";
  const userDni = user?.dni || "Sin DNI";
  const userHouse = user?.vivienda || "Sin vivienda";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateIncident = async (e) => {
    e.preventDefault();

    try {
      const newIncident = await createIncident({
        zone_id: Number(formData.zone_id),
        created_by: user.id,
        title: formData.title,
        description: formData.description,
      });

      const zoneObj = zones.find((z) => z.id === Number(formData.zone_id));

      setIncidents((prev) => [
        {
          ...newIncident,
          zone: zoneObj || null,
        },
        ...prev,
      ]);

      setFormData({
        zone_id: "",
        title: "",
        description: "",
      });

      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al crear incidencia");
    }
  };

  return (
    <div className="user-sketch-shell">
      <SidebarUser
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        userName={userName}
        userDni={userDni}
        userHouse={userHouse}
      />

      <main className="user-sketch-main">
        {activeSection === "inicio" && (
          <section className="user-sketch-center">
            <h1 className="user-sketch-welcome">
              Bienvenido, <span>{userName}</span>
            </h1>
          </section>
        )}

        {activeSection === "documentos" && (
          <section className="dashboard-panel">
            <h1 className="dashboard-title">Documentos</h1>
            <p className="dashboard-subtitle">
              Aquí verás los documentos publicados por la administración.
            </p>

            <div className="dashboard-list">
              <div className="dashboard-list-item">
                <h5>Normativa piscina.pdf</h5>
                <p>Publicado por administración</p>
              </div>
              <div className="dashboard-list-item">
                <h5>Acta reunión marzo.pdf</h5>
                <p>Publicado por administración</p>
              </div>
            </div>
          </section>
        )}

        {activeSection === "reuniones" && (
          <section className="dashboard-panel">
            <h1 className="dashboard-title">Reuniones</h1>
            <p className="dashboard-subtitle">
              Aquí verás las reuniones creadas por el administrador.
            </p>

            {meetings.length === 0 ? (
              <p className="dashboard-empty">No hay reuniones programadas.</p>
            ) : (
              <div className="dashboard-list">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="dashboard-list-item">
                    <h5>{meeting.title}</h5>
                    <p>
                      <strong>Fecha:</strong>{" "}
                      {new Date(meeting.meeting_date).toLocaleString()}
                    </p>
                    <p>{meeting.description || "Sin descripción"}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeSection === "incidencias" && (
          <section className="dashboard-panel">
            <div className="dashboard-header-row">
              <div>
                <h1 className="dashboard-title">Mis incidencias</h1>
                <p className="dashboard-subtitle">
                  Aquí verás tus incidencias creadas y su estado.
                </p>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => setShowForm((prev) => !prev)}
              >
                {showForm ? "Cerrar formulario" : "Nueva incidencia"}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleCreateIncident} className="dashboard-block mb-4">
                <div className="mb-3">
                  <label className="form-label">Zona</label>
                  <select
                    className="form-select"
                    name="zone_id"
                    value={formData.zone_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona una zona</option>
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Título</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-success">
                  Enviar incidencia
                </button>
              </form>
            )}

            {loadingIncidents && <p>Cargando incidencias...</p>}
            {incidentError && <div className="alert alert-danger">{incidentError}</div>}

            {!loadingIncidents && !incidentError && (
              <>
                {incidents.length === 0 ? (
                  <p className="dashboard-empty">No has creado incidencias todavía.</p>
                ) : (
                  <div className="incidents-grid user-incidents-grid">
                    {incidents.map((incident) => (
                      <article
                        key={incident.id}
                        className={`incident-card ${
                          expandedIncidentId === incident.id ? "expanded" : ""
                        }`}
                      >
                        <div className="incident-card__top">
                          <h4>{incident.title}</h4>

                          <span
                            className={`badge ${
                              incident.status === "PENDIENTE"
                                ? "text-bg-warning"
                                : incident.status === "EN_PROCESO"
                                ? "text-bg-primary"
                                : "text-bg-success"
                            }`}
                          >
                            {incident.status === "EN_PROCESO"
                              ? "EN PROCESO"
                              : incident.status}
                          </span>
                        </div>

                        <div className="incident-card__meta">
                          <p>
                            <strong>Zona:</strong> {incident.zone?.name || "—"}
                          </p>
                        </div>

                        <button
                          className="btn btn-sm btn-outline-primary incident-card__toggle"
                          onClick={() =>
                            setExpandedIncidentId(
                              expandedIncidentId === incident.id ? null : incident.id
                            )
                          }
                        >
                          {expandedIncidentId === incident.id ? "Ver menos" : "Ver más"}
                        </button>

                        {expandedIncidentId === incident.id && (
                          <>
                            <div className="incident-card__description">
                              <strong>Descripción:</strong>
                              <p>{incident.description}</p>
                            </div>

                            <p className="incident-card__date">
                              <strong>Fecha:</strong>{" "}
                              {incident.created_at
                                ? new Date(incident.created_at).toLocaleDateString()
                                : "—"}
                            </p>
                          </>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}