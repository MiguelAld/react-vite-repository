import { useEffect, useState } from "react";
import SidebarAdmin from "../../components/layout/SidebarAdmin";
import CalendarMeetings from "../../components/CalendarMeetings";
import CalendarReservations from "../../components/CalendarReservations";
import { useAuth } from "../../context/AuthContext";

import {
  getUsers,
  createUser,
  updateUser,
  updateUserActive,
  deleteUser,
  getIncidents,
  updateIncidentStatus,
  deleteIncident,
  getAllZones,
  createZone,
  updateZoneActive,
  updateZoneOrder,
  deleteZone,
  getMeetings,
  getDocuments,
  uploadDocument,
  deleteDocument,
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../services/api";

import "../../assets/dashboard.css";

import {
  Pencil,
  Trash2,
  FileText,
  FileUp,
  Megaphone,
  Image as ImageIcon,
  Edit3,
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [section, setSection] = useState("comunicados");

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");

  const [incidents, setIncidents] = useState([]);
  const [incidentsLoading, setIncidentsLoading] = useState(false);
  const [incidentsError, setIncidentsError] = useState("");
  const [selectedIncident, setSelectedIncident] = useState(null);

  const [meetings, setMeetings] = useState([]);
  const [meetingsLoading, setMeetingsLoading] = useState(false);

  const [zones, setZones] = useState([]);
  const [zonesLoading, setZonesLoading] = useState(false);
  const [zonesError, setZonesError] = useState("");
  const [zoneName, setZoneName] = useState("");

  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [userSearchFilter, setUserSearchFilter] = useState("");

  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentFile, setDocumentFile] = useState(null);

  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);
  const [announcementsError, setAnnouncementsError] = useState("");
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [announcementImageFile, setAnnouncementImageFile] = useState(null);

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    description: "",
    type: "informacion",
    image_url: "",
  });

  const [userForm, setUserForm] = useState({
    dni: "",
    name: "",
    apellidos: "",
    phone: "",
    email: "",
    portal: "",
    vivienda: "",
    role: "VECINO",
  });

  const adminFullName =
    [user?.name, user?.apellidos].filter(Boolean).join(" ") || "Admin";

  const adminProperty =
    [user?.portal, user?.vivienda].filter(Boolean).join(" - ") || "—";

  const isComunicadosSection =
    section === "comunicados" || section === "reportes";

  const viviendasPorPortal = {
    P1: ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B"],
    P2: ["1C", "1D", "2C", "2D", "3C", "3D", "4C", "4D", "5C", "5D"],
  };

  useEffect(() => {
    if (section === "usuarios") {
      setUsersLoading(true);
      setUsersError("");

      getUsers()
        .then(setUsers)
        .catch((err) => {
          console.error(err);
          setUsersError(err.message || "Error al cargar usuarios");
        })
        .finally(() => {
          setUsersLoading(false);
        });
    }
  }, [section]);

  useEffect(() => {
    if (section === "inicio") {
      setIncidentsLoading(true);
      setMeetingsLoading(true);
      setDocumentsLoading(true);

      getIncidents()
        .then(setIncidents)
        .catch(console.error)
        .finally(() => {
          setIncidentsLoading(false);
        });

      getMeetings()
        .then(setMeetings)
        .catch(console.error)
        .finally(() => {
          setMeetingsLoading(false);
        });

      getDocuments()
        .then(setDocuments)
        .catch(console.error)
        .finally(() => {
          setDocumentsLoading(false);
        });
    }
  }, [section]);

  useEffect(() => {
    if (section === "incidencias") {
      setIncidentsLoading(true);
      setIncidentsError("");

      getIncidents()
        .then(setIncidents)
        .catch((err) => {
          console.error(err);
          setIncidentsError(err.message || "Error al cargar incidencias");
        })
        .finally(() => {
          setIncidentsLoading(false);
        });
    }
  }, [section]);

  useEffect(() => {
    if (section === "zonas") {
      setZonesLoading(true);
      setZonesError("");

      getAllZones()
        .then(setZones)
        .catch((err) => {
          console.error(err);
          setZonesError(err.message || "Error al cargar zonas");
        })
        .finally(() => {
          setZonesLoading(false);
        });
    }
  }, [section]);

  useEffect(() => {
    if (section === "documentos") {
      setDocumentsLoading(true);
      setDocumentsError("");

      getDocuments()
        .then(setDocuments)
        .catch((err) => {
          console.error(err);
          setDocumentsError(err.message || "Error al cargar documentos");
        })
        .finally(() => {
          setDocumentsLoading(false);
        });
    }
  }, [section]);

  useEffect(() => {
    if (isComunicadosSection) {
      setAnnouncementsLoading(true);
      setAnnouncementsError("");

      getAnnouncements()
        .then(setAnnouncements)
        .catch((err) => {
          console.error(err);
          setAnnouncementsError(err.message || "Error al cargar comunicados");
        })
        .finally(() => {
          setAnnouncementsLoading(false);
        });
    }
  }, [isComunicadosSection]);

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

  const getFullName = (person) => {
    if (!person) return "—";
    return [person.name, person.apellidos].filter(Boolean).join(" ") || "—";
  };

  const getIncidentZoneLabel = (incident) => {
    return incident.zone?.name || incident.custom_zone || "—";
  };

  const getAnnouncementTypeLabel = (type) => {
    if (type === "urgente") return "URGENTE";
    if (type === "aviso") return "AVISO";
    return "INFORMACIÓN";
  };

  const previewImage = announcementImageFile
    ? URL.createObjectURL(announcementImageFile)
    : announcementForm.image_url
    ? `http://localhost:4000${announcementForm.image_url}`
    : "";

  const handleDeleteUser = async (userId, userName) => {
    const ok = window.confirm(
      `¿Seguro que quieres borrar al usuario ${userName}? Esta acción no se puede deshacer.`
    );

    if (!ok) return;

    try {
      await deleteUser(userId);

      setUsers((prev) => prev.filter((u) => u.id !== userId));

      if (editingUser && editingUser.id === userId) {
        closeUserModal();
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Error eliminando usuario");
    }
  };

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;

    setUserForm((prev) => {
      if (name === "portal") {
        return {
          ...prev,
          portal: value,
          vivienda: "",
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setUserForm({
      dni: "",
      name: "",
      apellidos: "",
      phone: "",
      email: "",
      portal: "",
      vivienda: "",
      role: "VECINO",
    });
    setShowUserModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setUserForm({
      dni: user.dni || "",
      name: user.name || "",
      apellidos: user.apellidos || "",
      phone: user.phone || "",
      email: user.email || "",
      portal: user.portal || "",
      vivienda: user.vivienda || "",
      role: user.role || "VECINO",
    });
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setEditingUser(null);
    setOpenMenuId(null);
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        const updated = await updateUser(editingUser.id, userForm);

        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? updated : u))
        );

        setEditingUser(updated);
      } else {
        const newUser = await createUser(userForm);
        setUsers((prev) => [...prev, newUser]);
      }

      closeUserModal();
    } catch (err) {
      console.error(err);
      alert(err.message || "Error guardando usuario");
    }
  };

  const handleToggleUserActive = async (userId, currentState) => {
    try {
      const response = await updateUserActive(userId, !currentState);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, is_active: response.user?.is_active ?? !currentState }
            : u
        )
      );

      if (editingUser && editingUser.id === userId) {
        setEditingUser((prev) =>
          prev
            ? {
                ...prev,
                is_active: response.user?.is_active ?? !currentState,
              }
            : prev
        );
      }

      setOpenMenuId(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error actualizando usuario");
    }
  };

  const handleStatusChange = async (incidentId, newStatus) => {
    try {
      await updateIncidentStatus(incidentId, newStatus);

      setIncidents((prev) =>
        prev.map((incident) =>
          incident.id === incidentId
            ? {
                ...incident,
                status: newStatus,
                closed_at:
                  newStatus === "RESUELTA" ? new Date().toISOString() : null,
              }
            : incident
        )
      );

      if (selectedIncident && selectedIncident.id === incidentId) {
        setSelectedIncident((prev) =>
          prev
            ? {
                ...prev,
                status: newStatus,
                closed_at:
                  newStatus === "RESUELTA" ? new Date().toISOString() : null,
              }
            : prev
        );
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Error actualizando estado");
    }
  };

  const handleDeleteIncident = async (incidentId) => {
    const ok = window.confirm(
      "¿Seguro que quieres eliminar esta incidencia? Esta acción no se puede deshacer."
    );

    if (!ok) return;

    try {
      await deleteIncident(incidentId);
      setIncidents((prev) =>
        prev.filter((incident) => incident.id !== incidentId)
      );
      setSelectedIncident(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error eliminando incidencia");
    }
  };

  const handleCreateZone = async (e) => {
    e.preventDefault();

    try {
      const newZone = await createZone({
        name: zoneName,
      });

      setZones((prev) =>
        [...prev, newZone].sort((a, b) => {
          const orderA = Number(a.order || 0);
          const orderB = Number(b.order || 0);

          if (orderA !== orderB) return orderA - orderB;

          return Number(a.id) - Number(b.id);
        })
      );

      setZoneName("");
    } catch (err) {
      console.error(err);
      alert(err.message || "Error creando zona");
    }
  };

  const handleToggleZoneActive = async (zoneId, currentState) => {
    try {
      const response = await updateZoneActive(zoneId, !currentState);

      setZones((prev) =>
        prev.map((z) =>
          z.id === zoneId
            ? { ...z, is_active: response.zone?.is_active ?? !currentState }
            : z
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message || "Error actualizando zona");
    }
  };

  const handleDeleteZone = async (zoneId, zoneName) => {
    const ok = window.confirm(
      `¿Seguro que quieres eliminar la zona "${zoneName}"? Esta acción no se puede deshacer.`
    );

    if (!ok) return;

    try {
      const response = await deleteZone(zoneId);

      if (response.zones) {
        setZones(response.zones);
        return;
      }

      const updatedZones = await getAllZones();
      setZones(updatedZones);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error eliminando zona");
    }
  };

  const handleMoveZone = async (zoneId, direction) => {
    try {
      const response = await updateZoneOrder(zoneId, direction);

      if (response.zones) {
        setZones(response.zones);
        return;
      }

      getAllZones().then(setZones).catch(console.error);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error moviendo zona");
    }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();

    try {
      if (!documentTitle.trim() || !documentFile) {
        alert("Debes indicar título y seleccionar un PDF");
        return;
      }

      const formData = new FormData();
      formData.append("title", documentTitle);
      formData.append("uploaded_by", user.id);
      formData.append("file", documentFile);

      const newDocument = await uploadDocument(formData);

      setDocuments((prev) => [newDocument, ...prev]);
      setDocumentTitle("");
      setDocumentFile(null);

      const fileInput = document.getElementById("document-file-input");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error(err);
      alert(err.message || "Error subiendo documento");
    }
  };

  const handleDeleteDocument = async (documentId, title) => {
    const ok = window.confirm(
      `¿Seguro que quieres borrar el documento "${title}"?`
    );

    if (!ok) return;

    try {
      await deleteDocument(documentId);
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    } catch (err) {
      console.error(err);
      alert(err.message || "Error eliminando documento");
    }
  };

  const openCreateAnnouncementModal = () => {
    setEditingAnnouncement(null);
    setAnnouncementImageFile(null);
    setAnnouncementForm({
      title: "",
      description: "",
      type: "informacion",
      image_url: "",
    });
    setShowAnnouncementModal(true);
  };

  const openEditAnnouncementModal = (announcement) => {
    setEditingAnnouncement(announcement);
    setAnnouncementImageFile(null);
    setAnnouncementForm({
      title: announcement.title || "",
      description: announcement.description || "",
      type: announcement.type || "informacion",
      image_url: announcement.image_url || "",
    });
    setShowAnnouncementModal(true);
  };

  const closeAnnouncementModal = () => {
    setShowAnnouncementModal(false);
    setEditingAnnouncement(null);
    setAnnouncementImageFile(null);
  };

  const handleAnnouncementFormChange = (e) => {
    const { name, value } = e.target;

    setAnnouncementForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitAnnouncement = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();

      payload.append("title", announcementForm.title);
      payload.append("description", announcementForm.description);
      payload.append("type", announcementForm.type);
      payload.append("created_by", user.id);

      if (announcementImageFile) {
        payload.append("image", announcementImageFile);
      }

      if (
        editingAnnouncement &&
        announcementForm.image_url &&
        !announcementImageFile
      ) {
        payload.append("keep_image", "true");
      }

      if (editingAnnouncement) {
        const updated = await updateAnnouncement(
          editingAnnouncement.id,
          payload
        );

        setAnnouncements((prev) =>
          prev.map((a) => (a.id === editingAnnouncement.id ? updated : a))
        );
      } else {
        const created = await createAnnouncement(payload);
        setAnnouncements((prev) => [created, ...prev]);
      }

      closeAnnouncementModal();
    } catch (err) {
      console.error(err);
      alert(err.message || "Error guardando comunicado");
    }
  };

  const handleDeleteAnnouncement = async (announcementId, title) => {
    const ok = window.confirm(
      `¿Seguro que quieres eliminar el comunicado "${title}"?`
    );

    if (!ok) return;

    try {
      await deleteAnnouncement(announcementId, user.id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== announcementId));
    } catch (err) {
      console.error(err);
      alert(err.message || "Error eliminando comunicado");
    }
  };

  const getFilteredUsers = () => {
    if (!userSearchFilter.trim()) return users;

    const filter = userSearchFilter.toLowerCase();

    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(filter) ||
        user.apellidos?.toLowerCase().includes(filter) ||
        user.dni?.toLowerCase().includes(filter) ||
        user.email?.toLowerCase().includes(filter) ||
        user.phone?.toLowerCase().includes(filter) ||
        user.portal?.toLowerCase().includes(filter) ||
        user.vivienda?.toLowerCase().includes(filter) ||
        user.role?.toLowerCase().includes(filter)
    );
  };

  return (
    <div className="dashboard-shell">
      <SidebarAdmin
        activeSection={section}
        setActiveSection={setSection}
        userName={adminFullName}
        userDni={user?.dni || "—"}
        userHouse={adminProperty}
      />

      <div className="dashboard-content">
        <main className="dashboard-main">
          {section === "inicio" && (
            <section className="dashboard-panel">
              <h1 className="dashboard-title">Resumen general</h1>
              <p className="dashboard-subtitle">
                Consulta rápidamente el estado de la comunidad.
              </p>

              <div className="dashboard-cards">
                <div className="dashboard-card summary-accent-yellow">
                  <h5>Incidencias pendientes</h5>
                  <p className="summary-number">
                    {incidentsLoading
                      ? "..."
                      : incidents.filter((i) => i.status === "PENDIENTE")
                          .length}
                  </p>
                </div>

                <div className="dashboard-card summary-accent-blue">
                  <h5>Documentos subidos</h5>
                  <p className="summary-number">
                    {documentsLoading ? "..." : documents.length}
                  </p>
                </div>

                <div className="dashboard-card summary-accent-green">
                  <h5>Próximas reuniones</h5>
                  <p className="summary-number">
                    {meetingsLoading
                      ? "..."
                      : meetings.filter(
                          (m) => new Date(m.meeting_date) > new Date()
                        ).length}
                  </p>
                </div>
              </div>
            </section>
          )}

          {isComunicadosSection && (
            <section className="dashboard-panel">
              <div className="dashboard-header-row">
                <div>
                  <h1 className="dashboard-title">Comunicados</h1>
                  <p className="dashboard-subtitle">
                    Gestiona las novedades y avisos que verán los vecinos en la
                    aplicación.
                  </p>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={openCreateAnnouncementModal}
                  type="button"
                >
                  Nuevo comunicado
                </button>
              </div>

              {announcementsLoading && <p>Cargando comunicados...</p>}

              {announcementsError && (
                <div className="alert alert-danger">{announcementsError}</div>
              )}

              {!announcementsLoading && !announcementsError && (
                <>
                  {announcements.length === 0 ? (
                    <p className="dashboard-empty">
                      No hay comunicados creados todavía.
                    </p>
                  ) : (
                    <div className="announcements-admin-grid">
                      {announcements.map((announcement) => (
                        <article
                          key={announcement.id}
                          className={`announcement-admin-card announcement-admin-card--${announcement.type}`}
                        >
                          <div className="announcement-admin-card__media">
                            {announcement.image_url ? (
                              <img
                                src={`http://localhost:4000${announcement.image_url}`}
                                alt={announcement.title}
                                className="announcement-admin-card__image"
                              />
                            ) : (
                              <div className="announcement-admin-card__placeholder">
                                <ImageIcon size={34} />
                              </div>
                            )}
                          </div>

                          <div className="announcement-admin-card__body">
                            <div className="announcement-admin-card__top">
                              <h3>{announcement.title}</h3>

                              <div className="announcement-admin-card__badges">
                                <span
                                  className={`announcement-type-badge announcement-type-badge--${announcement.type}`}
                                >
                                  {getAnnouncementTypeLabel(announcement.type)}
                                </span>

                                {announcement.is_featured && (
                                  <span className="announcement-featured-badge">
                                    DESTACADO
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="announcement-admin-card__description">
                              {announcement.description}
                            </p>

                            <div className="announcement-admin-card__meta">
                              <span>
                                <strong>Autor:</strong>{" "}
                                {getFullName(announcement.creator) ||
                                  "Administración"}
                              </span>
                              <span>
                                <strong>Fecha:</strong>{" "}
                                {announcement.created_at
                                  ? new Date(
                                      announcement.created_at
                                    ).toLocaleDateString("es-ES")
                                  : "—"}
                              </span>
                            </div>

                            <div className="announcement-admin-card__actions">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() =>
                                  openEditAnnouncementModal(announcement)
                                }
                                type="button"
                              >
                                <Edit3 size={14} className="me-1" />
                                Editar
                              </button>

                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  handleDeleteAnnouncement(
                                    announcement.id,
                                    announcement.title
                                  )
                                }
                                type="button"
                              >
                                <Trash2 size={14} className="me-1" />
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </>
              )}

              {showAnnouncementModal && (
                <div className="admin-modal-backdrop">
                  <div className="admin-modal-card admin-modal-card--xl">
                    <div className="dashboard-header-row">
                      <div>
                        <h2
                          className="dashboard-title"
                          style={{ fontSize: "1.5rem" }}
                        >
                          {editingAnnouncement
                            ? "Editar comunicado"
                            : "Nuevo comunicado"}
                        </h2>
                        <p className="dashboard-subtitle mb-0">
                          Configura el comunicado y revisa la vista previa antes
                          de publicarlo.
                        </p>
                      </div>

                      <button
                        className="btn btn-outline-secondary"
                        onClick={closeAnnouncementModal}
                        type="button"
                      >
                        Cerrar
                      </button>
                    </div>

                    <div className="announcement-modal-layout">
                      <form
                        onSubmit={handleSubmitAnnouncement}
                        className="announcement-form-panel"
                      >
                        <div className="mb-3">
                          <label className="form-label">Título</label>
                          <input
                            type="text"
                            className="form-control"
                            name="title"
                            value={announcementForm.title}
                            onChange={handleAnnouncementFormChange}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Descripción</label>
                          <textarea
                            className="form-control"
                            name="description"
                            rows="6"
                            value={announcementForm.description}
                            onChange={handleAnnouncementFormChange}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Tipo</label>
                          <select
                            className="form-select"
                            name="type"
                            value={announcementForm.type}
                            onChange={handleAnnouncementFormChange}
                          >
                            <option value="informacion">Información</option>
                            <option value="aviso">Aviso</option>
                            <option value="urgente">Urgente</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">
                            Imagen del comunicado
                          </label>
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) =>
                              setAnnouncementImageFile(
                                e.target.files?.[0] || null
                              )
                            }
                          />

                          {editingAnnouncement?.image_url &&
                            !announcementImageFile && (
                              <small className="text-muted">
                                Este comunicado ya tiene una imagen. Si
                                seleccionas otra, se sustituirá.
                              </small>
                            )}
                        </div>

                        <div className="d-flex gap-2 justify-content-end">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={closeAnnouncementModal}
                          >
                            Cancelar
                          </button>
                          <button type="submit" className="btn btn-success">
                            {editingAnnouncement
                              ? "Guardar cambios"
                              : "Publicar comunicado"}
                          </button>
                        </div>
                      </form>

                      <div className="announcement-preview-panel">
                        <h4 className="announcement-preview-panel__title">
                          Vista previa
                        </h4>

                        <article
                          className={`announcement-preview-card announcement-preview-card--${announcementForm.type}`}
                        >
                          <div className="announcement-preview-card__media">
                            {previewImage ? (
                              <img
                                src={previewImage}
                                alt="Preview"
                                className="announcement-preview-card__image"
                              />
                            ) : (
                              <div className="announcement-preview-card__placeholder">
                                <Megaphone size={34} />
                              </div>
                            )}
                          </div>

                          <div className="announcement-preview-card__body">
                            <div className="announcement-preview-card__badges">
                              <span
                                className={`announcement-type-badge announcement-type-badge--${announcementForm.type}`}
                              >
                                {getAnnouncementTypeLabel(
                                  announcementForm.type
                                )}
                              </span>
                            </div>

                            <h3>
                              {announcementForm.title ||
                                "Título del comunicado"}
                            </h3>
                            <p>
                              {announcementForm.description ||
                                "Aquí se verá la descripción del comunicado para el vecino."}
                            </p>

                            <div className="announcement-preview-card__meta">
                              <span>{adminFullName}</span>
                              <span>
                                {new Date().toLocaleDateString("es-ES")}
                              </span>
                            </div>
                          </div>
                        </article>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {section === "incidencias" && (
            <section className="dashboard-panel">
              <div className="dashboard-header-row">
                <div>
                  <h1 className="dashboard-title">Gestión de incidencias</h1>
                  <p className="dashboard-subtitle">
                    Aquí puedes revisar quién envió cada incidencia, consultar
                    su ficha completa y cambiar su estado.
                  </p>
                </div>
              </div>

              {!incidentsLoading && !incidentsError && (
                <div className="dashboard-cards incidents-summary-cards mb-4">
                  <div className="dashboard-card summary-accent-yellow">
                    <h5>Pendientes</h5>
                    <p className="summary-number">
                      {
                        incidents.filter((i) => i.status === "PENDIENTE")
                          .length
                      }
                    </p>
                  </div>

                  <div className="dashboard-card summary-accent-blue">
                    <h5>En proceso</h5>
                    <p className="summary-number">
                      {
                        incidents.filter((i) => i.status === "EN_PROCESO")
                          .length
                      }
                    </p>
                  </div>

                  <div className="dashboard-card summary-accent-green">
                    <h5>Resueltas</h5>
                    <p className="summary-number">
                      {incidents.filter((i) => i.status === "RESUELTA").length}
                    </p>
                  </div>
                </div>
              )}

              {incidentsLoading && <p>Cargando incidencias...</p>}

              {incidentsError && (
                <div className="alert alert-danger">{incidentsError}</div>
              )}

              {!incidentsLoading && !incidentsError && (
                <>
                  {incidents.length === 0 ? (
                    <p className="dashboard-empty">
                      No hay incidencias registradas.
                    </p>
                  ) : (
                    <div className="incidents-grid">
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
                              <strong>Creado por:</strong>{" "}
                              {getFullName(incident.creator)}
                            </p>
                            <p>
                              <strong>Fecha y hora:</strong>{" "}
                              {formatDateTime(incident.created_at)}
                            </p>
                          </div>

                          <div className="incident-card__actions">
                            <button
                              className="btn btn-sm btn-outline-primary incident-card__toggle"
                              onClick={() => setSelectedIncident(incident)}
                              type="button"
                            >
                              Ver detalle
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteIncident(incident.id)}
                              title="Eliminar incidencia"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </>
              )}

              {selectedIncident && (
                <div className="admin-modal-backdrop">
                  <div className="admin-modal-card incident-detail-modal">
                    <div className="dashboard-header-row">
                      <div>
                        <h2
                          className="dashboard-title"
                          style={{ fontSize: "1.5rem" }}
                        >
                          Detalle de incidencia
                        </h2>
                        <p className="dashboard-subtitle mb-0">
                          Revisa toda la información y gestiona esta incidencia.
                        </p>
                      </div>

                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => setSelectedIncident(null)}
                        type="button"
                      >
                        Cerrar
                      </button>
                    </div>

                    <div className="incident-detail-grid">
                      <div className="incident-detail-block">
                        <label>Zona</label>
                        <p>{getIncidentZoneLabel(selectedIncident)}</p>
                      </div>

                      <div className="incident-detail-block">
                        <label>Estado actual</label>
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
                        <label>Vecino</label>
                        <p>{getFullName(selectedIncident.creator)}</p>
                      </div>

                      <div className="incident-detail-block">
                        <label>DNI</label>
                        <p>{selectedIncident.creator?.dni || "—"}</p>
                      </div>

                      <div className="incident-detail-block">
                        <label>Fecha y hora</label>
                        <p>{formatDateTime(selectedIncident.created_at)}</p>
                      </div>

                      <div className="incident-detail-block incident-detail-block--full">
                        <label>Descripción</label>
                        <p>{selectedIncident.description}</p>
                      </div>

                      {selectedIncident.image_url && (
                        <div className="incident-detail-block incident-detail-block--full">
                          <label>Imagen adjunta</label>

                          <div className="incident-detail-image">
                            <img
                              src={`http://localhost:4000${selectedIncident.image_url}`}
                              alt="Imagen de la incidencia"
                            />
                          </div>
                        </div>
                      )}

                      <div className="incident-detail-block incident-detail-block--full">
                        <label>Estado</label>

                        <div className="incident-status-actions">
                          <button
                            type="button"
                            className={`incident-status-btn incident-status-btn--pending ${
                              selectedIncident.status === "PENDIENTE"
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              handleStatusChange(
                                selectedIncident.id,
                                "PENDIENTE"
                              )
                            }
                          >
                            Pendiente
                          </button>

                          <button
                            type="button"
                            className={`incident-status-btn incident-status-btn--progress ${
                              selectedIncident.status === "EN_PROCESO"
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              handleStatusChange(
                                selectedIncident.id,
                                "EN_PROCESO"
                              )
                            }
                          >
                            En proceso
                          </button>

                          <button
                            type="button"
                            className={`incident-status-btn incident-status-btn--resolved ${
                              selectedIncident.status === "RESUELTA"
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              handleStatusChange(
                                selectedIncident.id,
                                "RESUELTA"
                              )
                            }
                          >
                            Resuelta
                          </button>
                        </div>
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
          )}

          {section === "zonas" && (
            <section className="dashboard-panel">
              <div className="dashboard-header-row">
                <div>
                  <h1 className="dashboard-title">Zonas Públicas</h1>
                  <p className="dashboard-subtitle">
                    Crea, ordena, activa, desactiva o elimina las zonas que
                    verán los usuarios al crear incidencias.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleCreateZone}
                className="dashboard-block mb-4"
              >
                <div className="row g-3 align-items-end">
                  <div className="col-md-9">
                    <label className="form-label">Nueva zona</label>
                    <input
                      type="text"
                      className="form-control"
                      value={zoneName}
                      onChange={(e) => setZoneName(e.target.value)}
                      placeholder="Ej: Piscina, Jardines, Garaje..."
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <button type="submit" className="btn btn-success w-100">
                      Añadir zona
                    </button>
                  </div>
                </div>
              </form>

              {zonesLoading && <p>Cargando zonas...</p>}

              {zonesError && (
                <div className="alert alert-danger">{zonesError}</div>
              )}

              {!zonesLoading && !zonesError && (
                <>
                  {zones.length === 0 ? (
                    <p className="dashboard-empty">No hay zonas registradas.</p>
                  ) : (
                    <div className="zone-list-admin">
                      {zones.map((zone, index) => (
                        <div key={zone.id} className="zone-item-admin">
                          <div className="zone-item-admin__info">
                            <strong>{zone.name}</strong>

                            {zone.is_active ? (
                              <span className="badge bg-success">ACTIVA</span>
                            ) : (
                              <span className="badge bg-secondary">
                                INACTIVA
                              </span>
                            )}
                          </div>

                          <div className="zone-modal-item__actions">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleMoveZone(zone.id, "up")}
                              disabled={index === 0}
                              title="Mover arriba"
                            >
                              ↑
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleMoveZone(zone.id, "down")}
                              disabled={index === zones.length - 1}
                              title="Mover abajo"
                            >
                              ↓
                            </button>

                            <button
                              type="button"
                              className={`btn btn-sm ${
                                zone.is_active
                                  ? "btn-outline-danger"
                                  : "btn-outline-success"
                              }`}
                              onClick={() =>
                                handleToggleZoneActive(zone.id, zone.is_active)
                              }
                            >
                              {zone.is_active ? "Desactivar" : "Activar"}
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                handleDeleteZone(zone.id, zone.name)
                              }
                              title="Eliminar zona"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          )}

          {section === "reuniones" && (
            <section className="dashboard-panel">
              <h1 className="dashboard-title">Reuniones</h1>
              <p className="dashboard-subtitle">
                Crea y organiza reuniones para la comunidad con el calendario
                interactivo.
              </p>

              <CalendarMeetings />
            </section>
          )}

          {section === "reservas" && (
            <section className="dashboard-panel">
              <div className="dashboard-header-row">
                <div>
                  <h1 className="dashboard-title">
                    Reservas del salón social
                  </h1>
                  <p className="dashboard-subtitle">
                    Gestiona las solicitudes de reserva, aprueba o rechaza
                    peticiones y controla qué días están ocupados.
                  </p>
                </div>
              </div>

              <CalendarReservations mode="admin" />
            </section>
          )}

          {section === "documentos" && (
            <section className="dashboard-panel">
              <div className="dashboard-header-row">
                <div>
                  <h1 className="dashboard-title">Documentos</h1>
                  <p className="dashboard-subtitle">
                    Aquí puedes subir PDFs, ver los documentos publicados y
                    eliminarlos.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleUploadDocument}
                className="dashboard-block mb-4"
              >
                <div className="row g-3 align-items-end">
                  <div className="col-md-5">
                    <label className="form-label">Título del documento</label>
                    <input
                      type="text"
                      className="form-control"
                      value={documentTitle}
                      onChange={(e) => setDocumentTitle(e.target.value)}
                      placeholder="Ej: Acta junta abril 2026"
                      required
                    />
                  </div>

                  <div className="col-md-5">
                    <label className="form-label">Archivo PDF</label>
                    <input
                      id="document-file-input"
                      type="file"
                      className="form-control"
                      accept="application/pdf"
                      onChange={(e) =>
                        setDocumentFile(e.target.files?.[0] || null)
                      }
                      required
                    />
                  </div>

                  <div className="col-md-2">
                    <button type="submit" className="btn btn-primary w-100">
                      <FileUp size={16} className="me-2" />
                      Subir
                    </button>
                  </div>
                </div>
              </form>

              {documentsLoading && <p>Cargando documentos...</p>}

              {documentsError && (
                <div className="alert alert-danger">{documentsError}</div>
              )}

              {!documentsLoading && !documentsError && (
                <>
                  {documents.length === 0 ? (
                    <p className="dashboard-empty">
                      No hay documentos subidos todavía.
                    </p>
                  ) : (
                    <div className="documents-grid">
                      {documents.map((doc) => (
                        <article key={doc.id} className="document-card">
                          <div className="document-card__icon">
                            <FileText size={36} />
                          </div>

                          <div className="document-card__content">
                            <h4>{doc.title}</h4>
                            <p>
                              <strong>Archivo:</strong> {doc.original_name}
                            </p>
                            <p>
                              <strong>Subido por:</strong>{" "}
                              {getFullName(doc.uploader) || "Administración"}
                            </p>
                            <p>
                              <strong>Fecha:</strong>{" "}
                              {doc.created_at
                                ? new Date(doc.created_at).toLocaleDateString(
                                    "es-ES"
                                  )
                                : "—"}
                            </p>
                          </div>

                          <div className="document-card__actions">
                            <a
                              href={`http://localhost:4000/uploads/${doc.stored_name}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-primary"
                            >
                              Ver PDF
                            </a>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                handleDeleteDocument(doc.id, doc.title)
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          )}

          {section === "usuarios" && (
            <section className="dashboard-panel">
              <div className="dashboard-header-row">
                <div>
                  <h1 className="dashboard-title">Usuarios</h1>
                  <p className="dashboard-subtitle">
                    Aquí podrás ver, crear, editar y activar o desactivar
                    vecinos y administradores.
                  </p>
                </div>

                <button className="btn btn-primary" onClick={openCreateModal}>
                  Nuevo usuario
                </button>
              </div>

              {usersLoading && <p>Cargando usuarios...</p>}

              {usersError && (
                <div className="alert alert-danger">{usersError}</div>
              )}

              {!usersLoading && !usersError && (
                <>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por nombre, DNI, email, teléfono, portal o propiedad..."
                      value={userSearchFilter}
                      onChange={(e) => setUserSearchFilter(e.target.value)}
                    />
                  </div>

                  <div className="dashboard-table-wrap">
                    <table className="table table-striped align-middle">
                      <thead>
                        <tr>
                          <th>DNI</th>
                          <th>Nombre</th>
                          <th>Apellidos</th>
                          <th>Teléfono</th>
                          <th>Portal</th>
                          <th>Vivienda</th>
                          <th>Rol</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredUsers().length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              No hay usuarios en este grupo.
                            </td>
                          </tr>
                        ) : (
                          getFilteredUsers().map((user) => (
                            <tr
                              key={user.id}
                              className={
                                !user.is_active ? "user-row-inactive" : ""
                              }
                            >
                              <td>{user.dni}</td>
                              <td>{user.name}</td>
                              <td>{user.apellidos || "—"}</td>
                              <td>{user.phone || "—"}</td>
                              <td>{user.portal || "—"}</td>
                              <td>{user.vivienda || "—"}</td>
                              <td>
                                <div className="user-role-state-wrap">
                                  {user.role === "ADMIN" ? (
                                    <span className="badge bg-dark">
                                      ADMIN
                                    </span>
                                  ) : (
                                    <span className="badge bg-primary">
                                      VECINO
                                    </span>
                                  )}

                                  {!user.is_active && (
                                    <span className="user-inactive-badge">
                                      INACTIVO
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="user-action-buttons">
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => openEditModal(user)}
                                    title="Editar usuario"
                                    type="button"
                                  >
                                    <Pencil size={16} />
                                  </button>

                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() =>
                                      handleDeleteUser(
                                        user.id,
                                        getFullName(user)
                                      )
                                    }
                                    title="Borrar usuario"
                                    type="button"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {showUserModal && (
                <div className="admin-modal-backdrop">
                  <div className="admin-modal-card">
                    <div className="dashboard-header-row">
                      <div>
                        <h2
                          className="dashboard-title"
                          style={{ fontSize: "1.5rem" }}
                        >
                          {editingUser ? "Editar usuario" : "Nuevo usuario"}
                        </h2>
                        <p className="dashboard-subtitle mb-0">
                          {editingUser
                            ? "Modifica los datos del usuario."
                            : "Crea un nuevo vecino o administrador."}
                        </p>
                      </div>

                      <button
                        className="btn btn-outline-secondary"
                        onClick={closeUserModal}
                        type="button"
                      >
                        Cerrar
                      </button>
                    </div>

                    <form onSubmit={handleSubmitUser}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">DNI</label>
                          <input
                            type="text"
                            className="form-control"
                            name="dni"
                            value={userForm.dni}
                            onChange={handleUserFormChange}
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Nombre</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={userForm.name}
                            onChange={handleUserFormChange}
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Apellidos</label>
                          <input
                            type="text"
                            className="form-control"
                            name="apellidos"
                            value={userForm.apellidos}
                            onChange={handleUserFormChange}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Teléfono</label>
                          <input
                            type="text"
                            className="form-control"
                            name="phone"
                            value={userForm.phone}
                            onChange={handleUserFormChange}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={userForm.email}
                            onChange={handleUserFormChange}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Portal</label>
                          <select
                            className="form-select"
                            name="portal"
                            value={userForm.portal}
                            onChange={handleUserFormChange}
                          >
                            <option value="">Selecciona un portal</option>
                            <option value="P1">P1</option>
                            <option value="P2">P2</option>
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Vivienda</label>
                          <select
                            className="form-select"
                            name="vivienda"
                            value={userForm.vivienda}
                            onChange={handleUserFormChange}
                            disabled={!userForm.portal}
                          >
                            <option value="">
                              {userForm.portal
                                ? "Selecciona vivienda"
                                : "Primero selecciona portal"}
                            </option>

                            {(viviendasPorPortal[userForm.portal] || []).map(
                              (vivienda) => (
                                <option key={vivienda} value={vivienda}>
                                  {vivienda}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        <div className="col-md-12">
                          <label className="form-label">Rol</label>
                          <select
                            className="form-select"
                            name="role"
                            value={userForm.role}
                            onChange={handleUserFormChange}
                            required
                          >
                            <option value="VECINO">VECINO</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </div>
                      </div>

                      {editingUser && (
                        <div className="mt-4 d-flex justify-content-between align-items-center">
                          <div>
                            <span className="me-2">Estado actual:</span>
                            {editingUser.is_active ? (
                              <span className="badge bg-success">ACTIVO</span>
                            ) : (
                              <span className="badge bg-secondary">
                                INACTIVO
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            className={`btn ${
                              editingUser.is_active
                                ? "btn-outline-danger"
                                : "btn-outline-success"
                            }`}
                            onClick={() =>
                              handleToggleUserActive(
                                editingUser.id,
                                editingUser.is_active
                              )
                            }
                          >
                            {editingUser.is_active
                              ? "Desactivar usuario"
                              : "Activar usuario"}
                          </button>
                        </div>
                      )}

                      <div className="mt-4 d-flex gap-2 justify-content-end">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={closeUserModal}
                        >
                          Cancelar
                        </button>
                        <button type="submit" className="btn btn-success">
                          {editingUser ? "Guardar cambios" : "Crear usuario"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}