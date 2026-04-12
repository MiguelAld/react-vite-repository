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

  const userName = user?.name || "Vecino";
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
    <div className="dashboard-shell">
      <SidebarUser
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        userName={userName}
        userDni={userDni}
        userHouse={userHouse}
      />

      <div className="dashboard-content">
        <main className="dashboard-main">
          {activeSection === "inicio" && (
            <section className="dashboard-panel">
              <h1 className="dashboard-title">Bienvenido, {userName}</h1>
              <p className="dashboard-subtitle">
                Consulta el estado de tu comunidad, reuniones, incidencias y documentos.
              </p>

              <div className="dashboard-cards">
                <div className="dashboard-card summary-accent-green">
                  <h5>Próxima reunión</h5>
                  <p>
                    {meetings.length > 0
                      ? new Date(meetings[0].meeting_date).toLocaleString()
                      : "No hay reuniones programadas"}
                  </p>
                </div>

                <div className="dashboard-card summary-accent-yellow">
                  <h5>Incidencias abiertas</h5>
                  <p>{incidents.length}</p>
                </div>

                <div className="dashboard-card summary-accent-blue">
                  <h5>Documentos recientes</h5>
                  <p>Pendiente de conectar con datos reales</p>
                </div>
              </div>
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
                <div className="dashboard-table-wrap">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Zona</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incidents.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No has creado incidencias todavía.
                          </td>
                        </tr>
                      ) : (
                        incidents.map((incident) => (
                          <tr key={incident.id}>
                            <td>{incident.title}</td>
                            <td>{incident.zone?.name || "—"}</td>
                            <td>
                              {incident.status === "PENDIENTE" && (
                                <span className="badge text-bg-warning">Pendiente</span>
                              )}
                              {incident.status === "EN_PROCESO" && (
                                <span className="badge text-bg-primary">En proceso</span>
                              )}
                              {incident.status === "RESUELTA" && (
                                <span className="badge text-bg-success">Resuelta</span>
                              )}
                            </td>
                            <td>
                              {incident.created_at
                                ? new Date(incident.created_at).toLocaleDateString()
                                : "—"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
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

          {activeSection === "documentos" && (
            <section className="dashboard-panel">
              <h1 className="dashboard-title">Documentos</h1>
              <p className="dashboard-subtitle">
                Aquí verás los documentos subidos por la administración.
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
        </main>
      </div>
    </div>
  );
}