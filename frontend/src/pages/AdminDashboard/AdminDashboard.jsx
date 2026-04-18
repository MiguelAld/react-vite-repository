import { useEffect, useState } from "react";
import SidebarAdmin from "../../components/layout/SidebarAdmin";
import CreateMeeting from "./CreateMeeting";
import {
  getUsers,
  createUser,
  updateUser,
  updateUserActive,
  getIncidents,
  updateIncidentStatus,
  deleteIncident,
  getAllZones,
  createZone,
  updateZoneActive,
} from "../../services/api";
import "../../assets/dashboard.css";

export default function AdminDashboard() {
  const [section, setSection] = useState("inicio");

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");

  const [incidents, setIncidents] = useState([]);
  const [incidentsLoading, setIncidentsLoading] = useState(false);
  const [incidentsError, setIncidentsError] = useState("");
  const [selectedIncident, setSelectedIncident] = useState(null);

  const [zones, setZones] = useState([]);
  const [zonesLoading, setZonesLoading] = useState(false);
  const [zonesError, setZonesError] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [showZonesManager, setShowZonesManager] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState(null);

  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const [userForm, setUserForm] = useState({
    dni: "",
    name: "",
    phone: "",
    email: "",
    vivienda: "",
    role: "VECINO",
  });

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
    if (section === "incidencias") {
      setIncidentsLoading(true);
      setIncidentsError("");
      setZonesLoading(true);
      setZonesError("");

      getIncidents()
        .then(setIncidents)
        .catch((err) => {
          console.error(err);
          setIncidentsError(err.message || "Error al cargar incidencias");
        })
        .finally(() => {
          setIncidentsLoading(false);
        });

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

  const getIncidentZoneLabel = (incident) => {
    return incident.zone?.name || incident.custom_zone || "—";
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
      setIncidents((prev) => prev.filter((incident) => incident.id !== incidentId));
      setSelectedIncident(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error eliminando incidencia");
    }
  };

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setUserForm({
      dni: "",
      name: "",
      phone: "",
      email: "",
      vivienda: "",
      role: "VECINO",
    });
    setShowUserModal(true);
    setOpenMenuId(null);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setUserForm({
      dni: user.dni || "",
      name: user.name || "",
      phone: user.phone || "",
      email: user.email || "",
      vivienda: user.vivienda || "",
      role: user.role || "VECINO",
    });
    setShowUserModal(true);
    setOpenMenuId(null);
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

  const handleCreateZone = async (e) => {
    e.preventDefault();

    try {
      const newZone = await createZone({
        name: zoneName,
        created_by: 1,
      });

      setZones((prev) => [...prev, newZone].sort((a, b) => a.name.localeCompare(b.name)));
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

  return (
    <div className="dashboard-shell">
      <SidebarAdmin
        activeSection={section}
        setActiveSection={setSection}
        userName="Admin Comunidad"
        userDni="12345678A"
        userHouse="Administración"
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
                  <p className="summary-number">4</p>
                </div>

                <div className="dashboard-card summary-accent-blue">
                  <h5>Documentos subidos</h5>
                  <p className="summary-number">12</p>
                </div>

                <div className="dashboard-card summary-accent-green">
                  <h5>Próximas reuniones</h5>
                  <p className="summary-number">2</p>
                </div>
              </div>
            </section>
          )}

          {section === "incidencias" && (
            <section className="dashboard-panel">
              <div className="dashboard-header-row">
                <div>
                  <h1 className="dashboard-title">Gestión de incidencias</h1>
                  <p className="dashboard-subtitle">
                    Aquí puedes revisar quién envió cada incidencia y abrir su ficha completa.
                  </p>
                </div>
              </div>

              {!incidentsLoading && !incidentsError && (
                <div className="mb-3">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setShowZonesManager(!showZonesManager);
                      setSelectedZoneId(null);
                    }}
                  >
                    {showZonesManager ? "Cerrar" : "Gestionar zonas"}
                  </button>
                </div>
              )}

              {showZonesManager && (
                <div className="dashboard-block mb-4">
                  <h3 className="mb-3">Zonas disponibles</h3>

                  <div className="row g-3 mb-4 align-items-end">
                    <div className="col-md-6">
                      <label className="form-label">Nueva zona</label>
                      <input
                        type="text"
                        className="form-control"
                        value={zoneName}
                        onChange={(e) => setZoneName(e.target.value)}
                        placeholder="Ej: Gimnasio, Portal A..."
                      />
                    </div>

                    <div className="col-md-3">
                      <button
                        type="button"
                        className="btn btn-success w-100"
                        onClick={handleCreateZone}
                        disabled={!zoneName.trim()}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>

                  {zonesLoading && <p>Cargando zonas...</p>}
                  {zonesError && <div className="alert alert-danger">{zonesError}</div>}

                  {!zonesLoading && !zonesError && zones.length > 0 && (
                    <div>
                      <label className="form-label">Gestionar zonas</label>
                      <div className="zone-list-admin">
                        {zones.map((zone) => (
                          <div key={zone.id} className="zone-item-admin">
                            <div className="zone-item-admin__info">
                              <strong>{zone.name}</strong>
                              <span className={`badge ${zone.is_active ? "bg-success" : "bg-secondary"}`}>
                                {zone.is_active ? "ACTIVA" : "INACTIVA"}
                              </span>
                            </div>

                            <button
                              type="button"
                              className={`btn btn-sm ${
                                zone.is_active ? "btn-danger" : "btn-success"
                              }`}
                              onClick={() => handleToggleZoneActive(zone.id, zone.is_active)}
                            >
                              {zone.is_active ? "Desactivar" : "Activar"}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!incidentsLoading && !incidentsError && (
                <div className="dashboard-cards incidents-summary-cards mb-4">
                  <div className="dashboard-card summary-accent-yellow">
                    <h5>Pendientes</h5>
                    <p className="summary-number">
                      {incidents.filter((i) => i.status === "PENDIENTE").length}
                    </p>
                  </div>

                  <div className="dashboard-card summary-accent-blue">
                    <h5>En proceso</h5>
                    <p className="summary-number">
                      {incidents.filter((i) => i.status === "EN_PROCESO").length}
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
              {incidentsError && <div className="alert alert-danger">{incidentsError}</div>}

              {!incidentsLoading && !incidentsError && (
                <>
                  {incidents.length === 0 ? (
                    <p className="dashboard-empty">No hay incidencias registradas.</p>
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
                              <strong>Enviada por:</strong> {incident.creator?.name || "—"}
                            </p>
                            <p>
                              <strong>Fecha:</strong>{" "}
                              {incident.created_at
                                ? new Date(incident.created_at).toLocaleDateString()
                                : "—"}
                            </p>
                            <p>
                              <strong>Hora:</strong>{" "}
                              {incident.created_at
                                ? new Date(incident.created_at).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "—"}
                            </p>
                          </div>

                          <button
                            className="btn btn-sm btn-outline-primary incident-card__toggle"
                            onClick={() => setSelectedIncident(incident)}
                          >
                            Ver detalle
                          </button>
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
                        <h2 className="dashboard-title" style={{ fontSize: "1.5rem" }}>
                          Detalle de incidencia
                        </h2>
                        <p className="dashboard-subtitle mb-0">
                          Revisa toda la información y gestiona esta incidencia.
                        </p>
                      </div>

                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => setSelectedIncident(null)}
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
                        <p>{selectedIncident.creator?.name || "—"}</p>
                      </div>

                      <div className="incident-detail-block">
                        <label>DNI</label>
                        <p>{selectedIncident.creator?.dni || "—"}</p>
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

                      <div className="incident-detail-block incident-detail-block--full">
                        <label>Estado</label>

                        <div className="incident-status-actions">
                          <button
                            type="button"
                            className={`incident-status-btn incident-status-btn--pending ${
                              selectedIncident.status === "PENDIENTE" ? "active" : ""
                            }`}
                            onClick={() =>
                              handleStatusChange(selectedIncident.id, "PENDIENTE")
                            }
                          >
                            Pendiente
                          </button>

                          <button
                            type="button"
                            className={`incident-status-btn incident-status-btn--progress ${
                              selectedIncident.status === "EN_PROCESO" ? "active" : ""
                            }`}
                            onClick={() =>
                              handleStatusChange(selectedIncident.id, "EN_PROCESO")
                            }
                          >
                            En proceso
                          </button>

                          <button
                            type="button"
                            className={`incident-status-btn incident-status-btn--resolved ${
                              selectedIncident.status === "RESUELTA" ? "active" : ""
                            }`}
                            onClick={() =>
                              handleStatusChange(selectedIncident.id, "RESUELTA")
                            }
                          >
                            Resuelta
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => handleDeleteIncident(selectedIncident.id)}
                      >
                        Eliminar incidencia
                      </button>
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
                  <h1 className="dashboard-title">Zonas comunes</h1>
                  <p className="dashboard-subtitle">
                    Aquí puedes crear, activar o desactivar las zonas que verán los usuarios al crear incidencias.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateZone} className="dashboard-block mb-4">
                <div className="row g-3 align-items-end">
                  <div className="col-md-9">
                    <label className="form-label">Nueva zona</label>
                    <input
                      type="text"
                      className="form-control"
                      value={zoneName}
                      onChange={(e) => setZoneName(e.target.value)}
                      placeholder="Ej: Trasteros"
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
              {zonesError && <div className="alert alert-danger">{zonesError}</div>}

              {!zonesLoading && !zonesError && (
                <div className="incidents-grid">
                  {zones.length === 0 ? (
                    <p className="dashboard-empty">No hay zonas registradas.</p>
                  ) : (
                    zones.map((zone) => (
                      <article key={zone.id} className="incident-card">
                        <div className="incident-card__top">
                          <h4>{zone.name}</h4>

                          {zone.is_active ? (
                            <span className="badge bg-success">ACTIVA</span>
                          ) : (
                            <span className="badge bg-secondary">INACTIVA</span>
                          )}
                        </div>

                        <div className="incident-card__meta">
                          <p>
                            <strong>Alta:</strong>{" "}
                            {zone.created_at
                              ? new Date(zone.created_at).toLocaleDateString()
                              : "—"}
                          </p>
                        </div>

                        <button
                          className={`btn btn-sm ${
                            zone.is_active ? "btn-outline-danger" : "btn-outline-success"
                          }`}
                          onClick={() =>
                            handleToggleZoneActive(zone.id, zone.is_active)
                          }
                        >
                          {zone.is_active ? "Desactivar" : "Activar"}
                        </button>
                      </article>
                    ))
                  )}
                </div>
              )}
            </section>
          )}

          {section === "reportes" && (
            <section className="dashboard-panel">
              <h1 className="dashboard-title">Reportes</h1>
              <p className="dashboard-subtitle">
                Aquí irán estadísticas y reportes de la comunidad.
              </p>
            </section>
          )}

          {section === "documentos" && (
            <section className="dashboard-panel">
              <h1 className="dashboard-title">Documentos</h1>
              <p className="dashboard-subtitle">
                Aquí gestionarás los PDFs y documentos oficiales.
              </p>
            </section>
          )}

          {section === "reuniones" && (
            <section className="dashboard-panel">
              <h1 className="dashboard-title">Reuniones</h1>
              <p className="dashboard-subtitle">
                Crea y organiza reuniones para la comunidad.
              </p>

              <CreateMeeting />
            </section>
          )}

          {section === "usuarios" && (
            <section className="dashboard-panel">
              <div className="dashboard-header-row">
                <div>
                  <h1 className="dashboard-title">Usuarios</h1>
                  <p className="dashboard-subtitle">
                    Aquí podrás ver, crear, editar y activar o desactivar vecinos y administradores.
                  </p>
                </div>

                <button className="btn btn-primary" onClick={openCreateModal}>
                  Nuevo usuario
                </button>
              </div>

              {usersLoading && <p>Cargando usuarios...</p>}
              {usersError && <div className="alert alert-danger">{usersError}</div>}

              {!usersLoading && !usersError && (
                <div className="dashboard-table-wrap">
                  <table className="table table-striped align-middle">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>DNI</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th>Vivienda</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Alta</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="10" className="text-center">
                            No hay usuarios registrados.
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.dni}</td>
                            <td>{user.phone || "—"}</td>
                            <td>{user.email || "—"}</td>
                            <td>{user.vivienda || "—"}</td>
                            <td>
                              {user.role === "ADMIN" ? (
                                <span className="badge bg-dark">ADMIN</span>
                              ) : (
                                <span className="badge bg-primary">VECINO</span>
                              )}
                            </td>
                            <td>
                              {user.is_active ? (
                                <span className="badge bg-success">ACTIVO</span>
                              ) : (
                                <span className="badge bg-secondary">INACTIVO</span>
                              )}
                            </td>
                            <td>
                              {user.created_at
                                ? new Date(user.created_at).toLocaleDateString()
                                : "—"}
                            </td>
                            <td style={{ position: "relative" }}>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() =>
                                  setOpenMenuId(
                                    openMenuId === user.id ? null : user.id
                                  )
                                }
                              >
                                ⋮
                              </button>

                              {openMenuId === user.id && (
                                <div
                                  className="card shadow-sm p-2"
                                  style={{
                                    position: "absolute",
                                    right: 0,
                                    top: "100%",
                                    zIndex: 20,
                                    minWidth: "160px",
                                  }}
                                >
                                  <button
                                    className="btn btn-sm btn-light text-start"
                                    onClick={() => openEditModal(user)}
                                  >
                                    Editar
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {showUserModal && (
                <div className="admin-modal-backdrop">
                  <div className="admin-modal-card">
                    <div className="dashboard-header-row">
                      <div>
                        <h2 className="dashboard-title" style={{ fontSize: "1.5rem" }}>
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

                        <div className="col-md-12">
                          <label className="form-label">Vivienda</label>
                          <input
                            type="text"
                            className="form-control"
                            name="vivienda"
                            value={userForm.vivienda}
                            onChange={handleUserFormChange}
                          />
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
                              <span className="badge bg-secondary">INACTIVO</span>
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