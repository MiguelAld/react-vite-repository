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
    } catch (err) {
      console.error(err);
      alert(err.message || "Error actualizando estado");
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
      await updateUserActive(userId, !currentState);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, is_active: !currentState } : u
        )
      );

      if (editingUser && editingUser.id === userId) {
        setEditingUser((prev) =>
          prev ? { ...prev, is_active: !currentState } : prev
        );
      }

      setOpenMenuId(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error actualizando usuario");
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
                    Aquí puedes revisar quién envió cada incidencia, su descripción y cambiar su estado.
                  </p>
                </div>
              </div>

              {incidentsLoading && <p>Cargando incidencias...</p>}

              {incidentsError && (
                <div className="alert alert-danger">{incidentsError}</div>
              )}

              {!incidentsLoading && !incidentsError && (
                <div className="dashboard-table-wrap">
                  <table className="table table-striped align-middle">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Vecino</th>
                        <th>DNI</th>
                        <th>Zona</th>
                        <th>Título</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incidents.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center">
                            No hay incidencias registradas.
                          </td>
                        </tr>
                      ) : (
                        incidents.map((incident) => (
                          <tr key={incident.id}>
                            <td>{incident.id}</td>
                            <td>{incident.creator?.name || "—"}</td>
                            <td>{incident.creator?.dni || "—"}</td>
                            <td>{incident.zone?.name || "—"}</td>
                            <td>{incident.title}</td>
                            <td style={{ maxWidth: "280px" }}>
                              {incident.description}
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={incident.status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    incident.id,
                                    e.target.value
                                  )
                                }
                              >
                                <option value="PENDIENTE">PENDIENTE</option>
                                <option value="EN_PROCESO">EN PROCESO</option>
                                <option value="RESUELTA">RESUELTA</option>
                              </select>
                            </td>
                            <td>
                              {incident.created_at
                                ? new Date(
                                    incident.created_at
                                  ).toLocaleDateString()
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

              {usersError && (
                <div className="alert alert-danger">{usersError}</div>
              )}

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
                                    minWidth: "170px",
                                  }}
                                >
                                  <button
                                    className="btn btn-sm btn-light text-start mb-2"
                                    onClick={() => openEditModal(user)}
                                  >
                                    Editar
                                  </button>

                                  <button
                                    className="btn btn-sm btn-light text-start"
                                    onClick={() =>
                                      handleToggleUserActive(
                                        user.id,
                                        user.is_active
                                      )
                                    }
                                  >
                                    {user.is_active
                                      ? "Desactivar"
                                      : "Activar"}
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