import { useState } from "react";
import SidebarAdmin from "../../components/layout/SidebarAdmin";
import CreateMeeting from "./CreateMeeting";
import "../../assets/dashboard.css";

export default function AdminDashboard() {
  const [section, setSection] = useState("inicio");

  return (
    <div className="dashboard-shell">
      <SidebarAdmin activeSection={section} setActiveSection={setSection} />

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
                    Revisa incidencias, estados y zonas afectadas.
                  </p>
                </div>
              </div>

              <div className="dashboard-table-wrap">
                <table className="table table-striped align-middle">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Zona</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Luz rota en garaje</td>
                      <td>Garaje</td>
                      <td><span className="badge bg-warning text-dark">Pendiente</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
              <h1 className="dashboard-title">Usuarios</h1>
              <p className="dashboard-subtitle">
                Aquí podrás gestionar vecinos y administración.
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}