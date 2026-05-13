import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Wrench,
  Bell,
  UserCircle2,
  ChevronDown,
  X,
  Home,
  CalendarDays,
  CalendarCheck,
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
import "./UserDashboard.css";
import headerBg from "../../assets/header-bg.png";
import logoComunidad from "../../assets/logo-comunidad.png";
import CalendarReservations from "../../components/CalendarReservations";

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

  const [showCreateIncidentModal, setShowCreateIncidentModal] =
    useState(false);

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

      Promise.all([getAnnouncements(user?.id), getMeetings()])
        .then(([announcementsData, meetingsData]) => {
          setAnnouncements(announcementsData || []);
          setMeetings(meetingsData || []);

          if (user?.id) {
            markAllNovededAsRead(user.id)
              .then(() => setUnreadCount(0))
              .catch(console.error);
          }
        })
        .catch((err) => {
          console.error(err);
          setAnnouncementError(err.message || "Error cargando novedades");
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

  const formatPortal = (portal) => {
    if (!portal) return "";

    const value = String(portal).trim();

    if (!value) return "";

    return value.toUpperCase().startsWith("P")
      ? value.toUpperCase()
      : `P${value}`;
  };

  const userName =
    [user?.name, user?.apellidos].filter(Boolean).join(" ") || "Usuario";

  const userDni = user?.dni || "Sin DNI";

  const userHouse =
    [formatPortal(user?.portal), user?.vivienda]
      .filter(Boolean)
      .join(" ") || "Sin vivienda";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "zone_id" && value !== "other"
        ? { custom_zone: "" }
        : {}),
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
      date.toLocaleDateString("es-ES") +
      " " +
      date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const formatLongDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";

    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatMeetingDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";

    return new Date(dateString).toLocaleString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getIncidentZoneLabel = (incident) => {
    return incident.zone?.name || incident.custom_zone || "—";
  };

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

  const getCreatorName = (creator) => {
    if (!creator) return "Administración";

    return (
      [creator.name, creator.apellidos].filter(Boolean).join(" ") ||
      "Administración"
    );
  };

  const getNovedadesItems = () => {
    const announcementItems = announcements.map((announcement) => ({
      kind: "announcement",
      id: `announcement-${announcement.id}`,
      dateValue: announcement.created_at || "",
      data: announcement,
    }));

    const meetingItems = meetings.map((meeting) => ({
      kind: "meeting",
      id: `meeting-${meeting.id}`,
      dateValue: meeting.created_at || meeting.meeting_date || "",
      data: meeting,
    }));

    return [...announcementItems, ...meetingItems].sort((a, b) => {
      const dateA = new Date(a.dateValue || 0).getTime();
      const dateB = new Date(b.dateValue || 0).getTime();
      return dateB - dateA;
    });
  };

  const renderTopHeader = () => (
    <header className="user-app-header">
      <div className="user-app-header__left">
        <button
          className={`user-app-home-btn ${
            activeSection === "inicio" ? "user-app-home-btn--hidden" : ""
          }`}
          onClick={() => setActiveSection("inicio")}
          aria-label="Volver al inicio"
          type="button"
        >
          <Home size={30} />
        </button>
      </div>

      <div className="user-app-brand">
        <div className="user-app-brand__logo-block">
          <img src={logoComunidad} alt="Logo comunidad" />
        </div>

        <span>JARDINES DE LAS RAMBLAS</span>
      </div>

      <div className="user-app-header__right">
        <div className="user-profile-menu">
          <button
            className="user-profile-menu__trigger"
            onClick={() => setProfileMenuOpen((prev) => !prev)}
            type="button"
          >
            <div className="user-profile-menu__avatar">
              <UserCircle2 size={24} />
            </div>

            <div className="user-profile-menu__text">
              <strong>{userName}</strong>
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
                  type="button"
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
                type="button"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );

  const renderInicio = () => (
    <section className="user-home-v2">
      {renderTopHeader()}

      <div
        className="user-home-v2__center user-home-v2__center--banner"
        style={{
          backgroundImage: `linear-gradient(rgba(244, 247, 251, 0.42), rgba(244, 247, 251, 0.70)), url(${headerBg})`,
        }}
      >
        <div className="user-home-v2__buttons user-home-v2__buttons--four">
          <button
            className="user-circle-access user-circle-access--incidencias"
            onClick={() => setActiveSection("incidencias")}
            type="button"
          >
            <div className="user-circle-access__icon">
              <Wrench size={30} />
            </div>
            <span>Incidencias</span>
          </button>

          <button
            className="user-circle-access user-circle-access--novedades"
            onClick={() => setActiveSection("novedades")}
            type="button"
          >
            <div className="user-circle-access__icon user-circle-access__icon--bell">
              <Bell size={30} />
              {unreadCount > 0 && (
                <span className="user-circle-access__badge">
                  {unreadCount}
                </span>
              )}
            </div>
            <span>Novedades</span>
          </button>

          <button
            className="user-circle-access user-circle-access--documentos"
            onClick={() => setActiveSection("documentos")}
            type="button"
          >
            <div className="user-circle-access__icon">
              <FileText size={30} />
            </div>
            <span>Documentos</span>
          </button>

          <button
            className="user-circle-access user-circle-access--reservas"
            onClick={() => setActiveSection("reservas")}
            type="button"
          >
            <div className="user-circle-access__icon user-circle-access__icon--booking">
              <CalendarCheck size={30} />
            </div>
            <span>Reservas</span>
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
            Aquí puedes crear una incidencia y consultar las registradas por
            toda la comunidad.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowCreateIncidentModal(true)}
          type="button"
        >
          Nueva incidencia
        </button>
      </div>

      {loadingIncidents && <p>Cargando incidencias...</p>}

      {incidentError && (
        <div className="alert alert-danger">{incidentError}</div>
      )}

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
                      {incident.creator
                        ? [
                            incident.creator.name,
                            incident.creator.apellidos,
                          ]
                            .filter(Boolean)
                            .join(" ")
                        : "—"}
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
                      <img
                        src={getFileUrl(incident.image_url)}
                        alt="Imagen de la incidencia"
                      />
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );

  const renderReservas = () => (
    <section className="dashboard-panel user-section-panel reservations-user-section">
      <div className="dashboard-header-row">
        <div>
          <h1 className="dashboard-title">Reservas</h1>
          <p className="dashboard-subtitle">
            Consulta la disponibilidad del salón social y solicita una reserva.
          </p>
        </div>
      </div>

      <CalendarReservations mode="user" />
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
                      <strong>
                        {doc.uploader
                          ? [doc.uploader.name, doc.uploader.apellidos]
                              .filter(Boolean)
                              .join(" ")
                          : "Administración"}
                      </strong>
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

  const renderNovedades = () => {
    const novedadesItems = getNovedadesItems();

    return (
      <section className="dashboard-panel user-section-panel">
        <div className="dashboard-header-row">
          <div>
            <h1 className="dashboard-title">Novedades</h1>

            <p className="dashboard-subtitle">
              Avisos, comunicaciones importantes y reuniones de la comunidad.
            </p>
          </div>
        </div>

        {loadingAnnouncements && <p>Cargando novedades...</p>}

        {announcementError && (
          <div className="alert alert-danger">{announcementError}</div>
        )}

        {!loadingAnnouncements && !announcementError && (
          <>
            {novedadesItems.length === 0 ? (
              <p className="dashboard-empty">
                No hay novedades publicadas todavía.
              </p>
            ) : (
              <div className="user-announcements-list">
                {novedadesItems.map((item) => {
                  if (item.kind === "meeting") {
                    const meeting = item.data;

                    return (
                      <article
                        key={item.id}
                        className="user-announcement-card user-announcement-card--meeting"
                      >
                        <div className="user-announcement-card__media user-announcement-card__media--meeting">
                          <div className="user-announcement-card__placeholder user-announcement-card__placeholder--meeting">
                            <CalendarDays size={38} />
                          </div>
                        </div>

                        <div className="user-announcement-card__content">
                          <div className="user-announcement-card__top">
                            <span className="user-announcement-card__type user-announcement-card__type--meeting">
                              Reunión
                            </span>

                            <span className="user-announcement-card__pinned user-announcement-card__pinned--meeting">
                              Convocatoria
                            </span>
                          </div>

                          <h3>{meeting.title}</h3>

                          <p className="user-announcement-card__description">
                            {meeting.description ||
                              "Se ha convocado una nueva reunión de la comunidad."}
                          </p>

                          <div className="user-meeting-info-box">
                            <CalendarDays size={18} />

                            <span>
                              <strong>Fecha y hora:</strong>{" "}
                              {formatMeetingDate(meeting.meeting_date)}
                            </span>
                          </div>

                          <div className="user-announcement-card__meta">
                            <span>{getCreatorName(meeting.creator)}</span>

                            <span>
                              Publicado: {formatLongDate(meeting.created_at)}
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  }

                  const announcement = item.data;

                  return (
                    <article
                      key={item.id}
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
                            {announcement.creator
                              ? [
                                  announcement.creator.name,
                                  announcement.creator.apellidos,
                                ]
                                  .filter(Boolean)
                                  .join(" ")
                              : "Administración"}
                          </span>

                          <span>
                            {formatLongDate(announcement.created_at)}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    );
  };

  const renderBottomNav = () => (
    <nav className="user-bottom-nav user-bottom-nav--four">
      <button
        className={`user-bottom-nav__item user-bottom-nav__item--incidencias ${
          activeSection === "incidencias" ? "active" : ""
        }`}
        onClick={() => setActiveSection("incidencias")}
        type="button"
      >
        <Wrench size={20} />
        <span>Incidencias</span>
      </button>

      <button
        className={`user-bottom-nav__item user-bottom-nav__item--novedades ${
          activeSection === "novedades" ? "active" : ""
        }`}
        onClick={() => setActiveSection("novedades")}
        type="button"
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
        className={`user-bottom-nav__item user-bottom-nav__item--documentos ${
          activeSection === "documentos" ? "active" : ""
        }`}
        onClick={() => setActiveSection("documentos")}
        type="button"
      >
        <FileText size={20} />
        <span>Documentos</span>
      </button>

      <button
        className={`user-bottom-nav__item user-bottom-nav__item--reservas ${
          activeSection === "reservas" ? "active" : ""
        }`}
        onClick={() => setActiveSection("reservas")}
        type="button"
      >
        <CalendarCheck size={20} />
        <span>Reservas</span>
      </button>
    </nav>
  );
  const renderCreateIncidentModal = () => {
    if (!showCreateIncidentModal) return null;

    return (
      <div className="admin-modal-backdrop">
        <div className="admin-modal-card incident-create-modal">
          <div className="dashboard-header-row incident-create-modal__header">
            <div>
              <h2 className="dashboard-title" style={{ fontSize: "1.5rem" }}>
                Crear nueva incidencia
              </h2>

              <p className="dashboard-subtitle mb-0">
                Rellena los datos y envía la incidencia a la comunidad.
              </p>
            </div>

            <button
              className="btn btn-outline-secondary incident-create-modal__close"
              onClick={() => setShowCreateIncidentModal(false)}
              type="button"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleCreateIncident} className="incident-create-form">
            <div className="incident-create-form__body">
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
                    onChange={(e) =>
                      setIncidentImageFile(e.target.files?.[0] || null)
                    }
                  />

                  <small className="text-muted">
                    Puedes añadir una foto para mostrar mejor el problema.
                  </small>
                </div>
              </div>
            </div>

            <div className="incident-create-form__actions d-flex gap-2 justify-content-end">
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
    );
  };

  const renderIncidentDetailModal = () => {
    if (!selectedIncident) return null;

    return (
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
              type="button"
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
              <p>
                {selectedIncident.creator
                  ? [
                      selectedIncident.creator.name,
                      selectedIncident.creator.apellidos,
                    ]
                      .filter(Boolean)
                      .join(" ")
                  : "—"}
              </p>
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
    );
  };

  return (
    <div className="user-dashboard-v2">
      {activeSection === "inicio" ? (
        renderInicio()
      ) : (
        <>
          {renderTopHeader()}

          <main
            className="user-dashboard-v2__content user-dashboard-v2__content--section-bg"
            style={{
              backgroundImage: `linear-gradient(rgba(244, 247, 251, 0.42), rgba(244, 247, 251, 0.70)), url(${headerBg})`,
            }}
          >
            {activeSection === "incidencias" && renderIncidencias()}
            {activeSection === "documentos" && renderDocumentos()}
            {activeSection === "novedades" && renderNovedades()}
            {activeSection === "reservas" && renderReservas()}
          </main>

          {renderBottomNav()}
        </>
      )}

      {renderCreateIncidentModal()}
      {renderIncidentDetailModal()}
    </div>
  );
}