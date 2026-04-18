import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  CalendarDays,
  Wrench,
  Bell,
  UserCircle2,
  ChevronDown,
  X,
} from "lucide-react";
import SidebarUser from "../../components/layout/SidebarUser";
import {
  getMeetings,
  getZones,
  createIncident,
  getCommunityIncidents,
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
  const [showCreateIncidentModal, setShowCreateIncidentModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    zone_id: "",
    custom_zone: "",
    description: "",
  });

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getMeetings().then(setMeetings).catch(console.error);
    getZones().then(setZones).catch(console.error);
  }, []);

  useEffect(() => {
    if (activeSection === "incidencias") {
      setLoadingIncidents(true);
      setIncidentError("");

      getCommunityIncidents()
        .then(setIncidents)
        .catch((err) => {
          console.error(err);
          setIncidentError(err.message || "Error cargando incidencias");
        })
        .finally(() => {
          setLoadingIncidents(false);
        });
    }
  }, [activeSection]);

  const userName = user?.name || "USER";
  const userDni = user?.dni || "Sin DNI";
  const userHouse = user?.vivienda || "Sin vivienda";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "zone_id" && value !== "other" ? { custom_zone: "" } : {}),
    }));
  };

  const handleCreateIncident = async (e) => {
    e.preventDefault();

    try {
      const incidentPayload = {
        zone_id: formData.zone_id === "other" ? null : Number(formData.zone_id),
        custom_zone: formData.zone_id === "other" ? formData.custom_zone.trim() : null,
        created_by: user.id,
        description: formData.description,
      };

      const newIncident = await createIncident(incidentPayload);

      setIncidents((prev) => [newIncident, ...prev]);

      setFormData({
        zone_id: "",
        custom_zone: "",
        description: "",
      });

      setShowCreateIncidentModal(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al crear incidencia");
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderInicio = () => (
    <section className="user-home">
      <div className="user-home__hero">
        <h1 className="user-home__title">
          Bienvenido, <span>{userName}</span>
        </h1>
        <p className="user-home__subtitle">
          Accede rápidamente a las secciones principales de la comunidad.
        </p>
      </div>

      <div className="user-home__identity-card">
        <h3>Mis datos</h3>
        <p><strong>Nombre:</strong> {userName}</p>
        <p><strong>DNI:</strong> {userDni}</p>
        <p><strong>Vivienda:</strong> {userHouse}</p>
      </div>

      <div className="user-home__grid">
        <button
          className="user-home-card"
          onClick={() => setActiveSection("documentos")}
        >
          <div className="user-home-card__icon">
            <FileText size={28} />
          </div>
          <div>
            <h3>Documentos</h3>
            <p>Consulta normativa, actas y archivos importantes.</p>
          </div>
        </button>

        <button
          className="user-home-card"
          onClick={() => setActiveSection("reuniones")}
        >
          <div className="user-home-card__icon">
            <CalendarDays size={28} />
          </div>
          <div>
            <h3>Reuniones</h3>
            <p>Revisa convocatorias, fechas y detalles publicados.</p>
          </div>
        </button>

        <button
          className="user-home-card"
          onClick={() => setActiveSection("incidencias")}
        >
          <div className="user-home-card__icon">
            <Wrench size={28} />
          </div>
          <div>
            <h3>Incidencias</h3>
            <p>Crea avisos y consulta el estado de la comunidad.</p>
          </div>
        </button>

        <button
          className="user-home-card"
          onClick={() => setActiveSection("novedades")}
        >
          <div className="user-home-card__icon">
            <Bell size={28} />
          </div>
          <div>
            <h3>Novedades</h3>
            <p>Mantente al día con avisos y noticias de la comunidad.</p>
          </div>
        </button>
      </div>
    </section>
  );

  const renderIncidencias = () => (
    <section className="dashboard-panel">
      <div className="dashboard-header-row">
        <div>
          <h1 className="dashboard-title">Incidencias de la comunidad</h1>
          <p className="dashboard-subtitle">
            Aquí puedes crear una incidencia y consultar las registradas por toda la comunidad.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowCreateIncidentModal(true)}
        >
          Nueva incidencia
        </button>
      </div>

      {loadingIncidents && <p>Cargando incidencias...</p>}
      {incidentError && <div className="alert alert-danger">{incidentError}</div>}

      {!loadingIncidents && !incidentError && (
        <>
          {incidents.length === 0 ? (
            <p className="dashboard-empty">No hay incidencias registradas todavía.</p>
          ) : (
            <div className="incidents-grid user-incidents-grid">
              {incidents.map((incident) => {
                const isMine = user?.id && incident.creator?.id === user.id;

                return (
                  <article key={incident.id} className="incident-card">
                    <div className="incident-card__top">
                      <h4>{getIncidentZoneLabel(incident)}</h4>

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
                        <strong>Creada por:</strong> {incident.creator?.name || "—"}
                      </p>
                      <p>
                        <strong>Fecha y hora:</strong> {formatDateTime(incident.created_at)}
                      </p>
                    </div>

                    <div className="incident-card__description">
                      <p>{incident.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      {showCreateIncidentModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card incident-create-modal">
            <div className="dashboard-header-row">
              <div>
                <h2 className="dashboard-title" style={{ fontSize: "1.5rem" }}>
                  Crear nueva incidencia
                </h2>
                <p className="dashboard-subtitle mb-0">
                  Rellena los datos y envía la incidencia a la comunidad.
                </p>
              </div>

              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowCreateIncidentModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateIncident}>
              <div className="row g-3">
                <div className="col-md-12">
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
                    <option value="other">Otro</option>
                  </select>
                </div>

                {formData.zone_id === "other" && (
                  <div className="col-md-12">
                    <label className="form-label">Especifica la zona</label>
                    <input
                      type="text"
                      className="form-control"
                      name="custom_zone"
                      value={formData.custom_zone}
                      onChange={handleChange}
                      placeholder="Ej: Pasillo bloque B"
                      required
                    />
                  </div>
                )}

                <div className="col-md-12">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="6"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mt-4 d-flex gap-2 justify-content-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowCreateIncidentModal(false)}
                >
                  Cerrar
                </button>
                <button type="submit" className="btn btn-success">
                  Enviar incidencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedIncident && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card incident-detail-modal">
            <div className="dashboard-header-row">
              <div>
                <h2 className="dashboard-title" style={{ fontSize: "1.5rem" }}>
                  Detalle de incidencia
                </h2>
                <p className="dashboard-subtitle mb-0">
                  Información completa de la incidencia seleccionada.
                </p>
              </div>

              <button
                className="btn btn-outline-secondary"
                onClick={() => setSelectedIncident(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="incident-detail-grid">
              <div className="incident-detail-block">
                <label>Zona</label>
                <p>{getIncidentZoneLabel(selectedIncident)}</p>
              </div>

              <div className="incident-detail-block">
                <label>Estado</label>
                <p>
                  <span
                    className={`badge ${
                      selectedIncident.status === "PENDIENTE"
                        ? "text-bg-warning"
                        : selectedIncident.status === "EN_PROCESO"
                        ? "text-bg-primary"
                        : "text-bg-success"
                    }`}
                  >
                    {selectedIncident.status === "EN_PROCESO"
                      ? "EN PROCESO"
                      : selectedIncident.status}
                  </span>
                </p>
              </div>

              <div className="incident-detail-block">
                <label>Creado por</label>
                <p>{selectedIncident.creator?.name || "—"}</p>
              </div>

              <div className="incident-detail-block">
                <label>Fecha</label>
                <p>
                  {selectedIncident.created_at
                    ? new Date(selectedIncident.created_at).toLocaleDateString()
                    : "—"}
                </p>
              </div>

              <div className="incident-detail-block">
                <label>Hora</label>
                <p>
                  {selectedIncident.created_at
                    ? new Date(selectedIncident.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </p>
              </div>

              <div className="incident-detail-block incident-detail-block--full">
                <label>Descripción</label>
                <p>{selectedIncident.description}</p>
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setSelectedIncident(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );

  const renderReuniones = () => (
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
  );

  const renderDocumentos = () => (
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
  );

  const renderNovedades = () => (
    <section className="dashboard-panel">
      <h1 className="dashboard-title">Novedades</h1>
      <p className="dashboard-subtitle">
        Aquí aparecerán avisos, noticias y comunicaciones importantes.
      </p>

      <div className="dashboard-list">
        <div className="dashboard-list-item">
          <h5>Aviso de mantenimiento</h5>
          <p>Se informará próximamente sobre actuaciones en zonas comunes.</p>
        </div>
        <div className="dashboard-list-item">
          <h5>Comunicado general</h5>
          <p>La administración publicará aquí los avisos recientes.</p>
        </div>
      </div>
    </section>
  );

  return (
    <div className="user-layout-shell">
      <SidebarUser
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
      />

      <div className="user-layout-content">
        <header className="user-topbar">
          <div className="user-topbar__spacer" />

          <div className="user-profile-menu">
            <button
              className="user-profile-menu__trigger"
              onClick={() => setProfileMenuOpen((prev) => !prev)}
            >
              <div className="user-profile-menu__avatar">
                <UserCircle2 size={24} />
              </div>

              <div className="user-profile-menu__text">
                <strong>{userName}</strong>
                <span>{userHouse}</span>
              </div>

              <ChevronDown size={18} />
            </button>

            {profileMenuOpen && (
              <div className="user-profile-menu__dropdown">
                <div className="user-profile-menu__info">
                  <p><strong>Nombre:</strong> {userName}</p>
                  <p><strong>DNI:</strong> {userDni}</p>
                  <p><strong>Vivienda:</strong> {userHouse}</p>
                </div>

                <button
                  className="user-profile-menu__item"
                  onClick={() => {
                    setActiveSection("inicio");
                    setProfileMenuOpen(false);
                  }}
                >
                  Ver inicio
                </button>

                <button
                  className="user-profile-menu__item user-profile-menu__item--danger"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="user-layout-main">
          {activeSection === "inicio" && renderInicio()}
          {activeSection === "documentos" && renderDocumentos()}
          {activeSection === "reuniones" && renderReuniones()}
          {activeSection === "incidencias" && renderIncidencias()}
          {activeSection === "novedades" && renderNovedades()}
        </main>
      </div>
    </div>
  );
}