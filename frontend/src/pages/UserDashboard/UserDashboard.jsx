import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Wrench,
  Bell,
  UserCircle2,
  ChevronDown,
  X,
  House,
} from "lucide-react";
import {
  getMeetings,
  getZones,
  createIncident,
  getCommunityIncidents,
  getAnnouncements,
  markAllNovededAsRead,
  getNovededCount,
  getDocuments,
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "../../assets/dashboard.css";
import headerBg from "../../assets/header-bg.png";
import logoComunidad from "../../assets/logo-comunidad.png";

export default function UserDashboard() {
  const [activeSection, setActiveSection] = useState("inicio");
  const [meetings, setMeetings] = useState([]);
  const [zones, setZones] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [documentsError, setDocumentsError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingIncidents, setLoadingIncidents] = useState(false);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [incidentError, setIncidentError] = useState("");
  const [announcementError, setAnnouncementError] = useState("");
  const [showCreateIncidentModal, setShowCreateIncidentModal] = useState(false);
  const [incidentImageFile, setIncidentImageFile] = useState(null);
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

    if (user?.id) {
      getNovededCount(user.id)
        .then((data) => setUnreadCount(data.total || 0))
        .catch(console.error);
    }
  }, [user?.id]);

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

  useEffect(() => {
    if (activeSection === "novedades") {
      setLoadingAnnouncements(true);
      setAnnouncementError("");

      getAnnouncements(user?.id)
        .then((data) => {
          setAnnouncements(data);

          if (user?.id) {
            markAllNovededAsRead(user.id)
              .then(() => setUnreadCount(0))
              .catch(console.error);
          }
        })
        .catch((err) => {
          console.error(err);
          setAnnouncementError(err.message || "Error cargando anuncios");
        })
        .finally(() => {
          setLoadingAnnouncements(false);
        });
    }
  }, [activeSection, user?.id]);

  useEffect(() => {
  if (activeSection === "documentos") {
    setLoadingDocuments(true);
    setDocumentsError("");

    getDocuments()
      .then(setDocuments)
      .catch((err) => {
        console.error(err);
        setDocumentsError(err.message || "Error cargando documentos");
      })
      .finally(() => {
        setLoadingDocuments(false);
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
      const incidentPayload = new FormData();

      incidentPayload.append(
        "zone_id",
        formData.zone_id === "other" ? "" : Number(formData.zone_id)
      );

      incidentPayload.append(
        "custom_zone",
        formData.zone_id === "other" ? formData.custom_zone.trim() : ""
      );

      incidentPayload.append("created_by", user.id);
      incidentPayload.append("description", formData.description);

      if (incidentImageFile) {
        incidentPayload.append("image", incidentImageFile);
      }

      const newIncident = await createIncident(incidentPayload);

      setIncidents((prev) => [newIncident, ...prev]);

      setFormData({
        zone_id: "",
        custom_zone: "",
        description: "",
      });

      setIncidentImageFile(null);
      setShowCreateIncidentModal(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al crear incidencia");
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getIncidentZoneLabel = (incident) => {
    return incident.zone?.name || incident.custom_zone || "—";
  };

  const renderTopHeader = () => (
    <header className="user-app-header">
      <div className="user-app-header__left">
        {activeSection !== "inicio" && (
          <button
            className="user-app-home-btn"
            onClick={() => setActiveSection("inicio")}
            title="Volver a inicio"
          >
            <House size={20} />
          </button>
        )}

        <div className="user-app-brand">
          <div className="user-app-brand__logo user-app-brand__logo--image">
            <img src={logoComunidad} alt="Logo comunidad" />
          </div>
          <span>JARDINES DE LAS RAMBLAS</span>
        </div>
      </div>

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
              <p>
                <strong>Nombre:</strong> {userName}
              </p>
              <p>
                <strong>DNI:</strong> {userDni}
              </p>
              <p>
                <strong>Vivienda:</strong> {userHouse}
              </p>
            </div>

            {activeSection !== "inicio" && (
              <button
                className="user-profile-menu__item"
                onClick={() => {
                  setActiveSection("inicio");
                  setProfileMenuOpen(false);
                }}
              >
                Ver inicio
              </button>
            )}

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
  );

  const getFileUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `http://localhost:4000${path}`;
  };

  const getAnnouncementTypeLabel = (type) => {
    if (type === "urgente") return "Urgente";
    if (type === "aviso") return "Aviso";
    return "Información";
  };

  const getAnnouncementTypeClass = (type) => {
    if (type === "urgente") return "user-announcement-card--urgent";
    if (type === "aviso") return "user-announcement-card--warning";
    return "user-announcement-card--info";
  };

  const renderInicio = () => (
  <section className="user-home-v2">
    {renderTopHeader()}

    <div
      className="user-home-v2__center user-home-v2__center--banner"
      style={{
        backgroundImage: `linear-gradient(rgba(244, 247, 251, 0.62), rgba(244, 247, 251, 0.86)), url(${headerBg})`,
      }}
    >
      <div className="user-home-v2__buttons">
        <button
          className="user-circle-access user-circle-access--large"
          onClick={() => setActiveSection("incidencias")}
        >
          <div className="user-circle-access__icon">
            <Wrench size={30} />
          </div>
          <span>Incidencias</span>
        </button>

        <button
          className="user-circle-access user-circle-access--small"
          onClick={() => setActiveSection("novedades")}
        >
          <div className="user-circle-access__icon user-circle-access__icon--bell">
            <Bell size={30} />
            {unreadCount > 0 && (
              <span className="user-circle-access__badge">{unreadCount}</span>
            )}
          </div>
          <span>Novedades</span>
        </button>

        <button
          className="user-circle-access user-circle-access--large"
          onClick={() => setActiveSection("documentos")}
        >
          <div className="user-circle-access__icon">
            <FileText size={30} />
          </div>
          <span>Documentos</span>
        </button>
      </div>
    </div>

    <div className="user-home-v2__bottom" />
  </section>
);

  const renderIncidencias = () => (
    <section className="dashboard-panel user-section-panel">
      <div className="dashboard-header-row">
        <div>
          <h1 className="dashboard-title">Incidencias</h1>
          <p className="dashboard-subtitle">
            Aquí puedes crear una incidencia y consultar las registradas por toda
            la comunidad.
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
            <p className="dashboard-empty">
              No hay incidencias registradas todavía.
            </p>
          ) : (
            <div className="incidents-grid user-incidents-grid">
              {incidents.map((incident) => (
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
                      <strong>Enviado por:</strong>{" "}
                    {incident.creator ? [incident.creator.name, incident.creator.apellidos] .filter(Boolean) .join(" "): "—"}
                    </p>
                    <p>
                      <strong>Fecha y hora:</strong>{" "}
                      {formatDateTime(incident.created_at)}
                    </p>
                  </div>

                  <div className="incident-card__description">
                    <p>{incident.description}</p>
                  </div>

                  {incident.image_url && (
                    <div className="incident-card__image">
                      <img src={getFileUrl(incident.image_url)} alt="Imagen de la incidencia" />
                    </div>
                  )}
                </article>
              ))}
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
                <div className="col-md-12">
                  <label className="form-label">Imagen opcional</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => setIncidentImageFile(e.target.files?.[0] || null)}
                  />
                  <small className="text-muted">
                    Puedes añadir una foto para mostrar mejor el problema.
                  </small>
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
                    {selectedIncident.status === "EN PROCESO"
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
                    ? new Date(
                        selectedIncident.created_at
                      ).toLocaleDateString()
                    : "—"}
                </p>
              </div>

              <div className="incident-detail-block">
                <label>Hora</label>
                <p>
                  {selectedIncident.created_at
                    ? new Date(
                        selectedIncident.created_at
                      ).toLocaleTimeString([], {
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

  const renderDocumentos = () => (
    <section className="dashboard-panel user-section-panel">
      <h1 className="dashboard-title">Documentos</h1>
      <p className="dashboard-subtitle">
        Consulta los documentos oficiales publicados por la administración.
      </p>

      {loadingDocuments && <p>Cargando documentos...</p>}

      {documentsError && (
        <div className="alert alert-danger">{documentsError}</div>
      )}

      {!loadingDocuments && !documentsError && (
        <>
          {documents.length === 0 ? (
            <p className="dashboard-empty">
              No hay documentos publicados todavía.
            </p>
          ) : (
            <div className="user-documents-grid">
              {documents.map((doc) => (
                <article key={doc.id} className="user-document-card">
                  <div className="user-document-card__icon">
                    <FileText size={34} />
                  </div>

                  <div className="user-document-card__body">
                    <h3>{doc.title}</h3>

                    <p>
                      Publicado por{" "}
                      <strong>{doc.uploader?.name || "Administración"}</strong>
                    </p>

                    <span>
                      {doc.created_at
                        ? new Date(doc.created_at).toLocaleDateString("es-ES")
                        : "Fecha no disponible"}
                    </span>
                  </div>

                  <a
                    href={`http://localhost:4000/uploads/${doc.stored_name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Ver PDF
                  </a>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );

  const renderNovedades = () => (
  <section className="dashboard-panel user-section-panel">
    <div className="dashboard-header-row">
      <div>
        <h1 className="dashboard-title">Novedades</h1>
        <p className="dashboard-subtitle">
          Avisos y comunicaciones importantes de la comunidad.
        </p>
      </div>
    </div>

    {loadingAnnouncements && <p>Cargando novedades...</p>}

    {announcementError && (
      <div className="alert alert-danger">{announcementError}</div>
    )}

    {!loadingAnnouncements && !announcementError && (
      <>
        {announcements.length === 0 ? (
          <p className="dashboard-empty">
            No hay novedades publicadas todavía.
          </p>
        ) : (
          <div className="user-announcements-list">
            {announcements.map((announcement) => (
              <article
                key={announcement.id}
                className={`user-announcement-card ${getAnnouncementTypeClass(
                  announcement.type
                )}`}
              >
                <div className="user-announcement-card__media">
                  {announcement.image_url ? (
                    <img
                      src={getFileUrl(announcement.image_url)}
                      alt={announcement.title}
                    />
                  ) : (
                    <div className="user-announcement-card__placeholder">
                      <Bell size={32} />
                    </div>
                  )}
                </div>

                <div className="user-announcement-card__content">
                  <div className="user-announcement-card__top">
                    <span className="user-announcement-card__type">
                      {getAnnouncementTypeLabel(announcement.type)}
                    </span>

                    {announcement.type === "urgente" && (
                      <span className="user-announcement-card__pinned">
                        Fijado
                      </span>
                    )}
                  </div>

                  <h3>{announcement.title}</h3>

                  <p className="user-announcement-card__description">
                    {announcement.description}
                  </p>

                  <div className="user-announcement-card__meta">
                    <span>
                      {announcement.creator?.name || "Administración"}
                    </span>
                    <span>
                      {announcement.created_at
                        ? new Date(announcement.created_at).toLocaleDateString(
                            "es-ES",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "Fecha no disponible"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </>
    )}
  </section>
  );

  const renderBottomNav = () => (
    <nav className="user-bottom-nav">
      <button
        className={`user-bottom-nav__item ${
          activeSection === "incidencias" ? "active" : ""
        }`}
        onClick={() => setActiveSection("incidencias")}
      >
        <Wrench size={20} />
        <span>Incidencias</span>
      </button>

      <button
        className={`user-bottom-nav__item ${
          activeSection === "novedades" ? "active" : ""
        }`}
        onClick={() => setActiveSection("novedades")}
      >
        <div className="user-bottom-nav__icon-wrap">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="user-bottom-nav__badge">{unreadCount}</span>
          )}
        </div>
        <span>Novedades</span>
      </button>

      <button
        className={`user-bottom-nav__item ${
          activeSection === "documentos" ? "active" : ""
        }`}
        onClick={() => setActiveSection("documentos")}
      >
        <FileText size={20} />
        <span>Documentos</span>
      </button>
    </nav>
  );

  return (
    <div className="user-dashboard-v2">
      {activeSection === "inicio" ? (
        renderInicio()
      ) : (
        <>
          {renderTopHeader()}

          <main className="user-dashboard-v2__content">
            {activeSection === "incidencias" && renderIncidencias()}
            {activeSection === "documentos" && renderDocumentos()}
            {activeSection === "novedades" && renderNovedades()}
          </main>

          {renderBottomNav()}
        </>
      )}
    </div>
  );
}